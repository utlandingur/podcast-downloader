"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchBar as UI } from "./ui/searchBar";
import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "./ui/searchResults";

type SearchBarProps = {
  searchQuery: (searchTerm: string) => Promise<SearchResult[]>;
  staleTime?: number;
  enabled?: boolean;
  queryKey?: string[];
};

export const SearchBar = ({ enabled = true, searchQuery }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["search", searchTerm],
    enabled: searchTerm.length > 0 && enabled,
    queryFn: async ({ queryKey }: { queryKey: [string, string] }) => {
      const [, searchTerm] = queryKey;
      return await searchQuery(searchTerm);
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
    setShowPopover(searchTerm !== "");
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
