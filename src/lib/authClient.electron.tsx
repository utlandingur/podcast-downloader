'use client';
import React, { createContext, useContext, useMemo } from 'react';
import type { Session } from 'next-auth';

export type SessionContextValue = {
  data: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update?: () => Promise<Session | null>;
};

const AuthContext = createContext<SessionContextValue>({
  data: null,
  status: 'unauthenticated',
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(
    () => ({
      data: null,
      status: 'unauthenticated' as const,
      update: async () => null,
    }),
    [],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useSession = () => useContext(AuthContext);

export const signIn = async (_provider?: string, _options?: unknown) => null;

export const signOut = async (_options?: unknown) => null;

export type { Session };
