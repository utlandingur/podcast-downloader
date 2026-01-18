import { cn } from '@/lib/utils';
import { DebouncedInput } from './input';
import { forwardRef } from 'react';
import { SearchResult } from '../searchBar';

type SearchInputProps = {
  searchTerm: string;
  setSearchTerm: (string: string) => void;
  searchResults: SearchResult[];
  autoFocus?: boolean;
  className?: string;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ searchTerm, setSearchTerm, className, autoFocus }, ref) => {
    return (
      <DebouncedInput
        type="search"
        placeholder="Podcast title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={cn(
          'self-center placeholder:text-lg md:placeholder:text-2xl py-0',
          className,
        )}
        autoFocus={autoFocus}
        ref={ref}
      />
    );
  },
);

SearchInput.displayName = 'SearchBar';

export { SearchInput };
