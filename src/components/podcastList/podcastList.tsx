'use client';
import {
  FixedSizeList,
  type FixedSizeListProps,
  type ListChildComponentProps,
} from 'react-window';
import type { PodcastV2 } from '@/types/podcasts';
import { Podcast } from './podcast';

type RowProps = ListChildComponentProps<PodcastV2[]>;

type Props = {
  podcasts: PodcastV2[];
};

export const PodcastList = ({ podcasts }: Props) => {
  const ITEM_SIZE = 120;
  const numOfPodcasts = podcasts.length;
  const VirtualList =
    FixedSizeList as unknown as React.ComponentType<
      FixedSizeListProps<PodcastV2[]>
    >;

  if (!podcasts?.length)
    return (
      <div className="flex py-4">
        <p>No favourites found</p>
      </div>
    );

  const Row = ({ index, style, data }: RowProps) => {
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
    <VirtualList
      height={Math.min(1280, ITEM_SIZE * numOfPodcasts)} // Total height of the container in pixels.
      itemCount={numOfPodcasts} // Total number of episodes.
      itemSize={ITEM_SIZE} // Function returning height of each item.
      width={'100%'} // Total width of the container in pixels.
      itemData={podcasts} // Pass podcasts as data for the Row component.
      style={{
        overflowY: 'scroll', // Allow scrolling
        scrollbarWidth: 'none', // Firefox specific to hide scrollbar
        msOverflowStyle: 'none', // Internet Explorer/Edge specific to hide scrollbar
      }}
      key={numOfPodcasts}
      itemKey={(index, data) => data[index].id}
    >
      {Row}
    </VirtualList>
  );
};
