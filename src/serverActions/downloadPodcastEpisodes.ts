"use server";
import base64js from "base64-js";

const downloadPodcastEpisode = async (downloadInfo: downloadInfo) => {
  const { name, episodeName, url } = downloadInfo;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to download podcast episode");
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (error) {
    throw new Error(`Failed to download episode: ${episodeName}`);
  }
};

export type downloadInfo = {
  name: string;
  episodeName: string;
  url: string;
};

export const downloadPodcastEpisodes = async (podcasts: downloadInfo[]) => {
  try {
    const responses: ArrayBuffer[] = await Promise.all(
      podcasts.map((podcast) => downloadPodcastEpisode(podcast))
    );
    return responses.map((arrayBuffer) => ({
      data: encodeBase64(arrayBuffer), // Base64 encoded data
    }));
  } catch (error) {
    console.error("Error downloading episodes:", error);
    return null;
  }
};

// Utility function to encode data to base64
const encodeBase64 = (arrayBuffer: ArrayBuffer) => {
  // Convert ArrayBuffer to base64 using base64-js
  return base64js.fromByteArray(new Uint8Array(arrayBuffer));
};
