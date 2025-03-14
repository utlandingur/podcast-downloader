'use client';
import { cn } from '@/lib/utils';
import { DebouncedInput } from '../ui/input';
import { EpisodeList, EpisodeListSkeleton } from '../episodeList/episodeList';
import { Toggle } from '@/components/toggle';
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import { useEpisodesView } from './useEpisodesView';
import { OptionsWrapper } from './optionsWraper';
import { ToggleFavourite } from './toggleFavourite';

type Props = {
  podcastName: string;
  podcastId: string;
  isLoggedIn: boolean;
};

export const EpisodesView = ({ podcastName, podcastId, isLoggedIn }: Props) => {
  const {
    searchTerm,
    setSearchTerm,
    isAscending,
    setIsAscending,
    showDownloaded,
    setShowDownloaded,
    filteredEpisodes,
    episodesToDisplay,
    isLoading,
  } = useEpisodesView(podcastId);

  return (
    <div className={cn('flex flex-col w-[98%] px-4 gap-4 max-w-[720px]')}>
      <div className={cn('grid gap-4 w-full grid-cols-[auto] items-center')}>
        {/* // Favourite or unfavourite podcast */}
        <ToggleFavourite podcastId={podcastId} isLoggedIn={isLoggedIn} />
        {/* // Toggle to sort episodes in ascending or descending order */}
        <OptionsWrapper title="Sort">
          <div className={cn('flex flex-col sm:flex-row gap-2')}>
            <Toggle
              onToggle={setIsAscending}
              disabled={isLoading}
              initialValue={isAscending}
              trueText={'Ascending'}
              falseText={'Descending'}
              label={'Sort Ascending'}
              trueIcon={<ArrowUpNarrowWide className="h-4 w-4" />}
              falseIcon={<ArrowDownNarrowWide className="h-4 w-4" />}
            />
          </div>
        </OptionsWrapper>
        {/* // Toggle to show or hide downloaded episodes */}
        <OptionsWrapper title="Filter">
          <Toggle
            disabled={isLoading}
            onToggle={setShowDownloaded}
            initialValue={showDownloaded}
            trueText={'Showing Downloaded'}
            falseText={'Hiding Downloaded'}
            label={'show or hide downloaded episodes'}
          />
        </OptionsWrapper>
        {/* // Search episode titles */}
        <OptionsWrapper title="Search">
          <DebouncedInput
            value={searchTerm}
            disabled={isLoading}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn('max-w-96')}
          />
        </OptionsWrapper>
        <div className={cn('text-sm text-muted-foreground')}>
          {`${isLoading ? 'Loading' : filteredEpisodes.length} episodes`}
        </div>
      </div>
      {isLoading && <EpisodeListSkeleton />}
      {isLoading === false && !filteredEpisodes.length ? (
        <div>No episodes found</div>
      ) : (
        <EpisodeList
          episodes={episodesToDisplay}
          podcastName={podcastName}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
