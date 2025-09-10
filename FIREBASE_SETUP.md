# Firebase 설정 가이드

## 🔥 Firebase Console 설정 (중요!)

### 1. Authentication 설정

1. [Firebase Console](https://console.firebase.google.com) 접속
2. 프로젝트 선택 (julyak-1c85a)
3. **Authentication** → **Settings** → **Authorized domains**
4. 다음 도메인들을 추가:
   - `localhost`
   - `julyak.jhlab.ai.kr`
   - `*.jhlab.ai.kr` (와일드카드)
   - Vercel 도메인 (있는 경우)

### 2. Google 로그인 설정

1. **Authentication** → **Sign-in method**
2. **Google** 활성화
3. **Web SDK configuration**에서:
   - Web client ID 확인
   - Web client secret 확인
4. **Authorized domains**에 배포 도메인 추가

### 3. Firestore 보안 규칙 설정

1. **Firestore Database** → **Rules**
2. `firestore.rules` 파일의 내용을 복사하여 붙여넣기:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 인증된 사용자만 자신의 데이터 접근 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /goals/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    match /savingsPlans/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    match /weeklyMissions/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

3. **Publish** 클릭

### 4. CORS 설정 (중요!)

1. **Project Settings** → **General**
2. **Default GCP resource location** 확인
3. Google Cloud Console에서:
   - [APIs & Services](https://console.cloud.google.com/apis) → **Credentials**
   - OAuth 2.0 Client IDs에서 Web client 선택
   - **Authorized JavaScript origins**에 추가:
     - `http://localhost:3000`
     - `https://julyak.jhlab.ai.kr`
   - **Authorized redirect URIs**에 추가:
     - `http://localhost:3000`
     - `https://julyak.jhlab.ai.kr`
     - `https://julyak.jhlab.ai.kr/__/auth/handler`

### 5. 환경변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBL9RQZmK8u1LCijgJx2C3Xj6Y3x1234567
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=julyak-1c85a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=julyak-1c85a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=julyak-1c85a.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012345
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🐛 트러블슈팅

### "Failed to get document because the client is offline" 오류

1. **원인**: Firestore 오프라인 캐시 충돌 또는 네트워크 문제
2. **해결방법**:
   - 브라우저 캐시 및 IndexedDB 삭제
   - Chrome DevTools → Application → Storage → Clear site data
   - Firebase 프로젝트의 도메인 허용 확인

### "Cross-Origin-Opener-Policy" 오류

1. **원인**: Google 로그인 팝업 CORS 정책
2. **해결방법**:
   - Firebase Console에서 도메인 추가
   - Google Cloud Console에서 OAuth 설정 확인

### "400 Bad Request" Firestore 오류

1. **원인**: 보안 규칙 또는 인증 문제
2. **해결방법**:
   - Firestore 보안 규칙 확인
   - 인증 토큰 유효성 확인
   - 프로젝트 ID 일치 확인

## 📱 테스트 체크리스트

- [ ] localhost:3000에서 Google 로그인 테스트
- [ ] 이메일/비밀번호 로그인 테스트
- [ ] 로그인 후 대시보드 리다이렉션 확인
- [ ] Firestore 데이터 읽기/쓰기 테스트
- [ ] 프로덕션 도메인에서 테스트

## 🚀 배포 전 확인사항

1. **환경변수**: GitHub Secrets에 모든 Firebase 환경변수 추가
2. **도메인**: Firebase와 Google Cloud Console에 프로덕션 도메인 추가
3. **보안 규칙**: Firestore 보안 규칙 프로덕션 모드로 설정
4. **API 키**: API 키 제한 설정 (특정 도메인만 허용)