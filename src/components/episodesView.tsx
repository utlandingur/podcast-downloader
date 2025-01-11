import { PodcastEpisodeV2 } from "@/types/podcasts";
import { cn } from "@/lib/utils";
import { DownloadState } from "./downloadPodcastButton";
import { useMemo, useState } from "react";
import { DebouncedInput } from "./ui/input";
import { EpisodeList } from "./episodeList";
import { useUserStore } from "@/hooks/useUserStore";
import { Toggle } from "@/components/toggle";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { useCantDownloadStore } from "@/hooks/useCanDownloadStore";

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
  const [showDownloaded, setShowDownloaded] = useState(true);
  const [episodeData, setEpisodeData] = useState<PodcastEpisodeV2[]>(episodes);
  const { user, addDownloadedEpisode } = useUserStore((state) => state);
  const { podcasts } = useCantDownloadStore((state) => state);
  const canDownload = useMemo(() => {
    console.log("podcasts", podcasts);
    console.log("podcastId", podcastId);
    return !podcasts.some((podcast) => podcast.podcastId === podcastId);
  }, [podcasts, podcastId]);

  const infoIndex = useMemo(() => {
    return user?.info.findIndex((info) => info.podcast_id === podcastId);
  }, [user, podcastId]);

  const filteredEpisodes = useMemo(() => {
    const filtered = (episodeData || []).filter((episode) => {
      // Filter by search term
      if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, "i");
        if (!searchRegex.test(episode.title)) {
          return false;
        }
      }
      // Filter by download state
      if (!showDownloaded && episode.downloadState === "downloaded")
        return false;
      return true;
    });
    // Sort by date
    if (isAscending) {
      return filtered.toReversed();
    }
    return filtered;
  }, [episodeData, searchTerm, isAscending, showDownloaded]);

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
      }
    };

    return filteredEpisodes.map((episode) => {
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
  }, [
    filteredEpisodes,
    podcastId,
    user,
    addDownloadedEpisode,
    infoIndex,
    canDownload,
  ]);

  return (
    <div className={cn("flex flex-col w-[98%] px-4 gap-4 max-w-[720px]")}>
      <div className={cn("grid gap-4 w-full grid-cols-[auto] items-center")}>
        <div className={cn("flex gap-4 sm:items-center")}>
          <div className={cn("min-w-14")}>Sort</div>
          {/* // Toggle to sort episodes in ascending or descending order */}
          <div className={cn("flex flex-col sm:flex-row gap-2")}>
            <Toggle
              onToggle={setIsAscending}
              initialValue={isAscending}
              trueText={"Ascending"}
              falseText={"Descending"}
              label={"Sort Ascending"}
              trueIcon={<ArrowUpNarrowWide className="h-4 w-4" />}
              falseIcon={<ArrowDownNarrowWide className="h-4 w-4" />}
            />
          </div>
        </div>
        <div className={cn("flex gap-4 sm:items-center")}>
          <div className={cn("min-w-14")}>Filter</div>
          {/* // Toggle to show or hide downloaded episodes */}
          <Toggle
            onToggle={setShowDownloaded}
            initialValue={showDownloaded}
            trueText={"Showing Downloaded"}
            falseText={"Hiding Downloaded"}
            label={"show or hide downloaded episodes"}
            // falseIcon={<Check className="h-4 w-4" />}
            // trueIcon={<X className="h-4 w-4" />}
          />
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
        <EpisodeList
          episodes={episodesToDisplay}
          podcastName={podcastName}
          canDownload={canDownload}
          podcastId={podcastId}
        />
      ) : (
        <div>No episodes found</div>
      )}
    </div>
  );
};
