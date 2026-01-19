'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { DebouncedInput } from '../ui/input';
import { EpisodeList, EpisodeListSkeleton } from '../episodeList/episodeList';
import { Download, Heart, Lock } from 'lucide-react';
import { useEpisodesView } from './useEpisodesView';
import { useToggleFavourite } from '@/hooks/useToggleFavourite';
import { LoginPortal } from '../loginPortal';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { DownloadState } from '@/components/downloadPodcastButton';
import type { EpisodeListItem } from '@/components/episodeList/episode';
import { downloadEpisodeFile } from '@/lib/downloadEpisodeFile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatEpisodeFilename } from '@/lib/formatEpisodeFilename';
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
    totalEpisodes,
  } = useEpisodesView(podcastId);
  const { favourited, toggleFavourite } = useToggleFavourite(podcastId);

  const [bulkProgress, setBulkProgress] = useState({
    active: false,
    total: 0,
    completed: 0,
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
    const filename = formatEpisodeFilename({
      podcastName,
      episodeNumber: episode.episodeNumber,
      episodeTitle: episode.title,
    });

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
      setBulkProgress({ active: true, total: requestedCount, completed: 0 });
    }
    const items = episodesToDisplay.slice(0, requestedCount);
    const fallbacks: { title: string; url: string }[] = [];
    for (let i = 0; i < items.length; i += 1) {
      if (bulkCancelRef.current) break;
      const controller = new AbortController();
      currentAbortRef.current = controller;
      const fallback = await downloadEpisode(items[i], controller.signal);
      if (fallback) {
        fallbacks.push(fallback);
      }
      currentAbortRef.current = null;
      if (bulkCancelRef.current) break;
      if (isMountedRef.current) {
        setBulkProgress((prev) => ({
          ...prev,
          completed: prev.completed + 1,
        }));
      }
    }
    if (isMountedRef.current) {
      setBulkProgress({ active: false, total: 0, completed: 0 });
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
    <div className={cn('flex flex-col w-[98%] px-2 sm:px-4 gap-4 max-w-[720px]')}>
      <section className="rounded-xl border border-border/60 bg-card/30 p-3 sm:p-4">
        <div className="flex flex-col gap-2">
          <div className="w-full">
            <DebouncedInput
              type="search"
              value={searchTerm}
              disabled={isLoading}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn('h-10 w-full')}
              placeholder="Search episode titles"
              aria-label="Search episode titles"
            />
          </div>
          <div className={cn('text-xs text-muted-foreground')}>
            {isLoading
              ? 'Loading episodes...'
              : `Showing ${filteredEpisodes.length} of ${totalEpisodes} episodes · ${
                  showDownloaded ? 'Including downloaded' : 'Hiding downloaded'
                }`}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filters"
          >
            <ToggleGroup
              type="single"
              size="sm"
              value={isAscending ? 'oldest' : 'newest'}
              onValueChange={(value) => {
                if (!value) return;
                setIsAscending(value === 'oldest');
              }}
              disabled={isLoading}
              aria-label="Sort order"
            >
              <ToggleGroupItem value="newest" aria-label="Sort by newest">
                Newest
              </ToggleGroupItem>
              <ToggleGroupItem value="oldest" aria-label="Sort by oldest">
                Oldest
              </ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup
              type="single"
              size="sm"
              value={showDownloaded ? 'show' : 'hide'}
              onValueChange={(value) => {
                if (!value) return;
                setShowDownloaded(value === 'show');
              }}
              disabled={isLoading}
              aria-label="Downloaded episodes visibility"
            >
              <ToggleGroupItem value="show" aria-label="Show downloaded">
                Show downloaded
              </ToggleGroupItem>
              <ToggleGroupItem value="hide" aria-label="Hide downloaded">
                Hide downloaded
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

        </div>
      </section>
      <div className="flex flex-wrap items-center gap-2">
        {isLoggedIn ? (
          <Button
            size="sm"
            variant="outline"
            onClick={toggleFavourite}
            aria-pressed={favourited}
          >
            <Heart
              className={cn(
                'h-4 w-4',
                favourited ? 'fill-current text-primary' : 'text-muted-foreground',
              )}
            />
            Favourite
          </Button>
        ) : (
          <LoginPortal
            trigger={
              <Button size="sm" variant="outline">
                <Lock className="h-4 w-4" />
                Favourite
              </Button>
            }
          />
        )}

        <Dialog
          open={bulkDialogOpen}
          onOpenChange={(open) => {
            if (isBulkDownloading) return;
            setBulkDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading || isBulkDownloading || maxBulkCount === 0}
            >
              <Download className="h-4 w-4" />
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
                <strong>
                  By using bulk download, you confirm you have found, read
                  and will respect the podcast host&apos;s terms. Personal use
                  only.
                </strong>
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
              <Button variant="ghost" onClick={() => setBulkDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={isLoading || isBulkDownloading || !isBulkCountValid}
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
              Bulk downloading · {bulkProgress.completed} of{' '}
              {bulkProgress.total} completed
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
        <div
          className={cn(
            isBulkDownloading && 'pointer-events-none select-none opacity-60',
          )}
          aria-busy={isBulkDownloading}
        >
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
    </div>
  );
};
