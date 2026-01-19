import type { PodcastEpisodeV2 } from '@/types/podcasts';
import {
  DownloadPodcastButton,
  DownloadState,
} from '@/components/downloadPodcastButton';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';
import { CSSProperties } from 'react';
import { Skeleton } from '../ui/skeleton';
import { formatEpisodeFilename } from '@/lib/formatEpisodeFilename';

export type EpisodeListItem = {
  episode: PodcastEpisodeV2;
  updateDownloadState: (id: number, state: DownloadState) => void;
};

type EpisodeProps = {
  episode: PodcastEpisodeV2;
  handleDownloadState: (id: number, state: DownloadState) => void;
  style: CSSProperties;
  podcastName: string;
  showBorder: boolean;
};

export const Episode = ({
  episode,
  podcastName,
  handleDownloadState,
  style,
  showBorder,
}: EpisodeProps) => {
  const { id, title, description, episodeUrl, downloadState } = episode;
  const datePublished = new Date(episode.datePublished);

  const cleanDescription = DOMPurify.sanitize(description);
  const filename = formatEpisodeFilename({
    podcastName,
    episodeNumber: episode.episodeNumber,
    episodeTitle: title,
  });

  return (
    <div
      style={style}
      className={cn(
        `flex h-full flex-col justify-between gap-3 px-3 sm:px-4 py-4 transition-colors hover:bg-muted/40
        ${showBorder && 'border-b border-border/40'}`,
      )}
    >
      <div className="flex flex-col gap-2">
        <div className={cn('text-xs uppercase tracking-wide text-muted-foreground')}>
          {datePublished.toLocaleDateString()}
        </div>
        <div className={cn('line-clamp-2 text-base font-semibold leading-snug')}>
          {title}
        </div>
        <div
          className={cn(
            'line-clamp-2 text-ellipsis text-sm text-muted-foreground',
          )}
          dangerouslySetInnerHTML={{ __html: cleanDescription }}
        />
      </div>
      <div className={cn('flex justify-end')}>
        <DownloadPodcastButton
          existingState={downloadState ?? DownloadState.ReadyToDownload}
          id={id}
          updateLocalState={handleDownloadState}
          url={episodeUrl}
          fileName={filename}
        />
      </div>
    </div>
  );
};

export const EpisodeSkeleton = () => (
  <div className="flex flex-col gap-3 px-4 py-4">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-5 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-9 w-36" />
  </div>
);
