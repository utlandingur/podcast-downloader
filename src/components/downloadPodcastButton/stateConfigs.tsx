import { Check, Download, X } from 'lucide-react';
import { LoadingSpinner } from '../ui/loadingSpinner';
import { DownloadState, DownloadButtonStateConfig } from './types';

export const createStateConfigs = (
  performDownload: () => Promise<void>
): Record<DownloadState, DownloadButtonStateConfig> => ({
  [DownloadState.ReadyToDownload]: {
    icon: <Download />,
    text: 'Download',
    variant: 'default',
    disabled: false,
    ariaLabel: 'Download episode',
    onClick: performDownload,
  },
  [DownloadState.Downloading]: {
    icon: <LoadingSpinner />,
    text: undefined,
    variant: 'default',
    disabled: true,
    ariaLabel: 'Downloading episode',
    onClick: undefined,
  },
  [DownloadState.Downloaded]: {
    icon: <Check />,
    text: 'Downloaded',
    variant: 'ghost',
    disabled: false,
    ariaLabel: 'Downloaded',
    onClick: performDownload,
  },
  [DownloadState.DownloadOnDesktop]: {
    icon: <X />,
    text: 'Error: download on desktop',
    variant: 'destructive',
    disabled: true,
    ariaLabel: 'Please download on desktop browser',
    onClick: undefined,
  },
  [DownloadState.downloadedInNewTab]: {
    icon: <Check />,
    text: 'Downloaded in new tab - click to retry',
    variant: 'default',
    disabled: true,
    ariaLabel: 'Download in new tab',
    onClick: performDownload,
    isSpecialRender: true,
  },
});