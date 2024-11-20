import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverTrigger } from "./popover";
import { forwardRef } from "react";
import { SearchResult, SearchResults } from "./searchResults";

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
            <SearchResults
              isLoading={isLoading ? true : false}
              searchResults={searchResults}
            />
          )}
        </Popover>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
