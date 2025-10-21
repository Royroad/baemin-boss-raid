# 📦 배포 요약 및 가이드 맵

보스 레이드 프로젝트의 모든 배포 관련 문서와 가이드입니다.

---

## 🗺️ 가이드 맵

### 🚀 시작하기

#### 초급: 빠르게 배포하기
**[QUICK_START.md](./QUICK_START.md)** - 5분 안에 배포
- 3단계로 끝내는 빠른 배포
- 최소한의 명령어만 포함
- 초보자에게 추천

#### 중급: 단계별 체크리스트
**[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - 완전한 체크리스트
- 모든 단계를 체크박스로 관리
- 놓치는 부분 없이 배포
- 팀 협업에 적합

#### 고급: 상세한 설명
**[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - 완전한 가이드
- 모든 옵션과 설명 포함
- 문제 해결 섹션
- 고급 설정 포함

---

## 📚 주제별 가이드

### 🗄️ Supabase 설정
**[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**
- 새 프로젝트 생성 방법
- 데이터베이스 스키마 설정
- API 키 관리
- RLS(Row Level Security) 설정
- 문제 해결

### 🚀 Vercel 배포
**[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)**
- Vercel CLI 사용법
- 환경변수 설정
- 프로덕션 배포
- 유용한 명령어
- 문제 해결

### ⚙️ 설정 파일
**[vercel.json](./vercel.json)**
- Vercel 빌드 설정
- 지역 설정 (서울)
- 환경변수 매핑

---

## 🎯 사용자별 추천 가이드

### 처음 배포하시는 분
1. ✅ [QUICK_START.md](./QUICK_START.md) - 빠른 시작
2. ✅ [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - 데이터베이스 설정
3. ✅ [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - 배포 방법

### 팀으로 작업하시는 분
1. ✅ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 체크리스트
2. ✅ [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 상세 가이드
3. ✅ [README.md](./README.md) - 프로젝트 개요

### 문제가 발생한 경우
1. ✅ [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 문제 해결 섹션
2. ✅ [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase 문제
3. ✅ [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Vercel 문제

---

## 📋 배포 프로세스 요약

### 전체 흐름

```
1. Supabase 프로젝트 생성
   ↓
2. 데이터베이스 스키마 설정
   ↓
3. API 키 확인 및 저장
   ↓
4. 로컬 환경변수 설정 (.env.local)
   ↓
5. 로컬 테스트 (npm start)
   ↓
6. 프로덕션 빌드 (npm run build)
   ↓
7. Vercel CLI 설치 및 로그인
   ↓
8. Vercel 환경변수 설정
   ↓
9. 프로덕션 배포 (vercel --prod)
   ↓
10. 배포 확인 및 테스트
   ↓
11. GitHub Actions 설정 (선택사항)
   ↓
12. 완료! 🎉
```

---

## ⚡ 빠른 명령어 참조

### Supabase
```bash
# SQL Editor에서 실행
database_raid_setup.sql

# Settings > API에서 확인
Project URL: https://[project-id].supabase.co
anon key: eyJ...
```

### 로컬 개발
```bash
# 환경변수 설정
# .env.local 파일 생성

# 개발 서버
npm start

# 프로덕션 빌드
npm run build
```

### Vercel 배포
```bash
# CLI 설치
npm install -g vercel

# 로그인
vercel login

# Preview 배포
vercel

# 환경변수 설정
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY

# 프로덕션 배포
vercel --prod
```

### 동기화 (선택사항)
```bash
# 로컬 동기화
npm run sync:raid

# GitHub Actions
# .github/workflows/raid-sync.yml
```

---

## 🔧 환경변수 목록

### 필수 (프론트엔드)
```bash
REACT_APP_SUPABASE_URL=https://[project-id].supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...
```

### 선택 (동기화용)
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GOOGLE_RAID_SHEET_ID=1abc...xyz
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 📍 배포 URL 구조

### Vercel
- **프로덕션**: `https://baemin-boss-raid.vercel.app`
- **Preview**: `https://baemin-boss-raid-git-[branch].vercel.app`
- **Dev**: `https://baemin-boss-raid-[hash].vercel.app`

### Supabase
- **Dashboard**: `https://supabase.com/dashboard/project/[project-id]`
- **API**: `https://[project-id].supabase.co`
- **Database**: `postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres`

---

## 🔐 보안 체크리스트

- [x] `.env.local`이 `.gitignore`에 포함되어 있음
- [x] `service_role key`는 서버 환경에만 저장
- [x] GitHub에 `.env.local` 파일이 커밋되지 않음
- [x] Supabase RLS(Row Level Security) 활성화
- [x] 환경변수가 Vercel/GitHub Secrets에만 저장됨

---

## 📊 배포 후 체크리스트

### 기능 테스트
- [ ] 보스 카드 표시
- [ ] HP 바 작동
- [ ] 카드뷰/지도뷰 전환
- [ ] 랭킹 페이지 접근
- [ ] 카운트다운 타이머
- [ ] 모바일 반응형

### 성능 테스트
- [ ] 페이지 로드 속도 (3초 이내)
- [ ] 이미지 로딩
- [ ] API 응답 속도

### 데이터 테스트
- [ ] Supabase 연결 확인
- [ ] 더미 데이터 미사용
- [ ] 실제 보스 데이터 로드

---

## 🆘 문제 해결 빠른 참조

| 문제 | 해결 방법 | 참조 가이드 |
|------|----------|------------|
| 빌드 실패 | `npm run build` 로컬 테스트 | VERCEL_DEPLOY.md |
| 환경변수 미인식 | 변수명 `REACT_APP_` 확인, 재배포 | DEPLOYMENT_GUIDE.md |
| Supabase 연결 실패 | API 키, URL 재확인 | SUPABASE_SETUP.md |
| 더미 데이터 표시 | Supabase 테이블 데이터 확인 | SUPABASE_SETUP.md |
| 이미지 로딩 실패 | `public/boss-images/` 확인 | README.md |
| 동기화 실패 | Google Sheets 권한 확인 | DEPLOYMENT_GUIDE.md |

---

## 🔗 유용한 링크

### 공식 문서
- 📘 [Vercel Documentation](https://vercel.com/docs)
- 📘 [Supabase Documentation](https://supabase.com/docs)
- 📘 [Create React App](https://create-react-app.dev/)
- 📘 [React Router](https://reactrouter.com/)

### 대시보드
- 🖥️ [Vercel Dashboard](https://vercel.com/dashboard)
- 🖥️ [Supabase Dashboard](https://supabase.com/dashboard)
- 🖥️ [GitHub Actions](https://github.com/features/actions)

### 커뮤니티
- 💬 [Vercel Discord](https://discord.com/invite/vercel)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 💬 [React Community](https://react.dev/community)

---

## 📞 추가 지원

### 프로젝트 관련
- 📧 이메일: contact@baemin.com
- 💬 카카오톡: @배민커넥트

### 기술 문의
- 🐛 GitHub Issues: [프로젝트 저장소]/issues
- 📖 Wiki: [프로젝트 저장소]/wiki

---

## 🎉 다음 단계

배포가 완료되었다면:

1. **라이더들에게 공유**
   - QR 코드 생성 및 배포
   - 카카오톡, 이메일로 URL 전송

2. **모니터링 시작**
   - Vercel Analytics 확인
   - Supabase 대시보드 모니터링

3. **피드백 수집**
   - 라이더들의 의견 청취
   - 버그 리포트 수집

4. **지속적인 개선**
   - 새 기능 추가
   - 성능 최적화
   - UI/UX 개선

---

**⚔️ 배포 성공을 축하합니다! 라이더님들과 함께 즐거운 보스 레이드를!**

