import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { PUBLIC_FIREBASE_CONFIG } from "@/lib/env";

export function getFirebaseClientApp() {
  const config = PUBLIC_FIREBASE_CONFIG();
  const app = getApps().length ? getApp() : initializeApp(config);
  return app;
}

export function getFirebaseClientAuth() {
  return getAuth(getFirebaseClientApp());
}

export function getFirebaseClientDb() {
  return getFirestore(getFirebaseClientApp());
}


