import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { forwardRef } from "react";

type SearchResult = {
  value: string;
  label: string;
};

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: React.MouseEventHandler<HTMLButtonElement>;
  searchResults: SearchResult[];
  showSearchResults: boolean;
};

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      searchTerm,
      setSearchTerm,
      handleSearch,
      searchResults,
      showSearchResults,
    },
    ref
  ) => {
    const Results = searchResults.map((result) => (
      <div key={result.label} tabIndex={0}>
        {result.label}
      </div>
    ));

    return (
      <div className="flex w-full justify-center space-x-2">
        <Popover open={showSearchResults}>
          <PopoverTrigger asChild>
            <Input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn("w-52 sm:w-96")}
              ref={ref}
            />
          </PopoverTrigger>
          <PopoverContent
            className={cn("w-52 sm:w-96 p-0")}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="grid gap-2 p-2">{Results}</div>
          </PopoverContent>
        </Popover>
        <Button onClick={handleSearch}>Search</Button>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
