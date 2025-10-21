-- 보스 이미지 URL 업데이트
-- 불타는 배달 악마 이미지를 각 구별 보스에 적용

UPDATE boss_raids 
SET boss_image_url = '/boss-images/fire-delivery-demon.png',
    boss_name = '불타는 배달 악마',
    boss_type = 'fire'
WHERE district = '강남구';

UPDATE boss_raids 
SET boss_image_url = '/boss-images/fire-delivery-demon.png',
    boss_name = '화염 배달 마왕',
    boss_type = 'fire'
WHERE district = '서초구';

UPDATE boss_raids 
SET boss_image_url = '/boss-images/fire-delivery-demon.png',
    boss_name = '용암 배달 거인',
    boss_type = 'fire'
WHERE district = '송파구';

-- HP를 다양한 상태로 설정하여 테스트
UPDATE boss_raids 
SET current_hp = 75000  -- 75% HP
WHERE district = '강남구';

UPDATE boss_raids 
SET current_hp = 40000  -- 50% HP
WHERE district = '서초구';

UPDATE boss_raids 
SET current_hp = 15000  -- 17% HP (위험 상태)
WHERE district = '송파구';
