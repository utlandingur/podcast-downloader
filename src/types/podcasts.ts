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
  artworkUrl160: string;
  artworkUrl600: string;
  releaseDate: Date;
  trackTimeMillis: number;
  trackCount: string;
  trackViewUrl: string;
  episodeUrl: string;
};

//---- API V2 uses PodcastIndex.org---- //
export type PodcastV2 = {
  id: number;
  title: string;
  feedUrl: string;
  description: string;
  image: string;
  language: string;
  type: number; // 0:RSS, 1:Atom
  dead: boolean; // Once the feed is marked dead, checked once per month.
  episodeCount: number;
  newestItemPubdate: number;
  trackCount: string;
};

enum TranscriptType {
  ApplicationJson = "application/json",
  ApplicationSrt = "application/srt",
  TextHtml = "text/html",
  TextPlain = "text/plain",
  TextSrt = "text/srt",
  TextVtt = "text/vtt",
}

export type PodcastEpisodeResponseV2 = {
  title: string;
  id: number;
  description: string;
  datePublished: string;
  feedImage: string;
  episode: number | null; // episode number
  season: number | null; // season number
  feedLanguage: string;
  transcriptUrl: URL | null;
  transcripts: { url: URL; type: TranscriptType }[];
  enclosureUrl: string; // link to the file
};

export type PodcastEpisodeV2 = {
  title: string;
  description: string; // description of the podcast episode
  datePublished: Date;
  episodeNumber: number | null; // episode number
  language?: string;
  id: number;
  episodeUrl: string;
  transcriptUrl?: URL | null;
  transcripts?: { url: URL; type: TranscriptType }[];
  downloadState?: DownloadState;
};

export type EnrichedEpisodeV2 = PodcastEpisodeV2 & { podcastName: string };
