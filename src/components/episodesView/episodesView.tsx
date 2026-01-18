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
        <OptionsWrapper title="Bulk Download">
          <Dialog
            open={bulkDialogOpen}
            onOpenChange={(open) => {
              if (isBulkDownloading) return;
              setBulkDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button
                disabled={isLoading || isBulkDownloading || maxBulkCount === 0}
              >
                Bulk download
              </Button>
            </DialogTrigger>
            <DialogContent
              onPointerDownOutside={(event) => {
                if (isBulkDownloading) event.preventDefault();
              }}
              onEscapeKeyDown={(event) => {
                if (isBulkDownloading) event.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Bulk download</DialogTitle>
                <DialogDescription>
                  Download the top episodes from the current view (filters
                  applied). Max {maxBulkCount}, up to {BULK_DOWNLOAD_MAX}.
                  <br />
                  <br />
                  If any downloads fail, we will offer a single list in a new
                  tab so you can finish them manually.
                  <br />
                  <br />
                  <strong>By using bulk download, you confirm you have found, read and will
                  respect the podcast host&apos;s terms. Personal use only.</strong>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="bulk-count">
                  How many episodes?
                </label>
                <Input
                  id="bulk-count"
                  type="number"
                  min={1}
                  max={maxBulkCount}
                  value={bulkCountInput}
                  onChange={(e) => setBulkCountInput(e.target.value)}
                  aria-invalid={!isBulkCountValid}
                  aria-describedby="bulk-count-error"
                />
                <p
                  id="bulk-count-error"
                  className={cn(
                    'text-xs text-destructive',
                    isBulkCountValid && 'sr-only',
                  )}
                >
                  Enter a number between 1 and {maxBulkCount}, up to{' '}
                  {BULK_DOWNLOAD_MAX}.
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setBulkDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={
                    isLoading || isBulkDownloading || !isBulkCountValid
                  }
                  onClick={() => {
                    if (!isBulkCountValid) return;
                    setBulkDialogOpen(false);
                    const requestedCount = Math.min(
                      parsedBulkCount,
                      maxBulkCount,
                    );
                    handleBulkDownload(requestedCount);
                  }}
                >
                  Start download
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
