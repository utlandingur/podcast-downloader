"use server";
export type Podcast = {
  name: string;
  feedUrl: string;
  artwork: {
    30: string;
    60: string;
    100: string;
    600: string;
  };
};

export const lookupPodcasts = async (
  searchTerm: string,
  limit: number = 6
): Promise<Podcast[]> => {
  const response = await fetch(
    `https://itunes.apple.com/search?term=${searchTerm}&entity=podcast&limit=${limit}`,
    { cache: "force-cache" }
  );
  const data = await response.json();
  const podcasts: Podcast[] = data.results.map((podcast: any) => ({
    name: podcast.collectionName,
    feedUrl: podcast.feedUrl,
    artwork: {
      30: podcast.artworkUrl30,
      60: podcast.artworkUrl60,
      100: podcast.artworkUrl100,
      600: podcast.artworkUrl600,
    },
  }));
  return podcasts;
};
