/**
 * 보스 이미지 최적화 유틸리티
 * 지도 화면용 보스 이미지 크기 조정 및 HP 표시 최적화
 */

/**
 * HP 퍼센트에 따른 보스 이미지 필터 적용
 * @param {number} hpPercentage - HP 퍼센트 (0-100)
 * @returns {string} CSS filter 문자열
 */
export const getBossImageFilter = (hpPercentage) => {
  if (hpPercentage > 75) {
    return 'brightness(1.0) saturate(1.2)'; // 건강한 상태
  } else if (hpPercentage > 50) {
    return 'brightness(0.9) saturate(1.0)'; // 약간 상처
  } else if (hpPercentage > 25) {
    return 'brightness(0.7) saturate(0.8) hue-rotate(30deg)'; // 중간 상처
  } else if (hpPercentage > 0) {
    return 'brightness(0.5) saturate(0.6) hue-rotate(60deg)'; // 심각한 상처
  } else {
    return 'brightness(0.3) saturate(0.3) grayscale(0.5)'; // 패배 상태
  }
};

/**
 * HP 퍼센트에 따른 보스 아이콘 크기 결정
 * @param {number} hpPercentage - HP 퍼센트 (0-100)
 * @param {boolean} isActive - 레이드 활성 상태
 * @param {string} screenSize - 화면 크기 ('mobile', 'tablet', 'desktop')
 * @returns {number} 아이콘 크기 (px)
 */
export const getBossIconSize = (hpPercentage, isActive = true, screenSize = 'desktop') => {
  const baseSizes = {
    mobile: { active: 35, inactive: 25 },
    tablet: { active: 45, inactive: 30 },
    desktop: { active: 50, inactive: 35 }
  };
  
  const baseSize = baseSizes[screenSize][isActive ? 'active' : 'inactive'];
  
  // HP가 낮을수록 약간 작게 (약화된 느낌)
  if (hpPercentage < 25) {
    return Math.floor(baseSize * 0.9);
  } else if (hpPercentage < 50) {
    return Math.floor(baseSize * 0.95);
  }
  
  return baseSize;
};

/**
 * HP 퍼센트에 따른 색상 결정
 * @param {number} hpPercentage - HP 퍼센트 (0-100)
 * @returns {string} 색상 코드
 */
export const getHpColor = (hpPercentage) => {
  if (hpPercentage > 60) return '#00ff41'; // 초록색 - 건강
  if (hpPercentage > 30) return '#ffae00'; // 주황색 - 주의
  return '#ff0040'; // 빨간색 - 위험
};

/**
 * 보스 타입에 따른 기본 색상 그라데이션
 * @param {string} bossType - 보스 타입 ('fire', 'water', 'earth', 'wind')
 * @returns {string} CSS 그라데이션 문자열
 */
export const getBossTypeGradient = (bossType) => {
  const gradients = {
    fire: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
    water: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    earth: 'linear-gradient(135deg, #8b4513, #a0522d)',
    wind: 'linear-gradient(135deg, #87ceeb, #b0e0e6)'
  };
  
  return gradients[bossType] || gradients.fire;
};

/**
 * 지도용 보스 이미지 URL 생성
 * @param {string} originalImageUrl - 원본 이미지 URL
 * @param {string} size - 이미지 크기 ('small', 'medium', 'large')
 * @returns {string} 최적화된 이미지 URL
 */
export const getOptimizedBossImageUrl = (originalImageUrl, size = 'medium') => {
  if (!originalImageUrl) return null;
  
  // 이미지 최적화를 위한 쿼리 파라미터 추가
  const sizeParams = {
    small: 'w=32&h=32&fit=crop&q=80',
    medium: 'w=48&h=48&fit=crop&q=85',
    large: 'w=64&h=64&fit=crop&q=90'
  };
  
  const separator = originalImageUrl.includes('?') ? '&' : '?';
  return `${originalImageUrl}${separator}${sizeParams[size]}`;
};

/**
 * 보스 상태에 따른 애니메이션 클래스 결정
 * @param {string} status - 보스 상태 ('active', 'completed', 'paused')
 * @param {number} hpPercentage - HP 퍼센트
 * @returns {string} CSS 클래스명
 */
export const getBossAnimationClass = (status, hpPercentage) => {
  if (status === 'completed') return 'boss-defeated';
  if (status === 'paused') return 'boss-paused';
  if (hpPercentage < 25) return 'boss-critical';
  if (hpPercentage < 50) return 'boss-wounded';
  return 'boss-healthy';
};

/**
 * HP 바 애니메이션 효과 생성
 * @param {number} hpPercentage - HP 퍼센트
 * @returns {object} 애니메이션 스타일 객체
 */
export const getHpBarAnimation = (hpPercentage) => {
  const baseStyle = {
    transition: 'all 0.3s ease',
    boxShadow: `0 0 8px ${getHpColor(hpPercentage)}`
  };
  
  // HP가 매우 낮을 때 깜빡이는 효과
  if (hpPercentage < 10) {
    return {
      ...baseStyle,
      animation: 'criticalBlink 1s ease-in-out infinite'
    };
  }
  
  return baseStyle;
};

/**
 * 보스 마커 툴팁 텍스트 생성
 * @param {object} raid - 레이드 정보
 * @returns {string} 툴팁 텍스트
 */
export const getBossTooltipText = (raid) => {
  const hpPercentage = Math.round((raid.current_hp / raid.max_hp) * 100);
  const statusText = raid.status === 'active' ? '진행중' : '완료';
  
  return `${raid.boss_name}\n${raid.district}\nHP: ${hpPercentage}% (${statusText})`;
};

/**
 * 보스 이미지 로딩 실패 시 대체 이모지 반환
 * @param {string} bossType - 보스 타입
 * @returns {string} 대체 이모지
 */
export const getFallbackEmoji = (bossType) => {
  const emojis = {
    fire: '🔥',
    water: '💧',
    earth: '🌍',
    wind: '💨'
  };
  
  return emojis[bossType] || '⚔️';
};
