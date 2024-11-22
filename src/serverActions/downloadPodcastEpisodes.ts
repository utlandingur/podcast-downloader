"use server";

// const downloadFile = async (url: string): Promise<string> => {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error("Failed to fetch file");
//     }

//     if (!response.body) {
//       throw new Error("Response body is null");
//     }

//     const reader = response.body.getReader();
//     const chunks: Uint8Array[] = [];

//     const pump = async (): Promise<Buffer> => {
//       const { done, value } = await reader.read();
//       if (done) {
//         const buffer = Buffer.concat(chunks);
//         console.log(`Downloaded ${buffer.length} bytes`);
//         return buffer;
//       }
//       chunks.push(value);
//       return pump();
//     };

//     const buffer = await pump();
//     return buffer.toString("base64");
//   } catch (e) {
//     console.error(e);
//     throw e;
//   }
// };

// export const downloadPodcastEpisodes = async (podcasts: downloadInfo[]) => {
//   console.log("podcasts", podcasts);
//   try {
//     const responses = await Promise.all(
//       podcasts.map((podcast) => downloadFile(podcast.url))
//     );
//     return responses.map((data) => ({ data })); // Return Base64-encoded data
//   } catch (error) {
//     console.error("Error downloading episodes:", error);
//     return null;
//   }
// };

export type downloadInfo = {
  name: string;
  episodeName: string;
  url: string;
};
