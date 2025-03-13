import { useUserStore } from './useUserStore';
import { getUserPodcastInfo } from '@/lib/getUserPodcastInfo';

export const useUserPodcastInfo = (podcastId: string) => {
  const { user } = useUserStore((state) => state);

  return getUserPodcastInfo(podcastId, user?.info);
};
