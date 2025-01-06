"use server";
import type { PodcastV2 } from "@/types/podcasts";
import { getPodcastIndexHeaders } from "@/serverActions/getPodcastIndexHeaders";

export const lookupPodcastsV2 = async (
  searchTerm: string,
  limit: number = 6
): Promise<PodcastV2[]> => {
  const url = new URL("https://api.podcastindex.org/api/1.0/search/byterm");
  url.searchParams.append("q", searchTerm);
  url.searchParams.append("max", limit + "");
  url.searchParams.append("fulltext", "true"); // If present, return the full text value of any text fields (ex: description). If not provided, field value is truncated to 100 words.

  const response = await fetch(url, {
    headers: await getPodcastIndexHeaders(),
    method: "GET",
  });
  const data = await response.json();

  return data.feeds;
};
