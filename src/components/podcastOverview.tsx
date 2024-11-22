"use client";
import { PodcastEpisode } from "@/types/podcasts";
import { PodcastEpisodeTable } from "./podcastEpisodeTable/podcastEpisodeTable";
import { columns } from "./podcastEpisodeTable/columns";

type PodcastOverviewProps = {
  podcastEpisodes: PodcastEpisode[];
};

export const PodcastOverview = ({ podcastEpisodes }: PodcastOverviewProps) => {
  return <PodcastEpisodeTable columns={columns} data={podcastEpisodes} />;
};
