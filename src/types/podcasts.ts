export type Podcast = {
  collectionName: string;
  feedUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  artworkUrl600: string;
  collectionId: string;
  trackCount: string;
};

export type PodcastEpisode = {
  trackName: string;
  trackId: string;
  collectionId: string;
  collectionName: string;
  feedUrl: string;
  artworkUrl100: string;
  artworkUrl600: string;
  releaseDate: Date;
  trackTimeMillis: number;
  trackCount: string;
  trackViewUrl: string;
  episodeUrl: string;
};
