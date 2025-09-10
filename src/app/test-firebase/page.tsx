'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { checkFirebaseConfig } from '@/lib/firebase-check';
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function TestFirebasePage() {
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const status = checkFirebaseConfig();
    setConfigStatus(status);
  }, []);

  const testFirestoreConnection = async () => {
    try {
      const testDoc = doc(db, 'test', 'connection');
      await setDoc(testDoc, { 
        timestamp: new Date(), 
        test: true,
        region: 'asia-northeast3'
      });
      const docSnap = await getDoc(testDoc);
      return { success: docSnap.exists(), data: docSnap.data() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const testGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user.email };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults({});

    // Test Firestore
    const firestoreResult = await testFirestoreConnection();
    setTestResults(prev => ({ ...prev, firestore: firestoreResult }));

    setTesting(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Firebase 연결 테스트</h1>

        {/* Configuration Status */}
        <Card>
          <CardHeader>
            <CardTitle>환경변수 설정 상태</CardTitle>
            <CardDescription>Firebase 설정이 올바른지 확인합니다</CardDescription>
          </CardHeader>
          <CardContent>
            {configStatus && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {configStatus.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {configStatus.isValid ? '설정 완료' : '설정 오류'}
                  </span>
                </div>

                {configStatus.errors.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-red-600">오류:</h3>
                    {configStatus.errors.map((error, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                )}

                {configStatus.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-yellow-600">경고:</h3>
                    {configStatus.warnings.map((warning, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Tests */}
        <Card>
          <CardHeader>
            <CardTitle>연결 테스트</CardTitle>
            <CardDescription>Firebase 서비스 연결을 테스트합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runTests} disabled={testing}>
              {testing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {testing ? '테스트 중...' : '테스트 시작'}
            </Button>

            {testResults.firestore && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {testResults.firestore.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">Firestore 연결</span>
                </div>
                {testResults.firestore.success ? (
                  <pre className="text-xs bg-gray-100 p-2 rounded">
                    {JSON.stringify(testResults.firestore.data, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-red-600">{testResults.firestore.error}</p>
                )}
              </div>
            )}

            <Button 
              onClick={testGoogleAuth} 
              variant="outline"
              disabled={!configStatus?.isValid}
            >
              Google 로그인 테스트
            </Button>

            {testResults.auth && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {testResults.auth.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">Google 인증</span>
                </div>
                {testResults.auth.success ? (
                  <p className="text-sm">로그인 성공: {testResults.auth.user}</p>
                ) : (
                  <p className="text-sm text-red-600">{testResults.auth.error}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>설정 방법</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">1. Firebase Console에서 설정값 복사:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Firebase Console → 프로젝트 설정 → 일반</li>
                <li>웹 앱 섹션에서 SDK 설정 확인</li>
                <li>.env.local 파일에 값 복사</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. 도메인 허용 설정:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Authentication → Settings → Authorized domains</li>
                <li>localhost와 julyak.jhlab.ai.kr 추가</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">3. Firestore 보안 규칙:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /test/{document} {
      allow read, write: if true;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}