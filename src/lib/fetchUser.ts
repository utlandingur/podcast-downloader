import { getCurrentUser } from '@/lib/api/user';

export const fetchUser = async (email: string) => {
  try {
    if (!email) return { user: null, error: null };
    const user = await getCurrentUser();
    if (!user) {
      return {
        user: null,
        error: new Error('Unauthorized'),
      };
    }
    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: new Error(`Error fetching user: ${(error as Error).message}`),
    };
  }
};
