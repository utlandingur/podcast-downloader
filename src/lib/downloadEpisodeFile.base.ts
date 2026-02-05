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

type DownloadHandlerResult = {
  success: boolean;
  aborted?: boolean;
  error?: string;
};

type DownloadHandler = (
  options: DownloadEpisodeOptions,
) => Promise<DownloadHandlerResult>;

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

export const createDownloadEpisodeFile = (handler: DownloadHandler) => {
  return async (options: DownloadEpisodeOptions): Promise<DownloadState> => {
    const { url, signal, suppressFallbackOpen } = options;
    ensureUnloadListener();

    try {
      if (signal?.aborted) {
        return DownloadState.ReadyToDownload;
      }

      const result = await handler(options);
      if (result.success) {
        return DownloadState.Downloaded;
      }
      if (result.aborted) {
        return DownloadState.ReadyToDownload;
      }
      throw new Error(result.error ?? 'Download failed');
    } catch (error) {
      if (isPageUnloading) {
        return DownloadState.ReadyToDownload;
      }
      if (signal?.aborted || (error as Error).name === 'AbortError') {
        return DownloadState.ReadyToDownload;
      }

      if (!isDesktop) {
        return DownloadState.DownloadOnDesktop;
      }

      if (!suppressFallbackOpen) {
        const fallbackUrl = getOpenAudioUrl(url);
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      }
      return DownloadState.downloadedInNewTab;
    }
  };
};

export type { DownloadEpisodeOptions, DownloadHandlerResult };
