# 절약가 정신 (Julyak) 🎯

20~30대 1인 가구 직장인을 위한 AI 절약 코치와 실시간 가격 비교 서비스

## 주요 기능 ✨

- 🔐 **Firebase 인증**: Google 소셜 로그인 및 이메일/비밀번호 로그인
- 🎯 **목표 설정**: 개인 맞춤형 절약 목표 및 계획 수립
- 📊 **진행률 추적**: 실시간 절약 목표 달성률 모니터링
- 🏃‍♂️ **주간 미션**: AI가 추천하는 개인화된 절약 미션
- 🗺️ **최저가 맵**: 전국 실시간 최저가 비교 (예정)
- 👤 **사용자 관리**: 프로필 설정 및 회원탈퇴

## 기술 스택 🛠️

- **Frontend**: Next.js 15.1.0, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: TanStack Query (React Query)
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React

## 설치 방법 🚀

### 1. 저장소 클론

```bash
git clone https://github.com/kjhk3082/julyak.git
cd julyak
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 Firebase 설정을 입력하세요:

```bash
cp .env.example .env.local
```

Firebase Console에서 프로젝트 설정 정보를 확인하여 `.env.local` 파일을 수정하세요.

### 4. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication > Sign-in method에서 Google 및 이메일/비밀번호 로그인 활성화
3. Firestore Database 생성 (테스트 모드)

### 5. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 사용법 📖

1. **회원가입/로그인**: Google 계정 또는 이메일로 가입
2. **목표 설정**: 원하는 절약 목표와 기간 설정
3. **미션 수행**: AI가 추천하는 주간 절약 미션 완료
4. **진행률 확인**: 대시보드에서 절약 목표 달성률 모니터링

## 개발자 👨‍💻

- **GitHub**: [https://github.com/kjhk3082](https://github.com/kjhk3082)

---

**절약가 정신**으로 똑똑한 절약 습관을 만들어보세요! 🎯
