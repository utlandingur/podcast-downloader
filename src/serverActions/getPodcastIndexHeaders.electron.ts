'use server';

export const getPodcastIndexHeaders = async () => {
  throw new Error(
    'Podcast Index headers are unavailable in Electron build. Use remote API.',
  );
};
