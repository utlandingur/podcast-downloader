import { PodcastEpisodeV2 } from "@/types/podcasts";
import { VariableSizeList as List } from "react-window";
import { cn } from "@/lib/utils";
import { DownloadPodcastButton, DownloadState } from "./downloadPodcastButton";
import DOMPurify from "dompurify";
import { useMemo, useState } from "react";
import { DebouncedInput } from "./ui/input";
import { SortToggle } from "./ui/sortToggle";

const getItemSize = (_index: number) => {
  return 160;
};

export const ViewEpisodes = ({
  episodes,
  podcastName,
}: {
  episodes: PodcastEpisodeV2[];
  podcastName: string;
}) => {
  const [episodeData, setEpisodeData] = useState<PodcastEpisodeV2[]>(episodes);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAscending, setIsAscending] = useState(false);

  const filteredEpisodes = useMemo(() => {
    const filtered = episodes.filter((episode) => {
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
  }, [episodes, searchTerm, isAscending]);

  const handleUpdateDownloadState = (id: number, state: DownloadState) => {
    setEpisodeData((prev) => {
      const newData = [...prev];
      const indexToUpdate = prev.findIndex((episode) => episode.id === id);
      newData[indexToUpdate].downloadState = state;
      return newData;
    });
  };

  // Row component to render each item in the list
  const Row = ({ index, style, data }: RowProps<PodcastEpisodeV2>) => {
    const episodeId = data[index].id;
    const episode = episodeData.find((episode) => episode.id === episodeId);

    if (!episode) {
      return null;
    }
    const cleanDescription = DOMPurify.sanitize(episode?.description);
    const filename = `${podcastName}-episode-${episode?.title}.mp3`;

    return (
      <div
        style={style}
        className={cn(
          `flex flex-col py-4 justify-center ${
            index !== data.length - 1 && "border-b border-muted-foreground pt-4"
          }`
        )}
      >
        <div className={cn("text-sm text-muted-foreground")}>
          {episode.datePublished.toLocaleDateString()}
        </div>
        <div className={cn("line-clamp-2 text-ellipsis")}>{episode.title}</div>
        <div
          className={cn(
            "line-clamp-2 text-ellipsis text-sm text-muted-foreground "
          )}
          dangerouslySetInnerHTML={{ __html: cleanDescription }}
        />
        <div className={cn("flex justify-start pt-2")}>
          <DownloadPodcastButton
            existingState={episode.downloadState ?? "readyToDownload"}
            id={episode.id}
            updateLocalState={handleUpdateDownloadState}
            url={episode.episodeUrl}
            fileName={filename}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col w-[98%] px-4 gap-4")}>
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

      <List
        height={400} // Total height of the container in pixels.
        itemCount={filteredEpisodes.length} // Total number of episodes.
        itemSize={getItemSize} // Function returning height of each item.
        width={"100%"} // Total width of the container in pixels.
        itemData={filteredEpisodes} // Pass episodes as data for the Row component.
        style={{
          overflowY: "scroll", // Allow scrolling
          scrollbarWidth: "none", // Firefox specific to hide scrollbar
          msOverflowStyle: "none", // Internet Explorer/Edge specific to hide scrollbar
        }}
        key={filteredEpisodes.length}
        itemKey={(index, data) => data[index].id}
      >
        {Row}
      </List>
    </div>
  );
};

type RowProps<PodcastEpisodeV2> = {
  index: number; // The index of the item in the list.
  style: React.CSSProperties; // The style object provided by react-window for positioning.
  data: PodcastEpisodeV2[]; // The array of items passed as `itemData` to the List.
};
