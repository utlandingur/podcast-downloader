"use client";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/searchBar";
import { usePageLoad } from "@/providers/pageLoadProvider";
import type { SearchResult } from "@/components/searchBar";
import { lookupPodcastsV2 } from "@/serverActions/lookupPodcasts";
import { PodcastsSearchResponseV2 } from "@/types/podcasts";

export const PodcastSearchBar = () => {
  const router = useRouter();
  const { startLoading } = usePageLoad();

  const podcastSearch = async (searchTerm: string): Promise<SearchResult[]> => {
    if (!searchTerm) return [];
    const podcasts = await lookupPodcastsV2(searchTerm, 6);
    return podcasts.map((podcast: PodcastsSearchResponseV2) => ({
      name: podcast.title,
      label: podcast.title,
      image: podcast.image,
      handleOnClick: () => {
        startLoading();
        router.push(`/podcasts/v2/${JSON.stringify(podcast.id)}`);
      },
    }));
  };

  return <SearchBar searchQuery={podcastSearch} />;
};
