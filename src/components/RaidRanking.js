/**
 * 레이드 랭킹 컴포넌트
 * TOP 20 라이더 랭킹 표시
 */

import React from 'react';
import CountUp from 'react-countup';
import { maskRiderId } from '../services/raidService';
import './RaidRanking.css';

const RaidRanking = ({ rankings, currentRiderId = null }) => {
  // 랭킹 메달 아이콘
  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}위`;
  };
  
  // 랭킹 배경 색상
  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };
  
  if (!rankings || rankings.length === 0) {
    return (
      <div className="raid-ranking-container">
        <h3 className="ranking-title">🏆 랭킹</h3>
        <div className="ranking-empty">
          아직 랭킹 데이터가 없습니다.
        </div>
      </div>
    );
  }
  
  return (
    <div className="raid-ranking-container">
      <h3 className="ranking-title">🏆 랭킹 TOP {rankings.length}</h3>
      
      <div className="ranking-table">
        <div className="ranking-header">
          <div className="ranking-col-rank">순위</div>
          <div className="ranking-col-rider">라이더</div>
          <div className="ranking-col-damage">데미지</div>
        </div>
        
        <div className="ranking-body">
          {rankings.map((ranking) => (
            <div 
              key={ranking.id}
              className={`ranking-row ${getRankClass(ranking.rank)} ${
                currentRiderId && ranking.rider_id === currentRiderId ? 'current-rider' : ''
              }`}
            >
              <div className="ranking-col-rank">
                <span className="rank-badge">{getRankIcon(ranking.rank)}</span>
              </div>
              
              <div className="ranking-col-rider">
                <span className="rider-id">
                  {maskRiderId(ranking.rider_id)}
                </span>
                {ranking.rider_name && (
                  <span className="rider-name"> {ranking.rider_name}</span>
                )}
              </div>
              
              <div className="ranking-col-damage">
                <CountUp 
                  end={ranking.total_damage} 
                  duration={1.5}
                  separator=","
                  className="damage-value"
                />
                <span className="damage-unit"> DMG</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="ranking-footer">
        <small>💡 랭킹은 매일 자정에 업데이트됩니다</small>
      </div>
    </div>
  );
};

export default RaidRanking;

