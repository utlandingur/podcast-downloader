'use client';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/searchBar';
import type { SearchResult } from '@/components/searchBar';
import {
  lookupPodcastsV1,
  lookupPodcastsV2,
} from '@/serverActions/lookupPodcasts';
import { PodcastsSearchResponseV2 } from '@/types/podcasts';

export const PodcastSearchBar = () => {
  const router = useRouter();

  const podcastSearch = async (searchTerm: string): Promise<SearchResult[]> => {
    if (!searchTerm) return [];
    const podcasts = await lookupPodcastsV2(searchTerm, 6);
    return podcasts.map((podcast: PodcastsSearchResponseV2) => ({
      name: podcast.title,
      label: podcast.title,
      image: podcast.image,
      handleOnClick: () => {
        router.push(`/podcasts/v2/${JSON.stringify(podcast.id)}`);
      },
    }));
  };

  return <SearchBar searchQuery={podcastSearch} />;
};

export const PodcastSearchBarV1 = () => {
  const router = useRouter();

  const podcastSearch = async (searchTerm: string): Promise<SearchResult[]> => {
    if (!searchTerm) return [];
    const podcasts = await lookupPodcastsV1(searchTerm, 6);

    return podcasts.map((podcast) => ({
      name: podcast.collectionName,
      label: podcast.collectionName,
      image: podcast.artworkUrl100,
      handleOnClick: () => {
        router.push(`/podcasts/${JSON.stringify(podcast.collectionId)}`);
      },
    }));
  };

  return <SearchBar searchQuery={podcastSearch} />;
};
