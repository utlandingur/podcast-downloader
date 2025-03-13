import { PlainUserType } from '@/models/user';

export const getFavouriteIds = (user: PlainUserType) => {
  if (user) {
    return user.info
      .filter((info) => info.favourited)
      .map((info) => info.podcast_id);
  }
  return [];
};
