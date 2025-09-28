'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';

export default function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

