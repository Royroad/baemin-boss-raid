/**
 * 보스 레이드 목록 페이지
 * 전체 레이드 현황 및 지도 표시
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button, ButtonGroup } from 'react-bootstrap';
import { getActiveRaids, getRaidParticipants } from '../services/raidService';
import BossRaidMap from '../components/BossRaidMap';
import BossCard from '../components/BossCard';
import './BossRaidPage.css';

const BossRaidPage = () => {
  const [raids, setRaids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [participantCounts, setParticipantCounts] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [timeLeft, setTimeLeft] = useState('');
  
  // 레이드 데이터 로드
  useEffect(() => {
    loadRaids();
  }, []);

  // 카운트다운 타이머
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = new Date('2025-10-24T00:00:00');
      
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      
      return '00:00:00';
    };

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);
  
  const loadRaids = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const raidsData = await getActiveRaids();
      setRaids(raidsData);
      
      // 각 레이드의 참여자 수 조회
      const counts = {};
      for (const raid of raidsData) {
        const participants = await getRaidParticipants(raid.id);
        counts[raid.id] = participants.length;
      }
      setParticipantCounts(counts);
      
    } catch (err) {
      console.error('레이드 로드 실패:', err);
      setError('레이드 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="boss-raid-page">
      {/* 히어로 섹션 */}
      <div className="raid-hero">
        <Container>
          <h1 className="raid-hero-title">⚔️ 보스 레이드</h1>
          
          {/* 카운트다운 타이머 */}
          <div className="countdown-timer mb-3">
            <div className="timer-display">
              <span className="timer-label">남은 시간</span>
              <span className="timer-time">{timeLeft}</span>
            </div>
          </div>
          
          <p className="raid-hero-description mb-3">
            기한 내 보스를 토벌하고 보상을 획득하세요!
          </p>
          
          <div className="raid-hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-value">{raids.length}</span>
              <span className="hero-stat-label">활성 레이드</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">
                {Object.values(participantCounts).reduce((sum, count) => sum + count, 0)}
              </span>
              <span className="hero-stat-label">총 참여자</span>
            </div>
          </div>
        </Container>
      </div>
      
      <Container className="raid-content">
        {/* 뷰 모드 전환 */}
        <div className="view-mode-selector">
          <ButtonGroup>
            <Button 
              variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
              onClick={() => setViewMode('grid')}
            >
              🎴 카드뷰
            </Button>
            <Button 
              variant={viewMode === 'map' ? 'primary' : 'outline-primary'}
              onClick={() => setViewMode('map')}
            >
              🗺️ 지도뷰
            </Button>
          </ButtonGroup>
        </div>
        
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="loading-container">
            <Spinner animation="border" variant="primary" />
            <p>레이드 정보를 불러오는 중...</p>
          </div>
        )}
        
        {/* 에러 상태 */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {/* 레이드 목록 */}
        {!isLoading && !error && (
          <>
            {raids.length === 0 ? (
              <Alert variant="info">
                현재 진행 중인 레이드가 없습니다.
              </Alert>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <Row className="raid-grid">
                    {raids.map((raid) => (
                      <Col key={raid.id} xs={12} md={6} lg={4} className="mb-4">
                        <BossCard 
                          raid={raid} 
                          participantCount={participantCounts[raid.id] || 0}
                        />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="raid-map-view">
                    <BossRaidMap raids={raids} />
                    <div className="map-info">
                      <p>💡 지도의 보스 아이콘을 클릭하면 상세 정보를 확인할 수 있습니다.</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
        
        {/* 레이드 안내 */}
        <div className="raid-guide">
          <h3>📖 레이드 가이드</h3>
          <Row>
            <Col md={4}>
              <div className="guide-card">
                <div className="guide-icon">1️⃣</div>
                <h4>참여하기</h4>
                <p>레이드 이벤트 참여 동의를 위해 구글 설문에 참여해주세요</p>
                <a 
                  href="https://forms.gle/your-google-form-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  📝 참여 동의 설문 작성
                </a>
              </div>
            </Col>
            <Col md={4}>
              <div className="guide-card">
                <div className="guide-icon">2️⃣</div>
                <h4>배달하기</h4>
                <p>해당 구역에서 배달하여 보스에게 데미지 입히기</p>
                <a
                  href="https://baeminconnect.onelink.me/k618/5engev5b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-sm mt-2"
                >
                  📱 배민커넥트 앱 다운로드
                </a>
              </div>
            </Col>
            <Col md={4}>
              <div className="guide-card">
                <div className="guide-icon">3️⃣</div>
                <h4>보상받기</h4>
                <p>레이드 완료 시 랭킹에 따라 보상 획득</p>
                <a
                  href="/rewards"
                  className="btn btn-success btn-sm mt-2"
                >
                  🎁 보상 확인하기
                </a>
              </div>
            </Col>
          </Row>
          
          <div className="guide-tips">
            <h5>💡 팁</h5>
            <ul>
              <li>배달 건당 10만큼 데미지가 적용됩니다.</li>
              <li>화속성 보스는 우천 및 기상할증 적용 건당 2배의 데미지를 입습니다.</li>
              <li>참여 유저수와 레이드 난이도를 고려해 기간 내 데미지 2배 버프가 적용될 수 있습니다.</li>
              <li>라이더 랭킹 및 보스 HP는 다음 날 새벽 갱신 됩니다.</li>
              <li>픽업지 주소에 따라 레이드 대상 보스가 지정됩니다.</li>
              <li>레이드 도중 휴식이 필요할 경우 배민커넥트 라운지를 찾아주세요.</li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BossRaidPage;

