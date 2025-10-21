# 🗄️ Supabase 프로젝트 설정 가이드

이 가이드는 보스 레이드를 위한 새로운 Supabase 프로젝트를 처음부터 설정하는 방법을 설명합니다.

## 📋 목차

1. [프로젝트 생성](#1-프로젝트-생성)
2. [데이터베이스 스키마 설정](#2-데이터베이스-스키마-설정)
3. [API 키 확인](#3-api-키-확인)
4. [테스트 데이터 확인](#4-테스트-데이터-확인)
5. [보안 설정 (RLS)](#5-보안-설정-rls)

---

## 1. 프로젝트 생성

### 1.1 Supabase 계정 생성/로그인

1. https://supabase.com 접속
2. "Start your project" 또는 "Sign In" 클릭
3. GitHub, Google, 또는 이메일로 가입/로그인

### 1.2 Organization 선택

- 기존 organization이 있다면 선택
- 없다면 자동으로 생성됨

### 1.3 새 프로젝트 생성

**Dashboard에서 "New Project" 클릭**

**프로젝트 정보 입력:**

| 항목 | 값 | 설명 |
|------|-----|------|
| **Name** | `baemin-boss-raid` | 프로젝트 이름 |
| **Database Password** | `[안전한 비밀번호]` | ⚠️ 반드시 안전한 곳에 저장! |
| **Region** | `Northeast Asia (Seoul)` | 한국 사용자를 위한 최적의 지역 |
| **Pricing Plan** | `Free` | 무료 플랜 (500MB 데이터베이스, 50,000 MAU) |

**"Create new project" 클릭**

프로젝트 생성에 약 **2분** 소요됩니다. ☕

---

## 2. 데이터베이스 스키마 설정

### 2.1 SQL Editor 열기

좌측 메뉴에서 **"SQL Editor"** 클릭

### 2.2 SQL 스크립트 실행

1. **"New query"** 버튼 클릭
2. 프로젝트의 `database_raid_setup.sql` 파일 열기
3. **전체 내용 복사** (Ctrl+A, Ctrl+C)
4. SQL Editor에 **붙여넣기** (Ctrl+V)
5. 우측 하단의 **"Run"** 버튼 클릭 또는 `Ctrl+Enter`

### 2.3 성공 메시지 확인

SQL 실행이 완료되면 아래와 같은 메시지가 표시됩니다:

```
Success. No rows returned
```

**생성된 항목:**
- ✅ 6개 테이블
  - `boss_raids` - 보스 레이드 정보
  - `raid_participants` - 참여자 목록
  - `delivery_logs` - 배달 로그
  - `raid_damages` - 데미지 기록
  - `raid_rankings` - 랭킹
  - `raid_rewards` - 보상 기록
- ✅ 8개 인덱스 (성능 최적화)
- ✅ RLS(Row Level Security) 정책
- ✅ 테스트 데이터 3개 (강남구, 서초구, 송파구)

### 2.4 스키마 구조

```sql
-- 보스 레이드 메인 테이블
boss_raids
├── id (Primary Key)
├── district (구 이름)
├── boss_name (보스 이름)
├── boss_image_url (이미지 URL)
├── boss_type (속성: fire)
├── max_hp (최대 HP)
├── current_hp (현재 HP)
├── start_date (시작일)
├── end_date (종료일)
├── status (상태: active/completed/failed)
└── buff_multiplier (버프 배율)

-- 참여자 테이블
raid_participants
├── raid_id (FK -> boss_raids)
├── rider_id (라이더 ID)
└── rider_name (라이더 이름)

-- 배달 로그 테이블 (Google Sheets 동기화)
delivery_logs
├── rider_id
├── delivery_date
├── delivery_count
├── is_rainy (우천 여부)
├── has_surge (할증 여부)
└── district (구역)

-- 데미지 기록
raid_damages
├── raid_id (FK)
├── rider_id
├── damage_date
├── base_damage
├── bonus_multiplier
└── total_damage

-- 랭킹 (일단위 집계)
raid_rankings
├── raid_id (FK)
├── rider_id
├── total_damage
└── rank

-- 보상 기록
raid_rewards
├── raid_id (FK)
├── rider_id
├── rank
├── reward_type
└── reward_description
```

---

## 3. API 키 확인

### 3.1 API 설정 페이지 열기

좌측 메뉴 하단의 **"Settings"** (⚙️) 클릭 > **"API"** 선택

### 3.2 API 정보 복사

다음 3가지 정보를 **안전한 곳에 복사**하세요:

#### 1️⃣ Project URL
```
https://xxxxxxxxxx.supabase.co
```
모든 API 요청의 기본 URL입니다.

#### 2️⃣ anon/public Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
- **용도**: 프론트엔드(클라이언트)에서 사용
- **공개 가능**: 브라우저 코드에 포함되어도 안전
- **권한**: RLS 정책에 따라 제한됨

#### 3️⃣ service_role Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
- **용도**: 백엔드(서버) 스크립트에서 사용
- ⚠️ **절대 공개 금지**: RLS 정책을 우회하는 전체 권한
- **권한**: 모든 데이터에 대한 읽기/쓰기 가능

### 3.3 환경변수 파일 작성

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **주의**: 
- `.env.local`은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다
- `service_role key`는 서버 환경(GitHub Actions, Vercel 등)에만 설정하세요

---

## 4. 테스트 데이터 확인

### 4.1 Table Editor 열기

좌측 메뉴에서 **"Table Editor"** 클릭

### 4.2 boss_raids 테이블 확인

**`boss_raids`** 테이블을 선택하면 다음 3개의 테스트 데이터가 있어야 합니다:

| id | district | boss_name | max_hp | current_hp | status |
|----|----------|-----------|--------|------------|--------|
| 1 | 강남구 | 불꽃 드래곤 | 100000 | 100000 | active |
| 2 | 서초구 | 화염 골렘 | 80000 | 80000 | active |
| 3 | 송파구 | 용암 거인 | 90000 | 90000 | active |

### 4.3 기타 테이블 확인

**`raid_participants`** 테이블:
- 테스트 참여자 3명이 있어야 합니다

**나머지 테이블:**
- `delivery_logs`: 비어있음 (동기화로 채워짐)
- `raid_damages`: 비어있음
- `raid_rankings`: 비어있음
- `raid_rewards`: 비어있음

---

## 5. 보안 설정 (RLS)

### 5.1 Row Level Security란?

RLS(Row Level Security)는 PostgreSQL의 보안 기능으로, 테이블의 각 행에 대한 접근 권한을 세밀하게 제어합니다.

### 5.2 현재 RLS 정책

**공개 읽기 (Public Read):**
모든 사용자가 다음 테이블을 **조회**할 수 있습니다:
- `boss_raids`
- `raid_participants`
- `raid_damages`
- `raid_rankings`
- `raid_rewards`

**참여자 등록 (Insert):**
- 누구나 `raid_participants`에 자신의 정보를 **등록**할 수 있습니다

**서비스 역할 전체 권한:**
- `delivery_logs`, `raid_damages`, `raid_rankings`는 서비스 역할(동기화 스크립트)만 수정 가능

### 5.3 RLS 정책 확인

**Authentication > Policies** 메뉴에서 확인:

```sql
-- 예시: boss_raids 공개 읽기 정책
CREATE POLICY "Public read access for boss_raids" 
ON boss_raids FOR SELECT 
USING (true);
```

### 5.4 보안 체크리스트

- [x] 모든 테이블에 RLS 활성화
- [x] 공개 읽기 정책 설정
- [x] 서비스 역할 전체 권한
- [x] anon key는 프론트엔드에서 사용
- [x] service_role key는 백엔드에서만 사용

---

## 6. 연결 테스트

### 6.1 로컬 환경에서 테스트

```bash
# 개발 서버 시작
npm start
```

브라우저에서 http://localhost:3000 접속

### 6.2 확인 사항

**성공적인 연결:**
- ✅ 보스 카드 3개가 표시됨
- ✅ 각 보스의 이름과 HP가 정확함
- ✅ 콘솔에 에러가 없음

**연결 실패 시:**
- ❌ "더미 데이터 사용" 메시지
- ❌ 콘솔에 `Failed to fetch` 에러
- ❌ 보스 카드가 표시되지 않음

### 6.3 콘솔 확인 (F12)

**정상 연결:**
```
✅ Supabase 연결 성공
활성 레이드 3개 로드됨
```

**연결 실패:**
```
❌ Supabase 환경변수가 설정되지 않았습니다.
데이터베이스 연결 실패, 더미 데이터 사용
```

---

## 7. 추가 설정 (선택사항)

### 7.1 이메일 인증 비활성화

개발 중에는 이메일 인증을 비활성화할 수 있습니다:

**Authentication > Settings > Email Auth**
- "Confirm email" 토글을 OFF로 설정

### 7.2 데이터베이스 백업

**Settings > Database > Backups**
- 자동 백업 설정 (Pro 플랜)
- 수동 백업: "Create backup" 클릭

### 7.3 프로젝트 일시 중지 방지

**Settings > General**
- "Pause after 1 week of inactivity" 확인
- Free 플랜은 1주일 비활성 시 일시 중지됨
- 주기적으로 접속하여 활성 상태 유지

---

## 8. 문제 해결

### 8.1 SQL 실행 실패

**에러: relation already exists**
```sql
-- 테이블이 이미 존재하는 경우
-- 모든 테이블 삭제 후 재실행
DROP TABLE IF EXISTS raid_rewards CASCADE;
DROP TABLE IF EXISTS raid_rankings CASCADE;
DROP TABLE IF EXISTS raid_damages CASCADE;
DROP TABLE IF EXISTS delivery_logs CASCADE;
DROP TABLE IF EXISTS raid_participants CASCADE;
DROP TABLE IF EXISTS boss_raids CASCADE;

-- 이후 database_raid_setup.sql 재실행
```

### 8.2 API 연결 실패

**체크리스트:**
1. Supabase 프로젝트가 활성 상태인가?
2. API URL이 정확한가? (`https://`로 시작)
3. anon key가 정확한가?
4. `.env.local` 파일이 프로젝트 루트에 있는가?
5. 변수명이 `REACT_APP_`로 시작하는가?
6. 서버를 재시작했는가? (`npm start`)

### 8.3 RLS 정책 에러

**에러: new row violates row-level security policy**

원인: RLS 정책이 너무 제한적임

해결:
```sql
-- 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- 정책 수정 (예시)
ALTER POLICY "policy_name" ON table_name USING (true);
```

---

## 9. 유용한 리소스

### 공식 문서
- 📚 [Supabase 시작 가이드](https://supabase.com/docs/guides/getting-started)
- 📚 [PostgreSQL 함수](https://supabase.com/docs/guides/database/functions)
- 📚 [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### 커뮤니티
- 💬 [Supabase Discord](https://discord.supabase.com)
- 💬 [GitHub Discussions](https://github.com/supabase/supabase/discussions)

### 도구
- 🛠️ [Supabase Studio](https://supabase.com/dashboard) - 웹 기반 데이터베이스 관리
- 🛠️ [pgAdmin](https://www.pgadmin.org/) - 데스크톱 PostgreSQL 클라이언트

---

## 완료! ✅

Supabase 프로젝트가 성공적으로 설정되었습니다!

### 다음 단계
1. ✅ Supabase 프로젝트 생성
2. ✅ 데이터베이스 스키마 설정
3. ✅ API 키 확인 및 저장
4. ✅ 로컬 환경 테스트
5. ➡️ [Vercel 배포](./VERCEL_DEPLOY.md)

---

**⚔️ 데이터베이스 준비 완료! 이제 보스 레이드를 시작할 수 있습니다!**

