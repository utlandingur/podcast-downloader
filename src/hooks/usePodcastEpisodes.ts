"use client";
import { lookupPodcastEpisodes } from "@/serverActions/looksPodcastEpisodes";
import { lookupPodcastEpisodesV2 } from "@/utils/lookupPodcastEpisodes";
import { useQuery } from "@tanstack/react-query";

export const usePodcastEpisodes = (id: string) => {
  const { data, error } = useQuery({
    queryKey: ["podcastEpisodes", id],
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
    queryKey: ["podcastEpisodes", id],
    queryFn: async ({ queryKey }: { queryKey: [string, string] }) => {
      const [, id] = queryKey;
      const episodes = await lookupPodcastEpisodesV2(id);
      return episodes;
    },
    staleTime: 60 * 60 * 1000, // Cache results for 1 hour
  });

  return { data, error };
};
