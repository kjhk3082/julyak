#!/bin/bash

echo "🔥 Firebase 설정 도우미"
echo "========================"
echo ""
echo "⚠️  중요: 제공하신 MongoDB 연결 문자열은 Firebase와 호환되지 않습니다."
echo ""
echo "Firebase Console에서 올바른 설정값을 가져와야 합니다:"
echo ""
echo "1. https://console.firebase.google.com 접속"
echo "2. 프로젝트 선택"
echo "3. 프로젝트 설정 → 일반 → 내 앱 (웹 앱)"
echo "4. firebaseConfig 객체의 값들을 복사"
echo ""
echo "설정값을 입력해주세요:"
echo ""

# API Key
read -p "API Key (AIzaSy...): " API_KEY

# Auth Domain
read -p "Auth Domain (your-project.firebaseapp.com): " AUTH_DOMAIN

# Project ID
read -p "Project ID (your-project-id): " PROJECT_ID

# Storage Bucket
read -p "Storage Bucket (your-project.appspot.com): " STORAGE_BUCKET

# Messaging Sender ID
read -p "Messaging Sender ID (123456789): " SENDER_ID

# App ID
read -p "App ID (1:123:web:abc...): " APP_ID

# Measurement ID (optional)
read -p "Measurement ID (G-XXX) [선택사항, Enter로 건너뛰기]: " MEASUREMENT_ID

# Create .env.local file
cat > .env.local << EOF
# Firebase Configuration
# Generated on $(date)

NEXT_PUBLIC_FIREBASE_API_KEY=$API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$MEASUREMENT_ID

# Firestore Region
NEXT_PUBLIC_FIREBASE_REGION=asia-northeast3
EOF

echo ""
echo "✅ .env.local 파일이 생성되었습니다!"
echo ""
echo "다음 단계:"
echo "1. Firestore Database가 생성되었는지 확인"
echo "2. Authentication 로그인 방법 활성화 확인"
echo "3. 승인된 도메인에 'julyak.jhlab.ai.kr' 추가"
echo "4. npm run dev로 서버 재시작"
echo ""
echo "테스트 페이지:"
echo "- http://localhost:3000/test-firebase"
echo "- 또는 브라우저에서 test-firebase-standalone.html 파일 열기"