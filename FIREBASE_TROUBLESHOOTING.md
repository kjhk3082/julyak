# Firebase 문제 해결 가이드

## 현재 발생한 오류들과 해결 방법

### 1. "The email or password provided is incorrect" 오류

**원인:**
- Firebase Authentication에 해당 이메일/비밀번호 조합이 등록되지 않음
- 비밀번호가 틀림
- 이메일 형식이 잘못됨

**해결 방법:**
1. Firebase Console에서 새 사용자 생성:
   ```
   Firebase Console → Authentication → Users → Add user
   ```
2. 또는 회원가입 기능을 먼저 사용하여 계정 생성
3. 비밀번호는 최소 6자 이상이어야 함

### 2. "FirebaseError: Failed to get document because the client is offline" 오류

**주요 원인들:**

#### A. Firestore 데이터베이스가 생성되지 않음
**해결:**
1. Firebase Console → Firestore Database 이동
2. "Create database" 클릭
3. **Production mode** 선택
4. **Location: asia-northeast3 (Seoul)** 선택
5. 데이터베이스 생성 완료 대기

#### B. 보안 규칙이 모든 접근을 차단
**해결:**
Firebase Console → Firestore Database → Rules 탭에서 다음 규칙 적용:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 테스트용 (임시)
    match /test/{document} {
      allow read, write: if true;
    }
    
    // 사용자 데이터
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 목표 데이터
    match /goals/{goalId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### C. 네트워크 연결 문제
**해결:**
1. 브라우저 개발자 도구(F12) → Network 탭 확인
2. Firestore 요청이 차단되는지 확인
3. VPN 사용 중이라면 비활성화
4. 브라우저 확장 프로그램 비활성화 (특히 광고 차단기)

### 3. "로그인 성공 환영합니다 하고 바뀌는게 없어" 문제

**원인:**
- 로그인 후 리다이렉션 로직 실패
- Firestore 연결 오류로 인한 사용자 데이터 생성 실패

**해결:**
1. 브라우저 콘솔에서 에러 확인
2. localStorage에 저장된 인증 토큰 확인:
   ```javascript
   // 브라우저 콘솔에서 실행
   localStorage.getItem('authToken')
   ```
3. 수동으로 대시보드 접근 시도: `/dashboard` URL 직접 입력

### 4. "Failed to load resource: the server responded with a status of 400" 오류

**원인:**
- Firestore Listen 채널 연결 실패
- 잘못된 프로젝트 ID 또는 API 키

**해결:**
1. `.env.local` 파일의 모든 값이 정확한지 확인
2. Firebase Console에서 정확한 값 복사:
   ```
   Project Settings → General → Your apps → Web app
   ```

## 독립 테스트 도구 사용법

### 1. 브라우저에서 테스트 파일 열기
```bash
# 파일 경로
/home/kitri/webapp/test-firebase-standalone.html
```
브라우저에서 이 파일을 직접 열어서 사용

### 2. Firebase 설정값 입력
Firebase Console에서 복사한 값들을 입력 필드에 붙여넣기

### 3. 테스트 실행
- Firebase 초기화 버튼 클릭
- 각 테스트 버튼을 순서대로 클릭
- 로그에서 상세 오류 메시지 확인

## Firebase Console 체크리스트

### ✅ 필수 확인 사항

- [ ] **Firestore Database 생성됨**
  - Location: asia-northeast3 (Seoul)
  - 보안 규칙 설정 완료

- [ ] **Authentication 활성화**
  - Email/Password 제공자 활성화
  - Google 제공자 활성화
  - 사용자 계정 생성됨

- [ ] **Authorized Domains 설정**
  ```
  Authentication → Settings → Authorized domains
  추가할 도메인:
  - localhost
  - julyak.jhlab.ai.kr
  ```

- [ ] **웹 앱 등록**
  ```
  Project Settings → General → Your apps
  웹 앱이 등록되어 있고 SDK 설정 표시됨
  ```

- [ ] **API 키 제한 설정 (선택사항)**
  ```
  Google Cloud Console → APIs & Services → Credentials
  API 키에 대한 HTTP referrer 제한 설정
  ```

## 환경 변수 확인

`.env.local` 파일 형식:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...
```

**주의사항:**
- 모든 변수는 `NEXT_PUBLIC_` 접두사 필요
- 따옴표 없이 값만 입력
- 공백이나 특수문자 주의

## 브라우저 개발자 도구 디버깅

### Console 탭에서 확인할 사항:
1. Firebase 초기화 성공 메시지
2. Authentication 관련 에러
3. Firestore 연결 에러
4. CORS 에러

### Network 탭에서 확인할 사항:
1. `firebaseapp.com` 도메인 요청 상태
2. `firestore.googleapis.com` 요청 상태
3. 400, 401, 403 에러 응답

### Application 탭에서 확인할 사항:
1. Local Storage → `authToken` 값 존재 여부
2. Cookies → Firebase 관련 쿠키
3. IndexedDB → Firebase 캐시 데이터

## 임시 해결책

### Firestore 오프라인 모드 사용
```javascript
// src/lib/firebase.ts에 추가
import { enableIndexedDbPersistence } from 'firebase/firestore';

// Firestore 초기화 후
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // 여러 탭이 열려있는 경우
    console.log('Persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // 브라우저가 지원하지 않는 경우
    console.log('Persistence not supported');
  }
});
```

### 직접 REST API 사용
Firestore SDK 대신 REST API 직접 호출:
```javascript
const response = await fetch(
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}`,
  {
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  }
);
```

## 추가 도움말

### Firebase Support 문의
- [Firebase Support](https://firebase.google.com/support)
- [Firebase Status](https://status.firebase.google.com/)

### 커뮤니티 리소스
- [Stack Overflow Firebase Tag](https://stackoverflow.com/questions/tagged/firebase)
- [Firebase Community](https://firebase.google.com/community)

## 연락처
문제가 지속되면 다음 정보와 함께 문의:
1. 브라우저 콘솔 전체 로그
2. Network 탭 스크린샷
3. Firebase Console 프로젝트 설정 스크린샷
4. 독립 테스트 도구 실행 결과