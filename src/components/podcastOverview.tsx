"use client";
import { PodcastEpisode } from "@/types/podcasts";
import { useState } from "react";
import { DataTable } from "./podcastEpisodeDemo.tsx/demo";
import { columns } from "./podcastEpisodeDemo.tsx/columns";

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

  return <DataTable columns={columns} data={podcastEpisodes} />;
};
