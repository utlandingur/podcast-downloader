import type { PodcastTrack } from "@/types/podcasts";

export const lookupPodcastEpisodes = async (
  collectionId: string
): Promise<PodcastTrack[]> => {
  const response = await fetch(
    `https://itunes.apple.com/lookup?id=${collectionId}&entity=podcastEpisode
      `,
    { cache: "force-cache" }
  );
  const data = await response.json();
  const results: PodcastTrack[] = data.results;
  return data.results;
};
