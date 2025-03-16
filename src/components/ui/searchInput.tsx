import { cn } from '@/lib/utils';
import { Button } from './button';
import { DebouncedInput } from './input';
import { forwardRef } from 'react';
import { SearchResult } from '../searchBar';

type SearchInputProps = {
  searchTerm: string;
  setSearchTerm: (string: string) => void;
  handleSearch?: React.MouseEventHandler<HTMLButtonElement>;
  searchResults: SearchResult[];
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ searchTerm, setSearchTerm, handleSearch }, ref) => {
    return (
      <>
        <DebouncedInput
          type="search"
          placeholder="Enter name of the podcast here."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn('self-center border-accent-foreground')}
          ref={ref}
        />
        {handleSearch && <Button onClick={handleSearch}>Search</Button>}
      </>
    );
  },
);

SearchInput.displayName = 'SearchBar';

export { SearchInput };
