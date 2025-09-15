import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, "Missing NEXT_PUBLIC_FIREBASE_API_KEY"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, "Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, "Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, "Missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, "Missing NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, "Missing NEXT_PUBLIC_FIREBASE_APP_ID"),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_DEV_MODE: z.union([z.literal("0"), z.literal("1")]).optional(),
});

const serverSchema = z.object({
  GOOGLE_GEMINI_API_KEY: z.string().optional(),
  SERPAPI_API_KEY: z.string().optional(),
  ABR_GUID: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
});

export type KeyStatus = {
  firebaseClientReady: boolean;
  firebaseAdminReady: boolean;
  geminiReady: boolean;
  serpapiReady: boolean;
  abrReady: boolean;
  missingKeys: string[];
};

export function readPublicEnv() {
  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    NEXT_PUBLIC_DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE,
  });
  return parsed;
}

export function readServerEnv() {
  const parsed = serverSchema.safeParse({
    GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
    SERPAPI_API_KEY: process.env.SERPAPI_API_KEY,
    ABR_GUID: process.env.ABR_GUID,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  });
  return parsed;
}

export function getKeyStatus(): KeyStatus {
  const publicEnv = readPublicEnv();
  const serverEnv = readServerEnv();

  const missing: string[] = [];

  if (!publicEnv.success) {
    for (const issue of publicEnv.error.issues) missing.push(issue.message);
  }

  const s = serverEnv.success ? serverEnv.data : {};

  const firebaseAdminReady = Boolean(
    s && s.FIREBASE_PROJECT_ID && s.FIREBASE_CLIENT_EMAIL && s.FIREBASE_PRIVATE_KEY
  );
  if (!firebaseAdminReady) {
    if (!s?.FIREBASE_PROJECT_ID) missing.push("Missing FIREBASE_PROJECT_ID");
    if (!s?.FIREBASE_CLIENT_EMAIL) missing.push("Missing FIREBASE_CLIENT_EMAIL");
    if (!s?.FIREBASE_PRIVATE_KEY) missing.push("Missing FIREBASE_PRIVATE_KEY");
  }

  const geminiReady = Boolean(s && s.GOOGLE_GEMINI_API_KEY);
  if (!geminiReady) missing.push("Missing GOOGLE_GEMINI_API_KEY");

  const serpapiReady = Boolean(s && s.SERPAPI_API_KEY);
  if (!serpapiReady) missing.push("Missing SERPAPI_API_KEY (optional but recommended)");

  const abrReady = Boolean(s && s.ABR_GUID);
  if (!abrReady) missing.push("Missing ABR_GUID (optional)");

  return {
    firebaseClientReady: publicEnv.success,
    firebaseAdminReady,
    geminiReady,
    serpapiReady,
    abrReady,
    missingKeys: missing,
  };
}

export function isDevModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEV_MODE === "1";
}

export const PUBLIC_FIREBASE_CONFIG = () => ({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

export const SERVER_ENV = () => ({
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
  SERPAPI_API_KEY: process.env.SERPAPI_API_KEY,
  ABR_GUID: process.env.ABR_GUID,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
});


