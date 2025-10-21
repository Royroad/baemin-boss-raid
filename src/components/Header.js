import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';
import { useState, useEffect } from 'react';
import './Header.css';

/**
 * 헤더 네비게이션 컴포넌트
 * 로고, 슬로건 표시
 */
const Header = () => {
  const [timeLeft, setTimeLeft] = useState('');

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
  return (
    <header>
      {/* 로고 및 슬로건 섹션 */}
      <div className="bg-light py-4">
        <Container>
          <div className="text-center">
            <div className="header-logo-container mb-3">
              {(() => {
                const LOGO_VERSION = '2';
                return (
                  <img
                    src={`/logo_cropped.png?v=${LOGO_VERSION}`}
                    alt="배민커넥트 로고"
                    className="header-logo"
                  />
                );
              })()}
            </div>
            <div>
              <h1 className="header-title mb-2">⚔️ 보스 레이드</h1>
              <p className="header-subtitle mb-0 text-muted fs-5">
                우리 지역이 몬스터 침공으로 위기에 빠졌습니다!<br/>
                구역별 보스를 처치하고 우리 지역 배달을 지켜주세요!
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* 네비게이션 메뉴 */}
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
            <Link 
              to="/" 
              className="navbar-brand mx-auto"
              onClick={() => trackEvent('logo_click', { location_path: '/' })}
              style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#2AC1BC',
                textDecoration: 'none'
              }}
            >
              🏠 레이드 목록으로
            </Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
