"use client";
import { lookupPodcasts } from "@/serverActions/lookupPodcasts";
import { SearchBar } from "./searchBar";
import { SearchResult } from "./ui/searchResults";

const podcastSearch = async (searchTerm: string): Promise<SearchResult[]> => {
  if (!searchTerm) return [];
  const podcasts = await lookupPodcasts(searchTerm, 6);
  return podcasts.map((podcast) => ({
    name: podcast.name,
    label: podcast.name,
    image: podcast.artwork[100],
    handleOnClick: () => console.log("clicked", podcast),
  }));
};

export const PodcastSearchBar = () => {
  return <SearchBar searchQuery={podcastSearch} />;
};
