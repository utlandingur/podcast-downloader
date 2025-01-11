import { FixedSizeList as List } from "react-window";
import { Episode, EpisodeListItem } from "@/components/episode";

type EpisodeListProps = {
  episodes: EpisodeListItem[];
  podcastName: string;
  canDownload: boolean; // Find a better way to pass this down. Lots of prop drilling.
  podcastId: string; // Find a better way to pass this down. Lots of prop drilling.
};

// Row component to render each item in the list
type RowProps<EpisodeListItem> = {
  index: number; // The index of the item in the list.
  style: React.CSSProperties; // The style object provided by react-window for positioning.
  data: EpisodeListItem[]; // The array of items passed as `itemData` to the List.
};

export const EpisodeList = ({
  episodes,
  podcastName,
  canDownload,
  podcastId,
}: EpisodeListProps) => {
  const ITEM_SIZE = 160;
  const numOfEps = episodes.length;

  const Row = ({ index, style, data }: RowProps<EpisodeListItem>) => {
    const { episode, updateDownloadState } = data[index];

    const showBorder = index !== numOfEps - 1;
    return (
      <Episode
        podcastName={podcastName}
        episode={episode}
        handleDownloadState={updateDownloadState}
        style={style}
        showBorder={showBorder}
        canDownload={canDownload}
        podcastId={podcastId}
      />
    );
  };
  return (
    <List
      height={Math.min(640, ITEM_SIZE * numOfEps)} // Total height of the container in pixels.
      itemCount={numOfEps} // Total number of episodes.
      itemSize={ITEM_SIZE} // Function returning height of each item.
      width={"100%"} // Total width of the container in pixels.
      itemData={episodes} // Pass episodes as data for the Row component.
      style={{
        overflowY: "scroll", // Allow scrolling
        scrollbarWidth: "none", // Firefox specific to hide scrollbar
        msOverflowStyle: "none", // Internet Explorer/Edge specific to hide scrollbar
      }}
      key={numOfEps}
      itemKey={(index, data) => data[index].episode.id}
    >
      {Row}
    </List>
  );
};
