import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { forwardRef } from "react";

export type SearchResult = {
  value: string;
  label: string;
  image?: string;
  handleOnClick?: () => void;
};

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: React.MouseEventHandler<HTMLButtonElement>;
  searchResults: SearchResult[];
  showSearchResults: boolean;
};

const WIDTH = "w-72 sm:w-96";

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
      <div
        key={result.image}
        tabIndex={0}
        className={cn("flex gap-2 hover:bg-slate-100")}
        onClick={result.handleOnClick}
      >
        <img tabIndex={-1} src={result.image} />
        <div tabIndex={-1}>{result.label}</div>
      </div>
    ));

    return (
      <div className="flex w-full justify-center gap-2">
        <Popover open={showSearchResults}>
          <PopoverTrigger asChild>
            <div className={cn(`flex gap-4 ${WIDTH}`)}>
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("self-center")}
                ref={ref}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            sideOffset={4}
            className={cn(
              `p-0 max-h-72 sm:max-h-96 overflow-hidden overflow-y-auto ${WIDTH}`
            )}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="grid gap-2 p-2">
              {searchResults.length > 0 ? Results : "No results found"}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
