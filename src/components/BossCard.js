/**
 * 보스 카드 컴포넌트
 * 레이드 목록에서 각 보스를 표시
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateHpPercentage, calculateDaysRemaining, getStatusText } from '../services/raidService';
import RaidHPBar from './RaidHPBar';
import './BossCard.css';

const BossCard = ({ raid, participantCount = 0 }) => {
  const navigate = useNavigate();
  
  const hpPercentage = calculateHpPercentage(raid.current_hp, raid.max_hp);
  const daysRemaining = calculateDaysRemaining(raid.end_date);
  
  // 카드 클릭 시 랭킹 페이지로 이동
  const handleClick = () => {
    navigate(`/ranking/${raid.district}`);
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
  
  // 상태 배지 색상
  const getStatusBadgeClass = (status) => {
    const classMap = {
      'active': 'status-active',
      'completed': 'status-completed',
      'failed': 'status-failed'
    };
    return classMap[status] || '';
  };
  
  return (
    <div 
      className={`boss-card ${raid.status !== 'active' ? 'boss-card-inactive' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`${raid.district} ${raid.boss_name} 레이드 상세보기`}
    >
      {/* 보스 이미지 */}
      <div className="boss-card-image">
        {raid.boss_image_url ? (
          <img src={raid.boss_image_url} alt={raid.boss_name} />
        ) : (
          <div className="boss-placeholder">
            <span className="boss-type-icon">{getBossTypeIcon(raid.boss_type)}</span>
          </div>
        )}
        
        {/* 상태 배지 */}
        <div className={`status-badge ${getStatusBadgeClass(raid.status)}`}>
          {getStatusText(raid.status)}
        </div>
      </div>
      
      {/* 보스 정보 */}
      <div className="boss-card-content">
        <div className="boss-card-header">
          <h3 className="boss-name">{raid.boss_name}</h3>
          <span className="boss-district">{raid.district}</span>
        </div>
        
        {/* HP 바 */}
        <RaidHPBar 
          currentHp={raid.current_hp} 
          maxHp={raid.max_hp}
          animated={raid.status === 'active'}
        />
        
        {/* 통계 */}
        <div className="boss-card-stats">
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">화속성</span>
            <span className="stat-label">보스 속성</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">{raid.buff_multiplier >= 2 ? '⏩' : '▶️'}</span>
            <span className="stat-value">
              {raid.buff_multiplier > 1 ? `X${raid.buff_multiplier}` : 'X1'}
            </span>
            <span className="stat-label">버프</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{participantCount}</span>
            <span className="stat-label">참여자</span>
          </div>
        </div>
      </div>
      
      {/* 호버 효과 */}
      <div className="boss-card-overlay">
        <span className="overlay-text">랭킹 보기 ➜</span>
      </div>
    </div>
  );
};

export default BossCard;

