# GitHub Actions 워크플로우 설정

GitHub 저장소에서 직접 다음 파일들을 생성해주세요:

## 1. `.github/workflows/deploy.yml` 생성

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Create .env.local file
        run: |
          echo "NEXT_PUBLIC_FIREBASE_API_KEY=${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_APP_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }}" >> .env.local

      - name: Build Next.js application
        run: npm run build

      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          port: ${{ secrets.DEPLOY_PORT || 22 }}
          script: |
            cd /var/www/julyak || cd ~/julyak || mkdir -p ~/julyak && cd ~/julyak
            git pull origin main || git clone https://github.com/kjhk3082/julyak.git . && git pull
            npm ci
            
            cat > .env.local << EOF
            NEXT_PUBLIC_FIREBASE_API_KEY=${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
            NEXT_PUBLIC_FIREBASE_PROJECT_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
            NEXT_PUBLIC_FIREBASE_APP_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
            NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }}
            EOF
            
            npm run build
            pm2 restart julyak || pm2 start npm --name "julyak" -- start
            echo "Deployment completed successfully!"
```

## 2. GitHub Secrets 설정 방법

1. GitHub 저장소로 이동
2. Settings → Secrets and variables → Actions 클릭
3. "New repository secret" 버튼 클릭
4. 다음 시크릿들을 추가:

### Firebase 시크릿 (필수)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### 배포 서버 시크릿 (필수)
- `DEPLOY_HOST`: julyak.jhlab.ai.kr
- `DEPLOY_USER`: 서버 SSH 사용자명
- `DEPLOY_SSH_KEY`: SSH 개인키 전체 내용
- `DEPLOY_PORT`: 22 (기본값)

## 3. 서버 준비사항

배포 서버에서 다음 명령어 실행:

```bash
# Node.js 20 설치 (nvm 사용)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# PM2 설치
npm install -g pm2

# 앱 디렉토리 준비
mkdir -p ~/julyak
cd ~/julyak

# 처음 한 번만 실행
git clone https://github.com/kjhk3082/julyak.git .
npm install
npm run build
pm2 start npm --name "julyak" -- start
pm2 save
pm2 startup
```

## 4. 배포 테스트

1. 이 파일의 워크플로우를 GitHub에서 직접 생성
2. GitHub Secrets 설정
3. main 브랜치에 푸시
4. Actions 탭에서 워크플로우 실행 확인
5. https://julyak.jhlab.ai.kr/ 접속 확인