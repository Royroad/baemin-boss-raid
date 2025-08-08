import { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLightbulb, FaTimes, FaArrowRight } from 'react-icons/fa';
import { getCompletedImprovementsForBanner } from '../services/counselingService';
import { formatRiderName } from '../utils/maskRiderId';

/**
 * 개선사항 배너 컴포넌트
 * 최근 라이더 제안으로 개선된 아이템을 메인 화면에 표시
 */
const ImprovementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [latestImprovement, setLatestImprovement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 최근 개선 아이템 데이터 가져오기
  useEffect(() => {
    const fetchLatestImprovement = async () => {
      try {
        const improvements = await getCompletedImprovementsForBanner(20);
        if (improvements && improvements.length > 0) {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          const withUpdateDate = improvements.filter(item => !!item.status_update_date);

          const recentImprovements = withUpdateDate.filter(item => {
            const updateDate = new Date(item.status_update_date);
            return !isNaN(updateDate) && updateDate >= oneWeekAgo;
          });

          const selectedImprovement = recentImprovements.length > 0
            ? recentImprovements[0]
            : withUpdateDate[0];

          setLatestImprovement(selectedImprovement || null);
        }
      } catch (error) {
        console.error('최근 개선 아이템 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestImprovement();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  // 로딩 중이거나 데이터가 없거나 배너가 닫혀있으면 표시하지 않음
  if (!isVisible || isLoading || !latestImprovement) return null;

  // 날짜 포맷팅 함수 (현재 미사용으로 주석 처리)
  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('ko-KR', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit'
  //   }).replace(/\./g, '.').replace(/\.$/, '');
  // };

  return (
    <Alert className="improvement-banner d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <FaLightbulb className="banner-icon me-3" />
        <div className="banner-content">
          <div className="banner-title">
            🎉 <strong>{formatRiderName(latestImprovement.rider_id)}</strong> 제안으로 정책 및 서비스 개선이 완료되었습니다!
          </div>
          <div className="banner-summary">
            {latestImprovement.action_content || latestImprovement.main_content || latestImprovement.counseling_content}
          </div>
        </div>
      </div>
      
      <div className="d-flex align-items-center">
        <Button 
          as={Link} 
          to="/suggestions" 
          variant="outline-dark" 
          size="sm"
          className="me-2 banner-btn"
        >
          더보기 <FaArrowRight size={12} className="ms-1" />
        </Button>
        <Button 
          variant="link" 
          size="sm" 
          onClick={handleClose}
          className="text-muted p-0"
          aria-label="배너 닫기"
        >
          <FaTimes />
        </Button>
      </div>
    </Alert>
  );
};

export default ImprovementBanner; 