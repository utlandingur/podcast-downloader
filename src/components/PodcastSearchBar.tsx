"use client";
import { useEffect, useRef, useState } from "react";
import { SearchBar as UI } from "./ui/searchBar";
import { lookupPodcasts } from "@/serverActions/lookupPodcasts";
import { useQuery } from "@tanstack/react-query";

type PodcastSearchBarProps = {};

export const PodcastSearchBar = ({}: PodcastSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults = [] } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const podcasts = await lookupPodcasts(searchTerm, 6);
      return podcasts.map((podcast) => ({
        value: podcast.name,
        label: podcast.name,
        image: podcast.artwork[100],
        handleOnClick: () => console.log("clicked", podcast),
      }));
    },
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
  });

  useEffect(() => {
    if (searchTerm) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  const handleSearch: React.MouseEventHandler<HTMLButtonElement> = () => {
    console.log("searching for", searchTerm);
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setShowSearchResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <UI
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleSearch={handleSearch}
      searchResults={searchResults}
      showSearchResults={showSearchResults}
      ref={inputRef}
    />
  );
};
