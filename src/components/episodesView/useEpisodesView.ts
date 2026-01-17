'use client';
import { DownloadState } from '@/components/downloadPodcastButton';
import { PodcastEpisodeV2 } from '@/types/podcasts';
import { useState, useMemo, useEffect } from 'react';
import { useUserStore } from '@/hooks/useUserStore';
import { getUserPodcastInfo } from '@/lib/getUserPodcastInfo';
import { usePodcastEpisodesV2 } from '@/hooks/usePodcastEpisodes';

export const useEpisodesView = (podcastId: string) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAscending, setIsAscending] = useState(false);
  const [showDownloaded, setShowDownloaded] = useState(true);
  const [episodeData, setEpisodeData] = useState<PodcastEpisodeV2[]>([]);
  const { user, addDownloadedEpisode } = useUserStore((state) => state);
  const [isLoading, setIsLoading] = useState(true);

  const { data, loading } = usePodcastEpisodesV2(podcastId);

  useEffect(() => {
    if (loading !== undefined) setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (data) {
      setEpisodeData(data);
    }
  }, [data]);

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
      if (!showDownloaded && 
          (episode.downloadState === DownloadState.Downloaded || 
           episode.downloadState === DownloadState.PreviouslyDownloaded))
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
        if (indexToUpdate !== -1) {
          newData[indexToUpdate].downloadState = state;
        }
        return newData;
      });
      
      // Persist download to database when state becomes 'downloaded'
      if (state === DownloadState.Downloaded && user) {
        addDownloadedEpisode(podcastId, id.toString());
      }
    };

    return filteredEpisodes.map((episode) => {
      if (userPodcastInfo) {
        const isDownloaded = userPodcastInfo.downloaded_episodes.includes(
          episode.id.toString(),
        );
        if (isDownloaded) {
          episode.downloadState = DownloadState.PreviouslyDownloaded;
        }
      }
      return {
        episode,
        updateDownloadState: handleUpdateDownloadState,
        podcastId,
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
    isLoading,
  };
};
