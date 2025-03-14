'use client';
import { useSyncUser } from '@/hooks/useSyncUser';
import { Session } from 'next-auth';

type Props = {
  session: Session | null;
  children: React.ReactNode;
};

export const SyncUserWrapper = ({ session, children }: Props) => {
  useSyncUser(session || null);
  return <>{children}</>;
};
