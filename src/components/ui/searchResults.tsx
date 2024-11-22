import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./loadingSpinner";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export type SearchResult = {
  name: string;
  label: string;
  image?: string;
  handleOnClick?: () => void;
};

type SearchResultsProps = {
  isLoading: boolean;
  searchResults: SearchResult[];
};

export const SearchResults = ({
  isLoading,
  searchResults,
}: SearchResultsProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const resultContainer = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!resultContainer.current) return;
    // resultContainer.current.focus();
    resultContainer.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [focusedIndex]);

  const Results = () => {
    return searchResults.length > 0
      ? searchResults.map((result, index) => (
          <button
            tabIndex={0}
            className={cn(
              "grid grid-cols-[100px_auto] gap-2 hover:bg-slate-100 items-center cursor-pointer"
            )}
            ref={index === focusedIndex ? resultContainer : null}
            onClick={result.handleOnClick}
            aria-label={`Select ${result.name}`}
            key={index}
          >
            {result.image && (
              <Image
                src={result.image}
                tabIndex={-1}
                alt={`Image for podcast ${result.name}`}
                width={100}
                height={100}
                className={cn("rounded-md")}
              />
            )}

            <div tabIndex={-1} className={cn("w-full")}>
              {result.label}
            </div>
          </button>
        ))
      : " No results found";
  };

  // Handle keydown events for arrow navigation and Enter to "click"
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    let nextIndexCount = 0;
    if (key === "ArrowDown") {
      nextIndexCount = (focusedIndex + 1) % (searchResults.length - 1);
    }
    if (key === "ArrowUp") {
      nextIndexCount = (focusedIndex - 1) % (searchResults.length - 1);
    }
    if (key === "Enter") {
      searchResults[focusedIndex].handleOnClick?.();
    }
    setFocusedIndex(nextIndexCount);
  };

  if (isLoading)
    return (
      <div className={cn("justify-self-center")}>
        <LoadingSpinner />
      </div>
    );

  return (
    <div onKeyDown={handleKeyDown}>
      <Results />
    </div>
  );
};
