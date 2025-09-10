'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from 'firebase/auth';
import { 
  auth, 
  googleProvider, 
  db 
} from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Set auth token in localStorage for client-side auth check
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', user.uid);
        }
        
        // Create or update user document in Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        } catch (error) {
          console.error('Error creating/updating user document:', error);
        }
        
        // Auto redirect to dashboard if on auth pages
        if (pathname === '/auth/login' || pathname === '/auth/signup') {
          router.replace('/dashboard');
        }
      } else {
        // Remove auth token when user is not authenticated
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
        }
      }
      
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [pathname, router]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });
      
      // Create user document in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        email,
        displayName: fullName,
        photoURL: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create or update user document in Firestore with retry logic
      try {
        const userDocRef = doc(db, 'users', result.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (firestoreError) {
        console.error('Firestore error (non-blocking):', firestoreError);
        // Don't block login even if Firestore fails
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      
      // Provide more specific error messages
      let errorMessage = '구글 로그인에 실패했습니다.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = '로그인 창이 닫혔습니다. 다시 시도해주세요.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = '이미 로그인 창이 열려있습니다.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = '팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = '승인되지 않은 도메인입니다. Firebase 콘솔에서 도메인을 추가해주세요.';
      }
      
      return { error: { ...error, message: errorMessage } };
    }
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }
    await firebaseSignOut(auth);
  };

  const deleteAccount = async () => {
    try {
      if (!user) {
        throw new Error('사용자가 로그인되어 있지 않습니다.');
      }

      const userId = user.uid;
      const batch = writeBatch(db);

      // Delete all user's goals
      const goalsQuery = query(collection(db, 'goals'), where('userId', '==', userId));
      const goalsSnapshot = await getDocs(goalsQuery);
      goalsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete all user's savings plans
      const savingsPlansQuery = query(collection(db, 'savingsPlans'), where('userId', '==', userId));
      const savingsPlansSnapshot = await getDocs(savingsPlansQuery);
      savingsPlansSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete all user's weekly missions
      const weeklyMissionsQuery = query(collection(db, 'weeklyMissions'), where('userId', '==', userId));
      const weeklyMissionsSnapshot = await getDocs(weeklyMissionsQuery);
      weeklyMissionsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete user document
      const userDocRef = doc(db, 'users', userId);
      batch.delete(userDocRef);

      // Commit all deletions
      await batch.commit();

      // Delete the user account from Firebase Auth
      await deleteUser(user);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};