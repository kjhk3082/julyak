# Google Cloud Firestore → Firebase 설정 찾기

## 상황 이해

현재 Google Cloud Console에서 Firestore의 **MongoDB 호환 모드**를 보고 계십니다.
하지만 웹 애플리케이션에는 **Firebase SDK 설정**이 필요합니다.

## 방법 1: Google Cloud Console에서 Firebase 연결 확인

### 1단계: Firestore 페이지에서 Firebase 확인
```
Google Cloud Console → Firestore
```
상단이나 측면에 다음 중 하나가 있는지 확인:
- "Firebase 콘솔에서 보기" 링크
- "Firebase로 이동" 버튼
- Firebase 로고

### 2단계: Firebase Console로 이동
Firebase 링크를 클릭하면 Firebase Console로 이동합니다.

## 방법 2: Firebase Console 직접 접속

### 1단계: Firebase Console 열기
https://console.firebase.google.com

### 2단계: 프로젝트 찾기
- Google Cloud 프로젝트와 동일한 프로젝트 찾기
- 프로젝트 ID 확인 (9f987c20-9f53-40a0-ad98-6e6c26fad4c7와 연관)

### 3단계: 웹 앱 설정 확인
1. ⚙️ 프로젝트 설정 클릭
2. 일반 탭 선택
3. 하단으로 스크롤 → "내 앱" 섹션
4. 웹 앱이 없다면 "앱 추가" → "</> 웹" 선택

### 4단계: SDK 설정 복사
```javascript
// 이런 형태의 설정이 표시됩니다:
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "project-name.firebaseapp.com",
  projectId: "project-name",
  storageBucket: "project-name.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## 방법 3: Google Cloud IAM에서 Firebase 서비스 계정 확인

### 1단계: IAM & Admin 페이지
```
Google Cloud Console → IAM & Admin → Service Accounts
```

### 2단계: Firebase 서비스 계정 찾기
- `firebase-adminsdk-xxxxx@project-id.iam.gserviceaccount.com` 형태의 계정 찾기
- 이것은 프로젝트가 Firebase와 연결되어 있음을 의미

### 3단계: 프로젝트 ID 확인
서비스 계정에서 프로젝트 ID를 확인한 후 Firebase Console에서 해당 프로젝트 검색

## 방법 4: gcloud CLI 사용

터미널에서:
```bash
# Google Cloud 프로젝트 목록
gcloud projects list

# Firebase 프로젝트 확인
firebase projects:list

# 특정 프로젝트 선택
firebase use PROJECT_ID
```

## 웹 앱이 없는 경우: 새로 생성

### Firebase Console에서:
1. 프로젝트 개요 페이지
2. "앱 추가" 클릭
3. 웹 플랫폼 선택 (</>)
4. 앱 닉네임 입력 (예: "Julyak Web App")
5. Firebase 호스팅 설정 (선택사항)
6. "앱 등록" 클릭
7. **firebaseConfig 복사** ← 이것이 필요한 설정입니다!

## 설정 적용

### .env.local 파일 업데이트:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=복사한_apiKey_값
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=복사한_authDomain_값
NEXT_PUBLIC_FIREBASE_PROJECT_ID=복사한_projectId_값
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=복사한_storageBucket_값
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=복사한_messagingSenderId_값
NEXT_PUBLIC_FIREBASE_APP_ID=복사한_appId_값
```

## MongoDB 연결 문자열 활용 (선택사항)

MongoDB 연결 문자열도 활용하고 싶다면:

### Next.js API Route 생성:
```typescript
// app/api/db/test/route.ts
import { MongoClient } from 'mongodb';

const uri = "mongodb://kitri:3vFzd7nDari8pbGL5Unle6TKgvAN9DeAMWYokGqzFWt77EKs@9f987c20-9f53-40a0-ad98-6e6c26fad4c7.asia-northeast3.firestore.goog:443/default?loadBalanced=true&tls=true&authMechanism=SCRAM-SHA-256&retryWrites=false";

export async function GET() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("MongoDB 호환 모드로 Firestore 연결 성공!");
    
    const db = client.db('default');
    const collections = await db.listCollections().toArray();
    
    return Response.json({ 
      success: true, 
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  } finally {
    await client.close();
  }
}
```

그러나 이는 서버 측 전용이며, 클라이언트 측 기능(실시간 업데이트, Firebase Auth)은 여전히 Firebase SDK가 필요합니다.

## 도움이 필요하시면

1. Google Cloud 프로젝트 ID 공유
2. Firebase Console 스크린샷 공유
3. 또는 Firebase 프로젝트를 새로 생성

제가 정확한 설정값을 찾도록 도와드리겠습니다!