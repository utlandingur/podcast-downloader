import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./loadingSpinner";
import { PopoverContent } from "./popover";
import Image from "next/image";

export type SearchResult = {
  name: string;
  label: string;
  image?: string;
  handleOnClick?: () => void;
};

type SearchResultsProps = {
  isLoading: boolean;
  searchResults: SearchResult[];
  width?: string;
};

export const SearchResults = ({
  isLoading,
  searchResults,
  width = "w-72 sm:w-96",
}: SearchResultsProps) => {
  const Results = () =>
    searchResults.length > 0
      ? searchResults.map((result) => (
          <SearchResult key={result.name} result={result} />
        ))
      : " No results found";

  return (
    <PopoverContent
      side="bottom"
      sideOffset={4}
      className={cn(
        `p-0 max-h-72 sm:max-h-96 overflow-hidden overflow-y-auto ${width}`
      )}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <div className="grid gap-2 p-2">
        {isLoading ? (
          <div className={cn("justify-self-center")}>
            <LoadingSpinner />
          </div>
        ) : (
          <Results />
        )}
      </div>
    </PopoverContent>
  );
};

type SearchResultProps = {
  result: SearchResult;
};

const SearchResult = ({ result }: SearchResultProps) => {
  return (
    <div
      key={result.image}
      tabIndex={0}
      className={cn(
        "grid grid-cols-[100px_auto] gap-2 hover:bg-slate-100 items-center"
      )}
      onClick={result.handleOnClick}
    >
      {result.image && (
        <Image
          src={result.image}
          tabIndex={-1}
          alt={`Image for podcast ${result.name}`}
          width={100}
          height={100}
          className={cn("rounded-md")}
        />
      )}

      <div tabIndex={-1} className={cn("w-full")}>
        {result.label}
      </div>
    </div>
  );
};
