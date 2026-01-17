import type { PodcastEpisodeV2 } from '@/types/podcasts';
import {
  DownloadPodcastButton,
  DownloadState,
} from '@/components/downloadPodcastButton';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';
import { CSSProperties } from 'react';
import { Skeleton } from '../ui/skeleton';


export type EpisodeListItem = {
  episode: PodcastEpisodeV2;
  updateDownloadState: (id: number, state: DownloadState) => void;
  podcastId?: string;
};

type EpisodeProps = {
  episode: PodcastEpisodeV2;
  handleDownloadState: (id: number, state: DownloadState) => void;
  style: CSSProperties;
  podcastName: string;
  podcastId?: string;
  showBorder: boolean;
};

export const Episode = ({
  episode,
  podcastName,
  podcastId,
  handleDownloadState,
  style,
  showBorder,
}: EpisodeProps) => {
  const { id, title, description, episodeUrl, downloadState } = episode;
  const datePublished = new Date(episode.datePublished);

  const cleanDescription = DOMPurify.sanitize(description);
  const filename = `${podcastName}-episode-${title}.mp3`;

  return (
    <div
      style={style}
      className={cn(
        `flex flex-col py-4 justify-center
        ${showBorder && 'border-b border-muted-foreground pt-4'}`,
      )}
    >
      <div className={cn('text-sm text-muted-foreground')}>
        {datePublished.toLocaleDateString()}
      </div>
      <div className={cn('line-clamp-1 m:line-clamp-2 text-ellipsis')}>
        {title}
      </div>
      <div
        className={cn(
          'line-clamp-2 text-ellipsis text-sm text-muted-foreground ',
        )}
        dangerouslySetInnerHTML={{ __html: cleanDescription }}
      />
      <div className={cn('flex flex-col items-start pt-2')}>
        <DownloadPodcastButton
          existingState={downloadState ?? DownloadState.ReadyToDownload}
          id={id}
          updateLocalState={handleDownloadState}
          url={episodeUrl}
          fileName={filename}
          podcastId={podcastId}
        />
      </div>
    </div>
  );
};

export const EpisodeSkeleton = () => (
  <div className="flex flex-col py-4 justify-center">
    <Skeleton className="w-full h-[20px] mb-4" /> {/* Title skeleton */}
    <Skeleton className="w-full h-[15px] mb-2" /> {/* Description skeleton */}
    <Skeleton className="w-[150px] h-[30px]" /> {/* Button skeleton */}
  </div>
);
