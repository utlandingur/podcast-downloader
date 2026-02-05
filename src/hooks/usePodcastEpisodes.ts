'use client';
import { useQuery } from '@tanstack/react-query';
import { getPodcastEpisodesV1, getPodcastEpisodesV2 } from '@/lib/api/podcasts';

export const usePodcastEpisodes = (id: string) => {
  const { data, error } = useQuery({
    queryKey: ['podcastEpisodes', id],
    queryFn: async ({ queryKey }: { queryKey: [string, string] }) => {
      const [, id] = queryKey;
      const episodes = await getPodcastEpisodesV1(id);
      return episodes;
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
      const episodes = await getPodcastEpisodesV2(id);
      return episodes;
    },
    staleTime: 60 * 60 * 1000, // Cache results for 1 hour
  });

  return { data, error, loading: !data && !error };
};
