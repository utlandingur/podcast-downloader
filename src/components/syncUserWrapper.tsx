'use client';
import { useSyncUser } from '@/hooks/useSyncUser';
import { useSession } from 'next-auth/react';

type Props = {
  children: React.ReactNode;
};

export const SyncUserWrapper = ({ children }: Props) => {
  const { data: session } = useSession();
  useSyncUser(session || null);
  return <>{children}</>;
};
