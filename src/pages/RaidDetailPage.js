/**
 * 레이드 상세 페이지
 * 특정 레이드의 상세 정보, 랭킹, 참여 등
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import {
  getRaidDetail,
  getRaidRankings,
  getRaidDamageHistory,
  getRaidStats,
  getStatusText,
  calculateDaysRemaining
} from '../services/raidService';
import RaidHPBar from '../components/RaidHPBar';
import RaidCountdown from '../components/RaidCountdown';
import RaidRanking from '../components/RaidRanking';
import RaidJoinModal from '../components/RaidJoinModal';
import DamageChart from '../components/DamageChart';
import './RaidDetailPage.css';

const RaidDetailPage = () => {
  const { raidId } = useParams();
  const navigate = useNavigate();
  
  const [raid, setRaid] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [damageHistory, setDamageHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  // 레이드 데이터 로드
  useEffect(() => {
    if (raidId) {
      loadRaidData();
    }
  }, [raidId]);
  
  const loadRaidData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 병렬로 데이터 로드
      const [raidData, rankingsData, historyData, statsData] = await Promise.all([
        getRaidDetail(parseInt(raidId)),
        getRaidRankings(parseInt(raidId)),
        getRaidDamageHistory(parseInt(raidId)),
        getRaidStats(parseInt(raidId))
      ]);
      
      setRaid(raidData);
      setRankings(rankingsData);
      setDamageHistory(historyData);
      setStats(statsData);
      
    } catch (err) {
      console.error('레이드 데이터 로드 실패:', err);
      setError('레이드 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 참여 성공 핸들러
  const handleJoinSuccess = () => {
    loadRaidData(); // 데이터 새로고침
  };
  
  // 보스 타입 아이콘
  const getBossTypeIcon = (type) => {
    const icons = {
      'fire': '🔥',
      'water': '💧',
      'earth': '🌍',
      'wind': '💨'
    };
    return icons[type] || '⚔️';
  };
  
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="raid-detail-page">
        <Container>
          <div className="loading-container">
            <Spinner animation="border" variant="primary" />
            <p>레이드 정보를 불러오는 중...</p>
          </div>
        </Container>
      </div>
    );
  }
  
  // 에러 상태
  if (error || !raid) {
    return (
      <div className="raid-detail-page">
        <Container>
          <Alert variant="danger">
            {error || '레이드를 찾을 수 없습니다.'}
          </Alert>
          <Button variant="primary" onClick={() => navigate('/boss-raid')}>
            목록으로 돌아가기
          </Button>
        </Container>
      </div>
    );
  }
  
  const daysRemaining = calculateDaysRemaining(raid.end_date);
  const shouldShowBuffNotice = raid.buff_multiplier > 1;
  
  return (
    <div className="raid-detail-page">
      {/* 백버튼 */}
      <Container>
        <Button 
          variant="outline-light" 
          className="back-button"
          onClick={() => navigate('/boss-raid')}
        >
          ← 목록으로
        </Button>
      </Container>
      
      {/* 보스 헤더 */}
      <div className="boss-header">
        <Container>
          <Row className="align-items-center">
            <Col md={4} className="boss-image-col">
              {raid.boss_image_url ? (
                <img 
                  src={raid.boss_image_url} 
                  alt={raid.boss_name}
                  className="boss-image"
                />
              ) : (
                <div className="boss-placeholder-large">
                  <span className="boss-type-icon-large">
                    {getBossTypeIcon(raid.boss_type)}
                  </span>
                </div>
              )}
            </Col>
            
            <Col md={8}>
              <div className="boss-info">
                <div className="boss-badges">
                  <span className="badge-district">{raid.district}</span>
                  <span className={`badge-status status-${raid.status}`}>
                    {getStatusText(raid.status)}
                  </span>
                  {shouldShowBuffNotice && (
                    <span className="badge-buff">⚡ {raid.buff_multiplier}x 버프</span>
                  )}
                </div>
                
                <h1 className="boss-title">{raid.boss_name}</h1>
                
                <div className="boss-stats-grid">
                  <div className="boss-stat">
                    <span className="stat-icon">👥</span>
                    <div>
                      <div className="stat-value">{stats?.participantCount || 0}</div>
                      <div className="stat-label">참여자</div>
                    </div>
                  </div>
                  
                  <div className="boss-stat">
                    <span className="stat-icon">💥</span>
                    <div>
                      <div className="stat-value">
                        {stats?.totalDamageDealt?.toLocaleString() || 0}
                      </div>
                      <div className="stat-label">총 데미지</div>
                    </div>
                  </div>
                  
                  <div className="boss-stat">
                    <span className="stat-icon">⏰</span>
                    <div>
                      <div className="stat-value">
                        {daysRemaining > 0 ? `D-${daysRemaining}` : '종료'}
                      </div>
                      <div className="stat-label">남은 기간</div>
                    </div>
                  </div>
                </div>
                
                {raid.status === 'active' && (
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="btn-join-raid"
                    onClick={() => setShowJoinModal(true)}
                  >
                    ⚔️ 레이드 참여하기
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* 버프 공지 배너 */}
      {shouldShowBuffNotice && raid.status === 'active' && (
        <div className="buff-notice-banner">
          <Container>
            <div className="buff-notice-content">
              <span className="buff-icon">⚡</span>
              <div className="buff-text">
                <strong>데미지 {raid.buff_multiplier}배 버프 활성화!</strong>
                <p>모든 배달에 {raid.buff_multiplier}배 데미지가 적용됩니다.</p>
              </div>
            </div>
          </Container>
        </div>
      )}
      
      {/* 메인 컨텐츠 */}
      <Container className="raid-main-content">
        <Row>
          {/* 왼쪽: HP, 카운트다운, 차트 */}
          <Col lg={8}>
            {/* HP 바 */}
            <div className="content-section">
              <RaidHPBar 
                currentHp={raid.current_hp}
                maxHp={raid.max_hp}
                animated={raid.status === 'active'}
              />
              
              {stats && (
                <div className="hp-progress-text">
                  <span>진행률: {stats.progressPercentage}%</span>
                  <span>
                    {raid.max_hp - raid.current_hp > 0 
                      ? `${(raid.max_hp - raid.current_hp).toLocaleString()} 데미지 입힘`
                      : '아직 데미지가 없습니다'
                    }
                  </span>
                </div>
              )}
            </div>
            
            {/* 카운트다운 */}
            {raid.status === 'active' && (
              <div className="content-section">
                <RaidCountdown endDate={raid.end_date} />
              </div>
            )}
            
            {/* 데미지 차트 */}
            <div className="content-section">
              <DamageChart damageHistory={damageHistory} chartType="bar" />
            </div>
          </Col>
          
          {/* 오른쪽: 랭킹 */}
          <Col lg={4}>
            <div className="content-section sticky-section">
              <RaidRanking rankings={rankings} />
            </div>
          </Col>
        </Row>
        
        {/* 보상 정보 */}
        <div className="content-section reward-section">
          <h3>🎁 보상 안내</h3>
          <Row>
            <Col md={4}>
              <div className="reward-card reward-1st">
                <div className="reward-rank">🥇 1등</div>
                <div className="reward-title">실제 보상</div>
                <div className="reward-desc">스타벅스 기프티콘 5만원권</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="reward-card reward-2nd">
                <div className="reward-rank">🥈 2-3등</div>
                <div className="reward-title">가상 보상</div>
                <div className="reward-desc">특별 달성 배지</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="reward-card reward-participant">
                <div className="reward-rank">👥 참여자</div>
                <div className="reward-title">참여 보상</div>
                <div className="reward-desc">레이드 참여 배지</div>
              </div>
            </Col>
          </Row>
          
          {daysRemaining > 0 && (
            <div className="reward-bonus">
              <p>⏰ 기한 내 레이드 성공 시 <strong>추가 보상</strong>이 지급됩니다!</p>
            </div>
          )}
        </div>
      </Container>
      
      {/* 참여 모달 */}
      <RaidJoinModal
        show={showJoinModal}
        onHide={() => setShowJoinModal(false)}
        raidId={raid.id}
        raidName={raid.boss_name}
        onJoinSuccess={handleJoinSuccess}
      />
    </div>
  );
};

export default RaidDetailPage;

