# 보스 레이드 시스템 가이드

## 📋 목차
1. [시스템 개요](#시스템-개요)
2. [데이터베이스 설정](#데이터베이스-설정)
3. [Google Sheets 설정](#google-sheets-설정)
4. [동기화 실행](#동기화-실행)
5. [보스 이미지 추가](#보스-이미지-추가)
6. [FAQ](#faq)

---

## 시스템 개요

보스 레이드 시스템은 라이더들의 배달 활동을 게임화하여 동기부여를 제공하는 기능입니다.

### 핵심 메커니즘
- **구 단위 보스**: 각 구에 하나의 필드 보스 배치
- **데미지 시스템**: 배달 1건 = 10 데미지, 우천/할증 = 20 데미지
- **레이드 기간**: 2주 단위
- **랭킹**: 일단위 갱신, 데미지 높은 순
- **보상**: 실제 보상(1등) + 가상 보상(전체) + 명예

---

## 데이터베이스 설정

### 1. Supabase SQL Editor에서 실행

`database_raid_setup.sql` 파일의 내용을 Supabase SQL Editor에서 실행합니다.

```bash
# SQL 파일 위치
database_raid_setup.sql
```

### 2. 테이블 확인

실행 후 다음 테이블들이 생성됩니다:
- `boss_raids` - 보스 레이드 정보
- `raid_participants` - 참여자 목록
- `delivery_logs` - 배달 로그
- `raid_damages` - 데미지 기록
- `raid_rankings` - 랭킹
- `raid_rewards` - 보상 기록

### 3. 테스트 데이터

스크립트 실행 시 3개의 샘플 레이드가 자동 생성됩니다:
- 강남구: 불꽃 드래곤
- 서초구: 화염 골렘
- 송파구: 용암 거인

---

## Google Sheets 설정

### 1. 새 스프레드시트 생성

Google Sheets에서 새 스프레드시트를 생성합니다.

### 2. 시트 이름 설정

첫 번째 시트의 이름을 **"배달로그"**로 변경합니다.

### 3. 헤더 행 추가

첫 번째 행에 다음 헤더를 추가합니다:

| 라이더_ID | 날짜 | 배달건수 | 우천여부 | 할증여부 | 배달구역 |
|----------|------|---------|---------|---------|---------|

### 4. 데이터 예시

```
BC123456    2025-10-21    45    TRUE     FALSE    강남구
BC234567    2025-10-21    38    FALSE    TRUE     서초구
BC345678    2025-10-22    52    TRUE     TRUE     송파구
```

### 5. 환경변수 설정

`.env.local` 파일에 다음 환경변수를 추가합니다:

```bash
# 기존 환경변수들
REACT_APP_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key

# 보스 레이드용 (새로 추가)
GOOGLE_RAID_SHEET_ID=your_raid_sheet_id
```

---

## 동기화 실행

### 수동 실행

```bash
# 보스 레이드 동기화 실행
npm run sync:raid
```

### 자동 실행 (GitHub Actions)

GitHub Actions가 다음 시간에 자동으로 실행됩니다:
- 매일 오전 9시 (한국시간)
- 매일 오후 9시 (한국시간)

### 수동 트리거

GitHub 리포지토리 → Actions → "Boss Raid Sync" → "Run workflow"

---

## 보스 이미지 추가

### 1. AI로 이미지 생성

ChatGPT, Midjourney, DALL-E 등을 사용하여 보스 이미지를 생성합니다.

**프롬프트 예시:**
```
"A fierce fire dragon boss monster in pixel art style, 
suitable for a mobile game, dark background, 
glowing red eyes, breathing flames"
```

### 2. 이미지 저장

생성된 이미지를 다음 위치에 저장합니다:

```
public/boss-images/
  ├── fire-dragon.png
  ├── fire-golem.png
  └── lava-giant.png
```

### 3. 데이터베이스 업데이트

Supabase에서 `boss_raids` 테이블의 `boss_image_url`을 업데이트합니다:

```sql
UPDATE boss_raids 
SET boss_image_url = '/boss-images/fire-dragon.png'
WHERE id = 1;
```

---

## FAQ

### Q1: 레이드를 새로 생성하려면?

Supabase에서 직접 `boss_raids` 테이블에 INSERT:

```sql
INSERT INTO boss_raids (
  district, boss_name, boss_type, 
  max_hp, current_hp, 
  start_date, end_date, status
) VALUES (
  '강동구', '화염 타이탄', 'fire',
  120000, 120000,
  '2025-10-21', '2025-11-04', 'active'
);
```

### Q2: 버프를 적용하려면?

```sql
UPDATE boss_raids 
SET buff_multiplier = 2.0
WHERE id = 1;
```

### Q3: 랭킹이 업데이트되지 않는다면?

1. 동기화 스크립트가 정상 실행되었는지 확인
2. GitHub Actions 로그 확인
3. 수동으로 `npm run sync:raid` 실행

### Q4: 라이더가 참여했는데 랭킹에 없다면?

1. 해당 구역의 배달 로그가 Google Sheets에 입력되었는지 확인
2. 라이더가 해당 레이드에 참여했는지 확인 (`raid_participants` 테이블)
3. 동기화 실행 후 데미지가 계산되었는지 확인 (`raid_damages` 테이블)

### Q5: 레이드를 강제 종료하려면?

```sql
UPDATE boss_raids 
SET status = 'completed', current_hp = 0
WHERE id = 1;
```

---

## 트러블슈팅

### 동기화 실패 시

1. **환경변수 확인**
   ```bash
   echo $REACT_APP_SUPABASE_URL
   echo $GOOGLE_RAID_SHEET_ID
   ```

2. **Google Sheets 권한 확인**
   - Service Account 이메일이 스프레드시트에 편집자로 추가되었는지 확인

3. **로그 확인**
   ```bash
   npm run sync:raid 2>&1 | tee sync.log
   ```

### 이미지가 표시되지 않을 때

1. 이미지 경로 확인: `/boss-images/파일명.png`
2. public 폴더에 이미지가 있는지 확인
3. 브라우저 캐시 삭제 후 새로고침

---

## 지원

문제가 발생하면 다음을 포함하여 이슈를 생성해주세요:
1. 오류 메시지
2. 실행 환경 (로컬/프로덕션)
3. 재현 단계
4. 관련 로그

---

**작성일**: 2025-10-21  
**버전**: 1.0.0

