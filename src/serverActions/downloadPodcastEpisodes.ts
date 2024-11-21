"use server";
import { ReadableStream, WritableStream } from "web-streams-polyfill";

const downloadFile = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];

    const pump = async (): Promise<Buffer> => {
      const { done, value } = await reader.read();
      if (done) {
        const buffer = Buffer.concat(chunks);
        console.log(`Downloaded ${buffer.length} bytes`);
        return buffer;
      }
      chunks.push(value);
      return pump();
    };

    const buffer = await pump();
    return buffer.toString("base64");
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// Stream and download a single podcast episode
const downloadPodcastEpisode = async (
  downloadInfo: downloadInfo
): Promise<string> => {
  const { url, episodeName } = downloadInfo;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch: ${response.statusText}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Readable stream not available");

    let base64Chunks: string[] = [];
    const readableStream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
        } else if (value) {
          // Process chunk and convert to Base64
          const chunkBase64 = btoa(String.fromCharCode(...value));
          base64Chunks.push(chunkBase64);
          controller.enqueue(value);
        }
      },
    });

    const writableStream = new WritableStream();
    await readableStream.pipeTo(writableStream);

    return base64Chunks.join("");
  } catch (error) {
    console.error(`Error downloading episode ${episodeName}:`, error);
    throw error;
  }
};

export const downloadPodcastEpisodes = async (podcasts: downloadInfo[]) => {
  console.log("podcasts", podcasts);
  try {
    const responses = await Promise.all(
      podcasts.map((podcast) => downloadFile(podcast.url))
    );
    return responses.map((data) => ({ data })); // Return Base64-encoded data
  } catch (error) {
    console.error("Error downloading episodes:", error);
    return null;
  }
};

export type downloadInfo = {
  name: string;
  episodeName: string;
  url: string;
};

// Function to validate if a string is Base64 encoded
const isBase64 = (str: string): boolean => {
  const base64Regex =
    /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(str);
};
