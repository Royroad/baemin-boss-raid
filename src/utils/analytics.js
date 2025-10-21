// GA4 경량 연동 유틸리티
// - 초기화 중복 방지, 오류 처리 포함
// - 페이지뷰와 커스텀 이벤트 전송 지원

/* eslint-disable no-undef */

export const initAnalytics = () => {
  try {
    if (typeof window === 'undefined') return;

    const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (!measurementId) {
      // 환경변수가 없으면 초기화 생략
      return;
    }

    // 이미 초기화된 경우 재실행 방지
    if (window.__ga4Initialized) return;

    // gtag 스크립트 주입
    const scriptTag = document.createElement('script');
    scriptTag.async = true;
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    scriptTag.onerror = () => console.error('GA4 스크립트 로드 실패');
    document.head.appendChild(scriptTag);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    // SPA에서 라우터로 page_view를 보낼 것이므로 send_page_view 비활성화
    gtag('config', measurementId, { send_page_view: false });

    window.__ga4Initialized = true;
  } catch (error) {
    console.error('GA4 초기화 오류:', error);
  }
};

export const trackPageView = (pagePath, pageTitle) => {
  try {
    if (typeof window === 'undefined' || !window.gtag) return;
    const resolvedTitle = pageTitle || document.title;
    window.gtag('event', 'page_view', {
      page_title: resolvedTitle,
      page_location: window.location.href,
      page_path: pagePath,
    });
  } catch (error) {
    console.error('page_view 전송 오류:', error);
  }
};

export const trackEvent = (eventName, params = {}) => {
  try {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', eventName, params);
  } catch (error) {
    console.error('이벤트 전송 오류:', error);
  }
};


