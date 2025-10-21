# 🚀 배포 가이드

이 가이드는 보스 레이드 프로젝트를 Vercel에 배포하는 전체 과정을 설명합니다.

## 📋 사전 준비물

- [x] Node.js 설치
- [ ] Vercel 계정 (https://vercel.com)
- [ ] Supabase 계정 (https://supabase.com)
- [ ] Git 저장소 (선택사항이지만 권장)

---

## 1️⃣ Supabase 프로젝트 설정

### 1.1 새 프로젝트 생성

1. **Supabase 대시보드 접속**
   - https://supabase.com/dashboard 로 이동
   - 로그인 후 "New Project" 클릭

2. **프로젝트 정보 입력**
   ```
   Organization: 본인의 organization 선택
   Name: baemin-boss-raid
   Database Password: 안전한 비밀번호 생성 (반드시 저장!)
   Region: Northeast Asia (Seoul) - ap-northeast-2
   Pricing Plan: Free
   ```

3. **프로젝트 생성 완료 대기** (약 2분 소요)

### 1.2 API 키 확인 및 저장

1. **Settings > API** 메뉴로 이동
2. 다음 정보를 안전한 곳에 복사:
   ```
   Project URL: https://xxxxxxxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

⚠️ **주의**: `service_role key`는 절대 공개하면 안 됩니다!

### 1.3 데이터베이스 스키마 생성

1. **SQL Editor** 메뉴로 이동
2. "New query" 클릭
3. 프로젝트의 `database_raid_setup.sql` 파일 내용 전체 복사
4. SQL Editor에 붙여넣기
5. **"Run"** 버튼 클릭

**예상 결과:**
```
Success. 6 tables created.
- boss_raids
- raid_participants
- delivery_logs
- raid_damages
- raid_rankings
- raid_rewards
```

### 1.4 데이터 확인

1. **Table Editor** 메뉴로 이동
2. `boss_raids` 테이블 선택
3. 테스트 데이터 3개(강남구, 서초구, 송파구)가 있는지 확인

---

## 2️⃣ 로컬 환경 설정

### 2.1 환경변수 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일 생성:

```bash
# .env.local
REACT_APP_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

위에서 복사한 실제 값으로 교체하세요.

### 2.2 로컬 테스트

```bash
# 개발 서버 시작
npm start
```

브라우저에서 http://localhost:3000 접속 후 확인:

- ✅ 보스 카드 3개가 표시되는가?
- ✅ 각 보스의 HP가 표시되는가?
- ✅ 지도뷰가 정상 작동하는가?
- ✅ 브라우저 콘솔에 에러가 없는가?
- ✅ "데이터베이스 연결 실패, 더미 데이터 사용" 메시지가 나오지 않는가?

### 2.3 프로덕션 빌드 테스트

```bash
npm run build
```

**성공 시 출력:**
```
The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build
```

---

## 3️⃣ Vercel 배포

### 방법 A: Vercel CLI (추천 - 빠르고 간편)

#### 3.1 Vercel CLI 설치

```bash
npm install -g vercel
```

#### 3.2 Vercel 로그인

```bash
vercel login
```

이메일로 로그인 링크가 전송됩니다. 이메일 확인 후 인증 완료.

#### 3.3 프로젝트 초기 배포

```bash
vercel
```

**질문에 답변:**
```
? Set up and deploy "~/baemin-boss-raid"? [Y/n] Y
? Which scope do you want to deploy to? [본인 계정 선택]
? Link to existing project? [y/N] N
? What's your project's name? baemin-boss-raid
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

Preview 배포가 완료되고 URL이 제공됩니다 (예: https://baemin-boss-raid-xxx.vercel.app)

#### 3.4 환경변수 설정

```bash
# Supabase URL 설정
vercel env add REACT_APP_SUPABASE_URL
# 입력: https://xxxxxxxxxx.supabase.co
# Environment: Production, Preview, Development 모두 선택 (a)

# Supabase Anon Key 설정
vercel env add REACT_APP_SUPABASE_ANON_KEY
# 입력: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Environment: Production, Preview, Development 모두 선택 (a)

# Service Role Key 설정 (동기화용)
vercel env add SUPABASE_SERVICE_ROLE_KEY
# 입력: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Environment: Production 선택
```

#### 3.5 프로덕션 배포

```bash
vercel --prod
```

**완료!** 프로덕션 URL이 제공됩니다: https://baemin-boss-raid.vercel.app

---

### 방법 B: Vercel 웹 대시보드

#### 3.1 GitHub 저장소 준비 (선택사항)

```bash
# Git 초기화 (아직 안 한 경우)
git init
git add .
git commit -m "Initial commit: 보스 레이드 프로젝트"

# GitHub에 저장소 생성 후
git remote add origin https://github.com/your-username/baemin-boss-raid.git
git branch -M main
git push -u origin main
```

#### 3.2 Vercel에서 프로젝트 임포트

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 로그인

2. **새 프로젝트 생성**
   - "Add New..." > "Project" 클릭

3. **저장소 연결**
   - GitHub 계정 연결
   - `baemin-boss-raid` 저장소 선택
   - "Import" 클릭

4. **프로젝트 설정**
   ```
   Framework Preset: Create React App (자동 감지)
   Root Directory: ./
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

5. **환경변수 추가**
   - "Environment Variables" 섹션 확장
   - 다음 변수 추가:
     ```
     REACT_APP_SUPABASE_URL = https://xxxxxxxxxx.supabase.co
     REACT_APP_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

6. **배포 시작**
   - "Deploy" 버튼 클릭
   - 빌드 로그 확인 (약 2-3분 소요)

---

## 4️⃣ 배포 확인

### 4.1 URL 접속

Vercel이 제공하는 URL로 이동: https://baemin-boss-raid.vercel.app

### 4.2 체크리스트

- [ ] 페이지가 정상적으로 로드되는가?
- [ ] 보스 카드 3개가 모두 표시되는가?
- [ ] 각 보스의 이름과 HP가 정확한가?
- [ ] 카드뷰와 지도뷰가 전환되는가?
- [ ] 지도에서 서울시가 보이고 보스 마커가 표시되는가?
- [ ] 보스 카드 클릭 시 랭킹 페이지로 이동하는가?
- [ ] 브라우저 콘솔(F12)에 에러가 없는가?
- [ ] "더미 데이터 사용" 메시지가 나오지 않는가?

### 4.3 문제 해결

#### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 확인 및 수정
# package.json의 dependencies 확인
```

#### 환경변수 인식 안됨
- 변수명이 `REACT_APP_`로 시작하는지 확인
- Vercel Dashboard > Settings > Environment Variables에서 재확인
- 재배포: `vercel --prod`

#### Supabase 연결 실패
- API 키와 URL이 정확한지 확인
- Supabase 프로젝트가 활성 상태인지 확인
- RLS(Row Level Security) 정책이 올바르게 설정되었는지 확인

#### 더미 데이터만 표시
- Supabase `boss_raids` 테이블에 실제 데이터가 있는지 확인
- `database_raid_setup.sql`을 다시 실행

---

## 5️⃣ GitHub Actions 설정 (자동 동기화)

### 5.1 Google Sheets 준비 (선택사항)

동기화 기능을 사용하려면:

1. Google Sheets에서 새 스프레드시트 생성
2. "배달로그" 시트 추가
3. 헤더 행 작성:
   ```
   라이더ID | 배달날짜 | 배달건수 | 우천여부 | 할증여부 | 구역
   ```

### 5.2 GitHub Secrets 등록

GitHub 저장소 > Settings > Secrets and variables > Actions

**New repository secret** 클릭 후 다음 추가:

```
REACT_APP_SUPABASE_URL = https://xxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Google Sheets 동기화 사용 시 추가:
```
GOOGLE_RAID_SHEET_ID = 1abc...xyz
GOOGLE_CLIENT_EMAIL = your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

### 5.3 워크플로우 확인

`.github/workflows/raid-sync.yml` 파일이 자동으로 실행됩니다:
- **스케줄**: 매일 오전 9시, 오후 9시 (KST)
- **Actions 탭**에서 실행 로그 확인 가능

---

## 6️⃣ 도메인 설정 (선택사항)

### 기본 도메인
Vercel이 자동으로 제공:
- Production: `https://baemin-boss-raid.vercel.app`
- Preview: `https://baemin-boss-raid-git-branch.vercel.app`

### 커스텀 도메인 추가

1. Vercel Dashboard > 프로젝트 선택
2. Settings > Domains
3. "Add" 버튼 클릭
4. 도메인 입력 (예: `raid.baemin.com`)
5. DNS 설정 안내에 따라 도메인 제공업체에서 레코드 추가
   - Type: `CNAME`
   - Name: `raid` (또는 `@` for root)
   - Value: `cname.vercel-dns.com`

---

## 🎉 완료!

축하합니다! 보스 레이드 시스템이 성공적으로 배포되었습니다.

### 배포된 URL
- 프로덕션: https://baemin-boss-raid.vercel.app
- Vercel 대시보드: https://vercel.com/dashboard

### 다음 단계

1. **라이더들에게 URL 공유**
   - QR 코드 생성 추천: https://qr.io
   
2. **실제 데이터 입력**
   - Google Sheets에 배달 로그 입력
   - 동기화 스크립트 실행: `npm run sync:raid`

3. **모니터링**
   - Vercel Analytics로 트래픽 확인
   - Supabase Dashboard로 데이터베이스 상태 확인

4. **성능 최적화**
   - Vercel Speed Insights 활성화
   - 이미지 최적화 (WebP 포맷)

### 유용한 링크

- 🔗 [Vercel Documentation](https://vercel.com/docs)
- 🔗 [Supabase Documentation](https://supabase.com/docs)
- 🔗 [Create React App Deployment](https://create-react-app.dev/docs/deployment)

### 문의

문제가 발생하면:
1. Vercel 빌드 로그 확인
2. 브라우저 콘솔 에러 확인
3. Supabase 로그 확인

---

**⚔️ 라이더님들의 활동을 게임처럼 재미있게!**

