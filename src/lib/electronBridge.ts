type DownloadPayload = {
  url: string;
  filename: string;
};

type DownloadResult = {
  success: boolean;
  path?: string;
  error?: string;
  aborted?: boolean;
};

type RemoteResponse = {
  ok: boolean;
  status: number;
  data: unknown;
};

type AuthResult = { success: boolean; error?: string };
type AuthSessionResult = { session: unknown | null; error?: string };

export const isElectron = () => false;

export const canOpenElectronAuthWindow = () => false;

export const openElectronAuthWindow = async (
  _url: string,
): Promise<AuthResult | null> => null;

export const downloadEpisodeViaElectron = async (
  _payload: DownloadPayload,
): Promise<DownloadResult | null> => null;

export const remoteRequest = async (
  _payload: {
    path: string;
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
  },
): Promise<RemoteResponse | null> => null;

export const authSignIn = async (): Promise<AuthResult | null> => null;

export const authGetSession = async (): Promise<AuthSessionResult | null> =>
  null;

export const authSignOut = async (): Promise<AuthResult | null> => null;
