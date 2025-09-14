'use client';

import { Button } from '../ui/button';
import { DownloadPodcastButtonProps, DownloadState } from './types';
import { useDownloadLogic } from './useDownloadLogic';
import { createStateConfigs } from './stateConfigs';
import { NewTabDownloadButton } from './NewTabDownloadButton';

export const DownloadPodcastButton = ({
  existingState,
  updateLocalState,
  url,
  id,
  fileName,
}: DownloadPodcastButtonProps) => {
  const { downloadState, performDownload } = useDownloadLogic({
    initialState: existingState || DownloadState.ReadyToDownload,
    url,
    fileName,
    id,
    updateLocalState,
  });

  const stateConfigs = createStateConfigs(performDownload);
  const config = stateConfigs[downloadState];

  // Handle special rendering for new tab downloads
  if (config.isSpecialRender && downloadState === DownloadState.downloadedInNewTab) {
    return <NewTabDownloadButton config={config} url={url} />;
  }

  // Standard button rendering for all other states
  return (
    <Button
      size={'sm'}
      variant={config.variant}
      onClick={config.onClick}
      disabled={config.disabled}
      aria-disabled={config.disabled}
      aria-label={config.ariaLabel}
    >
      {config.icon}
      {config.text}
    </Button>
  );
};

// Re-export the DownloadState enum for backward compatibility
export { DownloadState } from './types';