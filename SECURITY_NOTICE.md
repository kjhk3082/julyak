# ⚠️ 보안 경고: Firebase API 키 노출

## 🚨 즉시 취해야 할 조치

### 1. Firebase Console에서 API 키 제한 설정

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 접속
2. 프로젝트: `julyak-1c85a` 선택
3. API 키 찾기: `AIzaSyDgrRbxqGA1f7YMl33QDiIrFVtiVR8TNU4`
4. **API 키 제한 설정**:
   - 애플리케이션 제한사항 → **HTTP 리퍼러(웹사이트)**
   - 웹사이트 제한사항 추가:
     ```
     http://localhost:3000/*
     https://julyak.jhlab.ai.kr/*
     ```
   - API 제한사항 → **특정 API 선택**:
     - Firebase Auth API
     - Cloud Firestore API
     - Firebase Installations API

### 2. Firebase 보안 규칙 강화

Firestore Database → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 인증된 사용자만 접근
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /goals/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // 테스트 컬렉션 제거
    match /test/{document=**} {
      allow read, write: if false;  // 비활성화
    }
  }
}
```

### 3. 환경 변수 사용 규칙

#### ❌ 절대 하지 말아야 할 것:
- API 키를 하드코딩하여 커밋
- 테스트 파일에 실제 API 키 포함
- 공개 저장소에 `.env.local` 파일 업로드

#### ✅ 올바른 방법:
- `.env.local` 파일은 로컬에만 보관
- `.env.local.example` 파일로 템플릿 제공
- 배포 시 환경 변수는 호스팅 서비스에서 설정

## 📋 Firebase API 키 특성

Firebase 웹 API 키는 **공개되어도 되는** 설계입니다. 하지만:

### 안전한 이유:
1. **Firebase 보안 규칙**으로 데이터 접근 제어
2. **Authentication**으로 사용자 인증
3. **도메인 제한**으로 승인된 도메인만 허용

### 그래도 보호해야 하는 이유:
1. **할당량 도용** 방지
2. **악의적 사용** 차단
3. **모범 사례** 준수

## 🔧 현재 프로젝트 보안 설정

### 1. `.gitignore` 확인
```bash
# 이미 설정됨
.env*
.env.local
```

### 2. 환경 변수 사용
```javascript
// ✅ 올바른 방법
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // ...
};

// ❌ 잘못된 방법
const firebaseConfig = {
  apiKey: "AIzaSyDgrRbxqGA1f7YMl33QDiIrFVtiVR8TNU4",  // 하드코딩
  // ...
};
```

### 3. 배포 시 환경 변수 설정

#### Vercel:
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
```

#### GitHub Actions:
Settings → Secrets → New repository secret

## 🛡️ 추가 보안 조치

### 1. App Check 활성화 (선택사항)
Firebase Console → App Check:
- reCAPTCHA v3 설정
- 봇 공격 방지

### 2. 사용량 모니터링
Firebase Console → Usage and billing:
- 일일 할당량 설정
- 알림 설정

### 3. 정기적인 키 로테이션
- 3-6개월마다 새 API 키 생성
- 이전 키 비활성화

## 📌 중요 참고사항

1. **이미 노출된 API 키**: 도메인 제한을 설정하면 안전합니다
2. **Firebase API 키 ≠ 서버 API 키**: Firebase 웹 API 키는 클라이언트용
3. **진짜 비밀**: 서비스 계정 키, Admin SDK 키는 절대 노출 금지

## ✅ 체크리스트

- [ ] Google Cloud Console에서 API 키 제한 설정
- [ ] Firebase 보안 규칙 업데이트
- [ ] 승인된 도메인만 허용
- [ ] 테스트 파일에서 하드코딩된 키 제거
- [ ] `.env.local` 파일 로컬에만 보관
- [ ] 배포 환경에 환경 변수 설정

## 🔗 참고 링크

- [Firebase API 키 보안](https://firebase.google.com/docs/projects/api-keys)
- [Google Cloud API 키 제한](https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key)
- [Firebase 보안 규칙](https://firebase.google.com/docs/rules)