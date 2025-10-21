/**
 * 레이드 HP 바 컴포넌트
 * 보스의 현재 HP를 시각적으로 표시
 */

import React from 'react';
import { calculateHpPercentage } from '../services/raidService';
import './RaidHPBar.css';

const RaidHPBar = ({ currentHp, maxHp, animated = true }) => {
  const hpPercentage = calculateHpPercentage(currentHp, maxHp);
  
  // HP 퍼센트에 따른 색상 결정
  const getHpColor = (percentage) => {
    if (percentage > 60) return '#00ff41'; // 초록색
    if (percentage > 30) return '#ffae00'; // 주황색
    return '#ff0040'; // 빨간색
  };
  
  const hpColor = getHpColor(hpPercentage);
  
  return (
    <div className="raid-hp-bar-container">
      <div className="raid-hp-bar-header">
        <span className="raid-hp-label">HP</span>
        <span className="raid-hp-numbers">
          {currentHp.toLocaleString()} / {maxHp.toLocaleString()}
        </span>
      </div>
      
      <div className="raid-hp-bar-wrapper">
        <div 
          className={`raid-hp-bar-fill ${animated ? 'animated' : ''}`}
          style={{
            width: `${hpPercentage}%`,
            backgroundColor: hpColor,
            boxShadow: `0 0 20px ${hpColor}`
          }}
        >
          <div className="raid-hp-bar-shine"></div>
        </div>
        <div className="raid-hp-bar-percentage">
          {hpPercentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default RaidHPBar;

