import { PodcastEpisodeV2 } from "@/types/podcasts";
import { cn } from "@/lib/utils";
import { DownloadState } from "./downloadPodcastButton";
import { useEffect, useMemo, useState } from "react";
import { DebouncedInput } from "./ui/input";
import { SortToggle } from "./ui/sortToggle";
import { EpisodeList } from "./episodeList";
import { addDownloadedEpisode } from "@/serverActions/userActions";
import { useUser } from "@/hooks/useUser";

export const ViewEpisodes = ({
  episodes,
  podcastName,
  userEmail,
  podcastId,
}: {
  episodes: PodcastEpisodeV2[];
  podcastName: string;
  userEmail: string | null;
  podcastId: string;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAscending, setIsAscending] = useState(false);
  const [episodeData, setEpisodeData] = useState<PodcastEpisodeV2[]>(episodes);
  const { user } = useUser(userEmail);
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
        addDownloadedEpisode(user, podcastId, id.toString());
      }
    };

    return filteredEpisodes.map((episode) => {
      return {
        episode,
        updateDownloadState: handleUpdateDownloadState,
      };
    });
  }, [filteredEpisodes, podcastId, user]);

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
