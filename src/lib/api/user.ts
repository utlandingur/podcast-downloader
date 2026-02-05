import { apiGet, apiPost } from '@/lib/api/request';
import type { PlainUserType } from '@/models/user';

type UserResponse = { user: PlainUserType };

type ApiResult<T> = {
  ok: boolean;
  data: T | null;
};

const extractUser = (response: ApiResult<UserResponse>) => {
  if (!response.ok || !response.data) return null;
  return response.data.user ?? null;
};

export const getCurrentUser = async () => {
  const res = await apiGet<UserResponse>('/api/user');
  return extractUser(res);
};

export const addDownloadedEpisodeApi = async (
  podcastId: string,
  episodeId: string,
) => {
  const res = await apiPost<UserResponse>('/api/user/downloaded', {
    podcastId,
    episodeId,
  });
  return extractUser(res);
};

export const toggleFavouritePodcastApi = async (
  podcastId: string,
  favourited: boolean,
) => {
  const res = await apiPost<UserResponse>('/api/user/favourite', {
    podcastId,
    favourited,
  });
  return extractUser(res);
};
