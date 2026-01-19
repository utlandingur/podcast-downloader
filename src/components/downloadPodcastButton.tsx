'use client';
import { Check, Download, RotateCcw, AlertCircle, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { LoadingSpinner } from './ui/loadingSpinner';
import { Button } from './ui/button';
import { isDesktop } from 'react-device-detect';
import Link from 'next/link';
import { downloadEpisodeFile } from '@/lib/downloadEpisodeFile';
import { getOpenAudioUrl } from '@/lib/openAudio';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/hooks/useUserStore';

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
  variant: 'default' | 'ghost' | 'destructive' | 'secondary' | 'outline';
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

  // Only subscribe to the addDownloadedEpisode function, not the entire user object
  const addDownloadedEpisode = useUserStore((state) => state.addDownloadedEpisode);

  useEffect(() => {
    const normalized = normalizeState(existingState);
    setDownloadState((prev) => (prev === normalized ? prev : normalized));
  }, [existingState]);

  const handleDownload = async () => {
    setDownloadState(DownloadState.Downloading);
    updateLocalState(id, DownloadState.Downloading);

    try {
      const nextState = await downloadEpisodeFile({
        url,
        filename: fileName,
      });

      setDownloadState(nextState);
      updateLocalState(id, nextState);

      // Persist download without awaiting (error handling is in useUserStore)
      if (nextState === DownloadState.Downloaded && podcastId) {
        addDownloadedEpisode(podcastId, id.toString());
      }
    } catch {
      setDownloadState(DownloadState.ReadyToDownload);
      updateLocalState(id, DownloadState.ReadyToDownload);
    }
  };

  const DOWNLOAD_STATES: Record<DownloadState, DownloadButtonConfig> = {
    [DownloadState.ReadyToDownload]: {
      icon: <Download className="h-4 w-4" />,
      variant: 'secondary',
      text: 'Download',
      ariaLabel: 'Download episode',
      disabled: false,
    },
    [DownloadState.Downloading]: {
      icon: <LoadingSpinner size={16} />,
      variant: 'secondary',
      text: 'Downloading...',
      ariaLabel: 'Downloading episode',
      disabled: true,
    },
    [DownloadState.Downloaded]: {
      icon: <Check className="h-4 w-4" />,
      variant: 'ghost',
      text: 'Downloaded',
      ariaLabel: 'Episode downloaded successfully',
      disabled: false,
      className: 'text-green-600 hover:text-green-700',
    },
    [DownloadState.PreviouslyDownloaded]: {
      icon: <Check className="h-4 w-4" />,
      variant: 'ghost',
      text: 'Previously downloaded',
      ariaLabel: 'Episode previously downloaded',
      disabled: false,
      className: 'text-green-600 hover:text-green-700',
    },
    [DownloadState.DownloadError]: {
      icon: <AlertCircle className="h-4 w-4" />,
      variant: 'destructive',
      text: isDesktop ? 'Download Failed' : 'Use Desktop',
      ariaLabel: 'Download failed, click to retry',
      disabled: false,
    },
    [DownloadState.DownloadOnDesktop]: {
      icon: <X className="h-4 w-4" />,
      variant: 'destructive',
      text: 'Error: download on desktop',
      ariaLabel: 'Download on desktop',
      disabled: true,
    },
    [DownloadState.downloadedInNewTab]: {
      icon: <Check className="h-4 w-4" />,
      variant: 'secondary',
      text: 'Opened in New Tab',
      ariaLabel: 'Episode opened in new tab',
      disabled: true,
    },
    [DownloadState.AwaitingConfirmation]: {
      icon: <Check className="h-4 w-4" />,
      variant: 'secondary',
      text: 'Awaiting confirmation',
      ariaLabel: 'Awaiting confirmation',
      disabled: true,
    },
    [DownloadState.ShowingFallbackInstructions]: {
      icon: <AlertCircle className="h-4 w-4" />,
      variant: 'secondary',
      text: 'Download Instructions',
      ariaLabel: 'Showing download instructions',
      disabled: false,
    },
  };

  // Memoize the click handler to prevent unnecessary re-renders
  const getClickHandler = useCallback(() => {
    switch (downloadState) {
      case DownloadState.ReadyToDownload:
      case DownloadState.PreviouslyDownloaded:
      case DownloadState.Downloaded:
      case DownloadState.DownloadError:
        return handleDownload;
      default:
        return undefined;
    }
  }, [downloadState]);

  const config = DOWNLOAD_STATES[downloadState];

  // Show confirmation + download again button for completed downloads
  if (downloadState === DownloadState.Downloaded || downloadState === DownloadState.PreviouslyDownloaded) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-green-600 mr-2">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">
            {downloadState === DownloadState.Downloaded ? 'Downloaded' : 'Previously downloaded'}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
          aria-label="Download episode again"
          className="text-xs text-gray-400 hover:text-gray-600 rounded-full px-3"
        >
          <RotateCcw className="h-3 w-3 mr-1 text-gray-400 hover:text-gray-600" />
          Download Again
        </Button>
      </div>
    );
  }

  // Special handling for downloadedInNewTab state (legacy upstream behavior)
  if (downloadState === DownloadState.downloadedInNewTab) {
    const fallbackUrl = getOpenAudioUrl(url);
    return (
      <Link href={fallbackUrl} target="_blank" rel="noreferrer">
        <Button
          size={'sm'}
          variant={'secondary'}
          className="rounded-full px-3 sm:px-4"
          disabled
          aria-disabled
          aria-label="Episode opened in new tab"
        >
          <Check className="h-4 w-4" />
          Opened in New Tab
        </Button>
      </Link>
    );
  }

  // Default single button layout for other states
  return (
    <Button
      size="sm"
      variant={config.variant}
      onClick={getClickHandler()}
      disabled={config.disabled}
      aria-label={config.ariaLabel}
      className={cn('rounded-full px-3 sm:px-4', config.className)}
    >
      {config.icon}
      {config.text}
    </Button>
  );
};
