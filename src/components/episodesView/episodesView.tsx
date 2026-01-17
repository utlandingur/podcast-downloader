'use client';
import { useEffect, useState } from 'react';
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
import { isDesktop } from 'react-device-detect';
import { DownloadState } from '@/components/downloadPodcastButton';
import type { EpisodeListItem } from '@/components/episodeList/episode';
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

const BULK_DOWNLOAD_LIMIT = 10;
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

  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
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

  const downloadEpisode = async (item: EpisodeListItem) => {
    const { episode, updateDownloadState } = item;
    const filename = `${podcastName}-episode-${episode.title}.mp3`;
    const anchor = document.createElement('a');

    updateDownloadState(episode.id, DownloadState.Downloading);
    try {
      const response = await fetch(episode.episodeUrl);
      if (!response.ok) throw new Error('Failed to fetch the file');
      const blob = await response.blob();
      if (!blob || blob.size === 0) throw new Error('Received empty blob.');

      const blobUrl = window.URL.createObjectURL(blob);
      anchor.href = blobUrl;
      anchor.download = filename;
      anchor.click();

      window.URL.revokeObjectURL(blobUrl);
      anchor.remove();
      updateDownloadState(episode.id, DownloadState.Downloaded);
    } catch {
      if (!isDesktop) {
        anchor.remove();
        updateDownloadState(episode.id, DownloadState.DownloadOnDesktop);
      } else {
        const fallbackUrl = `/open-audio?url=${encodeURIComponent(
          episode.episodeUrl,
        )}`;
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
        anchor.remove();
        updateDownloadState(episode.id, DownloadState.downloadedInNewTab);
      }
    }
  };

  const handleBulkDownload = async (requestedCount: number) => {
    if (isLoading || isBulkDownloading || requestedCount === 0) return;

    setBulkProgress({ active: true, total: requestedCount, current: 0 });
    const items = episodesToDisplay.slice(0, requestedCount);
    for (let i = 0; i < items.length; i += 1) {
      setBulkProgress((prev) => ({ ...prev, current: i + 1 }));
      await downloadEpisode(items[i]);
    }
    setBulkProgress({ active: false, total: 0, current: 0 });
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
          <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={isLoading || isBulkDownloading || maxBulkCount === 0}
              >
                Bulk download
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                />
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
      <div className={cn('relative')}>
        {isBulkDownloading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-md bg-background/80 backdrop-blur-sm">
            <LoadingSpinner size={32} />
            <div className="text-sm text-muted-foreground">
              Downloading {bulkProgress.current} of {bulkProgress.total}
            </div>
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
