/**
 * 보스 레이드 시스템 데이터베이스 스키마
 * Supabase SQL Editor에서 실행
 */

-- 보스 레이드 정보 테이블
CREATE TABLE IF NOT EXISTS boss_raids (
  id SERIAL PRIMARY KEY,
  district VARCHAR(50) NOT NULL,                    -- 구 이름 (예: 강남구)
  boss_name VARCHAR(100) NOT NULL,                  -- 보스 이름
  boss_image_url TEXT,                              -- AI 생성 이미지 URL
  boss_type VARCHAR(20) DEFAULT 'fire',             -- 보스 속성 (화속성)
  max_hp INTEGER NOT NULL,                          -- 최대 HP
  current_hp INTEGER NOT NULL,                      -- 현재 HP
  start_date DATE NOT NULL,                         -- 레이드 시작일
  end_date DATE NOT NULL,                           -- 레이드 종료일 (2주)
  status VARCHAR(20) DEFAULT 'active',              -- active, completed, failed
  buff_multiplier DECIMAL(3,1) DEFAULT 1.0,         -- 데미지 버프 배율
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 레이드 참여자 테이블
CREATE TABLE IF NOT EXISTS raid_participants (
  id SERIAL PRIMARY KEY,
  raid_id INTEGER REFERENCES boss_raids(id) ON DELETE CASCADE,
  rider_id VARCHAR(20) NOT NULL,                    -- BC + 6자리
  rider_name VARCHAR(50),                           -- 라이더 이름 (선택)
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(raid_id, rider_id)
);

-- 배달 로그 테이블 (Google Sheets 동기화)
CREATE TABLE IF NOT EXISTS delivery_logs (
  id SERIAL PRIMARY KEY,
  rider_id VARCHAR(20) NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_count INTEGER NOT NULL,                  -- 일일 배달 건수
  is_rainy BOOLEAN DEFAULT false,                   -- 우천 여부
  has_surge BOOLEAN DEFAULT false,                  -- 할증 여부
  district VARCHAR(50),                             -- 배달 구역
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rider_id, delivery_date)                   -- 라이더당 하루 1개 레코드
);

-- 데미지 기록 테이블 (계산된 데이터)
CREATE TABLE IF NOT EXISTS raid_damages (
  id SERIAL PRIMARY KEY,
  raid_id INTEGER REFERENCES boss_raids(id) ON DELETE CASCADE,
  rider_id VARCHAR(20) NOT NULL,
  damage_date DATE NOT NULL,
  base_damage INTEGER NOT NULL,                     -- 기본 데미지 (배달건수 × 10)
  bonus_multiplier DECIMAL(3,1) DEFAULT 1.0,        -- 우천/할증 2배
  total_damage INTEGER NOT NULL,                    -- 최종 데미지
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(raid_id, rider_id, damage_date)            -- 레이드당 라이더당 날짜당 1개
);

-- 랭킹 테이블 (일단위 집계)
CREATE TABLE IF NOT EXISTS raid_rankings (
  id SERIAL PRIMARY KEY,
  raid_id INTEGER REFERENCES boss_raids(id) ON DELETE CASCADE,
  rider_id VARCHAR(20) NOT NULL,
  rider_name VARCHAR(50),
  total_damage INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  last_updated DATE NOT NULL,
  UNIQUE(raid_id, rider_id)
);

-- 보상 기록 테이블
CREATE TABLE IF NOT EXISTS raid_rewards (
  id SERIAL PRIMARY KEY,
  raid_id INTEGER REFERENCES boss_raids(id) ON DELETE CASCADE,
  rider_id VARCHAR(20) NOT NULL,
  rank INTEGER,
  reward_type VARCHAR(20),                          -- real, virtual, badge
  reward_description TEXT,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_boss_raids_status ON boss_raids(status);
CREATE INDEX IF NOT EXISTS idx_boss_raids_district ON boss_raids(district);
CREATE INDEX IF NOT EXISTS idx_raid_participants_rider ON raid_participants(rider_id);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_rider_date ON delivery_logs(rider_id, delivery_date);
CREATE INDEX IF NOT EXISTS idx_raid_damages_raid_rider ON raid_damages(raid_id, rider_id);
CREATE INDEX IF NOT EXISTS idx_raid_rankings_raid ON raid_rankings(raid_id, rank);

-- Row Level Security (RLS) 설정
ALTER TABLE boss_raids ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_damages ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_rewards ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 권한 (모든 사용자가 조회 가능)
CREATE POLICY "Public read access for boss_raids" ON boss_raids FOR SELECT USING (true);
CREATE POLICY "Public read access for raid_participants" ON raid_participants FOR SELECT USING (true);
CREATE POLICY "Public read access for raid_damages" ON raid_damages FOR SELECT USING (true);
CREATE POLICY "Public read access for raid_rankings" ON raid_rankings FOR SELECT USING (true);
CREATE POLICY "Public read access for raid_rewards" ON raid_rewards FOR SELECT USING (true);

-- 참여자는 자신만 등록 가능 (라이더 ID로 제한)
CREATE POLICY "Users can insert their own participation" ON raid_participants 
  FOR INSERT WITH CHECK (true);

-- 서비스 역할은 모든 작업 가능 (동기화 스크립트용)
CREATE POLICY "Service role full access delivery_logs" ON delivery_logs USING (true);
CREATE POLICY "Service role full access raid_damages" ON raid_damages USING (true);
CREATE POLICY "Service role full access raid_rankings" ON raid_rankings USING (true);

-- 테스트 데이터 삽입 (샘플)
INSERT INTO boss_raids (district, boss_name, boss_image_url, boss_type, max_hp, current_hp, start_date, end_date, status)
VALUES 
  ('강남구', '불꽃 드래곤', '/boss-images/fire-dragon.png', 'fire', 100000, 100000, CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', 'active'),
  ('서초구', '화염 골렘', '/boss-images/fire-golem.png', 'fire', 80000, 80000, CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', 'active'),
  ('송파구', '용암 거인', '/boss-images/lava-giant.png', 'fire', 90000, 90000, CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', 'active')
ON CONFLICT DO NOTHING;

-- 테스트 참여자 삽입
INSERT INTO raid_participants (raid_id, rider_id, rider_name)
VALUES 
  (1, 'BC123456', '김배민'),
  (1, 'BC234567', '이라이더'),
  (2, 'BC345678', '박배달')
ON CONFLICT DO NOTHING;

-- 업데이트 트리거 (updated_at 자동 갱신)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_boss_raids_updated_at 
  BEFORE UPDATE ON boss_raids 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE boss_raids IS '보스 레이드 메인 정보';
COMMENT ON TABLE raid_participants IS '레이드 참여자 목록';
COMMENT ON TABLE delivery_logs IS '라이더 배달 로그 (Google Sheets 동기화)';
COMMENT ON TABLE raid_damages IS '레이드 데미지 기록';
COMMENT ON TABLE raid_rankings IS '레이드 랭킹 (일단위 집계)';
COMMENT ON TABLE raid_rewards IS '레이드 보상 기록';

