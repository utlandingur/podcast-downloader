import type { PodcastEpisodeV2, PodcastV2 } from '@/types/podcasts';

const MOCK_PODCAST_V2: PodcastV2 = {
  id: 123,
  title: 'Planet Money',
  feedUrl: 'https://example.com/feed.xml',
  link: 'https://example.com/planet-money',
  description: 'A mock podcast for end-to-end tests.',
  image: 'https://example.com/planet-money.jpg',
  language: 'en',
  type: 0,
  dead: false,
  episodeCount: 2,
  newestItemPubdate: new Date(),
  trackCount: '2',
};

const MOCK_EPISODES_V2: PodcastEpisodeV2[] = [
  {
    id: 1,
    title: 'Episode One',
    description: 'First episode description.',
    datePublished: new Date().toISOString() as unknown as Date,
    episodeNumber: 1,
    episodeUrl: 'https://media.example.com/audio-success.mp3',
  },
  {
    id: 2,
    title: 'Episode Two',
    description: 'Second episode description.',
    datePublished: new Date().toISOString() as unknown as Date,
    episodeNumber: 2,
    episodeUrl: 'https://media.example.com/audio-fail.mp3',
  },
];

export const getE2EMockSearchResults = (term: string) => {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return [];
  return [MOCK_PODCAST_V2].filter((podcast) =>
    podcast.title.toLowerCase().includes(normalized),
  );
};

export const getE2EMockPodcast = (id: string) => {
  if (String(MOCK_PODCAST_V2.id) === String(id)) return MOCK_PODCAST_V2;
  return null;
};

export const getE2EMockEpisodes = (id: string) => {
  if (String(MOCK_PODCAST_V2.id) === String(id)) return MOCK_EPISODES_V2;
  return [];
};
