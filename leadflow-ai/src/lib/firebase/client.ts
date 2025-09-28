import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { PUBLIC_FIREBASE_CONFIG } from "@/lib/env";

export function getFirebaseClientApp() {
  const config = PUBLIC_FIREBASE_CONFIG();
  const app = getApps().length ? getApp() : initializeApp(config);
  return app;
}

export function getFirebaseClientAuth() {
  const auth = getAuth(getFirebaseClientApp());
  // Ensure persistent sessions across tabs and reloads
  // Configure once per runtime; ignore failures silently
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  setPersistence(auth, browserLocalPersistence).catch(() => {});
  return auth;
}

export function getFirebaseClientDb() {
  return getFirestore(getFirebaseClientApp());
}


