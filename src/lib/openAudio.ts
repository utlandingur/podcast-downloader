export const getOpenAudioUrl = (url: string) =>
  `/open-audio?url=${encodeURIComponent(url)}`;
