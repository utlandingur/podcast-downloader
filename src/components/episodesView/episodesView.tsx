import { PodcastEpisodeV2 } from '@/types/podcasts';
import { cn } from '@/lib/utils';
import { DebouncedInput } from '../ui/input';
import { EpisodeList } from '../episodeList/episodeList';
import { Toggle } from '@/components/toggle';
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import { useEpisodesView } from './useEpisodesView';
import { OptionsWrapper } from './optionsWraper';
import { ToggleFavourite } from './toggleFavourite';

type Props = {
  episodes: PodcastEpisodeV2[];
  podcastName: string;
  podcastId: string;
  isLoggedIn: boolean;
};

export const EpisodesView = ({
  episodes,
  podcastName,
  podcastId,
  isLoggedIn,
}: Props) => {
  const {
    searchTerm,
    setSearchTerm,
    isAscending,
    setIsAscending,
    showDownloaded,
    setShowDownloaded,
    filteredEpisodes,
    episodesToDisplay,
  } = useEpisodesView(episodes, podcastId);
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn('max-w-96')}
          />
        </OptionsWrapper>
        <div className={cn('text-sm text-muted-foreground')}>
          {`${filteredEpisodes.length} episodes`}
        </div>
      </div>
      {filteredEpisodes.length > 0 ? (
        <EpisodeList episodes={episodesToDisplay} podcastName={podcastName} />
      ) : (
        <div>No episodes found</div>
      )}
    </div>
  );
};
