'use client';
import { PodcastEpisodeTable } from './podcastEpisodeTable/podcastEpisodeTable';
import { columns } from './podcastEpisodeTable/columns';
import { Image } from '@/components/ui/image';
import { usePodcastEpisodes } from '@/hooks/usePodcastEpisodes';
import { LoadingSpinner } from './ui/loadingSpinner';
import { cn } from '@/lib/utils';
import { SocialShareLinks } from './socialShareLinks';
import Link from 'next/link';

type PodcastOverviewProps = {
  id: string;
};

export const PodcastOverview = ({ id }: PodcastOverviewProps) => {
  const { data: podcastEpisodes } = usePodcastEpisodes(id);

  if (!podcastEpisodes)
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  const podCastName = podcastEpisodes[0]?.collectionName;
  const imageUrl = podcastEpisodes[0]?.artworkUrl160;
  const officialUrl = podcastEpisodes[0]?.trackViewUrl?.startsWith('http')
    ? podcastEpisodes[0]?.trackViewUrl
    : podcastEpisodes[0]?.feedUrl?.startsWith('http')
      ? podcastEpisodes[0]?.feedUrl
      : undefined;

  if (!podCastName) return <p>Podcast not found</p>;

  return (
    <>
      <h1 className={cn('text-center')}>{podCastName}</h1>
      {imageUrl && (
        <>
          {officialUrl ? (
            <Link href={officialUrl} target="_blank" rel="noreferrer">
              <Image
                width={100}
                height={100}
                src={imageUrl}
                alt={`Artwork for ${podCastName}`}
              />
            </Link>
          ) : (
            <Image
              width={100}
              height={100}
              src={imageUrl}
              alt={`Artwork for ${podCastName}`}
            />
          )}
        </>
      )}
      <p className="text-center">{`Download your favourite podcast episodes from ${podCastName} as an mp3 file.`}</p>
      <PodcastEpisodeTable columns={columns} data={podcastEpisodes} />
      <SocialShareLinks
        url={'https://podcasttomp3.com/podcasts/' + id}
        title={'Download mp3s for podcast: ' + podCastName}
      />
    </>
  );
};
