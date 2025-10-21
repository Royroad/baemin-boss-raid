import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView } from '../utils/analytics';

/**
 * 라우트 변경 시 GA4 page_view 전송
 * - 마운트 시 1회 초기화
 * - pathname 변경마다 page_view 전송
 */
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;


