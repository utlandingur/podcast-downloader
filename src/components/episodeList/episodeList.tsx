'use client';
import { FixedSizeList } from 'react-window';
import {
  Episode,
  EpisodeListItem,
  EpisodeSkeleton,
} from '@/components/episodeList/episode';

type EpisodeListProps = {
  episodes: EpisodeListItem[];
  podcastName: string;
  podcastId?: string;
  isLoading?: boolean;
};

// Row component to render each item in the list
type RowProps<EpisodeListItem> = {
  index: number; // The index of the item in the list.
  style: React.CSSProperties; // The style object provided by react-window for positioning.
  data: EpisodeListItem[]; // The array of items passed as `itemData` to the List.
};

export const EpisodeList = ({ episodes, podcastName, podcastId }: EpisodeListProps) => {
  const ITEM_SIZE = 160;
  const numOfEps = episodes.length;

  const Row = ({ index, style, data }: RowProps<EpisodeListItem>) => {
    const { episode, updateDownloadState } = data[index];

    const showBorder = index !== numOfEps - 1;

    return (
      <Episode
        podcastName={podcastName}
        podcastId={podcastId}
        episode={episode}
        handleDownloadState={updateDownloadState}
        style={style}
        showBorder={showBorder}
      />
    );
  };
  return (
    <div className="border border-gray-200 rounded-md p-4">
      <FixedSizeList
        height={Math.min(530, ITEM_SIZE * numOfEps)} // Total height of the container in pixels.
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
      </FixedSizeList>
    </div>
  );
};

export const EpisodeListSkeleton = () => {
  const skeletones = Array.from({ length: 5 }).map((_, i) => (
    <EpisodeSkeleton key={i} />
  ));
  return <>{skeletones}</>;
};
