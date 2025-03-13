'use server';
import type {
  PodcastEpisode,
  PodcastEpisodeResponseV2,
  PodcastEpisodeV2,
} from '@/types/podcasts';
import { getPodcastIndexHeaders } from './getPodcastIndexHeaders';

export const lookupPodcastEpisodes = async (
  collectionId: string,
): Promise<PodcastEpisode[]> => {
  const url = `https://itunes.apple.com/lookup?id=${collectionId}&entity=podcastEpisode`;
  const response = await fetch(url, { cache: 'force-cache' });

  const data = await response.json();
  const results: PodcastEpisode[] = data.results;

  return results;
};

export const lookupPodcastEpisodesV2 = async (
  id: string,
): Promise<PodcastEpisodeV2[]> => {
  try {
    const url = new URL(
      'https://api.podcastindex.org/api/1.0/episodes/byfeedid',
    );
    url.searchParams.append('id', id);
    url.searchParams.append('max', '3000'); // Min 1, Max 1000
    url.searchParams.append('fulltext', 'true'); // If present, return the full text value of any text fields (ex: description). If not provided, field value is truncated to 100 words.

    const response = await fetch(url, {
      cache: 'force-cache',
      headers: await getPodcastIndexHeaders(),
      method: 'GET',
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    const episodes = data.items.map((item: PodcastEpisodeResponseV2) => {
      const { description, datePublished, episode, enclosureUrl, title, id } =
        item;

      const podcastEpisode: PodcastEpisodeV2 = {
        description,
        datePublished: new Date(Number(datePublished) * 1000), // convert from unix timestamp
        episodeNumber: episode,
        episodeUrl: enclosureUrl,
        title,
        id,
      };
      return podcastEpisode;
    });

    return episodes;
  } catch (error) {
    console.error('Error fetching episodes', error);
  }
  return [];
};
