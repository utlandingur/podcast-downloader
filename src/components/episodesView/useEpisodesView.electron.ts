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
  const [localDownloadedIds, setLocalDownloadedIds] = useState<string[]>([]);

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `podcast-downloads:${podcastId}`;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        setLocalDownloadedIds([]);
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setLocalDownloadedIds(parsed.map((id) => id.toString()));
      } else {
        setLocalDownloadedIds([]);
      }
    } catch {
      setLocalDownloadedIds([]);
    }
  }, [podcastId]);

  const filteredEpisodes = useMemo(() => {
    const downloadedIds = new Set([
      ...(userPodcastInfo?.downloaded_episodes ?? []),
      ...localDownloadedIds,
    ]);
    const filtered = (episodeData || []).filter((episode) => {
      if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, 'i');
        if (!searchRegex.test(episode.title)) {
          return false;
        }
      }
      const isDownloaded =
        episode.downloadState === DownloadState.Downloaded ||
        downloadedIds.has(episode.id.toString());
      if (!showDownloaded && isDownloaded) {
        return false;
      }
      return true;
    });
    if (isAscending) {
      return filtered.toReversed();
    }
    return filtered;
  }, [
    episodeData,
    searchTerm,
    isAscending,
    showDownloaded,
    userPodcastInfo,
    localDownloadedIds,
  ]);

  const episodesToDisplay = useMemo(() => {
    const handleUpdateDownloadState = (id: number, state: DownloadState) => {
      setEpisodeData((prev) => {
        const newData = [...prev];
        const indexToUpdate = prev.findIndex((episode) => episode.id === id);
        if (indexToUpdate === -1) return prev;
        newData[indexToUpdate].downloadState = state;
        return newData;
      });
      if (state === 'downloaded') {
        if (typeof window !== 'undefined') {
          const key = `podcast-downloads:${podcastId}`;
          setLocalDownloadedIds((prev) => {
            const next = Array.from(new Set([...prev, id.toString()]));
            window.localStorage.setItem(key, JSON.stringify(next));
            return next;
          });
        }
        if (user) {
          void addDownloadedEpisode(podcastId, id.toString());
        }
      }
    };

    return filteredEpisodes.map((episode) => {
      const isDownloaded = userPodcastInfo
        ? userPodcastInfo.downloaded_episodes.includes(episode.id.toString())
        : localDownloadedIds.includes(episode.id.toString());
      if (isDownloaded) {
        episode.downloadState = DownloadState.Downloaded;
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
    localDownloadedIds,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    isAscending,
    setIsAscending,
    showDownloaded,
    setShowDownloaded,
    totalEpisodes: episodeData.length,
    episodesToDisplay,
    filteredEpisodes,
    isLoading,
  };
};
