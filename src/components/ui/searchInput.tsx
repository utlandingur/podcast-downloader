import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { forwardRef } from "react";
import { SearchResult } from "./searchResults";

type SearchInputProps = {
  searchTerm: string;
  setSearchTerm: (string: string) => void;
  handleSearch?: React.MouseEventHandler<HTMLButtonElement>;
  searchResults: SearchResult[];
  width?: string;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { searchTerm, setSearchTerm, handleSearch, width = "w-72 sm:w-96" },
    ref
  ) => {
    return (
      <>
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
      </>
    );
  }
);

SearchInput.displayName = "SearchBar";

export { SearchInput };
