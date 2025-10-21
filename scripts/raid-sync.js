/**
 * 보스 레이드 배달로그 동기화 스크립트
 * Google Sheets → Supabase 동기화
 * 사용법: node scripts/raid-sync.js
 */

// Node.js fetch polyfill
const fetch = require('node-fetch');
global.fetch = fetch;

// SSL 검증 우회 (개발환경용)
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const { createClient } = require('@supabase/supabase-js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

// 환경변수 설정
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_SHEET_ID = process.env.GOOGLE_RAID_SHEET_ID || process.env.GOOGLE_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Supabase 클라이언트 (서비스 키 사용)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * 구글 시트 인증 및 문서 로드
 */
async function loadGoogleSheet() {
  try {
    console.log('🔐 구글 시트 인증 중...');
    
    const serviceAccountAuth = new JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    console.log(`✅ 구글 시트 로드 완료: ${doc.title}`);
    return doc;
  } catch (error) {
    console.error('❌ 구글 시트 로드 실패:', error);
    throw error;
  }
}

/**
 * 라이더 ID 유효성 검증
 */
function validateRiderId(riderId) {
  if (!riderId || typeof riderId !== 'string') return false;
  
  // BC + 6자리 숫자 패턴 확인
  const pattern = /^BC\d{6}$/;
  return pattern.test(riderId);
}

/**
 * 날짜 형식 변환 (YYYY-MM-DD)
 */
function formatDate(dateValue) {
  if (!dateValue) return null;
  
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return null;
  
  return date.toISOString().split('T')[0];
}

/**
 * Boolean 값 파싱
 */
function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.toLowerCase().trim();
    return normalized === 'true' || normalized === 'yes' || normalized === '1' || normalized === 'o';
  }
  return false;
}

/**
 * 구글 시트에서 배달로그 데이터 읽기
 */
async function readDeliveryLogs(doc) {
  try {
    console.log('📊 배달로그 데이터 읽기 중...');
    
    // "배달로그" 시트 찾기
    const sheet = doc.sheetsByTitle['배달로그'] || doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    const deliveryLogs = [];
    
    for (const row of rows) {
      // 빈 행 스킵
      if (!row.get('라이더_ID') && !row.get('날짜')) continue;
      
      // 라이더 ID 검증
      const riderId = row.get('라이더_ID');
      if (!validateRiderId(riderId)) {
        console.warn(`⚠️ 잘못된 라이더 ID: ${riderId} (행 ${row.rowNumber})`);
        continue;
      }
      
      // 날짜 검증
      const deliveryDate = formatDate(row.get('날짜'));
      if (!deliveryDate) {
        console.warn(`⚠️ 잘못된 날짜: ${row.get('날짜')} (행 ${row.rowNumber})`);
        continue;
      }
      
      // 배달건수 검증
      const deliveryCount = parseInt(row.get('배달건수'));
      if (isNaN(deliveryCount) || deliveryCount < 0) {
        console.warn(`⚠️ 잘못된 배달건수: ${row.get('배달건수')} (행 ${row.rowNumber})`);
        continue;
      }
      
      const logItem = {
        rider_id: riderId,
        delivery_date: deliveryDate,
        delivery_count: deliveryCount,
        is_rainy: parseBoolean(row.get('우천여부')),
        has_surge: parseBoolean(row.get('할증여부')),
        district: row.get('배달구역') || '',
      };
      
      deliveryLogs.push(logItem);
    }
    
    console.log(`✅ ${deliveryLogs.length}개 배달로그 읽기 완료`);
    return deliveryLogs;
    
  } catch (error) {
    console.error('❌ 배달로그 읽기 실패:', error);
    throw error;
  }
}

/**
 * Supabase에 배달로그 동기화
 */
async function syncDeliveryLogs(deliveryLogs) {
  try {
    console.log('🔄 배달로그 Supabase 동기화 시작...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const log of deliveryLogs) {
      // delivery_logs 테이블에 upsert
      const { error } = await supabase
        .from('delivery_logs')
        .upsert(log, {
          onConflict: 'rider_id,delivery_date'
        });
        
      if (error) {
        console.error(`❌ 동기화 실패 (${log.rider_id}, ${log.delivery_date}):`, error.message);
        errorCount++;
      } else {
        successCount++;
      }
    }
    
    console.log(`✅ 배달로그 동기화 완료: 성공 ${successCount}개, 실패 ${errorCount}개`);
    return { successCount, errorCount };
    
  } catch (error) {
    console.error('❌ 배달로그 동기화 실패:', error);
    throw error;
  }
}

/**
 * 데미지 계산 및 기록
 */
async function calculateAndRecordDamages() {
  try {
    console.log('⚔️ 데미지 계산 시작...');
    
    // 활성화된 레이드 목록 조회
    const { data: activeRaids, error: raidsError } = await supabase
      .from('boss_raids')
      .select('*')
      .eq('status', 'active');
      
    if (raidsError) throw raidsError;
    
    console.log(`📋 활성 레이드 ${activeRaids.length}개 발견`);
    
    for (const raid of activeRaids) {
      console.log(`\n🎯 레이드 처리 중: ${raid.district} - ${raid.boss_name}`);
      
      // 해당 레이드의 참여자 조회
      const { data: participants, error: participantsError } = await supabase
        .from('raid_participants')
        .select('rider_id')
        .eq('raid_id', raid.id);
        
      if (participantsError) throw participantsError;
      
      const participantIds = participants.map(p => p.rider_id);
      console.log(`👥 참여자 ${participantIds.length}명`);
      
      if (participantIds.length === 0) continue;
      
      // 레이드 기간 내의 배달로그 조회
      const { data: deliveryLogs, error: logsError } = await supabase
        .from('delivery_logs')
        .select('*')
        .in('rider_id', participantIds)
        .eq('district', raid.district)
        .gte('delivery_date', raid.start_date)
        .lte('delivery_date', raid.end_date);
        
      if (logsError) throw logsError;
      
      console.log(`📦 배달로그 ${deliveryLogs.length}개 발견`);
      
      // 각 배달로그에 대해 데미지 계산
      const BASE_DAMAGE_PER_DELIVERY = 10;
      let totalDamageDealt = 0;
      
      for (const log of deliveryLogs) {
        // 기본 데미지 계산
        const baseDamage = log.delivery_count * BASE_DAMAGE_PER_DELIVERY;
        
        // 보너스 배율 계산 (우천 또는 할증 시 2배)
        let bonusMultiplier = 1.0;
        if (log.is_rainy || log.has_surge) {
          bonusMultiplier = 2.0;
        }
        
        // 레이드 버프 적용
        const finalMultiplier = bonusMultiplier * parseFloat(raid.buff_multiplier);
        
        // 최종 데미지
        const totalDamage = Math.floor(baseDamage * finalMultiplier);
        
        // raid_damages 테이블에 기록
        const { error: damageError } = await supabase
          .from('raid_damages')
          .upsert({
            raid_id: raid.id,
            rider_id: log.rider_id,
            damage_date: log.delivery_date,
            base_damage: baseDamage,
            bonus_multiplier: finalMultiplier,
            total_damage: totalDamage
          }, {
            onConflict: 'raid_id,rider_id,damage_date'
          });
          
        if (damageError) {
          console.error(`❌ 데미지 기록 실패:`, damageError.message);
        } else {
          totalDamageDealt += totalDamage;
        }
      }
      
      // 보스 HP 감소
      if (totalDamageDealt > 0) {
        const newHp = Math.max(0, raid.current_hp - totalDamageDealt);
        const newStatus = newHp === 0 ? 'completed' : raid.status;
        
        const { error: updateError } = await supabase
          .from('boss_raids')
          .update({ 
            current_hp: newHp,
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', raid.id);
          
        if (updateError) {
          console.error(`❌ 보스 HP 업데이트 실패:`, updateError.message);
        } else {
          console.log(`💥 총 데미지: ${totalDamageDealt}, 남은 HP: ${newHp}/${raid.max_hp}`);
          
          // 레이드 완료 시 보상 처리
          if (newStatus === 'completed') {
            console.log(`🎉 레이드 완료! 보상 처리 중...`);
            await processRaidCompletion(raid.id);
          }
        }
      }
    }
    
    console.log('✅ 데미지 계산 완료');
    
  } catch (error) {
    console.error('❌ 데미지 계산 실패:', error);
    throw error;
  }
}

/**
 * 랭킹 업데이트
 */
async function updateRankings() {
  try {
    console.log('🏆 랭킹 업데이트 시작...');
    
    // 활성화된 레이드 목록 조회
    const { data: activeRaids, error: raidsError } = await supabase
      .from('boss_raids')
      .select('*')
      .in('status', ['active', 'completed']);
      
    if (raidsError) throw raidsError;
    
    for (const raid of activeRaids) {
      console.log(`\n📊 랭킹 계산 중: ${raid.district} - ${raid.boss_name}`);
      
      // 각 라이더의 총 데미지 집계
      const { data: damages, error: damagesError } = await supabase
        .from('raid_damages')
        .select('rider_id, total_damage')
        .eq('raid_id', raid.id);
        
      if (damagesError) throw damagesError;
      
      // 라이더별 총 데미지 합산
      const damageByRider = {};
      for (const damage of damages) {
        if (!damageByRider[damage.rider_id]) {
          damageByRider[damage.rider_id] = 0;
        }
        damageByRider[damage.rider_id] += damage.total_damage;
      }
      
      // 랭킹 계산 (데미지 높은 순)
      const rankings = Object.entries(damageByRider)
        .map(([riderId, totalDamage]) => ({
          rider_id: riderId,
          total_damage: totalDamage
        }))
        .sort((a, b) => b.total_damage - a.total_damage)
        .map((item, index) => ({
          raid_id: raid.id,
          rider_id: item.rider_id,
          total_damage: item.total_damage,
          rank: index + 1,
          last_updated: new Date().toISOString().split('T')[0]
        }));
      
      console.log(`📈 랭킹 ${rankings.length}개 생성`);
      
      // raid_rankings 테이블 업데이트
      for (const ranking of rankings) {
        const { error: rankError } = await supabase
          .from('raid_rankings')
          .upsert(ranking, {
            onConflict: 'raid_id,rider_id'
          });
          
        if (rankError) {
          console.error(`❌ 랭킹 업데이트 실패:`, rankError.message);
        }
      }
      
      console.log(`✅ 랭킹 업데이트 완료: TOP ${Math.min(3, rankings.length)}`);
      if (rankings.length > 0) {
        rankings.slice(0, 3).forEach((r, i) => {
          console.log(`  ${i + 1}등: ${r.rider_id} - ${r.total_damage.toLocaleString()} 데미지`);
        });
      }
    }
    
    console.log('✅ 전체 랭킹 업데이트 완료');
    
  } catch (error) {
    console.error('❌ 랭킹 업데이트 실패:', error);
    throw error;
  }
}

/**
 * 레이드 완료 처리 (보상 지급)
 */
async function processRaidCompletion(raidId) {
  try {
    console.log(`🎁 레이드 완료 보상 처리: ${raidId}`);
    
    // 랭킹 조회
    const { data: rankings, error: rankError } = await supabase
      .from('raid_rankings')
      .select('*')
      .eq('raid_id', raidId)
      .order('rank', { ascending: true });
      
    if (rankError) throw rankError;
    
    // 1등 실제 보상
    if (rankings.length > 0) {
      const firstPlace = rankings[0];
      await supabase.from('raid_rewards').insert({
        raid_id: raidId,
        rider_id: firstPlace.rider_id,
        rank: 1,
        reward_type: 'real',
        reward_description: '1등 보상: 스타벅스 기프티콘 5만원권'
      });
      console.log(`🥇 1등 실제 보상 지급: ${firstPlace.rider_id}`);
    }
    
    // 2-3등 가상 보상
    for (let i = 1; i < Math.min(3, rankings.length); i++) {
      const ranking = rankings[i];
      await supabase.from('raid_rewards').insert({
        raid_id: raidId,
        rider_id: ranking.rider_id,
        rank: ranking.rank,
        reward_type: 'virtual',
        reward_description: `${ranking.rank}등 달성 배지`
      });
    }
    
    // 전체 참여자에게 참여 배지
    const { data: participants } = await supabase
      .from('raid_participants')
      .select('rider_id')
      .eq('raid_id', raidId);
      
    for (const participant of participants) {
      // 이미 랭킹 보상 받은 사람은 제외
      const hasRankReward = rankings.some(r => r.rider_id === participant.rider_id);
      if (!hasRankReward) {
        await supabase.from('raid_rewards').insert({
          raid_id: raidId,
          rider_id: participant.rider_id,
          reward_type: 'badge',
          reward_description: '레이드 참여 배지'
        });
      }
    }
    
    console.log(`✅ 보상 처리 완료`);
    
  } catch (error) {
    console.error('❌ 보상 처리 실패:', error);
  }
}

/**
 * 메인 동기화 함수
 */
async function main() {
  try {
    console.log('🚀 보스 레이드 동기화 시작');
    console.log('시간:', new Date().toISOString());
    console.log('='.repeat(60));
    
    // 환경변수 확인
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GOOGLE_SHEET_ID) {
      throw new Error('필수 환경변수가 설정되지 않았습니다');
    }
    
    // 1. 구글 시트에서 배달로그 읽기
    const doc = await loadGoogleSheet();
    const deliveryLogs = await readDeliveryLogs(doc);
    
    // 2. Supabase에 배달로그 동기화
    await syncDeliveryLogs(deliveryLogs);
    
    // 3. 데미지 계산 및 기록
    await calculateAndRecordDamages();
    
    // 4. 랭킹 업데이트
    await updateRankings();
    
    console.log('='.repeat(60));
    console.log('🎉 보스 레이드 동기화 완료!');
    
  } catch (error) {
    console.error('💥 동기화 실패:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = { main };

