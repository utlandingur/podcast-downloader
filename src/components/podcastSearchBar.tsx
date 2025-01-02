"use client";
import { lookupPodcastsV2 } from "@/utils/lookupPodcasts";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/searchBar";
import { usePageLoad } from "@/providers/pageLoadProvider";
import type { SearchResult } from "@/components/searchBar";

export const PodcastSearchBar = () => {
  const router = useRouter();
  const { startLoading } = usePageLoad();

  const podcastSearch = async (searchTerm: string): Promise<SearchResult[]> => {
    if (!searchTerm) return [];
    const podcasts = await lookupPodcastsV2(searchTerm, 6);
    return podcasts.map((podcast) => ({
      name: podcast.title,
      label: podcast.title,
      image: podcast.podcastImageUrl,
      handleOnClick: () => {
        startLoading();
        router.push(`/podcasts/v2/${JSON.stringify(podcast.id)}`);
      },
    }));
  };

  return <SearchBar searchQuery={podcastSearch} />;
};
