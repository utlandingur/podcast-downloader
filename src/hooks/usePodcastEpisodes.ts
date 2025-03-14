'use client';
import { lookupPodcastEpisodes } from '@/serverActions/lookupPodcastEpisodes';
import { PodcastEpisodeV2 } from '@/types/podcasts';

import { useQuery } from '@tanstack/react-query';

const fetchEpisodes = async (podcastId: string) => {
  const res = await fetch(`/api/episodes?id=${podcastId}`);

  if (!res.ok) {
    console.error('Failed to fetch episodes');
    return;
  }
  const data = (await res.json()) as PodcastEpisodeV2[];
  return data;
};

export const usePodcastEpisodes = (id: string) => {
  const { data, error } = useQuery({
    queryKey: ['podcastEpisodes', id],
    queryFn: async ({ queryKey }: { queryKey: [string, string] }) => {
      const [, id] = queryKey;
      const episodes = await lookupPodcastEpisodes(id);
      if (!episodes || episodes.length === 1) return [];
      return episodes.slice(1); // Remove the first episode, which is the podcast itself
    },
    staleTime: 60 * 60 * 1000, // Cache results for 1 hour
  });

  return { data, error };
};

export const usePodcastEpisodesV2 = (id: string) => {
  const { data, error } = useQuery({
    queryKey: ['podcastEpisodes', id],
    queryFn: async ({ queryKey }: { queryKey: [string, string] }) => {
      const [, id] = queryKey;
      const episodes = await fetchEpisodes(id);
      return episodes;
    },
    staleTime: 60 * 60 * 1000, // Cache results for 1 hour
  });

  return { data, error, loading: !data && !error };
};
