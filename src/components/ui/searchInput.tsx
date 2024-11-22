import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { forwardRef } from "react";
import { SearchResult } from "./searchResults";

type SearchInputProps = {
  searchTerm: string;
  setSearchTerm: (string: string) => void;
  handleSearch?: React.MouseEventHandler<HTMLButtonElement>;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ searchTerm, setSearchTerm, handleSearch, ...props }, ref) => {
    return (
      <>
        <Input
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn("self-center")}
          ref={ref}
          {...props}
        />
        {handleSearch && <Button onClick={handleSearch}>Search</Button>}
      </>
    );
  }
);

SearchInput.displayName = "SearchBar";

export { SearchInput };
