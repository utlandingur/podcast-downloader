"use server";

import { Podcast } from "@/types/podcasts";

export const lookupPodcast = async (collectionId: string): Promise<Podcast> => {
  const response = await fetch(
    `https://itunes.apple.com/lookup?id=${collectionId}&entity=podcast
    `,
    { cache: "force-cache" }
  );
  const data = await response.json();
  return data.results[0];
};
