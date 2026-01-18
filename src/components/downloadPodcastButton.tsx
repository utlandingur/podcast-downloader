'use client';
import { Check, Download, X } from 'lucide-react';
import { useState } from 'react';
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
  DownloadOnDesktop = 'downloadOnDesktop',
  downloadedInNewTab = 'downloadedInNewTab',
}

type DownloadPodcastButtonProps = {
  existingState: DownloadState;
  updateLocalState: (id: number, state: DownloadState) => void;
  id: number;
  url: string;
  fileName: string;
};

export const DownloadPodcastButton = ({
  existingState,
  updateLocalState,
  url,
  id,
  fileName,
}: DownloadPodcastButtonProps) => {
  const [downloadState, setDownloadState] = useState<DownloadState>(
    existingState
      ? existingState === DownloadState.DownloadOnDesktop && isDesktop
        ? DownloadState.ReadyToDownload
        : existingState
      : DownloadState.ReadyToDownload,
  );

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
  };
  const buttonClassName = 'rounded-full px-3 sm:px-4';

  const buttonAriaLabel: Record<DownloadState, string> = {
    readyToDownload: 'Download episode',
    downloading: 'Downloading episode',
    downloaded: 'Downloaded',
    downloadOnDesktop: 'Please download on desktop browser',
    downloadedInNewTab: 'Download in new tab',
  };

  const handleOnClick: Record<
    DownloadState,
    (() => Promise<void>) | undefined
  > = {
    readyToDownload: handleDownload,
    downloading: undefined,
    downloaded: handleDownload,
    downloadOnDesktop: undefined,
    downloadedInNewTab: handleDownload,
  };

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
            Downloaded in new tab - click to retry
          </Button>
        </Link>
        <div className="text-[0.7rem] text-center self-center text-muted-foreground">
          Click three dots and press download.
        </div>
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
