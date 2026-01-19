'use client';
import { fetchUser } from '@/lib/fetchUser';
import { getFavouriteIds } from '@/lib/getFavouriteIds';
import type { PlainUserType } from '@/models/user';
import {
  addDownloadedEpisode,
  toggleFavouritePodcast,
} from '@/serverActions/userActions';
import { create } from 'zustand';

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

export const useUserStore = create<UserState & UserStateActions>(
  (set, get) => ({
    user: null,
    loading: false,
    error: null,
    syncUser: async (email: string | null) => {
      if (email) {
        set({ loading: true });
        try {
          const data = await fetchUser(email);
          if (data.error) {
            throw data.error;
          }
          const user = data.user;
          set({ user });
        } catch (error) {
          set({ error: 'Error fetching user.' });
          console.error('Error fetching user:', error);
        } finally {
          set({ loading: false });
        }
      } else {
        set({ user: null });
      }
    },
    getFavouriteIds: () => {
      const user = get().user;
      if (!user) {
        return [];
      }
      return getFavouriteIds(user);
    },
    addDownloadedEpisode: async (podcastId: string, episodeId: string) => {
      const user = get().user;
      if (user) {
        try {
          const updatedUser = await addDownloadedEpisode(
            user,
            podcastId,
            episodeId,
          );
          set({ user: updatedUser });
        } catch (error) {
          console.error('Failed to persist download:', error);
          // Don't update state on error - user experience continues normally
        }
      }
    },
    toggleFavouritePodcast: async (podcastId: string, favourited: boolean) => {
      const user = get().user;
      if (user && !get().loading) {
        const updatedUser = await toggleFavouritePodcast(
          user,
          podcastId,
          favourited,
        );
        set({ user: updatedUser });
      }
    },
  }),
);
