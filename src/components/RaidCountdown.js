/**
 * 레이드 카운트다운 컴포넌트
 * 레이드 종료까지 남은 시간 표시
 */

import React, { useState, useEffect } from 'react';
import './RaidCountdown.css';

const RaidCountdown = ({ endDate }) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(endDate));
  
  // 남은 시간 계산
  function calculateTimeRemaining(end) {
    const now = new Date();
    const endTime = new Date(end);
    const diff = endTime - now;
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isExpired: false
    };
  }
  
  // 1초마다 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(endDate));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endDate]);
  
  if (timeRemaining.isExpired) {
    return (
      <div className="raid-countdown expired">
        <div className="countdown-label">레이드 종료</div>
      </div>
    );
  }
  
  return (
    <div className="raid-countdown">
      <div className="countdown-label">남은 시간</div>
      <div className="countdown-timer">
        <div className="countdown-unit">
          <div className="countdown-value">{timeRemaining.days}</div>
          <div className="countdown-text">일</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <div className="countdown-value">{String(timeRemaining.hours).padStart(2, '0')}</div>
          <div className="countdown-text">시간</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <div className="countdown-value">{String(timeRemaining.minutes).padStart(2, '0')}</div>
          <div className="countdown-text">분</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <div className="countdown-value">{String(timeRemaining.seconds).padStart(2, '0')}</div>
          <div className="countdown-text">초</div>
        </div>
      </div>
    </div>
  );
};

export default RaidCountdown;

