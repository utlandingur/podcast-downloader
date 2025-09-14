export enum DownloadState {
  ReadyToDownload = 'readyToDownload',
  Downloading = 'downloading',
  Downloaded = 'downloaded',
  DownloadOnDesktop = 'downloadOnDesktop',
  downloadedInNewTab = 'downloadedInNewTab',
}

export type DownloadPodcastButtonProps = {
  existingState: DownloadState;
  updateLocalState: (id: number, state: DownloadState) => void;
  id: number;
  url: string;
  fileName: string;
};

export type DownloadButtonStateConfig = {
  icon: React.ReactElement;
  text?: string;
  variant: 'default' | 'ghost' | 'destructive';
  disabled: boolean;
  ariaLabel: string;
  onClick?: () => void | Promise<void>;
  isSpecialRender?: boolean;
};