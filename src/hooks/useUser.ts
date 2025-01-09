"use client";
import type { PlainUserType } from "@/models/user";
import {
  addDownloadedEpisode,
  findOrCreateUser,
  toggleFavouritePodcast,
} from "@/serverActions/userActions";
import { Session } from "next-auth";
import { create } from "zustand";

type UserState = {
  user: PlainUserType | null;
  loading: boolean;
  error: string | null;
};

type UserStateActions = {
  syncUser: (session: Session | null) => Promise<void>;
  addDownloadedEpisode: (podcastId: string, episodeId: string) => Promise<void>;
  toggleFavouritePodcast: (
    podcastId: string,
    favourited: boolean
  ) => Promise<void>;
};

export const useUserStore = create<UserState & UserStateActions>(
  (set, get) => ({
    user: null,
    loading: false,
    error: null,
    syncUser: async (session: Session | null) => {
      const email = session?.user?.email;

      if (email) {
        try {
          set({ loading: true });
          const user = await findOrCreateUser(email);
          set({ user });
        } catch (error) {
          set({ error: "Error fetching user." });
          console.error("Error fetching user:", error);
        } finally {
          set({ loading: false });
        }
      } else {
        set({ user: null });
      }
    },
    addDownloadedEpisode: async (podcastId: string, episodeId: string) => {
      const user = get().user;
      if (user) {
        const updatedUser = await addDownloadedEpisode(
          user,
          podcastId,
          episodeId
        );
        set({ user: updatedUser });
      }
    },
    toggleFavouritePodcast: async (podcastId: string, favourited: boolean) => {
      const user = get().user;
      if (user) {
        const updatedUser = await toggleFavouritePodcast(
          user,
          podcastId,
          favourited
        );
        set({ user: updatedUser });
      }
    },
  })
);
