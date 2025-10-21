/**
 * 랭킹 페이지 컴포넌트
 * 각 구역별 라이더 랭킹 표시
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';
import './RankingPage.css';

const RankingPage = () => {
  const { district } = useParams();
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 더미 랭킹 데이터 (50등까지)
  const generateRankings = (district, baseNames) => {
    const rankings = [];
    for (let i = 1; i <= 50; i++) {
      const nameIndex = (i - 1) % baseNames.length;
      const baseName = baseNames[nameIndex];
      const suffix = Math.floor((i - 1) / baseNames.length) + 1;
      const riderName = suffix > 1 ? `${baseName}${suffix}` : baseName;
      
      rankings.push({
        rank: i,
        riderId: `BC${String(i).padStart(6, '0')}`,
        riderName: riderName,
        totalDamage: Math.max(1000, 25000 - (i * 400) + Math.floor(Math.random() * 200)),
        district: district
      });
    }
    return rankings;
  };

  const dummyRankings = {
    '강남구': generateRankings('강남구', ['김배민', '이라이더', '박배달', '최속달', '정빠른', '강남킹', '배달마스터', '스피드킹', '빠른배달', '화염라이더']),
    '서초구': generateRankings('서초구', ['서초킹', '강남마스터', '배달왕', '스피드킹', '빠른배달', '서초라이더', '화염배달', '용암킹', '불꽃마스터', '번개라이더']),
    '송파구': generateRankings('송파구', ['송파킹', '용암마스터', '화염킹', '불꽃배달', '용암배달', '송파라이더', '화염마스터', '용암배달킹', '불꽃라이더', '번개송파'])
  };

  useEffect(() => {
    const loadRankings = async () => {
      try {
        setLoading(true);
        
        // 실제 데이터베이스 연결 시도
        // const { data, error } = await supabase
        //   .from('raid_rankings')
        //   .select('*')
        //   .eq('raid_id', raidId)
        //   .order('rank', { ascending: true });
        
        // 더미 데이터 사용
        console.log('데이터베이스 연결 실패, 더미 랭킹 데이터 사용');
        const data = dummyRankings[district] || [];
        setRankings(data);
        
        // 분석 이벤트 추적
        trackEvent('ranking_page_view', { district });
        
      } catch (err) {
        console.error('랭킹 로드 실패:', err);
        setError('랭킹 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, [district]);

  const getRankDisplay = (rank) => {
    if (rank === 1) return (
      <div className="rank-display">
        <span className="medal-emoji">🥇</span>
        <span className="rank-text">1등</span>
      </div>
    );
    if (rank === 2) return (
      <div className="rank-display">
        <span className="medal-emoji">🥈</span>
        <span className="rank-text">2등</span>
      </div>
    );
    if (rank === 3) return (
      <div className="rank-display">
        <span className="medal-emoji">🥉</span>
        <span className="rank-text">3등</span>
      </div>
    );
    return <span className="rank-text">{rank}등</span>;
  };

  const getDamageColor = (damage) => {
    if (damage >= 15000) return 'text-danger fw-bold';
    if (damage >= 10000) return 'text-warning fw-bold';
    if (damage >= 5000) return 'text-success fw-bold';
    return 'text-muted';
  };

  if (loading) {
    return (
      <div className="ranking-page">
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">로딩 중...</span>
            </div>
            <p className="mt-3">랭킹 정보를 불러오는 중...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-page">
        <Container>
          <Alert variant="danger" className="mt-4">
            {error}
            <div className="mt-3">
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/')}
              >
                목록으로 돌아가기
              </button>
            </div>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="ranking-page">
      <Container>
        {/* 헤더 */}
        <div className="ranking-header text-center py-5">
          <h1 className="ranking-title">
            🏆 {district} 보스 레이드 랭킹
          </h1>
        </div>

        {/* 랭킹 테이블 */}
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="ranking-card">
              <Card.Header className="ranking-card-header">
                <h4 className="mb-0">
                  <span className="me-2">⚔️</span>
                  {district} 데미지 랭킹
                </h4>
              </Card.Header>
              <Card.Body className="p-0">
                {rankings.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">아직 참여한 라이더가 없습니다.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/')}
                    >
                      레이드 목록으로 돌아가기
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="ranking-table">
                      <thead>
                        <tr>
                          <th>순위</th>
                          <th>라이더 ID</th>
                          <th>총 데미지</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rankings.map((rider, index) => (
                          <tr key={rider.riderId}>
                            <td>
                              {getRankDisplay(rider.rank)}
                            </td>
                            <td>
                              <div className="rider-id-only">
                                {rider.riderId}
                              </div>
                            </td>
                            <td>
                              <span className={`damage-value ${getDamageColor(rider.totalDamage)}`}>
                                {rider.totalDamage.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 하단 안내 */}
        <div className="ranking-footer text-center py-4">
          <p className="text-muted">
            💡 랭킹은 매일 자정에 업데이트됩니다
          </p>
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/')}
          >
            ← 레이드 목록으로 돌아가기
          </button>
        </div>
      </Container>
    </div>
  );
};

export default RankingPage;
