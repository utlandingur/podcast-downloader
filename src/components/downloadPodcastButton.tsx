'use client';
import { Check, Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from './ui/loadingSpinner';
import { Button } from './ui/button';
import { isDesktop } from 'react-device-detect';
import Link from 'next/link';
import { downloadEpisodeFile } from '@/lib/downloadEpisodeFile';
import { getOpenAudioUrl } from '@/lib/openAudio';
import { cn } from '@/lib/utils';

export enum DownloadState {
  ReadyToDownload = 'readyToDownload',
  Downloading = 'downloading',
  Downloaded = 'downloaded',
  PreviouslyDownloaded = 'previouslyDownloaded',
  DownloadError = 'downloadError',
  AwaitingConfirmation = 'awaitingConfirmation',
  ShowingFallbackInstructions = 'showingFallbackInstructions',
  DownloadOnDesktop = 'downloadOnDesktop',
  downloadedInNewTab = 'downloadedInNewTab',
}

interface DownloadButtonConfig {
  icon: React.ReactElement;
  variant: 'default' | 'ghost' | 'destructive' | 'secondary';
  text: string;
  ariaLabel: string;
  disabled: boolean;
  className?: string;
}

type DownloadPodcastButtonProps = {
  existingState: DownloadState;
  updateLocalState: (id: number, state: DownloadState) => void;
  id: number;
  url: string;
  fileName: string;
  podcastId?: string;
};

export const DownloadPodcastButton = ({
  existingState,
  updateLocalState,
  url,
  id,
  fileName,
  podcastId,
}: DownloadPodcastButtonProps) => {
  const normalizeState = (state?: DownloadState) => {
    if (!state) return DownloadState.ReadyToDownload;
    if (state === DownloadState.DownloadOnDesktop && isDesktop) {
      return DownloadState.ReadyToDownload;
    }
    return state;
  };

  const [downloadState, setDownloadState] = useState<DownloadState>(
    normalizeState(existingState),
  );

  useEffect(() => {
    const normalized = normalizeState(existingState);
    setDownloadState((prev) => (prev === normalized ? prev : normalized));
  }, [existingState]);

  const handleDownload = async () => {
    setDownloadState(DownloadState.Downloading);

    try {
      const nextState = await downloadEpisodeFile({ url, filename: fileName });
      setDownloadState(nextState);
      updateLocalState(id, nextState);
    } catch {
      setDownloadState(DownloadState.ReadyToDownload);
      updateLocalState(id, DownloadState.ReadyToDownload);
    }
  };

  const downloadIcon: Record<DownloadState, React.ReactElement> = {
    readyToDownload: <Download className="h-4 w-4" />,
    downloading: <LoadingSpinner size={16} />,
    downloaded: <Check className="h-4 w-4" />,
    downloadOnDesktop: <X className="h-4 w-4" />,
    downloadedInNewTab: <Check className="h-4 w-4" />,
    previouslyDownloaded: <Check className="h-4 w-4" />,
    downloadError: <X className="h-4 w-4" />,
    awaitingConfirmation: <Check className="h-4 w-4" />,
    showingFallbackInstructions: <X className="h-4 w-4" />,
  };

  const buttonStyle: Record<
    DownloadState,
    'default' | 'ghost' | 'destructive' | 'secondary' | 'outline'
  > = {
    readyToDownload: 'secondary',
    downloading: 'secondary',
    downloaded: 'outline',
    downloadOnDesktop: 'destructive',
    downloadedInNewTab: 'secondary',
    previouslyDownloaded: 'outline',
    downloadError: 'destructive',
    awaitingConfirmation: 'secondary',
    showingFallbackInstructions: 'secondary',
  };

  const buttonAriaLabel: Record<DownloadState, string> = {
    readyToDownload: 'Download episode',
    downloading: 'Downloading episode',
    downloaded: 'Episode downloaded successfully',
    downloadOnDesktop: 'Download on desktop',
    downloadedInNewTab: 'Episode opened in new tab',
    previouslyDownloaded: 'Episode previously downloaded',
    downloadError: 'Download failed',
    awaitingConfirmation: 'Awaiting confirmation',
    showingFallbackInstructions: 'Showing fallback instructions',
  };

  const handleOnClick: Record<DownloadState, () => void> = {
    readyToDownload: handleDownload,
    downloading: () => {},
    downloaded: () => {},
    downloadOnDesktop: () => {},
    downloadedInNewTab: () => {},
    previouslyDownloaded: handleDownload,
    downloadError: handleDownload,
    awaitingConfirmation: () => {},
    showingFallbackInstructions: () => {},
  };

  const buttonClassName = 'rounded-full px-3 sm:px-4';

  if (downloadState === DownloadState.downloadedInNewTab) {
    const fallbackUrl = getOpenAudioUrl(url);
    return (
      <div className="flex gap-8 align-center justify-center text-center">
        <Link href={fallbackUrl} target="_blank" rel="noreferrer">
          <Button
            size={'sm'}
            variant={'secondary'}
            className={buttonClassName}
            disabled
            aria-disabled
            aria-label={buttonAriaLabel[downloadState]}
            onClick={handleOnClick[downloadState]}
          >
            {downloadIcon[downloadState]}
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <Button
      size={'sm'}
      variant={buttonStyle[downloadState]}
      className={cn(
        buttonClassName,
        downloadState === DownloadState.Downloaded && 'text-muted-foreground',
      )}
      onClick={handleOnClick[downloadState]}
      disabled={
        downloadState === DownloadState.Downloading ||
        downloadState === DownloadState.DownloadOnDesktop
      }
      aria-disabled={
        downloadState === DownloadState.Downloading ||
        downloadState === DownloadState.DownloadOnDesktop
      }
      aria-label={buttonAriaLabel[downloadState]}
    >
      {downloadIcon[downloadState]}
      {downloadState === DownloadState.ReadyToDownload && 'Download'}
      {downloadState === DownloadState.Downloaded && 'Downloaded'}
      {downloadState === DownloadState.DownloadOnDesktop &&
        'Error: download on desktop'}
    </Button>
  );
};
