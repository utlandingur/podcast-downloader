"use client";
import { PodcastEpisodeTable } from "./podcastEpisodeTable/podcastEpisodeTable";
import { columns } from "./podcastEpisodeTable/columns";
import { usePodcastEpisodes } from "@/hooks/usePodcastEpisodes";
import { LoadingSpinner } from "./ui/loadingSpinner";

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

  return <PodcastEpisodeTable columns={columns} data={podcastEpisodes} />;
};
