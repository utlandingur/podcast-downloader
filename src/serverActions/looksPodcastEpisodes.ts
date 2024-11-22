import type { PodcastEpisode } from "@/types/podcasts";

export const lookupPodcastEpisodes = async (
  collectionId: string
): Promise<PodcastEpisode[]> => {
  const url = `https://itunes.apple.com/lookup?id=${collectionId}&entity=podcastEpisode`;
  const response = await fetch(url, { cache: "force-cache" });

  const data = await response.json();
  const results: PodcastEpisode[] = data.results;

  return results;
};
