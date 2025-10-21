/**
 * 보스 레이드 서비스
 * 레이드 관련 비즈니스 로직 및 Supabase 상호작용
 */

import { supabase } from '../config/supabase';

/**
 * 데미지 계산 상수
 */
export const DAMAGE_CONSTANTS = {
  BASE_DAMAGE_PER_DELIVERY: 10,
  WEATHER_BONUS_MULTIPLIER: 2.0,
  SURGE_BONUS_MULTIPLIER: 2.0,
};

/**
 * 데미지 계산
 * @param {number} deliveryCount - 배달 건수
 * @param {boolean} isRainy - 우천 여부
 * @param {boolean} hasSurge - 할증 여부
 * @param {number} buffMultiplier - 레이드 버프 배율
 * @returns {Object} - { baseDamage, bonusMultiplier, totalDamage }
 */
export const calculateDamage = (deliveryCount, isRainy = false, hasSurge = false, buffMultiplier = 1.0) => {
  const baseDamage = deliveryCount * DAMAGE_CONSTANTS.BASE_DAMAGE_PER_DELIVERY;
  
  // 우천 또는 할증 시 2배
  let bonusMultiplier = 1.0;
  if (isRainy || hasSurge) {
    bonusMultiplier = 2.0;
  }
  
  // 전체 버프 적용
  const finalMultiplier = bonusMultiplier * buffMultiplier;
  const totalDamage = Math.floor(baseDamage * finalMultiplier);
  
  return {
    baseDamage,
    bonusMultiplier: finalMultiplier,
    totalDamage
  };
};

/**
 * 활성화된 레이드 목록 조회
 * @returns {Promise<Array>} - 활성 레이드 목록
 */
export const getActiveRaids = async () => {
  try {
    const { data, error } = await supabase
      .from('boss_raids')
      .select('*')
      .eq('status', 'active')
      .order('district', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('활성 레이드 조회 실패:', error);
    
    // 데이터베이스 연결 실패 시 더미 데이터 반환
    console.log('데이터베이스 연결 실패, 더미 데이터 사용');
    return [
      {
        id: 1,
        district: '강남구',
        boss_name: '화염 드래곤',
        boss_image_url: '/boss-images/fire-dragon.png',
        boss_type: 'fire',
        max_hp: 100000,
        current_hp: 75000,
        start_date: '2025-01-21',
        end_date: '2025-02-04',
        status: 'active',
        buff_multiplier: 1.0
      },
      {
        id: 2,
        district: '서초구',
        boss_name: '불타는 골렘',
        boss_image_url: '/boss-images/fire-golem.png',
        boss_type: 'fire',
        max_hp: 80000,
        current_hp: 40000,
        start_date: '2025-01-21',
        end_date: '2025-02-04',
        status: 'active',
        buff_multiplier: 1.0
      },
      {
        id: 3,
        district: '송파구',
        boss_name: '용암 거인',
        boss_image_url: '/boss-images/lava-giant.png',
        boss_type: 'fire',
        max_hp: 90000,
        current_hp: 15000,
        start_date: '2025-01-21',
        end_date: '2025-02-04',
        status: 'active',
        buff_multiplier: 1.0
      }
    ];
  }
};

/**
 * 특정 레이드 상세 정보 조회
 * @param {number} raidId - 레이드 ID
 * @returns {Promise<Object>} - 레이드 상세 정보
 */
export const getRaidDetail = async (raidId) => {
  try {
    const { data, error } = await supabase
      .from('boss_raids')
      .select('*')
      .eq('id', raidId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('레이드 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 레이드 참여
 * @param {number} raidId - 레이드 ID
 * @param {string} riderId - 라이더 ID
 * @param {string} riderName - 라이더 이름 (선택)
 * @returns {Promise<Object>} - 참여 결과
 */
export const joinRaid = async (raidId, riderId, riderName = null) => {
  try {
    // 라이더 ID 유효성 검증
    const pattern = /^BC\d{6}$/;
    if (!pattern.test(riderId)) {
      throw new Error('올바른 라이더 ID 형식이 아닙니다 (BC + 6자리 숫자)');
    }
    
    // 이미 참여했는지 확인
    const { data: existing } = await supabase
      .from('raid_participants')
      .select('id')
      .eq('raid_id', raidId)
      .eq('rider_id', riderId)
      .maybeSingle();
    
    if (existing) {
      return { success: false, message: '이미 참여한 레이드입니다.' };
    }
    
    // 참여 등록
    const { data, error } = await supabase
      .from('raid_participants')
      .insert({
        raid_id: raidId,
        rider_id: riderId,
        rider_name: riderName
      })
      .select();
    
    if (error) throw error;
    
    return { 
      success: true, 
      message: '레이드 참여 완료!',
      data: data[0]
    };
  } catch (error) {
    console.error('레이드 참여 실패:', error);
    return { 
      success: false, 
      message: error.message || '레이드 참여에 실패했습니다.'
    };
  }
};

/**
 * 레이드 참여자 목록 조회
 * @param {number} raidId - 레이드 ID
 * @returns {Promise<Array>} - 참여자 목록
 */
export const getRaidParticipants = async (raidId) => {
  try {
    const { data, error } = await supabase
      .from('raid_participants')
      .select('*')
      .eq('raid_id', raidId)
      .order('joined_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('참여자 조회 실패:', error);
    throw error;
  }
};

/**
 * 레이드 랭킹 조회
 * @param {number} raidId - 레이드 ID
 * @param {number} limit - 조회할 랭킹 수 (기본: 20)
 * @returns {Promise<Array>} - 랭킹 목록
 */
export const getRaidRankings = async (raidId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('raid_rankings')
      .select('*')
      .eq('raid_id', raidId)
      .order('rank', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('랭킹 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 라이더의 레이드 참여 여부 확인
 * @param {number} raidId - 레이드 ID
 * @param {string} riderId - 라이더 ID
 * @returns {Promise<boolean>} - 참여 여부
 */
export const isRiderParticipating = async (raidId, riderId) => {
  try {
    const { data, error } = await supabase
      .from('raid_participants')
      .select('id')
      .eq('raid_id', raidId)
      .eq('rider_id', riderId)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('참여 여부 확인 실패:', error);
    return false;
  }
};

/**
 * 레이드 데미지 히스토리 조회 (일별)
 * @param {number} raidId - 레이드 ID
 * @returns {Promise<Array>} - 일별 데미지 데이터
 */
export const getRaidDamageHistory = async (raidId) => {
  try {
    const { data, error } = await supabase
      .from('raid_damages')
      .select('damage_date, total_damage')
      .eq('raid_id', raidId)
      .order('damage_date', { ascending: true });
    
    if (error) throw error;
    
    // 날짜별 총 데미지 집계
    const damageByDate = {};
    data.forEach(item => {
      if (!damageByDate[item.damage_date]) {
        damageByDate[item.damage_date] = 0;
      }
      damageByDate[item.damage_date] += item.total_damage;
    });
    
    // 배열로 변환
    return Object.entries(damageByDate).map(([date, damage]) => ({
      date,
      damage
    }));
  } catch (error) {
    console.error('데미지 히스토리 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 라이더의 레이드 데미지 조회
 * @param {number} raidId - 레이드 ID
 * @param {string} riderId - 라이더 ID
 * @returns {Promise<Object>} - { totalDamage, rank, dailyDamages }
 */
export const getRiderDamageInfo = async (raidId, riderId) => {
  try {
    // 총 데미지 및 랭킹 조회
    const { data: ranking } = await supabase
      .from('raid_rankings')
      .select('*')
      .eq('raid_id', raidId)
      .eq('rider_id', riderId)
      .maybeSingle();
    
    // 일별 데미지 조회
    const { data: dailyDamages } = await supabase
      .from('raid_damages')
      .select('*')
      .eq('raid_id', raidId)
      .eq('rider_id', riderId)
      .order('damage_date', { ascending: true });
    
    return {
      totalDamage: ranking?.total_damage || 0,
      rank: ranking?.rank || null,
      dailyDamages: dailyDamages || []
    };
  } catch (error) {
    console.error('라이더 데미지 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 레이드 통계 조회
 * @param {number} raidId - 레이드 ID
 * @returns {Promise<Object>} - 레이드 통계
 */
export const getRaidStats = async (raidId) => {
  try {
    // 참여자 수
    const { count: participantCount } = await supabase
      .from('raid_participants')
      .select('*', { count: 'exact', head: true })
      .eq('raid_id', raidId);
    
    // 총 데미지
    const { data: damages } = await supabase
      .from('raid_damages')
      .select('total_damage')
      .eq('raid_id', raidId);
    
    const totalDamageDealt = damages?.reduce((sum, d) => sum + d.total_damage, 0) || 0;
    
    // 레이드 정보
    const raid = await getRaidDetail(raidId);
    
    return {
      participantCount: participantCount || 0,
      totalDamageDealt,
      currentHp: raid.current_hp,
      maxHp: raid.max_hp,
      progressPercentage: ((raid.max_hp - raid.current_hp) / raid.max_hp * 100).toFixed(1),
      daysRemaining: Math.ceil((new Date(raid.end_date) - new Date()) / (1000 * 60 * 60 * 24)),
      status: raid.status,
      buffMultiplier: raid.buff_multiplier
    };
  } catch (error) {
    console.error('레이드 통계 조회 실패:', error);
    throw error;
  }
};

/**
 * 레이드 보상 조회
 * @param {number} raidId - 레이드 ID
 * @returns {Promise<Array>} - 보상 목록
 */
export const getRaidRewards = async (raidId) => {
  try {
    const { data, error } = await supabase
      .from('raid_rewards')
      .select('*')
      .eq('raid_id', raidId)
      .order('rank', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('보상 조회 실패:', error);
    throw error;
  }
};

/**
 * 날짜 범위 계산 (D-Day)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns {number} - 남은 일수
 */
export const calculateDaysRemaining = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * HP 퍼센트 계산
 * @param {number} currentHp - 현재 HP
 * @param {number} maxHp - 최대 HP
 * @returns {number} - HP 퍼센트 (0-100)
 */
export const calculateHpPercentage = (currentHp, maxHp) => {
  if (maxHp === 0) return 0;
  return Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
};

/**
 * 레이드 상태 텍스트 변환
 * @param {string} status - 상태 코드
 * @returns {string} - 한글 상태
 */
export const getStatusText = (status) => {
  const statusMap = {
    'active': '진행중',
    'completed': '완료',
    'failed': '화속성'
  };
  return statusMap[status] || status;
};

/**
 * 보상 타입 텍스트 변환
 * @param {string} rewardType - 보상 타입
 * @returns {string} - 한글 보상 타입
 */
export const getRewardTypeText = (rewardType) => {
  const typeMap = {
    'real': '실제 보상',
    'virtual': '가상 보상',
    'badge': '배지'
  };
  return typeMap[rewardType] || rewardType;
};

/**
 * 라이더 ID 마스킹
 * @param {string} riderId - 라이더 ID (BC123456)
 * @returns {string} - 마스킹된 ID (BC12****)
 */
export const maskRiderId = (riderId) => {
  if (!riderId || riderId.length < 6) return riderId;
  return riderId.substring(0, 4) + '*'.repeat(riderId.length - 4);
};

