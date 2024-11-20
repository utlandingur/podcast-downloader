"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchBar as UI } from "./ui/searchBar";
import { lookupPodcasts } from "@/serverActions/lookupPodcasts";
import { useQuery } from "@tanstack/react-query";

export const PodcastSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const podcasts = await lookupPodcasts(searchTerm, 6);
      return podcasts.map((podcast) => ({
        name: podcast.name,
        label: podcast.name,
        image: podcast.artwork[100],
        handleOnClick: () => console.log("clicked", podcast),
      }));
    },
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
  });

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setShowPopover(false);
    }
  };

  const handleOnChange = useCallback((searchTerm: string): void => {
    setSearchTerm(searchTerm);
    if (searchTerm === "") setShowPopover(false);
    else setShowPopover(true);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <UI
      searchTerm={searchTerm}
      setSearchTerm={handleOnChange}
      searchResults={searchResults}
      ref={inputRef}
      isLoading={isLoading}
      showPopover={showPopover}
    />
  );
};
