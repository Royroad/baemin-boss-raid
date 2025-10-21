# ✅ 배포 체크리스트

이 체크리스트를 따라 보스 레이드 프로젝트를 처음부터 끝까지 배포하세요.

---

## 📋 사전 준비

- [ ] Node.js 18+ 설치 확인 (`node --version`)
- [ ] npm 설치 확인 (`npm --version`)
- [ ] Vercel 계정 생성 (https://vercel.com)
- [ ] Supabase 계정 생성 (https://supabase.com)
- [ ] GitHub 계정 (선택사항, 자동 배포용)

---

## 1️⃣ Supabase 설정 (10분)

### 프로젝트 생성
- [ ] Supabase Dashboard 접속
- [ ] "New Project" 클릭
- [ ] 프로젝트 정보 입력
  - Name: `baemin-boss-raid`
  - Database Password: [안전한 비밀번호 생성 및 저장]
  - Region: `Northeast Asia (Seoul)`
  - Plan: `Free`
- [ ] 프로젝트 생성 완료 (약 2분 대기)

### 데이터베이스 스키마 생성
- [ ] SQL Editor 메뉴 이동
- [ ] "New query" 클릭
- [ ] `database_raid_setup.sql` 파일 내용 복사
- [ ] SQL Editor에 붙여넣기
- [ ] "Run" 클릭
- [ ] 성공 메시지 확인

### API 키 확인
- [ ] Settings > API 메뉴 이동
- [ ] 다음 정보 복사하여 안전한 곳에 저장:
  ```
  Project URL: https://[project-id].supabase.co
  anon/public key: eyJ...
  service_role key: eyJ...
  ```

### 데이터 확인
- [ ] Table Editor 메뉴 이동
- [ ] `boss_raids` 테이블 선택
- [ ] 테스트 데이터 3개 확인 (강남구, 서초구, 송파구)

📘 **상세 가이드**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

## 2️⃣ 로컬 환경 설정 (5분)

### 환경변수 파일 생성
- [ ] 프로젝트 루트에 `.env.local` 파일 생성
- [ ] 다음 내용 추가 (실제 값으로 교체):
  ```bash
  REACT_APP_SUPABASE_URL=https://[project-id].supabase.co
  REACT_APP_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  ```

### 로컬 테스트
- [ ] 터미널에서 `npm start` 실행
- [ ] http://localhost:3000 접속
- [ ] 보스 카드 3개 표시 확인
- [ ] 각 보스의 이름과 HP 확인
- [ ] 지도뷰 작동 확인
- [ ] 랭킹 페이지 접근 확인
- [ ] 브라우저 콘솔(F12)에서 에러 없음 확인
- [ ] "더미 데이터 사용" 메시지가 나오지 않음 확인

### 프로덕션 빌드 테스트
- [ ] 터미널에서 `npm run build` 실행
- [ ] 빌드 성공 확인
- [ ] `build/` 폴더 생성 확인

---

## 3️⃣ Vercel 배포 (5분)

### Vercel CLI 설치 및 로그인
- [ ] `npm install -g vercel` 실행
- [ ] `vercel login` 실행
- [ ] 이메일로 로그인 링크 확인
- [ ] 이메일에서 "Verify" 클릭
- [ ] 터미널에서 로그인 성공 확인

### 초기 배포
- [ ] 프로젝트 디렉토리에서 `vercel` 실행
- [ ] 질문에 답변:
  - Set up and deploy? **Y**
  - Which scope? [본인 계정 선택]
  - Link to existing project? **N**
  - Project name? **baemin-boss-raid**
  - In which directory? **./**
  - Override settings? **N**
- [ ] Preview URL 생성 확인 (예: `https://baemin-boss-raid-xxx.vercel.app`)

### 환경변수 설정
- [ ] `vercel env add REACT_APP_SUPABASE_URL` 실행
  - 값 입력: `https://[project-id].supabase.co`
  - Environment: **a** (모두 선택)
- [ ] `vercel env add REACT_APP_SUPABASE_ANON_KEY` 실행
  - 값 입력: `eyJ...`
  - Environment: **a** (모두 선택)
- [ ] `vercel env add SUPABASE_SERVICE_ROLE_KEY` 실행 (동기화용)
  - 값 입력: `eyJ...`
  - Environment: **Production**만 선택

### 프로덕션 배포
- [ ] `vercel --prod` 실행
- [ ] 배포 완료 확인
- [ ] Production URL 확인 (예: `https://baemin-boss-raid.vercel.app`)

📗 **상세 가이드**: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

---

## 4️⃣ 배포 확인 (5분)

### URL 접속 및 기능 테스트
- [ ] Production URL 접속
- [ ] 페이지 정상 로드 확인
- [ ] 헤더 표시 확인
  - 배민커넥트 로고
  - "⚔️ 보스 레이드" 제목
  - 카운트다운 타이머
- [ ] 보스 카드 3개 표시 확인
  - 화염 드래곤 (강남구)
  - 불타는 골렘 (서초구)
  - 용암 거인 (송파구)
- [ ] 각 보스 정보 확인
  - 보스 이미지
  - HP 바
  - 화속성, 버프, 참여자 수
- [ ] 카드뷰/지도뷰 전환 확인
- [ ] 지도뷰 기능 확인
  - 서울시 지도 표시
  - 보스 마커 3개 표시
  - 마커 클릭 시 팝업
- [ ] 보스 카드 클릭 확인
  - 랭킹 페이지로 이동
  - 해당 구역 랭킹 표시
- [ ] 레이드 가이드 버튼 확인
  - "참여 동의 설문 작성" 링크
  - "배민커넥트 앱 다운로드" 링크
  - "보상 확인하기" 링크
- [ ] 브라우저 콘솔 확인
  - F12 > Console 탭
  - 에러 메시지 없음 확인
  - "더미 데이터 사용" 메시지 없음 확인

### 성능 확인
- [ ] 페이지 로드 속도 확인 (3초 이내)
- [ ] 이미지 로딩 확인
- [ ] 모바일 반응형 확인 (개발자 도구 > 모바일 뷰)

---

## 5️⃣ GitHub Actions 설정 (10분, 선택사항)

### GitHub 저장소 생성 및 푸시
- [ ] GitHub에서 새 저장소 생성
- [ ] 로컬에서 Git 초기화 (아직 안 한 경우)
  ```bash
  git init
  git add .
  git commit -m "Initial commit: 보스 레이드 프로젝트"
  git branch -M main
  git remote add origin https://github.com/username/baemin-boss-raid.git
  git push -u origin main
  ```

### GitHub Secrets 등록
- [ ] GitHub 저장소 > Settings > Secrets and variables > Actions
- [ ] "New repository secret" 클릭
- [ ] 다음 시크릿 추가:
  - `REACT_APP_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GOOGLE_RAID_SHEET_ID` (Google Sheets 사용 시)
  - `GOOGLE_CLIENT_EMAIL` (Google Sheets 사용 시)
  - `GOOGLE_PRIVATE_KEY` (Google Sheets 사용 시)

### 워크플로우 확인
- [ ] GitHub 저장소 > Actions 탭 이동
- [ ] "Boss Raid Sync" 워크플로우 확인
- [ ] "Run workflow" 버튼으로 수동 테스트
- [ ] 워크플로우 실행 로그 확인
- [ ] 성공 메시지 확인

---

## 6️⃣ Google Sheets 동기화 (15분, 선택사항)

### Google Sheets 준비
- [ ] Google Sheets에서 새 스프레드시트 생성
- [ ] 스프레드시트 이름: "보스 레이드 배달로그"
- [ ] "배달로그" 시트 추가
- [ ] 헤더 행 작성:
  ```
  라이더ID | 배달날짜 | 배달건수 | 우천여부 | 할증여부 | 구역
  ```

### Google Cloud Console 설정
- [ ] https://console.cloud.google.com 접속
- [ ] 새 프로젝트 생성
- [ ] Google Sheets API 활성화
- [ ] 서비스 계정 생성
- [ ] 서비스 계정 키(JSON) 다운로드
- [ ] 서비스 계정 이메일 복사

### Sheets 권한 설정
- [ ] Google Sheets로 돌아가기
- [ ] "공유" 버튼 클릭
- [ ] 서비스 계정 이메일 추가
- [ ] 권한: "편집자"로 설정

### 환경변수 추가
- [ ] Vercel에 환경변수 추가:
  ```bash
  vercel env add GOOGLE_RAID_SHEET_ID
  vercel env add GOOGLE_CLIENT_EMAIL
  vercel env add GOOGLE_PRIVATE_KEY
  ```
- [ ] GitHub Secrets에도 동일하게 추가

### 동기화 테스트
- [ ] 로컬에서 `npm run sync:raid` 실행
- [ ] Supabase에서 데이터 확인
- [ ] 에러 없음 확인

---

## 7️⃣ 최종 점검 (5분)

### 배포 상태 확인
- [ ] Vercel Dashboard에서 배포 상태 "Ready" 확인
- [ ] Production URL 정상 작동 확인
- [ ] Supabase 프로젝트 활성 상태 확인

### 문서 확인
- [ ] README.md 업데이트 확인
- [ ] 배포 가이드 링크 확인
- [ ] 환경변수 예제 확인

### 보안 점검
- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] GitHub에 `.env.local` 파일이 커밋되지 않았는지 확인
- [ ] `service_role key`가 공개되지 않았는지 확인

### 성능 모니터링 설정
- [ ] Vercel Analytics 활성화 (선택사항)
- [ ] Supabase Database Health 확인

---

## 🎉 완료!

축하합니다! 보스 레이드 시스템이 성공적으로 배포되었습니다!

### 배포 정보

**프로덕션 URL:**
```
https://baemin-boss-raid.vercel.app
```

**Vercel Dashboard:**
```
https://vercel.com/dashboard
```

**Supabase Dashboard:**
```
https://supabase.com/dashboard
```

### 다음 단계

1. **라이더들에게 공유**
   - QR 코드 생성
   - 카카오톡, 이메일로 URL 전송

2. **실제 데이터 입력**
   - Google Sheets에 배달 로그 입력
   - 동기화 확인

3. **모니터링**
   - Vercel에서 트래픽 확인
   - Supabase에서 데이터베이스 상태 확인

4. **피드백 수집**
   - 라이더들의 의견 청취
   - 버그 리포트 수집
   - 개선 사항 반영

### 문제 발생 시

1. Vercel 빌드 로그 확인
2. 브라우저 콘솔 에러 확인
3. Supabase 로그 확인
4. 가이드 문서 참조:
   - [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
   - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**⚔️ 라이더님들과 함께 즐거운 보스 레이드를!**

