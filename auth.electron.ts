export const auth = async () => null;

export const signIn = async () => {
  throw new Error('Local NextAuth is disabled in Electron build.');
};

export const signOut = async () => {
  throw new Error('Local NextAuth is disabled in Electron build.');
};

const notSupported = () =>
  new Response('NextAuth is disabled in Electron build.', { status: 501 });

export const handlers = {
  GET: notSupported,
  POST: notSupported,
};
