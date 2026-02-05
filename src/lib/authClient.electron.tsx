'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session } from 'next-auth';
import { authGetSession, authSignIn, authSignOut } from '@/lib/electronBridge.electron';

export type SessionContextValue = {
  data: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update?: () => Promise<Session | null>;
};

const AuthContext = createContext<SessionContextValue>({
  data: null,
  status: 'loading',
});

const AUTH_EVENT = 'electron-auth-changed';

const notifyAuthChange = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_EVENT));
};

const fetchSession = async (): Promise<Session | null> => {
  if (typeof window === 'undefined') return null;
  const result = await authGetSession();
  return (result as { session?: Session | null } | null)?.session ?? null;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionContextValue['status']>('loading');

  const refresh = useCallback(async () => {
    setStatus('loading');
    try {
      const session = await fetchSession();
      setData(session);
      setStatus(session ? 'authenticated' : 'unauthenticated');
      return session;
    } catch {
      setData(null);
      setStatus('unauthenticated');
      return null;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handle = () => {
      refresh();
    };
    window.addEventListener(AUTH_EVENT, handle);
    return () => {
      window.removeEventListener(AUTH_EVENT, handle);
    };
  }, [refresh]);

  const value = useMemo(
    () => ({ data, status, update: refresh }),
    [data, status, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useSession = () => useContext(AuthContext);

export const signIn = async (_provider?: string, _options?: unknown) => {
  if (typeof window === 'undefined') return;
  await authSignIn();
  notifyAuthChange();
};

export const signOut = async (_options?: unknown) => {
  if (typeof window === 'undefined') return;
  await authSignOut();
  notifyAuthChange();
};

export type { Session };
