type FormatEpisodeFilenameOptions = {
  podcastName: string;
  episodeNumber?: number | null;
  episodeTitle?: string;
};

export const formatEpisodeFilename = ({
  podcastName,
  episodeNumber,
  episodeTitle,
}: FormatEpisodeFilenameOptions) => {
  const trimmedPodcast = podcastName.trim();
  const number =
    typeof episodeNumber === 'number' && Number.isFinite(episodeNumber)
      ? episodeNumber
      : null;
  const trimmedTitle = episodeTitle?.trim();

  if (number !== null && trimmedTitle) {
    return `${trimmedPodcast}-${number}-${trimmedTitle}.mp3`;
  }

  if (number !== null) {
    return `${trimmedPodcast}-${number}.mp3`;
  }

  if (trimmedTitle) {
    return `${trimmedPodcast}-${trimmedTitle}.mp3`;
  }

  return `${trimmedPodcast}.mp3`;
};
