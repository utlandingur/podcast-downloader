import { cn } from '@/lib/utils';
import { Input } from './input';
import { forwardRef } from 'react';

type SearchInputProps = React.ComponentPropsWithoutRef<'input'>;

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      type = 'search',
      placeholder = 'Podcast title',
      ...props
    },
    ref,
  ) => {
    return (
      <Input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={cn(
          'self-center border-2 border-muted-foreground/40 py-0 text-lg leading-none placeholder:text-base sm:placeholder:text-lg focus-visible:border-primary/60',
          className,
        )}
        {...props}
      />
    );
  },
);

SearchInput.displayName = 'SearchBar';

export { SearchInput };
