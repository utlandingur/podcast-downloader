"use client";
import { lookupPodcasts } from "@/serverActions/lookupPodcasts";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/searchBar";
import { usePageLoad } from "@/providers/pageLoadProvider";
import type { SearchResult } from "@/components/searchBar";

export const PodcastSearchBar = () => {
  const router = useRouter();
  const { startLoading } = usePageLoad();

  const podcastSearch = async (searchTerm: string): Promise<SearchResult[]> => {
    if (!searchTerm) return [];
    const podcasts = await lookupPodcasts(searchTerm, 6);
    return podcasts.map((podcast) => ({
      name: podcast.collectionName,
      label: podcast.collectionName,
      image: podcast.artworkUrl100,
      handleOnClick: () => {
        startLoading();
        router.push(`/podcasts/${JSON.stringify(podcast.collectionId)}`);
      },
    }));
  };

  return <SearchBar searchQuery={podcastSearch} />;
};
