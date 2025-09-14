import { useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { DownloadState } from './types';

type UseDownloadLogicProps = {
  initialState: DownloadState;
  url: string;
  fileName: string;
  id: number;
  updateLocalState: (id: number, state: DownloadState) => void;
};

export const useDownloadLogic = ({
  initialState,
  url,
  fileName,
  id,
  updateLocalState,
}: UseDownloadLogicProps) => {
  // Adjust initial state based on device type
  const adjustedInitialState =
    initialState === DownloadState.DownloadOnDesktop && isDesktop
      ? DownloadState.ReadyToDownload
      : initialState;

  const [downloadState, setDownloadState] = useState<DownloadState>(
    adjustedInitialState
  );

  const performDownload = async () => {
    setDownloadState(DownloadState.Downloading);
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
      anchor.click();

      // Clean up the blob URL after download
      window.URL.revokeObjectURL(blobUrl);
      anchor.remove();
      
      const newState = DownloadState.Downloaded;
      setDownloadState(newState);
      updateLocalState(id, newState);
    } catch {
      // Handle CORS or other download errors
      anchor.remove();
      
      if (!isDesktop) {
        const newState = DownloadState.DownloadOnDesktop;
        setDownloadState(newState);
        updateLocalState(id, newState);
      } else {
        // Open in new tab and mark as downloaded in new tab
        window.open(url, '_blank');
        const newState = DownloadState.downloadedInNewTab;
        setDownloadState(newState);
        updateLocalState(id, newState);
      }
    }
  };

  return {
    downloadState,
    performDownload,
  };
};