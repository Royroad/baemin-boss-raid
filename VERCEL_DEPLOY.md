# 🚀 Vercel 빠른 배포 가이드

이 문서는 Vercel CLI를 사용한 빠른 배포 방법을 설명합니다.

## ✅ 사전 준비 완료 항목

- [x] 프로젝트 빌드 테스트 완료 (`npm run build` 성공)
- [ ] Supabase 프로젝트 생성 및 API 키 확보
- [ ] `.env.local` 파일 생성 (로컬 테스트용)

---

## 🎯 5분 안에 배포하기

### 1단계: Vercel CLI 설치 및 로그인 (1분)

```bash
# Vercel CLI 글로벌 설치
npm install -g vercel

# Vercel 계정 로그인
vercel login
```

이메일로 로그인 링크가 전송됩니다. 이메일에서 "Verify" 클릭.

---

### 2단계: 초기 배포 (1분)

```bash
# 프로젝트 디렉토리에서 실행
vercel
```

**질문에 대한 답변:**
```
? Set up and deploy "~/baemin-boss-raid"? Y
? Which scope? [본인 계정 선택]
? Link to existing project? N
? What's your project's name? baemin-boss-raid
? In which directory is your code located? ./
? Want to override the settings? N
```

Preview URL이 생성됩니다 (예: `https://baemin-boss-raid-xxx.vercel.app`)

---

### 3단계: 환경변수 설정 (2분)

**Supabase 프로젝트에서 API 키 복사**
- Supabase Dashboard > Settings > API
- `Project URL`과 `anon key` 복사

**Vercel에 환경변수 추가:**

```bash
# Supabase URL 설정
vercel env add REACT_APP_SUPABASE_URL
# 입력: https://your-project-id.supabase.co
# Environment: a (모두 선택)

# Supabase Anon Key 설정
vercel env add REACT_APP_SUPABASE_ANON_KEY
# 입력: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Environment: a (모두 선택)
```

---

### 4단계: 프로덕션 배포 (1분)

```bash
vercel --prod
```

**완료!** 🎉

프로덕션 URL: `https://baemin-boss-raid.vercel.app`

---

## 📱 배포 URL 확인

배포가 완료되면 터미널에 URL이 표시됩니다:

```
✅  Production: https://baemin-boss-raid.vercel.app [2m]
```

브라우저에서 접속하여 확인:
- 보스 카드가 정상 표시되는지
- 지도뷰가 작동하는지
- 랭킹 페이지가 열리는지

---

## 🔄 업데이트 배포

코드를 수정한 후 재배포:

```bash
# 코드 변경 사항 확인
git status

# 프로덕션 재배포
vercel --prod
```

또는 Git push만으로 자동 배포 (GitHub 연동 시):
```bash
git add .
git commit -m "업데이트 내용"
git push origin main
```

---

## 🛠️ 유용한 명령어

```bash
# 현재 배포 목록 보기
vercel ls

# 특정 배포 제거
vercel rm [deployment-url]

# 프로젝트 정보 확인
vercel inspect

# 환경변수 목록 보기
vercel env ls

# 환경변수 제거
vercel env rm [variable-name]

# 로그 확인
vercel logs [deployment-url]
```

---

## 🎛️ Vercel 대시보드 접속

웹 UI에서 더 많은 설정을 할 수 있습니다:

https://vercel.com/dashboard

**주요 기능:**
- 📊 Analytics: 방문자 통계
- 🔍 Logs: 실시간 로그 확인
- ⚙️ Settings: 도메인, 환경변수, 빌드 설정
- 🔄 Deployments: 배포 히스토리 및 롤백

---

## ⚠️ 문제 해결

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 확인 및 수정 후 재배포
vercel --prod
```

### 환경변수가 적용되지 않음
```bash
# 환경변수 확인
vercel env ls

# 재배포 (환경변수 변경 시 필수)
vercel --prod
```

### Supabase 연결 실패
- API 키가 정확한지 확인
- Supabase 프로젝트가 활성 상태인지 확인
- RLS 정책이 올바르게 설정되었는지 확인

---

## 📞 추가 도움말

- Vercel 문서: https://vercel.com/docs
- Vercel CLI 문서: https://vercel.com/docs/cli
- Create React App 배포: https://create-react-app.dev/docs/deployment/#vercel

---

**⚔️ 배포 완료! 라이더님들과 함께 보스 레이드를 즐겨보세요!**

