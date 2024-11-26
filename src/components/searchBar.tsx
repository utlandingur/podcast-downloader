"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchInput } from "./ui/searchInput";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { useTheme } from "next-themes";
import { ClassValue } from "clsx";

export type SearchResult = {
  name: string;
  label: string;
  image?: string;
  handleOnClick?: () => void;
};

type SearchBarProps = {
  searchQuery: (searchTerm: string) => Promise<SearchResult[]>;
  staleTime?: number;
  enabled?: boolean;
  queryKey?: string[];
  width?: string;
};

export const SearchBar = ({
  enabled = true,
  searchQuery,
  width = "w-72 sm:w-96",
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultContainer = useRef<HTMLDivElement | null>(null);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["search", searchTerm],
    enabled: searchTerm.length > 0 && enabled,
    queryFn: async ({ queryKey }: { queryKey: [string, string] }) => {
      const [, searchTerm] = queryKey;
      return await searchQuery(searchTerm);
    },
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
  });

  useEffect(() => {
    if (!resultContainer.current) return;
    resultContainer.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [focusedIndex]);

  const handleNewSearchTerm = useCallback((newSearchTerm: string): void => {
    setSearchTerm(newSearchTerm);
    if (newSearchTerm === "" || !newSearchTerm) setShowPopover(false);
    else setShowPopover(true);
  }, []);

  // Handle keydown events for arrow navigation and Enter to "click"
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    let nextIndexCount = focusedIndex;

    if (key === "ArrowDown") {
      event.preventDefault();
      nextIndexCount = (focusedIndex + 1) % searchResults.length;
    }

    if (key === "ArrowUp") {
      event.preventDefault();
      nextIndexCount =
        (focusedIndex - 1 + searchResults.length) % searchResults.length;
    }

    if (key === "Escape") {
      setShowPopover(false);
    }

    if (key === "Enter" && focusedIndex !== -1) {
      setShowPopover(false);
      searchResults[focusedIndex].handleOnClick?.();
    }

    setFocusedIndex(nextIndexCount);
  };

  const Results = () => {
    const { systemTheme } = useTheme();
    const hoverStyles: ClassValue =
      systemTheme === "dark" ? "hover:bg-slate-600" : "hover:bg-slate-100";
    const focusStyles: ClassValue =
      systemTheme === "dark" ? "bg-slate-800" : "bg-slate-200";

    return searchResults.length > 0
      ? searchResults.map((result, index) => (
          <div
            tabIndex={0}
            className={cn(
              `grid grid-cols-[100px_auto] gap-2 items-center cursor-pointer ${
                focusedIndex === index ? focusStyles : ""
              } hover:bg-red ${hoverStyles}`
            )}
            ref={index === focusedIndex ? resultContainer : null}
            onClick={() => {
              setShowPopover(false);
              result.handleOnClick?.();
            }}
            aria-label={`Select ${result.name}`}
            key={index}
          >
            {result.image && (
              <img
                key={result.image}
                src={result.image}
                tabIndex={-1}
                alt={`Image for podcast ${result.name}`}
                width={100}
                height={100}
                className={cn("rounded-md")}
                loading="lazy"
              />
            )}

            <div tabIndex={-1} className={cn("w-full")}>
              {result.label}
            </div>
          </div>
        ))
      : " No results found";
  };

  return (
    <div className={cn("flex gap-8 flex-col items-center")}>
      <div
        className="flex w-full justify-center gap-2"
        onKeyDown={handleKeyDown}
      >
        <Popover open={showPopover}>
          <PopoverTrigger asChild aria-label="Searchbar input">
            <div className={cn(`flex gap-4 ${width}`)}>
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={handleNewSearchTerm}
                searchResults={searchResults}
                ref={inputRef}
              />
            </div>
          </PopoverTrigger>
          {showPopover && (
            <PopoverContent
              side="bottom"
              sideOffset={4}
              className={cn(
                `p-0 max-h-72 sm:max-h-96 overflow-hidden overflow-y-auto ${width}`
              )}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="grid gap-2 p-2">
                {isLoading ? (
                  <div className={cn("justify-self-center")}>
                    <LoadingSpinner />
                  </div>
                ) : (
                  <Results />
                )}
              </div>
            </PopoverContent>
          )}
        </Popover>
      </div>

      <a
        href="https://www.buymeacoffee.com/utlandingur"
        role="button"
        aria-label="Buy me a coffee"
      >
        <img
          src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=utlandingur&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff"
          className={cn("h-9")}
          alt="Buy me a coffee button"
        />
      </a>
    </div>
  );
};
