'use client';
import { FixedSizeList, type FixedSizeListProps } from 'react-window';
import {
  Episode,
  EpisodeListItem,
  EpisodeSkeleton,
} from '@/components/episodeList/episode';

type EpisodeListProps = {
  episodes: EpisodeListItem[];
  podcastName: string;
  isLoading?: boolean;
};

// Row component to render each item in the list
type RowProps<EpisodeListItem> = {
  index: number; // The index of the item in the list.
  style: React.CSSProperties; // The style object provided by react-window for positioning.
  data: EpisodeListItem[]; // The array of items passed as `itemData` to the List.
};

export const EpisodeList = ({ episodes, podcastName }: EpisodeListProps) => {
  const ITEM_SIZE = 176;
  const numOfEps = episodes.length;
  const VirtualList =
    FixedSizeList as unknown as React.ComponentType<
      FixedSizeListProps<EpisodeListItem[]>
    >;

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
      />
    );
  };
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/30 p-1 sm:p-2 shadow-sm overflow-hidden">
      <VirtualList
        height={Math.min(620, ITEM_SIZE * numOfEps)} // Total height of the container in pixels.
        itemCount={numOfEps} // Total number of episodes.
        itemSize={ITEM_SIZE} // Function returning height of each item.
        width={'100%'} // Total width of the container in pixels.
        itemData={episodes} // Pass episodes as data for the Row component.
        style={{
          overflowY: 'scroll', // Allow scrolling
          scrollbarWidth: 'none', // Firefox specific to hide scrollbar
          msOverflowStyle: 'none', // Internet Explorer/Edge specific to hide scrollbar
        }}
        key={numOfEps}
        itemKey={(index, data) => data[index].episode.id}
      >
        {Row}
      </VirtualList>
    </div>
  );
};

export const EpisodeListSkeleton = () => {
  const skeletones = Array.from({ length: 5 }).map((_, i) => (
    <EpisodeSkeleton key={i} />
  ));
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/30 p-1 sm:p-2 shadow-sm">
      {skeletones}
    </div>
  );
};
