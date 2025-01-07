import { PodcastStateType } from "@/models/podcastState";
import { UserStateDocument, UserState } from "@/models/userState";

export const toggleFavouritePodcast = async (
  userState: UserStateDocument,
  podcastId: string,
  favourited: boolean
) => {
  const podcastState = userState.info.find(
    (podcast: PodcastStateType) => podcast.podcast_id === podcastId
  );

  if (podcastState) {
    podcastState.favourited = favourited;
  } else {
    userState.info.push({ podcast_id: podcastId, favourited });
  }

  await userState.save();
};

export const addDownloadedEpisode = async (
  userState: UserStateDocument,
  podcastId: string,
  episodeId: string
) => {
  const podcastState = userState.info.find(
    (podcast: PodcastStateType) => podcast.podcast_id === podcastId
  );

  if (!podcastState) {
    const newPodcastState = userState.info.create({
      podcast_id: podcastId,
      downloaded_episodes: [episodeId],
    });
    userState.info.push(newPodcastState);
  } else if (!podcastState.downloaded_episodes.includes(episodeId)) {
    podcastState.downloaded_episodes.push(episodeId);
  }

  await userState.save();
};

export const findOrCreateUserState = async (
  userId: string
): Promise<UserStateDocument> => {
  const userState: UserStateDocument = await UserState.findOneAndUpdate(
    { user_id: userId }, // Filter by userId and podcastId
    { $setOnInsert: { user_id: userId } }, // Insert a new user state if not found
    { upsert: true, new: true }
  );

  return userState;
};
