'use client';
import { FixedSizeList as List } from 'react-window';
import { usePodcastsV2 } from '@/hooks/usePodcast';
import type { PodcastV2 } from '@/types/podcasts';
import { Podcast } from './podcast';
import { LoadingSpinner } from '../ui/loadingSpinner';

// Row component to render each item in the list
type RowProps<PodcastV2> = {
  index: number; // The index of the item in the list.
  style: React.CSSProperties; // The style object provided by react-window for positioning.
  data: PodcastV2[]; // The array of items passed as `itemData` to the List.
};

type Props = {
  ids: string[];
};

export const PodcastList = ({ ids }: Props) => {
  const ITEM_SIZE = 120;
  const numOfPodcasts = ids.length;
  const { isLoading, error, data } = usePodcastsV2(ids);

  if (error) return <p>Failed to load podcasts</p>;

  if (isLoading)
    return (
      <div className="flex w-full h-full justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  if (!data?.length)
    return (
      <div className="flex py-4">
        <p>No favourites found</p>
      </div>
    );

  const Row = ({ index, style, data }: RowProps<PodcastV2>) => {
    const { title, id, image } = data[index];

    const showBorder = index !== numOfPodcasts - 1;
    return (
      <Podcast
        title={title}
        image={image}
        id={id}
        style={style}
        showBorder={showBorder}
      />
    );
  };
  return (
    <List
      height={Math.min(420, ITEM_SIZE * numOfPodcasts)} // Total height of the container in pixels.
      itemCount={numOfPodcasts} // Total number of episodes.
      itemSize={ITEM_SIZE} // Function returning height of each item.
      width={'100%'} // Total width of the container in pixels.
      itemData={data} // Pass podcasts as data for the Row component.
      style={{
        overflowY: 'scroll', // Allow scrolling
        scrollbarWidth: 'none', // Firefox specific to hide scrollbar
        msOverflowStyle: 'none', // Internet Explorer/Edge specific to hide scrollbar
      }}
      key={numOfPodcasts}
      itemKey={(index, data) => data[index].id}
    >
      {Row}
    </List>
  );
};
