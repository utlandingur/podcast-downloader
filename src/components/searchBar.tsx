'use client';

import { useEffect, useRef, useState } from 'react';
import { useCombobox } from 'downshift';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { CoffeeButton } from './coffeeButton';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { SearchInput } from './ui/searchInput';

export type SearchResult = {
  name: string;
  label: string;
  image?: string;
  handleOnClick?: () => void;
};

type SearchBarProps = {
  searchQuery: (searchTerm: string) => Promise<SearchResult[]>;
  showCoffee?: boolean;
  staleTime?: number;
  enabled?: boolean;
  queryKey?: string[];
  width?: string;
  autoFocus?: boolean;
  showButton?: boolean;
  inputClassName?: string;
  buttonClassName?: string;
};

const SEARCH_DEBOUNCE_MS = 350;

export const SearchBar = ({
  showCoffee,
  enabled = true,
  searchQuery,
  width = 'w-72 sm:w-96',
  autoFocus,
  showButton,
  inputClassName,
  buttonClassName,
  staleTime = 5 * 60 * 1000,
  queryKey,
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(inputValue.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: queryKey
      ? [...queryKey, debouncedValue]
      : ['search', debouncedValue],
    enabled: debouncedValue.length > 0 && enabled,
    queryFn: async ({ queryKey }) => {
      const searchTerm = queryKey[queryKey.length - 1] as string;
      return await searchQuery(searchTerm);
    },
    staleTime,
  });

  const {
    isOpen,
    highlightedIndex,
    getMenuProps,
    getInputProps,
    getItemProps,
    openMenu,
  } = useCombobox({
    items: searchResults,
    inputValue,
    itemToString: (item) => item?.label ?? '',
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue ?? '');
    },
    onSelectedItemChange: ({ selectedItem }) => {
      selectedItem?.handleOnClick?.();
    },
  });

  const showMenu = isOpen && inputValue.trim().length > 0;


  return (
    <div className={cn('flex flex-col items-center gap-8')}>
      <div className="flex w-full justify-center gap-2">
        <div
          className={cn(`relative flex gap-4 ${width}`)}
        >
          <SearchInput
            {...getInputProps({
              ref: inputRef,
              autoFocus,
              onFocus: () => {
                if (inputValue.trim().length > 0) openMenu();
              },
              onClick: () => {
                if (inputValue.trim().length > 0) openMenu();
              },
              name: 'search',
              'aria-label': 'Search podcasts',
            })}
            className={inputClassName}
          />
          {showButton && (
            <Button
              className={cn('font-bold', buttonClassName)}
              onClick={() => {
                inputRef.current?.focus();
                openMenu();
              }}
            >
              Search
            </Button>
          )}

          <ul
            {...getMenuProps()}
            className={cn(
              'absolute left-0 top-full z-20 mt-2 max-h-72 w-full overflow-hidden overflow-y-auto rounded-md border border-border/70 bg-card/95 p-2 shadow-xl backdrop-blur sm:max-h-96',
              !showMenu && 'hidden',
            )}
          >
            {showMenu && (
              <>
                {isLoading && (
                  <li className="flex justify-center p-3">
                    <LoadingSpinner />
                  </li>
                )}
                {!isLoading && searchResults.length === 0 && (
                  <li className="p-3 text-sm text-muted-foreground">
                    No results found.
                  </li>
                )}
                {!isLoading &&
                  searchResults.map((result, index) => (
                    <li
                      key={`${result.name}-${index}`}
                      className={cn(
                        'grid grid-cols-[64px_auto] items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
                        highlightedIndex === index &&
                          'bg-accent text-accent-foreground',
                      )}
                      {...getItemProps({ item: result, index })}
                    >
                      {result.image && (
                        <Image
                          src={result.image}
                          alt={`Image for podcast ${result.name}`}
                          width={64}
                          height={64}
                          className={cn('rounded-md')}
                          loading="lazy"
                        />
                      )}
                      <span className="truncate">{result.label}</span>
                    </li>
                  ))}
              </>
            )}
          </ul>
        </div>
      </div>
      {showCoffee && (
        <>
          <div className={cn('text-center')}>
            <p>
              If you love this site, please consider buying a coffee. It costs
              time and money to run this site.
            </p>
          </div>
          <CoffeeButton />
        </>
      )}
    </div>
  );
};
