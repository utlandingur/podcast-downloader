// will make this generic once complete

"use client";
import { useEffect, useRef, useState } from "react";
import { SearchBar as UI } from "./ui/searchBar";

type PodcastSearchBarProps = {};

export const PodcastSearchBar = ({}: PodcastSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  const handleSearch: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    console.log("searching for", searchTerm);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  return (
    <UI
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleSearch={handleSearch}
      searchResults={searchTerm ? [{ value: "1", label: "1" }] : []}
      showSearchResults={showSearchResults}
      ref={inputRef}
    />
  );
};
