import type { Session } from 'next-auth';
import { auth } from '../../auth';

export const getOptionalSession = async (): Promise<Session | null> => {
  try {
    const session = await auth();
    return session ?? null;
  } catch {
    return null;
  }
};
