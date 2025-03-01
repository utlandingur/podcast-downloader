"use client";
import { lookupPodcastV2 } from "@/serverActions/lookupPodcast";
import { useQuery } from "@tanstack/react-query";

export const usePodcastV2 = (id: string) => {
  const { data, error } = useQuery({
    queryKey: ["podcast", id],
    queryFn: async ({ queryKey }: { queryKey: [string, string] }) => {
      const [, id] = queryKey;
      const podcast = await lookupPodcastV2(id);
      return podcast;
    },
    staleTime: 60 * 60 * 1000, // Cache results for 1 hour
  });

  return { data, error };
};
