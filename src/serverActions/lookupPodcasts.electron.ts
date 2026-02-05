'use server';
import type { Podcast, PodcastV2 } from '@/types/podcasts';
import { buildRemoteApiUrl } from '@/lib/remoteApi';

export const lookupPodcastsV2 = async (
  searchTerm: string,
  limit: number = 6,
): Promise<PodcastV2[]> => {
  const url = buildRemoteApiUrl(
    `/api/search?term=${encodeURIComponent(searchTerm)}&limit=${limit}&source=v2`,
  );

  const response = await fetch(url, { method: 'GET' });
  if (!response.ok) {
    throw new Error('Failed to fetch podcast search results');
  }
  const data = await response.json();
  return data as PodcastV2[];
};

export const lookupPodcastsV1 = async (
  searchTerm: string,
  limit: number = 6,
): Promise<Podcast[]> => {
  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(
      searchTerm,
    )}&entity=podcast&limit=${limit}`,
    { next: { revalidate: 7200 } },
  );
  const data = await response.json();
  return data.results as Podcast[];
};
