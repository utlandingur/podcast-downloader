import { DownloadState } from '@/components/downloadPodcastButton';
import { PodcastEpisodeV2 } from '@/types/podcasts';
import { useState, useMemo } from 'react';
import { useUserStore } from '@/hooks/useUserStore';
import { getUserPodcastInfo } from '@/lib/getUserPodcastInfo';

export const useEpisodesView = (
  episodes: PodcastEpisodeV2[],
  podcastId: string,
) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAscending, setIsAscending] = useState(false);
  const [showDownloaded, setShowDownloaded] = useState(true);
  const [episodeData, setEpisodeData] = useState<PodcastEpisodeV2[]>(episodes);
  const { user, loading, addDownloadedEpisode } = useUserStore(
    (state) => state,
  );
  const userPodcastInfo = getUserPodcastInfo(podcastId, user?.info);

  const filteredEpisodes = useMemo(() => {
    const filtered = (episodeData || []).filter((episode) => {
      // Filter by search term
      if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, 'i');
        if (!searchRegex.test(episode.title)) {
          return false;
        }
      }
      // Filter by download state
      if (!showDownloaded && episode.downloadState === DownloadState.Downloaded)
        return false;
      return true;
    });
    // Sort by date
    if (isAscending) {
      return filtered.toReversed();
    }
    return filtered;
  }, [episodeData, searchTerm, isAscending, showDownloaded]);

  const episodesToDisplay = useMemo(() => {
    const handleUpdateDownloadState = (id: number, state: DownloadState) => {
      setEpisodeData((prev) => {
        const newData = [...prev];
        const indexToUpdate = prev.findIndex((episode) => episode.id === id);
        newData[indexToUpdate].downloadState = state;
        return newData;
      });
      if (state === 'downloaded' && user) {
        addDownloadedEpisode(podcastId, id.toString());
      }
    };

    return filteredEpisodes.map((episode) => {
      if (userPodcastInfo) {
        const isDownloaded = userPodcastInfo.downloaded_episodes.includes(
          episode.id.toString(),
        );
        if (isDownloaded) {
          episode.downloadState = DownloadState.Downloaded;
        }
      }
      return {
        episode,
        updateDownloadState: handleUpdateDownloadState,
      };
    });
  }, [
    filteredEpisodes,
    podcastId,
    user,
    addDownloadedEpisode,
    userPodcastInfo,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    isAscending,
    setIsAscending,
    showDownloaded,
    setShowDownloaded,
    episodesToDisplay,
    filteredEpisodes,
    loading,
  };
};
