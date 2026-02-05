export const getRemoteApiBase = () =>
  process.env.NEXT_PUBLIC_REMOTE_API_BASE || 'https://podcasttomp3.com';

export const buildRemoteApiUrl = (path: string) => {
  const base = getRemoteApiBase();
  return new URL(path, base).toString();
};
