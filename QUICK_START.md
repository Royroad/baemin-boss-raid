# ⚡ 빠른 시작 가이드

5분 안에 보스 레이드를 배포하세요!

---

## 🎯 3단계로 끝내기

### 1️⃣ Supabase 설정 (2분)

```bash
# 1. https://supabase.com/dashboard 접속
# 2. New Project 클릭
# 3. 정보 입력:
#    - Name: baemin-boss-raid
#    - Password: woowa0625raid
#    - Region: Northeast Asia (Seoul)
# 4. SQL Editor > New query
# 5. database_raid_setup.sql 내용 붙여넣기 > Run
# 6. Settings > API에서 URL과 anon key 복사
```

anon 키
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyc21icGxjc3NscnBib3RxbXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzU2MjAsImV4cCI6MjA3NjYxMTYyMH0.zUhR4oH0xhUuxBxOY8TsVHqMN7TejwDYlk690cmXyK4

service_role
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyc21icGxjc3NscnBib3RxbXRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTAzNTYyMCwiZXhwIjoyMDc2NjExNjIwfQ.BDOCrL8ueL6XCVKHxeba2ZqUnF10NFuhjKkcO1gnBK8



---

### 2️⃣ 로컬 테스트 (1분)

프로젝트 루트에 `.env.local` 파일 생성:

```bash
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...
```

테스트:
```bash
npm start
# http://localhost:3000 접속하여 확인
```

---

### 3️⃣ Vercel 배포 (2분)

```bash
# CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel

# 환경변수 설정
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY

# 프로덕션 배포
vercel --prod
```

---

## ✅ 완료!

배포된 URL: `https://baemin-boss-raid.vercel.app`

---

## 📚 더 자세한 가이드

- 🔰 **처음 시작**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- 🗄️ **Supabase 상세**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- 🚀 **Vercel 상세**: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
- 📖 **전체 가이드**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🆘 문제 해결

### 빌드 실패
```bash
npm run build  # 로컬에서 테스트
```

### 환경변수 안 됨
```bash
vercel env ls  # 확인
vercel --prod  # 재배포
```

### Supabase 연결 실패
- URL과 API 키 재확인
- `.env.local` 파일 위치 확인
- 서버 재시작 (`npm start`)

---

**⚔️ 5분이면 충분합니다!**

