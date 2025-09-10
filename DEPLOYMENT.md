# 배포 가이드 (Deployment Guide)

## GitHub Actions CI/CD 설정

이 프로젝트는 GitHub Actions를 통해 자동으로 배포됩니다.

### 필수 GitHub Secrets 설정

GitHub 저장소의 Settings → Secrets and variables → Actions에서 다음 시크릿들을 추가해야 합니다:

#### Firebase 환경변수
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

#### 서버 배포용 (SSH 배포 사용 시)
- `DEPLOY_HOST`: 배포 서버 호스트 (예: julyak.jhlab.ai.kr)
- `DEPLOY_USER`: SSH 사용자명
- `DEPLOY_SSH_KEY`: SSH 개인키 (전체 내용)
- `DEPLOY_PORT`: SSH 포트 (기본값: 22)

#### Vercel 배포용 (선택사항)
- `VERCEL_TOKEN`: Vercel 액세스 토큰
- `VERCEL_ORG_ID`: Vercel 조직 ID
- `VERCEL_PROJECT_ID`: Vercel 프로젝트 ID

### 배포 워크플로우

1. **자동 배포**: `main` 브랜치에 푸시하면 자동으로 배포가 시작됩니다.

2. **배포 옵션**:
   - **SSH 배포** (`.github/workflows/deploy.yml`): 직접 서버에 SSH로 접속하여 배포
   - **Vercel 배포** (`.github/workflows/vercel-deploy.yml`): Vercel 플랫폼으로 배포
   - **GitHub Pages** (`.github/workflows/github-pages.yml`): 정적 사이트로 GitHub Pages에 배포

### 서버 설정 (SSH 배포용)

배포 서버에서 다음을 확인하세요:

```bash
# Node.js 20 이상 설치
node --version

# PM2 설치 (프로세스 관리용)
npm install -g pm2

# 배포 디렉토리 생성
mkdir -p ~/julyak
cd ~/julyak

# Git 저장소 클론
git clone https://github.com/kjhk3082/julyak.git .

# 의존성 설치
npm install

# PM2로 앱 시작
pm2 start npm --name "julyak" -- start
pm2 save
pm2 startup
```

### 수동 배포

서버에서 직접 배포하려면:

```bash
cd ~/julyak
git pull origin main
npm install
npm run build
pm2 restart julyak
```

### 배포 확인

배포가 완료되면 다음을 확인하세요:
- https://julyak.jhlab.ai.kr/ 접속 확인
- GitHub Actions 탭에서 워크플로우 실행 상태 확인
- 서버 로그 확인: `pm2 logs julyak`

### 트러블슈팅

#### Firebase 오프라인 오류
- Firebase 프로젝트 설정 확인
- 환경변수가 올바르게 설정되었는지 확인
- Firebase 콘솔에서 도메인 허용 목록에 배포 도메인 추가

#### 빌드 실패
- Node.js 버전 확인 (20 이상 필요)
- 의존성 설치 확인: `npm ci`
- 환경변수 확인

#### PM2 관련 문제
```bash
# PM2 상태 확인
pm2 status

# 앱 재시작
pm2 restart julyak

# 로그 확인
pm2 logs julyak --lines 100

# 앱 삭제 후 재시작
pm2 delete julyak
pm2 start npm --name "julyak" -- start
```