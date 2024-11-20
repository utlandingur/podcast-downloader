import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { forwardRef } from "react";
import Image from "next/image";
import { LoadingSpinner } from "./loadingSpinner";

export type SearchResult = {
  name: string;
  label: string;
  image?: string;
  handleOnClick?: () => void;
};

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (string: string) => void;
  handleSearch?: React.MouseEventHandler<HTMLButtonElement>;
  searchResults: SearchResult[];
  isLoading?: boolean;
  width?: string;
  showPopover: boolean;
};

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      searchTerm,
      setSearchTerm,
      handleSearch,
      searchResults,
      isLoading,
      width = "w-72 sm:w-96",
      showPopover,
    },
    ref
  ) => {
    const Results = () =>
      searchResults.length > 0
        ? searchResults.map((result) => (
            <div
              key={result.image}
              tabIndex={0}
              className={cn("flex gap-2 hover:bg-slate-100")}
              onClick={result.handleOnClick}
            >
              {result.image && (
                <Image
                  src={result.image}
                  tabIndex={-1}
                  alt={`Image for podcast ${result.name}`}
                  width={100}
                  height={100}
                />
              )}

              <div tabIndex={-1} className={cn("w-full")}>
                {result.label}
              </div>
            </div>
          ))
        : " No results found";

    return (
      <div className="flex w-full justify-center gap-2">
        <Popover open={showPopover}>
          <PopoverTrigger asChild>
            <div className={cn(`flex gap-4 ${width}`)}>
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("self-center")}
                ref={ref}
                aria-label="Search"
              />
              {handleSearch && <Button onClick={handleSearch}>Search</Button>}
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
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
