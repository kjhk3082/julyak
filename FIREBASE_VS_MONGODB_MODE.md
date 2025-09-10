# Firestore 연결 방식 이해하기

## 현재 상황 분석

Google Cloud Firestore는 두 가지 접근 방식을 제공합니다:

### 1. MongoDB 호환 모드 (서버 측)
- **연결 방식**: MongoDB 연결 문자열 사용
- **용도**: 백엔드 서버, MongoDB 도구
- **인증**: 사용자명/비밀번호
- **제공하신 연결 문자열**:
  ```
  mongodb://kitri:3vFzd7nDari8pbGL5Unle6TKgvAN9DeAMWYokGqzFWt77EKs@...
  ```

### 2. Firebase SDK (클라이언트 측) ✅ 현재 필요한 방식
- **연결 방식**: Firebase 설정 객체
- **용도**: 웹 애플리케이션, 모바일 앱
- **인증**: Firebase Authentication (OAuth, Email 등)
- **필요한 설정**:
  ```javascript
  const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    // ...
  };
  ```

## 왜 Firebase SDK가 필요한가?

현재 Next.js 애플리케이션은:
1. **브라우저에서 직접 Firestore에 접근** (클라이언트 사이드)
2. **Firebase Authentication 사용** (Google 로그인, 이메일 로그인)
3. **실시간 업데이트** 기능 사용
4. **보안 규칙** 적용

이러한 기능들은 MongoDB 호환 모드가 아닌 **Firebase SDK**를 통해서만 가능합니다.

## 해결 방법

### 옵션 1: Firebase 웹 SDK 설정 가져오기 (권장) ✅

Firebase Console에서 웹 앱 설정을 가져와야 합니다:

1. **Firebase Console 접속**
   - https://console.firebase.google.com
   - 또는 Google Cloud Console → Firestore → Firebase 모드

2. **프로젝트 확인**
   - 프로젝트 ID가 `9f987c20-9f53-40a0-ad98-6e6c26fad4c7`와 연관된 Firebase 프로젝트 찾기
   - 또는 새 Firebase 프로젝트 생성

3. **웹 앱 추가/확인**
   ```
   프로젝트 설정 → 일반 → 내 앱 → 웹 앱 추가
   ```

4. **SDK 설정 복사**
   ```javascript
   const firebaseConfig = {
     apiKey: "실제값",
     authDomain: "실제값.firebaseapp.com",
     projectId: "실제값",
     storageBucket: "실제값.appspot.com",
     messagingSenderId: "실제값",
     appId: "실제값"
   };
   ```

### 옵션 2: 백엔드 API 서버 구축 (복잡)

MongoDB 연결 문자열을 사용하려면:
1. 별도의 백엔드 서버 구축 (Node.js + Express)
2. MongoDB 드라이버로 Firestore 연결
3. REST API 엔드포인트 생성
4. 프론트엔드에서 API 호출

하지만 이 방법은:
- ❌ Firebase Authentication 사용 불가
- ❌ 실시간 업데이트 제한적
- ❌ 추가 서버 관리 필요
- ❌ 보안 규칙 적용 복잡

## Google Cloud Console에서 Firebase 설정 확인

Google Cloud Console을 사용 중이시라면:

1. **Firestore 페이지에서 Firebase 확인**
   ```
   Google Cloud Console → Firestore → 
   상단에 "Firebase 콘솔에서 보기" 링크 확인
   ```

2. **Firebase 프로젝트 연결**
   - Firestore가 Firebase 프로젝트와 연결되어 있는지 확인
   - 연결되지 않았다면 "Firebase 추가" 옵션 사용

3. **서비스 계정 vs 웹 SDK**
   - MongoDB 연결: 서비스 계정 기반 (서버용)
   - Firebase SDK: 웹 앱 구성 (클라이언트용)

## 임시 해결책: 하이브리드 접근

### API 라우트 생성 (Next.js)
```javascript
// app/api/firestore/route.ts
import { MongoClient } from 'mongodb';

const uri = "mongodb://kitri:3vFzd7nDari8pbGL5Unle6TKgvAN9DeAMWYokGqzFWt77EKs@...";

export async function GET(request: Request) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db('default');
    // 데이터 조회
    return Response.json({ data: result });
  } finally {
    await client.close();
  }
}
```

그러나 이 방법도 인증 시스템 재구축이 필요합니다.

## 권장 사항

**Firebase SDK 설정을 사용하는 것이 가장 간단하고 효율적입니다.**

Firebase Console이나 Google Cloud Console에서:
1. Firebase 웹 앱 구성 확인
2. SDK 설정값 복사
3. `.env.local` 파일 업데이트

이렇게 하면 현재 코드베이스를 그대로 사용할 수 있습니다.