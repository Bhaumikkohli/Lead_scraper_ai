"use client";

import { getFirebaseClientAuth } from "@/lib/firebase/client";

export async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const auth = getFirebaseClientAuth();
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  const headers = new Headers(init?.headers || {});
  if (token) headers.set("authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

