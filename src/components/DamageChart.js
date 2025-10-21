/**
 * 데미지 차트 컴포넌트
 * 일별 데미지 추이를 시각화
 */

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DamageChart.css';

const DamageChart = ({ damageHistory, chartType = 'bar' }) => {
  if (!damageHistory || damageHistory.length === 0) {
    return (
      <div className="damage-chart-container">
        <h4 className="chart-title">📈 일별 데미지</h4>
        <div className="chart-empty">
          아직 데미지 데이터가 없습니다.
        </div>
      </div>
    );
  }
  
  // 날짜 포맷팅 (MM/DD)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  // 차트 데이터 준비
  const chartData = damageHistory.map(item => ({
    date: formatDate(item.date),
    데미지: item.damage,
    fullDate: item.date
  }));
  
  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{payload[0].payload.fullDate}</p>
          <p className="tooltip-damage">
            데미지: <strong>{payload[0].value.toLocaleString()}</strong>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="damage-chart-container">
      <h4 className="chart-title">📈 일별 데미지</h4>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#aaa"
                tick={{ fill: '#aaa' }}
              />
              <YAxis 
                stroke="#aaa"
                tick={{ fill: '#aaa' }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="데미지" 
                stroke="#ff6b6b" 
                strokeWidth={3}
                dot={{ fill: '#ff6b6b', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#aaa"
                tick={{ fill: '#aaa' }}
              />
              <YAxis 
                stroke="#aaa"
                tick={{ fill: '#aaa' }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#fff' }}
              />
              <Bar 
                dataKey="데미지" 
                fill="#ff6b6b"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">총 데미지:</span>
          <span className="summary-value">
            {damageHistory.reduce((sum, item) => sum + item.damage, 0).toLocaleString()}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">평균 데미지:</span>
          <span className="summary-value">
            {Math.round(
              damageHistory.reduce((sum, item) => sum + item.damage, 0) / damageHistory.length
            ).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DamageChart;

