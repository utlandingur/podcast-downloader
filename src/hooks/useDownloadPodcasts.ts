"use client";
import {
  downloadInfo,
  downloadPodcastEpisodes as serverDownloadPodcastEpisodes,
} from "@/serverActions/downloadPodcastEpisodes";
import exportZip from "@/utils/zip";
import { useState } from "react";

export const useDownloadPodcasts = () => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadPodcastEpisodes = async (downloadData: downloadInfo[]) => {
    setIsLoading(true);

    // Call the server action
    const responses = await serverDownloadPodcastEpisodes(downloadData);

    // Convert base64 data to blobs (if the server returns base64-encoded data)
    const blobs = responses?.map((response) => {
      const byteCharacters = atob(response.data); // decode base64 to raw bytes
      const byteArrays = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }

      return new Blob([byteArrays], { type: "audio/mp3" });
    });

    if (!blobs?.length) {
      console.log("Error downloading episodes");
      setIsLoading(false);
      return;
    }

    // Call the utility function to export the blobs into a zip file
    await exportZip(blobs);

    console.log("All episodes downloaded");
    setIsLoading(false);
  };

  return { downloadPodcastEpisodes, isLoading };
};
