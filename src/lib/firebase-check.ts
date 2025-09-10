/**
 * Firebase Configuration Check Utility
 * Firebase 설정이 올바른지 확인하는 유틸리티
 */

export const checkFirebaseConfig = () => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!config.apiKey) errors.push('NEXT_PUBLIC_FIREBASE_API_KEY is missing');
  if (!config.authDomain) errors.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing');
  if (!config.projectId) errors.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing');
  if (!config.appId) errors.push('NEXT_PUBLIC_FIREBASE_APP_ID is missing');

  // Check optional but recommended fields
  if (!config.storageBucket) warnings.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is missing');
  if (!config.messagingSenderId) warnings.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is missing');
  if (!config.measurementId) warnings.push('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID is missing');

  // Validate format
  if (config.apiKey && !config.apiKey.startsWith('AIza')) {
    errors.push('API Key format seems incorrect (should start with AIza)');
  }

  if (config.authDomain && !config.authDomain.includes('.firebaseapp.com')) {
    warnings.push('Auth domain should typically end with .firebaseapp.com');
  }

  if (config.projectId && config.projectId.includes('CHANGE_ME')) {
    errors.push('Project ID contains placeholder value');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config: {
      ...config,
      apiKey: config.apiKey ? '***' + config.apiKey.slice(-4) : undefined,
    },
  };
};

export const logFirebaseStatus = () => {
  if (typeof window === 'undefined') return;

  const check = checkFirebaseConfig();
  
  console.group('🔥 Firebase Configuration Status');
  
  if (check.isValid) {
    console.log('✅ Configuration is valid');
  } else {
    console.error('❌ Configuration has errors');
  }

  if (check.errors.length > 0) {
    console.group('Errors:');
    check.errors.forEach(error => console.error(`• ${error}`));
    console.groupEnd();
  }

  if (check.warnings.length > 0) {
    console.group('Warnings:');
    check.warnings.forEach(warning => console.warn(`• ${warning}`));
    console.groupEnd();
  }

  console.group('Configuration:');
  console.table(check.config);
  console.groupEnd();
  
  console.groupEnd();
};