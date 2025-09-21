'use client';
import { Check, Download, RotateCcw, AlertCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { LoadingSpinner } from './ui/loadingSpinner';
import { Button } from './ui/button';
import { isDesktop } from 'react-device-detect';
import { useUserStore } from '@/hooks/useUserStore';
import { DownloadFallbackAlert } from './downloadFallbackAlert';

export enum DownloadState {
  ReadyToDownload = 'readyToDownload',
  Downloading = 'downloading',
  Downloaded = 'downloaded',
  PreviouslyDownloaded = 'previouslyDownloaded',
  DownloadError = 'downloadError',
  AwaitingConfirmation = 'awaitingConfirmation',
  ShowingFallbackInstructions = 'showingFallbackInstructions',
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
  const [downloadState, setDownloadState] = useState<DownloadState>(existingState);
  const [showFallbackAlert, setShowFallbackAlert] = useState<boolean>(false);
  const { addDownloadedEpisode, user } = useUserStore();

  const persistDownload = async () => {
    if (user && podcastId) {
      try {
        await addDownloadedEpisode(podcastId, id.toString());
      } catch (error) {
        console.error('Failed to persist download:', error);
      }
    }
  };

  const handleDownload = async () => {
    setDownloadState(DownloadState.Downloading);
    updateLocalState(id, DownloadState.Downloading);
    
    const anchor = document.createElement('a');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch the file');
      }
      const blob = await response.blob();
      if (!blob || blob.size === 0) {
        throw new Error('Received empty blob.');
      }
      const blobUrl = window.URL.createObjectURL(blob);

      anchor.href = blobUrl;
      anchor.download = fileName;
      await anchor.click();

      // Clean up the blob URL after download
      window.URL.revokeObjectURL(blobUrl);
      anchor.remove();
      
      // Update state and persist to database
      setDownloadState(DownloadState.Downloaded);
      updateLocalState(id, DownloadState.Downloaded);
      await persistDownload();
    } catch (error) {
      console.error('Download failed:', error);
      anchor.remove();
      
      // Open in new tab and show fallback instructions
      window.open(url, '_blank');
      setDownloadState(DownloadState.ShowingFallbackInstructions);
      updateLocalState(id, DownloadState.ShowingFallbackInstructions);
      setShowFallbackAlert(true);
    }
  };

  const handleRetry = () => {
    setDownloadState(DownloadState.ReadyToDownload);
    updateLocalState(id, DownloadState.ReadyToDownload);
    setShowFallbackAlert(false);
  };

  const handleConfirmFallbackDownload = async () => {
    setDownloadState(DownloadState.Downloaded);
    updateLocalState(id, DownloadState.Downloaded);
    setShowFallbackAlert(false);
    await persistDownload();
  };

  const handleReportIssue = () => {
    setDownloadState(DownloadState.DownloadError);
    updateLocalState(id, DownloadState.DownloadError);
    setShowFallbackAlert(false);
  };

  const handleDismissAlert = () => {
    setShowFallbackAlert(false);
    setDownloadState(DownloadState.ReadyToDownload);
    updateLocalState(id, DownloadState.ReadyToDownload);
  };

  const DOWNLOAD_STATES: Record<DownloadState, DownloadButtonConfig> = {
    [DownloadState.ReadyToDownload]: {
      icon: <Download className="h-4 w-4" />,
      variant: 'default',
      text: 'Download',
      ariaLabel: 'Download episode',
      disabled: false,
    },
    [DownloadState.Downloading]: {
      icon: <LoadingSpinner />,
      variant: 'default',
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
      icon: <RotateCcw className="h-4 w-4" />,
      variant: 'secondary',
      text: 'Download Again',
      ariaLabel: 'Download episode again',
      disabled: false,
    },
    [DownloadState.DownloadError]: {
      icon: <AlertCircle className="h-4 w-4" />,
      variant: 'destructive',
      text: isDesktop ? 'Download Failed' : 'Use Desktop',
      ariaLabel: 'Download failed, click to retry',
      disabled: false,
    },
    [DownloadState.AwaitingConfirmation]: {
      icon: <Clock className="h-4 w-4" />,
      variant: 'default',
      text: 'Opened in New Tab',
      ariaLabel: 'Waiting for download confirmation',
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

  const config = DOWNLOAD_STATES[downloadState];
  
  const getClickHandler = () => {
    switch (downloadState) {
      case DownloadState.ReadyToDownload:
      case DownloadState.PreviouslyDownloaded:
        return handleDownload;
      case DownloadState.Downloaded:
        return handleDownload; // Allow re-download
      case DownloadState.DownloadError:
        return handleRetry;
      case DownloadState.ShowingFallbackInstructions:
        return handleDismissAlert;
      default:
        return undefined;
    }
  };

  // Show confirmation + download again button for completed downloads
  if (downloadState === DownloadState.Downloaded || downloadState === DownloadState.PreviouslyDownloaded) {
    return (
      <div className="space-y-2">
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
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            <RotateCcw className="h-3 w-3 mr-1 text-gray-400 hover:text-gray-600" />
            Download Again
          </Button>
        </div>
        
        {showFallbackAlert && (
          <DownloadFallbackAlert
            fileName={fileName}
            onConfirmDownload={handleConfirmFallbackDownload}
            onReportIssue={handleReportIssue}
            onRetry={handleRetry}
          />
        )}
      </div>
    );
  }

  // Default single button layout for other states
  return (
    <div className="space-y-2">
      <Button
        size="sm"
        variant={config.variant}
        onClick={getClickHandler()}
        disabled={config.disabled}
        aria-label={config.ariaLabel}
        className={config.className}
      >
        {config.icon}
        {config.text}
      </Button>
      
      {showFallbackAlert && (
        <DownloadFallbackAlert
          fileName={fileName}
          onConfirmDownload={handleConfirmFallbackDownload}
          onReportIssue={handleReportIssue}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};
