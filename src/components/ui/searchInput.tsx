import { cn } from '@/lib/utils';
import { DebouncedInput } from './input';
import { forwardRef } from 'react';
import { SearchResult } from '../searchBar';

type SearchInputProps = {
  searchTerm: string;
  setSearchTerm: (string: string) => void;
  searchResults: SearchResult[];
  autoFocus?: boolean;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ searchTerm, setSearchTerm }, ref) => {
    return (
      <DebouncedInput
        type="search"
        placeholder="Enter name of the podcast"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={cn('self-center border-accent-foreground border-')}
        ref={ref}
      />
    );
  },
);

SearchInput.displayName = 'SearchBar';

export { SearchInput };
