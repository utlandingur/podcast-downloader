"use client";
import { PodcastEpisodeTable } from "./podcastEpisodeTable/podcastEpisodeTable";
import { columns } from "./podcastEpisodeTable/columns";

import {
  usePodcastEpisodes,
  usePodcastEpisodesV2,
} from "@/hooks/usePodcastEpisodes";
import { LoadingSpinner } from "./ui/loadingSpinner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SocialShareLinks } from "./socialShareLinks";
import { usePodcastV2 } from "@/hooks/usePodcast";
import { EpisodesView } from "@/components/episodesView";
import { Session } from "next-auth";
import { useSyncUser } from "@/hooks/useInitialUserFetch";

type PodcastOverviewProps = {
  id: string;
};

type PodcastOverviewV2Props = {
  id: string;
  session: Session | null;
};

export const PodcastOverview = ({ id }: PodcastOverviewProps) => {
  const { data: podcastEpisodes } = usePodcastEpisodes(id);

  if (!podcastEpisodes)
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  const podCastName = podcastEpisodes[0].collectionName;
  const imageUrl = podcastEpisodes[0].artworkUrl160;

  return (
    <>
      <h1 className={cn("text-center")}>{podCastName}</h1>
      <Image
        width={100}
        height={100}
        src={imageUrl}
        alt={`Artwork for ${podCastName}`}
      />
      <p className="text-center">{`Download your favourite podcast episodes from ${podCastName} as an mp3 file.`}</p>
      <PodcastEpisodeTable columns={columns} data={podcastEpisodes} />
      <SocialShareLinks
        url={"https://podcasttomp3.com/podcasts/" + id}
        title={"Download mp3s for podcast: " + podCastName}
      />
    </>
  );
};

export const PodcastOverviewV2 = ({ id, session }: PodcastOverviewV2Props) => {
  const { data: episodes } = usePodcastEpisodesV2(id);
  const { data: podcast } = usePodcastV2(id);

  useSyncUser(session || null);

  if (!episodes || !podcast)
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      <h1 className={cn("text-center line-clamp-5 w-full")}>{podcast.title}</h1>

      <Image
        width={100}
        height={100}
        className="rounded-md"
        src={podcast.image}
        alt={`Artwork for ${podcast.title}`}
      />
      <p className="text-center">{`Download your favourite podcast episodes from ${podcast.title} as an mp3 file.`}</p>
      <EpisodesView
        episodes={episodes}
        podcastName={podcast.title}
        podcastId={podcast.id.toString()}
      />

      <SocialShareLinks
        url={"https://podcasttomp3.com/podcasts/" + id}
        title={"Download mp3s for podcast: " + podcast.title}
      />
    </>
  );
};
