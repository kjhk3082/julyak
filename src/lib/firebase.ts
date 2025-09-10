import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, connectAuthEmulator } from "firebase/auth";
import { getFirestore, enableNetwork, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if config is properly loaded
if (typeof window !== 'undefined') {
  const hasConfig = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId;
  
  if (!hasConfig) {
    console.error('⚠️ Firebase configuration is missing!');
    console.error('Please check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set.');
    console.error('Visit /test-firebase to check your configuration.');
  } else {
    console.log('✅ Firebase Config loaded:', {
      apiKey: firebaseConfig.apiKey ? '✓' : '✗',
      authDomain: firebaseConfig.authDomain ? '✓' : '✗',
      projectId: firebaseConfig.projectId ? '✓' : '✗',
    });
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Set persistence to LOCAL
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Auth persistence error:', error);
  });
}

// Configure Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore with settings for asia-northeast3
export const db = typeof window !== 'undefined' 
  ? initializeFirestore(app, {
      experimentalForceLongPolling: false,
      cacheSizeBytes: 40 * 1024 * 1024, // 40 MB
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    })
  : getFirestore(app);

// Connect to emulator in development (optional)
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
}

// Force enable network for Firestore
if (typeof window !== 'undefined' && db) {
  enableNetwork(db)
    .then(() => {
      console.log('Firestore network enabled');
    })
    .catch((err) => {
      console.error('Firestore network enable error:', err);
      // Try to reconnect after a delay
      setTimeout(() => {
        enableNetwork(db).catch(console.error);
      }, 2000);
    });
}

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;