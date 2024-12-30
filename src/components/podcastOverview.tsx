"use client";
import { PodcastEpisodeTable } from "./podcastEpisodeTable/podcastEpisodeTable";
import { columns } from "./podcastEpisodeTable/columns";
import { usePodcastEpisodes } from "@/hooks/usePodcastEpisodes";
import { LoadingSpinner } from "./ui/loadingSpinner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SocialShareLinks } from "./socialShareLinks";

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
