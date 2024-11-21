"use server";
const downloadPodcastEpisode = async (downloadInfo: downloadInfo) => {
  const { name, episodeName, url } = downloadInfo;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to download podcast episode");
    const blob = await response.blob();
    console.log("blob", blob);
  } catch (error) {
    console.error("error", error);
  }
};

export type downloadInfo = {
  name: string;
  episodeName: string;
  url: string;
};

export const downloadPodcastEpisodes = async (podcasts: downloadInfo[]) => {
  try {
    await Promise.all(
      podcasts.map((podcast) => downloadPodcastEpisode(podcast))
    );
    console.log("All episodes downloaded");
    return { success: true, errors: [] };
  } catch (error) {
    console.error("Error downloading episodes:", error);
    return { success: false, errors: ["failed to download"] };
  }
};
