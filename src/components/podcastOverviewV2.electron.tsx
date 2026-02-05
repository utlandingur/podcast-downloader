'use client';
import { EpisodesView } from '@/components/episodesView/episodesView';
import type { PodcastV2 } from '@/types/podcasts';
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';
import { Donate } from './donate';
import Link from 'next/link';
import { useSession } from '@/lib/authClient';

type PodcastOverviewV2Props = {
  podcast: PodcastV2;
  session?: unknown;
};

export const PodcastOverviewV2 = ({ podcast }: PodcastOverviewV2Props) => {
  const { data: session } = useSession();
  const officialUrl = podcast.link?.startsWith('http')
    ? podcast.link
    : undefined;
  return (
    <>
      <h1 className={cn('text-center line-clamp-5 w-full')}>{podcast.title}</h1>
      {officialUrl ? (
        <Link href={officialUrl} target="_blank" rel="noreferrer">
          <Image
            width={100}
            height={100}
            className="rounded-md"
            src={podcast.image}
            alt={`Artwork for ${podcast.title}`}
            loading="lazy"
          />
        </Link>
      ) : (
        <Image
          width={100}
          height={100}
          className="rounded-md"
          src={podcast.image}
          alt={`Artwork for ${podcast.title}`}
          loading="lazy"
        />
      )}
      <p className="text-center">{`Download your favourite podcast episodes from ${podcast.title} as an mp3 file.`}</p>
      <EpisodesView
        podcastName={podcast.title}
        podcastId={podcast.id.toString()}
        isLoggedIn={!!session}
      />
      <div className="w-[98%] max-w-[720px] px-4">
        <Donate className="bg-foreground text-background" />
      </div>
    </>
  );
};
