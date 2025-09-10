'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function FirestoreDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    const log = `[${timestamp}] ${prefix} ${message}`;
    setLogs(prev => [...prev, log]);
    console.log(log);
  };

  useEffect(() => {
    addLog('Firestore Debug Page Loaded');
    addLog(`Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
    addLog(`Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`);
    
    // Check current auth state
    const user = auth.currentUser;
    if (user) {
      setAuthUser(user);
      addLog(`Current user: ${user.email}`, 'success');
    } else {
      addLog('No user currently logged in', 'info');
    }
  }, []);

  const testBasicConnection = async () => {
    addLog('Testing basic Firestore connection...');
    try {
      // Try to write a simple document
      const testRef = doc(db, 'connection-test', 'test-doc');
      await setDoc(testRef, {
        timestamp: new Date().toISOString(),
        test: true,
        message: 'Connection test successful'
      });
      addLog('Write test successful', 'success');
      
      // Try to read it back
      const docSnap = await getDoc(testRef);
      if (docSnap.exists()) {
        addLog(`Read test successful: ${JSON.stringify(docSnap.data())}`, 'success');
      } else {
        addLog('Document not found after write', 'error');
      }
    } catch (error: any) {
      addLog(`Firestore test failed: ${error.message}`, 'error');
      if (error.code === 'unavailable') {
        addLog('Firestore is unavailable. Check network connection.', 'error');
      }
      if (error.code === 'permission-denied') {
        addLog('Permission denied. Check Firestore security rules.', 'error');
      }
    }
  };

  const testWithAuth = async () => {
    addLog('Testing Firestore with authentication...');
    
    // First, ensure we're logged in
    if (!authUser) {
      addLog('Creating test user...');
      try {
        const testEmail = `test${Date.now()}@example.com`;
        const testPassword = 'testPassword123';
        
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        setAuthUser(userCredential.user);
        addLog(`Test user created: ${testEmail}`, 'success');
        
        // Wait a bit for auth to propagate
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          // Try to sign in instead
          try {
            const userCredential = await signInWithEmailAndPassword(auth, 'test@example.com', 'test123456');
            setAuthUser(userCredential.user);
            addLog('Signed in with existing test user', 'success');
          } catch (signInError: any) {
            addLog(`Auth failed: ${signInError.message}`, 'error');
            return;
          }
        } else {
          addLog(`User creation failed: ${error.message}`, 'error');
          return;
        }
      }
    }
    
    // Now test Firestore with authenticated user
    try {
      const userId = authUser?.uid || auth.currentUser?.uid;
      if (!userId) {
        addLog('No user ID available', 'error');
        return;
      }
      
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        email: authUser?.email || auth.currentUser?.email,
        lastTest: new Date().toISOString(),
        testField: 'Firestore connection successful'
      }, { merge: true });
      
      addLog('User document written successfully', 'success');
      
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        addLog(`User document read: ${JSON.stringify(userDoc.data())}`, 'success');
      }
    } catch (error: any) {
      addLog(`Authenticated Firestore test failed: ${error.message}`, 'error');
    }
  };

  const testCollections = async () => {
    addLog('Testing collection access...');
    try {
      // Try to read users collection
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      addLog(`Users collection has ${snapshot.size} documents`, 'info');
      
      // Try to read test collection
      const testRef = collection(db, 'connection-test');
      const testSnapshot = await getDocs(testRef);
      addLog(`Test collection has ${testSnapshot.size} documents`, 'info');
    } catch (error: any) {
      addLog(`Collection test failed: ${error.message}`, 'error');
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setLogs([]);
    addLog('Starting comprehensive Firestore tests...');
    
    await testBasicConnection();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testWithAuth();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testCollections();
    
    addLog('All tests completed', 'success');
    setTesting(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Firestore Connection Debugger</CardTitle>
            <CardDescription>
              Diagnose and fix Firestore connection issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={runAllTests} disabled={testing}>
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Run All Tests'
                )}
              </Button>
              <Button onClick={testBasicConnection} variant="outline" disabled={testing}>
                Test Basic Connection
              </Button>
              <Button onClick={testWithAuth} variant="outline" disabled={testing}>
                Test with Auth
              </Button>
              <Button onClick={testCollections} variant="outline" disabled={testing}>
                Test Collections
              </Button>
            </div>
            
            {authUser && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Authenticated as: {authUser.email}</span>
                </div>
              </div>
            )}
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
              <div className="space-y-1 font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-500">No logs yet. Click "Run All Tests" to start.</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>📋 Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">1. Firebase Console에서 Firestore Database 생성 확인</p>
                <p className="text-sm text-gray-600">
                  <a href="https://console.firebase.google.com/project/julyak-1c85a/firestore" 
                     target="_blank" 
                     className="text-blue-500 hover:underline">
                    Firestore Console 열기
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">2. 보안 규칙 설정 (임시 테스트용)</p>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                </pre>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">3. 브라우저 콘솔에서 추가 오류 확인</p>
                <p className="text-sm text-gray-600">F12 → Console 탭</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}