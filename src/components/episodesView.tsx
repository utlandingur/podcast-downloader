import { PodcastEpisodeV2 } from "@/types/podcasts";
import { cn } from "@/lib/utils";
import { DownloadState } from "./downloadPodcastButton";
import { useEffect, useMemo, useState } from "react";
import { DebouncedInput } from "./ui/input";
import { SortToggle } from "./ui/sortToggle";
import { EpisodeList } from "./episodeList";
import { useUserStore } from "@/hooks/useUser";

export const EpisodesView = ({
  episodes,
  podcastName,
  podcastId,
}: {
  episodes: PodcastEpisodeV2[];
  podcastName: string;
  podcastId: string;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAscending, setIsAscending] = useState(false);
  const [episodeData, setEpisodeData] = useState<PodcastEpisodeV2[]>(episodes);
  const { user, addDownloadedEpisode } = useUserStore((state) => state);

  const infoIndex = useMemo(() => {
    return user?.info.findIndex((info) => info.podcast_id === podcastId);
  }, [user, podcastId]);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const filteredEpisodes = useMemo(() => {
    const filtered = (episodeData || []).filter((episode) => {
      if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, "i");
        if (!searchRegex.test(episode.title)) {
          return false;
        }
      }
      return true;
    });
    if (isAscending) {
      return filtered.toReversed();
    }
    return filtered;
  }, [episodeData, searchTerm, isAscending]);

  const episodesToDisplay = useMemo(() => {
    const handleUpdateDownloadState = (id: number, state: DownloadState) => {
      setEpisodeData((prev) => {
        const newData = [...prev];
        const indexToUpdate = prev.findIndex((episode) => episode.id === id);
        newData[indexToUpdate].downloadState = state;
        return newData;
      });
      if (state === "downloaded" && user) {
        addDownloadedEpisode(podcastId, id.toString());
        console.log("added downloaded episode", id);
      }
    };

    return filteredEpisodes.map((episode) => {
      console.log("infoIndex", infoIndex);
      if (infoIndex && infoIndex !== -1) {
        const isDownloaded = user?.info[infoIndex].downloaded_episodes.includes(
          episode.id.toString()
        );
        if (isDownloaded) {
          episode.downloadState = "downloaded";
        }
      }
      return {
        episode,
        updateDownloadState: handleUpdateDownloadState,
      };
    });
  }, [filteredEpisodes, podcastId, user, addDownloadedEpisode, infoIndex]);

  return (
    <div className={cn("flex flex-col w-[98%] px-4 gap-4 max-w-[720px]")}>
      <div className={cn("grid gap-4 w-full grid-cols-[auto] items-center")}>
        <div className={cn("flex gap-4 items-center")}>
          <div className={cn("min-w-14")}>Sort</div>
          <SortToggle onToggle={setIsAscending} initialValue={isAscending} />
        </div>
        <div className={cn("flex gap-4 items-center")}>
          <div className={cn("min-w-14")}>Search</div>
          <DebouncedInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn("max-w-96")}
          />
        </div>
      </div>
      {filteredEpisodes.length > 0 ? (
        <EpisodeList episodes={episodesToDisplay} podcastName={podcastName} />
      ) : (
        <div>No episodes found</div>
      )}
    </div>
  );
};
