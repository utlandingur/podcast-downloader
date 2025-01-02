"use client";
import { PodcastEpisodeTable } from "./podcastEpisodeTable/podcastEpisodeTable";

import {
  usePodcastEpisodes,
  usePodcastEpisodesV2,
} from "@/hooks/usePodcastEpisodes";
import { LoadingSpinner } from "./ui/loadingSpinner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SocialShareLinks } from "./socialShareLinks";
import { usePodcastV2 } from "@/hooks/usePodcast";
import { EnrichedEpisodeV2 } from "@/types/podcasts";
import { PodcastEpisodeTableV2 } from "./podcastEpisodeTableV2/podcastEpisodeTableV2";
import { columns as columnsV2 } from "./podcastEpisodeTableV2/columns";
import { columns } from "./podcastEpisodeTable/columns";

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

export const PodcastOverviewV2 = ({ id }: PodcastOverviewProps) => {
  const { data: episodes } = usePodcastEpisodesV2(id);
  const { data: podcast } = usePodcastV2(id);

  if (!episodes || !podcast)
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  console.log("episodes", episodes);

  const enrichedEpisodes: EnrichedEpisodeV2[] = episodes.map((episode) => {
    return {
      ...episode,
      podcastName: podcast.title,
    };
  });

  console.log("enrichedEpisodes", enrichedEpisodes);

  return (
    <>
      <h1 className={cn("text-center")}>{podcast.title}</h1>
      <Image
        width={100}
        height={100}
        className="rounded-md"
        src={podcast.podcastImageUrl}
        alt={`Artwork for ${podcast.title}`}
      />
      <p className="text-center">{`Download your favourite podcast episodes from ${podcast.title} as an mp3 file.`}</p>
      <PodcastEpisodeTableV2 columns={columnsV2} data={enrichedEpisodes} />
      <SocialShareLinks
        url={"https://podcasttomp3.com/podcasts/" + id}
        title={"Download mp3s for podcast: " + podcast.title}
      />
    </>
  );
};
