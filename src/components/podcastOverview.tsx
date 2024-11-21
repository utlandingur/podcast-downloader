"use client";
import { PodcastEpisode } from "@/types/podcasts";
import { useState } from "react";
import { PodcastEpisodeTable } from "./podcastEpisodeTable/podcastEpisodeTable";
import { columns } from "./podcastEpisodeTable/columns";

type PodcastOverviewProps = {
  podcastEpisodes: PodcastEpisode[];
};

export const PodcastOverview = ({ podcastEpisodes }: PodcastOverviewProps) => {
  const [selectedEpisodes, setSelectedEpisodes] = useState<PodcastEpisode[]>(
    []
  );

  const handleSelectEpisode = (episode: PodcastEpisode) => {
    setSelectedEpisodes([...selectedEpisodes, episode]);
  };

  const handleDeselectEpisode = (episode: PodcastEpisode) => {
    setSelectedEpisodes(selectedEpisodes.filter((e) => e !== episode));
  };

  return <PodcastEpisodeTable columns={columns} data={podcastEpisodes} />;
};
