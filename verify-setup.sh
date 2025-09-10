#!/bin/bash

echo "🔥 Firebase 설정 검증"
echo "===================="
echo ""

# .env.local 파일 확인
if [ -f ".env.local" ]; then
    echo "✅ .env.local 파일 존재"
    
    # 필수 환경 변수 확인
    echo ""
    echo "📋 환경 변수 상태:"
    
    # API Key 확인
    if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDgrRbxqGA1f7YMl33QDiIrFVtiVR8TNU4" .env.local; then
        echo "  ✅ API Key 설정됨"
    else
        echo "  ❌ API Key 미설정 또는 잘못됨"
    fi
    
    # Auth Domain 확인
    if grep -q "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=julyak-1c85a.firebaseapp.com" .env.local; then
        echo "  ✅ Auth Domain 설정됨"
    else
        echo "  ❌ Auth Domain 미설정 또는 잘못됨"
    fi
    
    # Project ID 확인
    if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID=julyak-1c85a" .env.local; then
        echo "  ✅ Project ID 설정됨"
    else
        echo "  ❌ Project ID 미설정 또는 잘못됨"
    fi
    
    # Storage Bucket 확인
    if grep -q "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=julyak-1c85a.firebasestorage.app" .env.local; then
        echo "  ✅ Storage Bucket 설정됨"
    else
        echo "  ❌ Storage Bucket 미설정 또는 잘못됨"
    fi
    
else
    echo "❌ .env.local 파일이 없습니다!"
fi

echo ""
echo "===================="
echo "🔍 Firebase Console에서 확인할 사항:"
echo ""
echo "1. Firestore Database"
echo "   - https://console.firebase.google.com/project/julyak-1c85a/firestore"
echo "   - 데이터베이스가 생성되어 있는지 확인"
echo "   - 위치: asia-northeast3 (서울) 권장"
echo ""
echo "2. Authentication"
echo "   - https://console.firebase.google.com/project/julyak-1c85a/authentication"
echo "   - Email/Password 로그인 활성화"
echo "   - Google 로그인 활성화"
echo ""
echo "3. 승인된 도메인"
echo "   - Authentication → Settings → Authorized domains"
echo "   - localhost 추가됨"
echo "   - julyak.jhlab.ai.kr 추가 필요"
echo ""
echo "===================="
echo "🧪 테스트 방법:"
echo ""
echo "1. 브라우저에서 quick-test.html 파일 열기"
echo "   파일 경로: $(pwd)/quick-test.html"
echo ""
echo "2. 또는 Next.js 개발 서버 시작"
echo "   npm run dev"
echo "   http://localhost:3000/test-firebase"
echo ""
echo "===================="