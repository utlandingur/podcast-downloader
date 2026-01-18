'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { DebouncedInput } from '../ui/input';
import { EpisodeList, EpisodeListSkeleton } from '../episodeList/episodeList';
import { Toggle } from '@/components/toggle';
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import { useEpisodesView } from './useEpisodesView';
import { OptionsWrapper } from './optionsWraper';
import { ToggleFavourite } from './toggleFavourite';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { DownloadState } from '@/components/downloadPodcastButton';
import type { EpisodeListItem } from '@/components/episodeList/episode';
import { downloadEpisodeFile } from '@/lib/downloadEpisodeFile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type Props = {
  podcastName: string;
  podcastId: string;
  isLoggedIn: boolean;
};

// Default number of episodes pre-filled for bulk download. Kept small to avoid
// overwhelming users or the UI with very large initial batches.
const BULK_DOWNLOAD_LIMIT = 10;
// Hard upper safety cap on bulk downloads to avoid very large multi-download
// operations that could strain browser, network, or backend resources.
const BULK_DOWNLOAD_MAX = 100;

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

  const [bulkProgress, setBulkProgress] = useState({
    active: false,
    total: 0,
    current: 0,
  });
  const bulkCancelRef = useRef(false);
  const currentAbortRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkFallback, setBulkFallback] = useState<{
    key: string;
    count: number;
  } | null>(null);
  const maxBulkCount = Math.min(BULK_DOWNLOAD_MAX, episodesToDisplay.length);
  const defaultBulkCount =
    maxBulkCount > 0 ? Math.min(BULK_DOWNLOAD_LIMIT, maxBulkCount) : 0;
  const [bulkCountInput, setBulkCountInput] = useState(
    defaultBulkCount ? `${defaultBulkCount}` : '',
  );
  const isBulkDownloading = bulkProgress.active;

  useEffect(() => {
    if (!bulkDialogOpen) {
      setBulkCountInput(defaultBulkCount ? `${defaultBulkCount}` : '');
    }
  }, [bulkDialogOpen, defaultBulkCount]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      bulkCancelRef.current = true;
      currentAbortRef.current?.abort();
    };
  }, []);

  const downloadEpisode = async (
    item: EpisodeListItem,
    signal?: AbortSignal,
  ): Promise<{ title: string; url: string } | null> => {
    const { episode, updateDownloadState } = item;
    const filename = `${podcastName}-episode-${episode.title}.mp3`;

    if (isMountedRef.current) {
      updateDownloadState(episode.id, DownloadState.Downloading);
    }

    const nextState = await downloadEpisodeFile({
      url: episode.episodeUrl,
      filename,
      signal,
      suppressFallbackOpen: true,
    });

    if (isMountedRef.current) {
      updateDownloadState(episode.id, nextState);
    }

    if (nextState === DownloadState.downloadedInNewTab) {
      return { title: episode.title, url: episode.episodeUrl };
    }

    return null;
  };

  const handleBulkDownload = async (requestedCount: number) => {
    if (isLoading || isBulkDownloading || requestedCount === 0) return;

    bulkCancelRef.current = false;
    if (isMountedRef.current) {
      setBulkProgress({ active: true, total: requestedCount, current: 0 });
    }
    const items = episodesToDisplay.slice(0, requestedCount);
    const fallbacks: { title: string; url: string }[] = [];
    for (let i = 0; i < items.length; i += 1) {
      if (bulkCancelRef.current) break;
      if (isMountedRef.current) {
        setBulkProgress((prev) => ({ ...prev, current: i + 1 }));
      }
      const controller = new AbortController();
      currentAbortRef.current = controller;
      const fallback = await downloadEpisode(items[i], controller.signal);
      if (fallback) {
        fallbacks.push(fallback);
      }
      currentAbortRef.current = null;
    }
    if (isMountedRef.current) {
      setBulkProgress({ active: false, total: 0, current: 0 });
    }

    if (fallbacks.length > 0 && isMountedRef.current) {
      const key = `bulk-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(
        key,
        JSON.stringify({ createdAt: Date.now(), items: fallbacks }),
      );
      setBulkFallback({ key, count: fallbacks.length });
    }
  };

  const handleCancelBulkDownload = () => {
    bulkCancelRef.current = true;
    currentAbortRef.current?.abort();
  };

  const parsedBulkCount = Number.parseInt(bulkCountInput, 10);
  const isBulkCountValid =
    Number.isFinite(parsedBulkCount) &&
    parsedBulkCount >= 1 &&
    parsedBulkCount <= maxBulkCount;

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
                  Some downloads may open in a new tab with our player. Use the
                  three-dot menu in the browser player to download if needed.
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
      {bulkFallback && (
        <Alert>
          <AlertTitle>Manual downloads needed</AlertTitle>
          <AlertDescription>
            {bulkFallback.count} episodes need manual download. Open the list in
            a new tab to finish them.
          </AlertDescription>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() =>
                window.open(
                  `/open-audio?batch=${bulkFallback.key}`,
                  '_blank',
                  'noopener,noreferrer',
                )
              }
            >
              Open list
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setBulkFallback(null)}
            >
              Dismiss
            </Button>
          </div>
        </Alert>
      )}
      <div className={cn('relative')}>
        {isBulkDownloading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-md bg-background/80 backdrop-blur-sm">
            <LoadingSpinner size={32} />
            <div
              className="text-sm text-muted-foreground"
              aria-live="polite"
              aria-atomic="true"
            >
              Downloading {bulkProgress.current} of {bulkProgress.total}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelBulkDownload}
            >
              Cancel
            </Button>
          </div>
        )}
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
    </div>
  );
};
