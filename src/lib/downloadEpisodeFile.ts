'use client';
import { isDesktop } from 'react-device-detect';
import { DownloadState } from '@/components/downloadPodcastButton';
import { getOpenAudioUrl } from '@/lib/openAudio';

type DownloadEpisodeOptions = {
  url: string;
  filename: string;
  signal?: AbortSignal;
  suppressFallbackOpen?: boolean;
};

let isPageUnloading = false;
let unloadListenerAttached = false;

const ensureUnloadListener = () => {
  if (typeof window === 'undefined' || unloadListenerAttached) return;
  unloadListenerAttached = true;
  const markUnloading = () => {
    isPageUnloading = true;
  };
  window.addEventListener('beforeunload', markUnloading);
  window.addEventListener('pagehide', markUnloading);
};

export const downloadEpisodeFile = async ({
  url,
  filename,
  signal,
  suppressFallbackOpen,
}: DownloadEpisodeOptions): Promise<DownloadState> => {
  ensureUnloadListener();
  const anchor = document.createElement('a');

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error('Failed to fetch the file');
    const blob = await response.blob();
    if (!blob || blob.size === 0) throw new Error('Received empty blob.');

    const blobUrl = window.URL.createObjectURL(blob);
    anchor.href = blobUrl;
    anchor.download = filename;
    anchor.click();

    window.URL.revokeObjectURL(blobUrl);
    anchor.remove();
    return DownloadState.Downloaded;
  } catch (error) {
    if (isPageUnloading) {
      anchor.remove();
      return DownloadState.ReadyToDownload;
    }
    if (signal?.aborted || (error as Error).name === 'AbortError') {
      anchor.remove();
      return DownloadState.ReadyToDownload;
    }

    if (!isDesktop) {
      anchor.remove();
      return DownloadState.DownloadOnDesktop;
    }

    if (!suppressFallbackOpen) {
      const fallbackUrl = getOpenAudioUrl(url);
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
    anchor.remove();
    return DownloadState.downloadedInNewTab;
  }
};
