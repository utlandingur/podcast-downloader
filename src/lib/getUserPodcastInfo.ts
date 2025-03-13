import type { PlainPodcastStateType } from '@/models/user';

export const getUserPodcastInfo = (
  podcastId: string,
  info?: PlainPodcastStateType[],
) => {
  if (!info) return null;
  const index = info.findIndex((info) => info.podcast_id === podcastId);
  return index ? info[index] : null;
};
