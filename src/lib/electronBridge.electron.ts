type DownloadPayload = {
  url: string;
  filename: string;
};

export const isElectron = () =>
  typeof window !== 'undefined' && !!window.electronAPI;

export const canOpenElectronAuthWindow = () =>
  typeof window !== 'undefined' && !!window.electronAPI?.openAuthWindow;

export const openElectronAuthWindow = async (url: string) => {
  if (!canOpenElectronAuthWindow()) return null;
  return window.electronAPI?.openAuthWindow?.({ url }) ?? null;
};

export const downloadEpisodeViaElectron = async (payload: DownloadPayload) => {
  if (!isElectron() || !window.electronAPI?.downloadEpisode) return null;
  return window.electronAPI.downloadEpisode(payload);
};

export const remoteRequest = async (payload: {
  path: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}): Promise<{ ok: boolean; status: number; data: unknown } | null> => {
  if (!isElectron() || !window.electronAPI?.remoteRequest) return null;
  return window.electronAPI.remoteRequest(payload);
};

export const authSignIn = async () => {
  if (!isElectron() || !window.electronAPI?.authSignIn) return null;
  return window.electronAPI.authSignIn();
};

export const authGetSession = async () => {
  if (!isElectron() || !window.electronAPI?.authGetSession) return null;
  return window.electronAPI.authGetSession();
};

export const authSignOut = async () => {
  if (!isElectron() || !window.electronAPI?.authSignOut) return null;
  return window.electronAPI.authSignOut();
};
