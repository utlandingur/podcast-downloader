import { useCallback, useMemo } from 'react';
import { useUserStore } from './useUserStore';
import { getUserPodcastInfo } from '@/lib/getUserPodcastInfo';

export const useToggleFavourite = (podcastId: string) => {
  const { user, toggleFavouritePodcast } = useUserStore((state) => state);
  const userPodcastInfo = getUserPodcastInfo(podcastId, user?.info);

  const favourited = useMemo(() => {
    return userPodcastInfo?.favourited ?? false;
  }, [userPodcastInfo]);

  const toggleFavourite = useCallback(
    () => toggleFavouritePodcast(podcastId, !favourited),
    [favourited, podcastId, toggleFavouritePodcast],
  );

  return useMemo(
    () => ({ favourited, toggleFavourite }),
    [favourited, toggleFavourite],
  );
};
