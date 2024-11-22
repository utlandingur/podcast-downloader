"use server";

import { Podcast } from "@/types/podcasts";

export const lookupPodcasts = async (
  searchTerm: string,
  limit: number = 6
): Promise<Podcast[]> => {
  const response = await fetch(
    `https://itunes.apple.com/search?term=${searchTerm}&entity=podcast&limit=${limit}`,
    { cache: "force-cache" }
  );
  const data = await response.json();

  return data.results;
};
