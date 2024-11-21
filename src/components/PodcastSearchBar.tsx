"use client";
import { lookupPodcasts } from "@/serverActions/lookupPodcasts";
import { SearchBar } from "./searchBar";
import { SearchResult } from "./ui/searchResults";
import { useRouter } from "next/navigation";

export const PodcastSearchBar = () => {
  const router = useRouter();

  const podcastSearch = async (searchTerm: string): Promise<SearchResult[]> => {
    if (!searchTerm) return [];
    const podcasts = await lookupPodcasts(searchTerm, 6);
    return podcasts.map((podcast) => ({
      name: podcast.collectionName,
      label: podcast.collectionName,
      image: podcast.artworkUrl100,
      handleOnClick: () =>
        router.push(`/podcasts/${JSON.stringify(podcast.collectionId)}`),
    }));
  };

  return <SearchBar searchQuery={podcastSearch} />;
};
