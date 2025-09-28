'use client';

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getFirebaseClientAuth, getFirebaseClientDb } from '@/lib/firebase/client';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [signingIn, setSigningIn] = useState<boolean>(false);

  useEffect(() => {
    const auth = getFirebaseClientAuth();
    const unsub = onAuthStateChanged(auth, async (nextUser: User | null) => {
      setUser(nextUser);
      setLoading(false);
      if (nextUser) {
        try {
          const db = getFirebaseClientDb();
          const userRef = doc(db, 'users', nextUser.uid);
          const snapshot = await getDoc(userRef);
          if (!snapshot.exists()) {
            await setDoc(userRef, {
              uid: nextUser.uid,
              email: nextUser.email ?? null,
              displayName: nextUser.displayName ?? null,
              photoURL: nextUser.photoURL ?? null,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              role: 'user',
              preferences: {
                theme: 'system',
              },
            });
          } else {
            await updateDoc(userRef, { lastLoginAt: serverTimestamp() });
          }
        } catch (_) {}
      }
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    setSigningIn(true);
    try {
      const auth = getFirebaseClientAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = async () => {
    const auth = getFirebaseClientAuth();
    await firebaseSignOut(auth);
  };

  const getIdToken = async () => {
    try {
      const auth = getFirebaseClientAuth();
      const current = auth.currentUser;
      if (!current) return null;
      return await current.getIdToken();
    } catch (_) {
      return null;
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signingIn, signInWithGoogle, signOut, getIdToken }),
    [user, loading, signingIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

