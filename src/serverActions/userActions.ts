import { PodcastStateType } from "@/models/podcastState";
import { UserDocument, User } from "@/models/user";

export const toggleFavouritePodcast = async (
  user: UserDocument,
  podcastId: string,
  favourited: boolean
) => {
  const podcastState = user.info.find(
    (podcast: PodcastStateType) => podcast.podcast_id === podcastId
  );

  if (podcastState) {
    podcastState.favourited = favourited;
  } else {
    user.info.push({ podcast_id: podcastId, favourited });
  }

  await user.save();
};

export const addDownloadedEpisode = async (
  user: UserDocument,
  podcastId: string,
  episodeId: string
) => {
  const podcastState = user.info.find(
    (podcast: PodcastStateType) => podcast.podcast_id === podcastId
  );

  if (!podcastState) {
    const newPodcastState = user.info.create({
      podcast_id: podcastId,
      downloaded_episodes: [episodeId],
    });
    user.info.push(newPodcastState);
  } else if (!podcastState.downloaded_episodes.includes(episodeId)) {
    podcastState.downloaded_episodes.push(episodeId);
  }

  await user.save();
};

export const findOrCreateUser = async (
  userId: string
): Promise<UserDocument> => {
  const user: UserDocument = await User.findOneAndUpdate(
    { email: userId }, // Filter by userId and podcastId
    { $setOnInsert: { email: userId } }, // Insert a new user state if not found
    { upsert: true, new: true }
  );

  return user;
};
