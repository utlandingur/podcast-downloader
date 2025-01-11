import type { PodcastEpisodeV2 } from "@/types/podcasts";
import {
  DownloadPodcastButton,
  DownloadState,
} from "@/components/downloadPodcastButton";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import { CSSProperties } from "react";

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
  const datePublished = new Date(episode.datePublished); // its a string after being stringified from local storage

  const cleanDescription = DOMPurify.sanitize(description);
  const filename = `${podcastName}-episode-${title}.mp3`;

  return (
    <div
      style={style}
      className={cn(
        `flex flex-col py-4 justify-center
        ${showBorder && "border-b border-muted-foreground pt-4"}`
      )}
    >
      <div className={cn("text-sm text-muted-foreground")}>
        {datePublished.toLocaleDateString()}
      </div>
      <div className={cn("line-clamp-1 m:line-clamp-2 text-ellipsis")}>
        {title}
      </div>
      <div
        className={cn(
          "line-clamp-2 text-ellipsis text-sm text-muted-foreground "
        )}
        dangerouslySetInnerHTML={{ __html: cleanDescription }}
      />
      <div className={cn("flex justify-start pt-2")}>
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
