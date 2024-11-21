"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchInput as UI } from "./ui/searchInput";
import { useQuery } from "@tanstack/react-query";
import { SearchResult, SearchResults } from "./ui/searchResults";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  searchQuery: (searchTerm: string) => Promise<SearchResult[]>;
  staleTime?: number;
  enabled?: boolean;
  queryKey?: string[];
};

const WIDTH = "w-72 sm:w-96";

export const SearchBar = ({ enabled = true, searchQuery }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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
      if (resultsRef.current?.contains(document.activeElement)) {
        console.log("resultsRef.current", resultsRef.current);
        inputRef?.current?.focus();
      }
      setShowPopover(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleOnChange = useCallback((newSearchTerm: string): void => {
    setSearchTerm(newSearchTerm);
    if (newSearchTerm === "" || !newSearchTerm) setShowPopover(false);
    else setShowPopover(true);
  }, []);

  return (
    <div className="flex w-full justify-center gap-2">
      <Popover open={showPopover}>
        <PopoverTrigger asChild>
          <div className={cn(`flex gap-4 ${WIDTH}`)}>
            <UI
              searchTerm={searchTerm}
              setSearchTerm={handleOnChange}
              searchResults={searchResults}
              ref={inputRef}
              width={WIDTH}
            />
          </div>
        </PopoverTrigger>
        {showPopover && (
          <PopoverContent
            side="bottom"
            sideOffset={4}
            className={cn(
              `p-0 max-h-72 sm:max-h-96 overflow-hidden overflow-y-auto ${WIDTH}`
            )}
            onOpenAutoFocus={(e) => e.preventDefault()}
            ref={resultsRef}
          >
            <div className="grid gap-2 p-2">
              <SearchResults
                isLoading={isLoading ? true : false}
                searchResults={searchResults}
              />
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
};
