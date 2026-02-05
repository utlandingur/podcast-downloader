import type {
  Podcast,
  PodcastEpisode,
  PodcastEpisodeV2,
  PodcastV2,
} from '@/types/podcasts';
import { apiGet } from '@/lib/api/request';

export const searchPodcastsV2 = async (
  term: string,
  limit = 6,
): Promise<PodcastV2[]> => {
  const res = await apiGet<PodcastV2[]>(
    `/api/search?term=${encodeURIComponent(term)}&limit=${limit}&source=v2`,
  );
  if (!res.ok || !res.data) {
    throw new Error('Failed to fetch podcast search results');
  }
  return res.data;
};

export const searchPodcastsV1 = async (
  term: string,
  limit = 6,
): Promise<Podcast[]> => {
  const res = await apiGet<Podcast[]>(
    `/api/search?term=${encodeURIComponent(term)}&limit=${limit}&source=v1`,
  );
  if (!res.ok || !res.data) {
    throw new Error('Failed to fetch podcast search results');
  }
  return res.data;
};

export const getPodcastV2 = async (id: string): Promise<PodcastV2> => {
  const res = await apiGet<PodcastV2>(
    `/api/podcast?id=${encodeURIComponent(id)}`,
  );
  if (!res.ok || !res.data) {
    throw new Error('Failed to fetch podcast information');
  }
  return res.data;
};

export const getPodcastEpisodesV2 = async (
  id: string,
): Promise<PodcastEpisodeV2[]> => {
  const res = await apiGet<PodcastEpisodeV2[]>(
    `/api/episodes?id=${encodeURIComponent(id)}`,
  );
  if (!res.ok || !res.data) {
    return [];
  }
  return res.data;
};

export const getPodcastEpisodesV1 = async (
  id: string,
): Promise<PodcastEpisode[]> => {
  const res = await apiGet<PodcastEpisode[]>(
    `/api/episodes?id=${encodeURIComponent(id)}&source=v1`,
  );
  if (!res.ok || !res.data) {
    return [];
  }
  return res.data.length > 1 ? res.data.slice(1) : [];
};
