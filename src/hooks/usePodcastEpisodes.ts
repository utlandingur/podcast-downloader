"use client";
import { lookupPodcastEpisodes } from "@/serverActions/looksPodcastEpisodes";
import { useQuery } from "@tanstack/react-query";

export const usePodcastEpisodes = (id: string) => {
  const { data, error } = useQuery({
    queryKey: ["podcastEpisodes", id],
    queryFn: async ({ queryKey }: { queryKey: [string, string] }) => {
      const [, id] = queryKey;
      const episodes = await lookupPodcastEpisodes(id);
      return episodes;
    },
    staleTime: 60 * 60 * 1000, // Cache results for 1 hour
  });

  return { data, error };
};
