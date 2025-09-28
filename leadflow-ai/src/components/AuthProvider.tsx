"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getFirebaseClientAuth, getFirebaseClientDb } from "@/lib/firebase/client";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  getIdToken: () => Promise<string | null>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseClientAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      // Ensure user doc exists
      if (u) {
        const db = getFirebaseClientDb();
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName || "",
            photoURL: u.photoURL || "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(ref, { updatedAt: serverTimestamp() }, { merge: true });
        }
      }
    });
    return () => unsub();
  }, []);

  const getIdToken = async () => {
    const auth = getFirebaseClientAuth();
    const u = auth.currentUser;
    if (!u) return null;
    return await u.getIdToken();
  };

  const signInWithGoogle = async () => {
    const auth = getFirebaseClientAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const auth = getFirebaseClientAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    const auth = getFirebaseClientAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
  };

  const signOut = async () => {
    const auth = getFirebaseClientAuth();
    await fbSignOut(auth);
  };

  const value: AuthContextValue = useMemo(
    () => ({ user, loading, getIdToken, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

