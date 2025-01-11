"use client";
import { create } from "zustand";

type CantDownloadState = {
  podcasts: {
    podcastId: string;
    openInNewTab: boolean;
  }[];
};

type CantDownloadStateActions = {
  setCannotDownload: (podcastId: string) => void;
};

export const useCantDownloadStore = create<
  CantDownloadState & CantDownloadStateActions
>((set, get) => ({
  podcasts: [],
  setCannotDownload: (podcastId: string) => {
    const containsPodcast = get().podcasts.some(
      (podcast) => podcast.podcastId === podcastId
    );
    if (!containsPodcast) {
      set((state) => ({
        podcasts: [...state.podcasts, { podcastId, openInNewTab: false }],
      }));
    }
  },
}));
