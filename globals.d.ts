// globals.d.ts or google.d.ts
declare global {
  interface Window {
    google: any; // Declare google as a property of the window object
    electronAPI?: {
      isElectron?: boolean;
      downloadEpisode?: (payload: {
        url: string;
        filename: string;
      }) => Promise<{
        success: boolean;
        path?: string;
        error?: string;
        aborted?: boolean;
      }>;
      openAuthWindow?: (payload: {
        url: string;
        successOrigin?: string;
      }) => Promise<{
        success: boolean;
        error?: string;
      }>;
      authSignIn?: () => Promise<{ success: boolean; error?: string }>;
      authGetSession?: () => Promise<{ session: any | null; error?: string }>;
      authSignOut?: () => Promise<{ success: boolean; error?: string }>;
      remoteRequest?: (payload: {
        path: string;
        method?: string;
        headers?: Record<string, string>;
        body?: unknown;
      }) => Promise<{ ok: boolean; status: number; data: unknown }>;
    };
  }
}

export {};
