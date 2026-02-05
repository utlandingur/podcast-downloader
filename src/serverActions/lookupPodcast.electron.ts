'use server';
import type { PodcastV2 } from '@/types/podcasts';
import { buildRemoteApiUrl } from '@/lib/remoteApi';

export const lookupPodcastV2 = async (
  podcastId: string,
): Promise<PodcastV2> => {
  const url = buildRemoteApiUrl(`/api/podcast?id=${encodeURIComponent(podcastId)}`);
  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    throw new Error('Failed to fetch podcast information');
  }

  return (await response.json()) as PodcastV2;
};
