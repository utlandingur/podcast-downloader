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
  autoFocus?: boolean;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ searchTerm, setSearchTerm, handleSearch, autoFocus }, ref) => {
    return (
      <>
        <DebouncedInput
          type="search"
          placeholder='Enter name, such as "Joe Rogan"'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn('self-center border-accent-foreground')}
          ref={ref}
          autoFocus={autoFocus}
        />
        {handleSearch && <Button onClick={handleSearch}>Search</Button>}
      </>
    );
  },
);

SearchInput.displayName = 'SearchBar';

export { SearchInput };
