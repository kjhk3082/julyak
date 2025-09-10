# 완전한 Firebase 설정 가이드

## 📍 현재 상황 정리

1. **보유한 것**: MongoDB 호환 모드 연결 문자열 (서버용)
2. **필요한 것**: Firebase 웹 SDK 설정 (클라이언트용)

## 🔥 즉시 해결 방법

### 방법 A: Firebase Console에서 직접 가져오기

#### 1. Firebase Console 접속
```
https://console.firebase.google.com
```

#### 2. 프로젝트 찾기/생성
- 기존 프로젝트가 있다면 선택
- 없다면 "프로젝트 추가" 클릭

#### 3. 웹 앱 설정 가져오기
1. ⚙️ 프로젝트 설정 클릭
2. 일반 탭 → 하단 "내 앱" 섹션
3. 웹 앱이 없다면:
   - "앱 추가" 클릭
   - </> 웹 선택
   - 앱 닉네임 입력 (예: "Julyak Web")
   - "앱 등록" 클릭

4. **이 설정 복사**:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "project.firebaseapp.com",
  projectId: "project-id",
  storageBucket: "project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc..."
};
```

### 방법 B: Google Cloud Console에서 Firebase 연결

#### 1. Google Cloud Console 접속
```
https://console.cloud.google.com
```

#### 2. Firestore 페이지 확인
- Firestore → 상단에 "Firebase로 이동" 링크 찾기
- 클릭하면 Firebase Console로 이동

#### 3. Firebase 프로젝트 생성/연결
- Firebase가 연결되지 않았다면 "Firebase 추가" 옵션 사용

## 🛠️ .env.local 파일 설정

### 1. Firebase Console에서 복사한 값으로 업데이트

```env
# .env.local 파일
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBL9RQZmK8u1LCijgJx2C3Xj6Y3x_실제값
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012345
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_REGION=asia-northeast3
```

### 2. 값 확인 체크리스트
- [ ] API Key: `AIzaSy`로 시작
- [ ] Auth Domain: `.firebaseapp.com`으로 끝남
- [ ] Project ID: 소문자와 하이픈만 포함
- [ ] Storage Bucket: `.appspot.com`으로 끝남
- [ ] Messaging Sender ID: 숫자만
- [ ] App ID: `1:`로 시작

## 🔐 Firebase Console 필수 설정

### 1. Firestore Database
- Firestore Database → "데이터베이스 만들기"
- 프로덕션 모드 선택
- 위치: **asia-northeast3** (서울)

### 2. Authentication
- Authentication → Sign-in method
- ✅ 이메일/비밀번호 사용 설정
- ✅ Google 사용 설정

### 3. 승인된 도메인
- Authentication → Settings → Authorized domains
- 추가:
  - `localhost`
  - `julyak.jhlab.ai.kr`

### 4. 보안 규칙 (테스트용)
Firestore Database → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 임시로 모든 접근 허용 (테스트용)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 🧪 설정 테스트

### 1. 독립 테스트 도구 사용
브라우저에서 파일 열기:
```
/home/kitri/webapp/test-firebase-standalone.html
```

### 2. 테스트 순서
1. Firebase 설정값 입력
2. "Firebase 초기화" 클릭
3. "Firestore 테스트" 클릭
4. 성공하면 설정 완료!

## 🚨 자주 발생하는 문제

### "client is offline" 오류
**원인**: Firestore Database 미생성
**해결**: Firebase Console → Firestore Database → "데이터베이스 만들기"

### "invalid-api-key" 오류
**원인**: API 키가 잘못됨
**해결**: Firebase Console에서 정확한 값 복사

### "auth/unauthorized-domain" 오류
**원인**: 도메인이 허용되지 않음
**해결**: Authentication → Settings → Authorized domains에 도메인 추가

## 💡 MongoDB 연결 문자열 활용 (선택사항)

MongoDB 연결 문자열은 **서버 측 전용**입니다. 
클라이언트(브라우저)에서는 사용할 수 없습니다.

### 서버 API 예제 (참고용)
```javascript
// app/api/mongodb-test/route.ts
export async function GET() {
  // MongoDB 드라이버 사용
  const uri = "mongodb://kitri:...@...firestore.goog:443/...";
  // 서버에서만 사용 가능
}
```

## ✅ 최종 체크리스트

1. [ ] Firebase Console에서 웹 앱 설정 복사
2. [ ] .env.local 파일 업데이트
3. [ ] Firestore Database 생성 확인
4. [ ] Authentication 방법 활성화
5. [ ] 승인된 도메인 추가
6. [ ] 보안 규칙 설정
7. [ ] 테스트 도구로 연결 확인

## 📞 추가 도움

Firebase 설정값을 찾을 수 없다면:
1. Google Cloud 프로젝트 ID 공유
2. Firebase Console 스크린샷 제공
3. 새 Firebase 프로젝트 생성 고려

설정값을 찾으셨다면 .env.local 파일을 업데이트하고 서버를 재시작하세요!