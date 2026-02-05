'use client';
import { getPodcastV2 } from '@/lib/api/podcasts';
import { useQuery } from '@tanstack/react-query';

export const usePodcastV2 = (id: string) => {
  const { data, error } = useQuery({
    queryKey: ['podcast', id],
    queryFn: async ({ queryKey }: { queryKey: [string, string] }) => {
      const [, id] = queryKey;
      const podcast = await getPodcastV2(id);
      return podcast;
    },
    staleTime: 60 * 60 * 1000, // Cache results for 1 hour
  });

  return { data, error };
};

export const usePodcastsV2 = (ids: string[]) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['podcasts', ids],
    queryFn: async ({ queryKey }: { queryKey: [string, string[]] }) => {
      const [, ids] = queryKey;
      const podcasts = await Promise.all(ids.map((id) => getPodcastV2(id)));
      return podcasts;
    },
    staleTime: 60 * 60 * 1000, // Cache results for 1 hour
  });

  return { data, error, isLoading };
};
