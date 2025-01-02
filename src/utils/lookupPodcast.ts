import type { PodcastV2 } from "@/types/podcasts";
import { getPodcastIndexHeaders } from "../serverActions/getPodcastIndexHeaders";

export const lookupPodcastV2 = async (
  podcastId: string
): Promise<PodcastV2> => {
  const urlEndpoint = new URL(
    "https://api.podcastindex.org/api/1.0/podcasts/byfeedid"
  );
  urlEndpoint.searchParams.append("id", podcastId);
  urlEndpoint.searchParams.append("fulltext", "true"); // If present, return the full text value of any text fields (ex: description). If not provided, field value is truncated to 100 words.

  const response = await fetch(urlEndpoint, {
    cache: "force-cache",
    headers: await getPodcastIndexHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch podcast information");
  }

  const data = await response.json();

  const {
    description,
    title,
    url,
    image,
    language,
    type,
    dead,
    episodeCount,
    newestItemPubdate,
    trackCount,
    id,
  } = data.feed;

  return {
    title,
    description,
    feedUrl: url,
    podcastImageUrl: image,
    language,
    type,
    dead,
    episodeCount,
    newestItemPubdate,
    trackCount,
    id,
  };
};
