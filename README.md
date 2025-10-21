# ⚔️ 배민커넥트 보스 레이드

라이더님들의 배달 활동을 게임화하여 동기부여를 제공하는 보스 레이드 시스템입니다.

## ✨ 주요 기능

### ⚔️ 보스 레이드 시스템
- **구 단위 보스**: 각 구별 필드 보스 배치 및 실시간 HP 표시
- **레이드 참여**: 라이더 ID로 명시적 참여 및 랭킹 시스템
- **데미지 시스템**: 배달 1건당 10 데미지, 우천/할증 시 2배
- **실시간 랭킹**: TOP 20 라이더 랭킹 (일단위 갱신)
- **보상 시스템**: 실제 보상(1등) + 가상 보상(전체) + 명예 배지
- **지도 뷰**: Leaflet 기반 서울시 구별 보스 위치 표시
- **일별 데미지 차트**: Recharts 기반 데이터 시각화

## 🛠️ 기술 스택

- **Frontend**: React 19, Bootstrap 5, React Router
- **Backend**: Supabase (PostgreSQL)
- **Styling**: CSS3, Bootstrap
- **Icons**: React Icons
- **Maps**: Leaflet, React-Leaflet (OpenStreetMap)
- **Charts**: Recharts
- **Animations**: React-CountUp

## 🚀 빠른 시작

### 1. 프로젝트 설치
```bash
cd baemin-boss-raid
npm install
```

### 2. 환경변수 설정
프로젝트 루트에 `.env.local` 파일을 생성:

```bash
# Supabase
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Sheets (동기화용)
GOOGLE_RAID_SHEET_ID=your-raid-sheet-id
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. 데이터베이스 설정
Supabase SQL Editor에서 실행:
```bash
database_raid_setup.sql
```

### 4. 개발 서버 실행
```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 🗃️ 데이터베이스 구조

**보스 레이드 시스템:**
- `boss_raids` - 보스 레이드 정보
- `raid_participants` - 참여자 목록
- `delivery_logs` - 배달 로그 (Google Sheets 동기화)
- `raid_damages` - 데미지 기록
- `raid_rankings` - 랭킹 (일단위 집계)
- `raid_rewards` - 보상 기록

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── BossRaidMap.js  # 보스 레이드 지도 (Leaflet)
│   ├── BossCard.js     # 보스 카드
│   ├── RaidHPBar.js    # HP 프로그레스 바
│   ├── RaidRanking.js  # 랭킹 테이블
│   ├── RaidJoinModal.js # 참여 모달
│   ├── RaidCountdown.js # 카운트다운
│   └── DamageChart.js  # 데미지 차트
├── pages/              # 페이지 컴포넌트
│   ├── BossRaidPage.js # 보스 레이드 목록 페이지
│   └── RaidDetailPage.js # 레이드 상세 페이지
├── services/           # 데이터 서비스
│   └── raidService.js  # Supabase 연동 (보스 레이드)
├── config/             # 설정 파일
│   └── supabase.js     # Supabase 클라이언트 설정
└── App.js              # 메인 앱 컴포넌트

scripts/
└── raid-sync.js        # 보스 레이드 동기화

public/
└── boss-images/        # 보스 이미지 리소스
```

## 🎮 게임 메커니즘

### 데미지 계산
- 배달 1건 = **10 데미지**
- 우천 배달 = **20 데미지** (2배)
- 할증 배달 = **20 데미지** (2배)
- 레이드 버프 = **배율 적용** (관리자 설정)

### 레이드 진행
1. **참여하기**: 라이더 ID로 레이드 참여 신청
2. **배달하기**: 해당 구역에서 배달하여 보스에게 데미지
3. **랭킹 확인**: 매일 자정 랭킹 업데이트
4. **보상 획득**: 레이드 완료 시 순위별 보상

### 보상 시스템
- 🥇 **1등**: 스타벅스 기프티콘 5만원권 (실제 보상)
- 🥈 **2-3등**: 특별 달성 배지 (가상 보상)
- 👥 **참여자**: 레이드 참여 배지

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build

# 보스 레이드 동기화 실행 (배달로그 → Supabase)
npm run sync:raid
```

## 🤖 자동 동기화 (GitHub Actions)

`.github/workflows/raid-sync.yml`가 매일 오전 9시/오후 9시(KST)에 자동 실행

GitHub Secrets 등록 필요:
- `REACT_APP_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_RAID_SHEET_ID`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

## 📚 문서

- **상세 가이드**: [BOSS_RAID_GUIDE.md](./BOSS_RAID_GUIDE.md)
- **데이터베이스 스키마**: [database_raid_setup.sql](./database_raid_setup.sql)
- **동기화 스크립트**: [scripts/raid-sync.js](./scripts/raid-sync.js)

## 🎯 다음 단계

1. ✅ 데이터베이스 설정 (`database_raid_setup.sql` 실행)
2. ✅ Google Sheets 생성 및 "배달로그" 시트 추가
3. ✅ 환경변수 설정 (`.env.local`)
4. ✅ AI로 보스 이미지 생성 → `public/boss-images/`에 저장
5. ✅ 동기화 테스트 (`npm run sync:raid`)
6. ✅ 로컬 테스트 (`npm start`)

## 🌐 배포

### Vercel 배포 (추천)

**빠른 배포 (5분):**
```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 로그인
vercel login

# 3. 배포
vercel

# 4. 환경변수 설정
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY

# 5. 프로덕션 배포
vercel --prod
```

**상세 가이드:**
- 📘 [Supabase 설정 가이드](./SUPABASE_SETUP.md) - 데이터베이스 설정
- 📗 [Vercel 배포 가이드](./VERCEL_DEPLOY.md) - 빠른 배포 방법
- 📕 [전체 배포 가이드](./DEPLOYMENT_GUIDE.md) - 완전한 단계별 설명

**배포 URL:**
- Production: `https://baemin-boss-raid.vercel.app`
- Preview: Git push 시 자동 생성

## 🚀 향후 계획

- [ ] 여러 보스 속성 추가 (물, 바람, 땅)
- [ ] 라이더 클래스 시스템
- [ ] 길드/팀 레이드
- [ ] 아이템 시스템
- [ ] 시즌제 운영
- [ ] 실시간 알림 (Supabase Realtime)

## 📞 문의

- **카카오톡**: @배민커넥트
- **이메일**: contact@baemin.com

---

**⚔️ 라이더님들의 활동을 게임처럼 재미있게!**
# 배포 테스트
