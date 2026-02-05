'use server';
import type {
  PodcastEpisode,
  PodcastEpisodeV2,
} from '@/types/podcasts';
import { buildRemoteApiUrl } from '@/lib/remoteApi';

export const lookupPodcastEpisodes = async (
  collectionId: string,
): Promise<PodcastEpisode[]> => {
  const url = `https://itunes.apple.com/lookup?id=${encodeURIComponent(
    collectionId,
  )}&entity=podcastEpisode`;
  const response = await fetch(url, { next: { revalidate: 7200 } });

  const data = await response.json();
  const results: PodcastEpisode[] = data.results;

  return results;
};

export const lookupPodcastEpisodesV2 = async (
  id: string,
  _start?: number,
): Promise<PodcastEpisodeV2[]> => {
  const url = buildRemoteApiUrl(`/api/episodes?id=${encodeURIComponent(id)}`);
  const response = await fetch(url, { method: 'GET' });
  if (!response.ok) {
    return [];
  }
  return (await response.json()) as PodcastEpisodeV2[];
};

export const lookupRecentPodcastEpisodes = async (
  _id: string,
): Promise<PodcastEpisodeV2[]> => {
  return [];
};

export const lookupOlderPodcastEpisodes = async (
  _id: string,
  _lastTimestamp?: number,
): Promise<PodcastEpisodeV2[]> => {
  return [];
};
