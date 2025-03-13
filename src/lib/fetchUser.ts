import { findOrCreateUser } from '@/serverActions/userActions';

export const fetchUser = async (email: string) => {
  try {
    const user = await findOrCreateUser(email);
    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: new Error('Error fetching user:', error as Error),
    };
  }
};
