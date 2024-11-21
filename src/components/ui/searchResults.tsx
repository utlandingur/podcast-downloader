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

  const SearchResult = ({
    result,
    isFocused,
    onFocus,
    onClick,
  }: SearchResultProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (isFocused && buttonRef.current) {
        buttonRef.current.focus();
      }
    }, [isFocused]);

    return (
      <button
        tabIndex={0}
        className={cn(
          "grid grid-cols-[100px_auto] gap-2 hover:bg-slate-100 items-center"
        )}
        onFocus={onFocus}
        ref={buttonRef}
        onClick={onClick}
        aria-label={`Select ${result.name}`}
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
    );
  };

  const Results = () => {
    return searchResults.length > 0
      ? searchResults.map((result, index) => (
          <SearchResult
            key={index}
            result={result}
            isFocused={focusedIndex === index}
            onFocus={() => setFocusedIndex(index)}
            onClick={() => result.handleOnClick?.()}
          />
        ))
      : " No results found";
  };

  // Handle keydown events for arrow navigation and Enter to "click"
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      setFocusedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (event.key === "ArrowUp") {
      setFocusedIndex((prev) => Math.max(0, prev - 1));
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchResults]);

  if (isLoading)
    return (
      <div className={cn("justify-self-center")}>
        <LoadingSpinner />
      </div>
    );

  return <Results />;
};

type SearchResultProps = {
  result: SearchResult;
  isFocused: boolean; // Add isFocused prop to determine if this result is focused
  onFocus: () => void; // Function to update focus
  onClick: () => void; // Handle click event
};
