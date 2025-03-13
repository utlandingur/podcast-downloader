'use client';
import { useEffect } from 'react';
import { useUserStore } from '@/hooks/useUserStore';
import { Session } from 'next-auth';

/**
 *
 * Uses session to sync local user with the dbuser.
 *
 */
export const useSyncUser = (session: Session | null) => {
  const { user, syncUser } = useUserStore((state) => state);

  useEffect(() => {
    const fetchUser = async () => {
      await syncUser(session?.user?.email || null);
    };

    if (!session || user) return;

    if (session?.user?.email) fetchUser();
  }, [session, syncUser, user]);
};
