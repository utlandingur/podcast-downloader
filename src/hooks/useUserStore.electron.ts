'use client';
import { create } from 'zustand';
import type { PlainUserType } from '@/models/user';
import { remoteRequest } from '@/lib/electronBridge.electron';

type UserState = {
  user: PlainUserType | null;
  loading: boolean;
  error: string | null;
};

type UserStateActions = {
  syncUser: (email: string | null) => Promise<void>;
  getFavouriteIds: () => string[];
  addDownloadedEpisode: (podcastId: string, episodeId: string) => Promise<void>;
  toggleFavouritePodcast: (
    podcastId: string,
    favourited: boolean,
  ) => Promise<void>;
};

type RemoteResponse = { ok: boolean; status: number; data: unknown };

const getUserFromResponse = (res: RemoteResponse | null) => {
  if (!res || !res.ok) return null;
  if (!res.data || typeof res.data !== 'object') return null;
  const user = (res.data as { user?: PlainUserType }).user;
  return user ?? null;
};

const requestJson = async (payload: {
  path: string;
  method?: string;
  body?: unknown;
}) => {
  const response = await remoteRequest({
    path: payload.path,
    method: payload.method,
    headers: { 'Content-Type': 'application/json' },
    body: payload.body,
  });
  return response as RemoteResponse | null;
};

export const useUserStore = create<UserState & UserStateActions>(
  (set, get) => ({
    user: null,
    loading: false,
    error: null,
    syncUser: async (email: string | null) => {
      if (!email) {
        set({ user: null });
        return;
      }
      set({ loading: true });
      try {
        const res = await requestJson({ path: '/api/user', method: 'GET' });
        if (!res || !res.ok) {
          set({ user: null, error: 'Unauthorized' });
          return;
        }
        const user = getUserFromResponse(res);
        set({ user, error: null });
      } catch (error) {
        console.error('Error fetching user:', error);
        set({ error: 'Error fetching user.' });
      } finally {
        set({ loading: false });
      }
    },
    getFavouriteIds: () => {
      const user = get().user;
      if (!user) return [];
      return user.info
        .filter((info) => info.favourited)
        .map((info) => info.podcast_id);
    },
    addDownloadedEpisode: async (podcastId: string, episodeId: string) => {
      if (get().loading) return;
      set({ loading: true });
      try {
        const res = await requestJson({
          path: '/api/user/downloaded',
          method: 'POST',
          body: { podcastId, episodeId },
        });
        const user = getUserFromResponse(res);
        if (user) set({ user, error: null });
      } catch (error) {
        console.error('Error updating downloads:', error);
        set({ error: 'Error updating downloads.' });
      } finally {
        set({ loading: false });
      }
    },
    toggleFavouritePodcast: async (podcastId: string, favourited: boolean) => {
      if (get().loading) return;
      set({ loading: true });
      try {
        const res = await requestJson({
          path: '/api/user/favourite',
          method: 'POST',
          body: { podcastId, favourited },
        });
        const user = getUserFromResponse(res);
        if (user) set({ user, error: null });
      } catch (error) {
        console.error('Error updating favourite:', error);
        set({ error: 'Error updating favourite.' });
      } finally {
        set({ loading: false });
      }
    },
  }),
);
