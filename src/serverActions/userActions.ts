"use server";
import { connectToDatabase } from "@/lib/db";
import { PodcastStateType } from "@/models/podcastState";
import { UserDocument, User, UserType } from "@/models/user";

export async function getUser(email: string): Promise<UserDocument | null> {
  try {
    await connectToDatabase();
    const user: UserDocument | null = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error("Error fetching user", error);
    return null;
  }
}

export const toggleFavouritePodcast = async (
  user: UserType,
  podcastId: string,
  favourited: boolean
): Promise<UserType> => {
  await connectToDatabase();
  const userDoc: UserDocument = await User.hydrate(user);
  const podcastState = userDoc.info.find(
    (podcast: PodcastStateType) => podcast.podcast_id === podcastId
  );
  if (podcastState) {
    podcastState.favourited = favourited;
  } else {
    userDoc.info.push({ podcast_id: podcastId, favourited });
  }

  await userDoc.save();
  return JSON.parse(JSON.stringify(userDoc));
};

export const addDownloadedEpisode = async (
  user: UserType,
  podcastId: string,
  episodeId: string
): Promise<UserType> => {
  await connectToDatabase();
  const userDoc: UserDocument = User.hydrate(user);
  const podcastState = userDoc.info.find(
    (podcast: PodcastStateType) => podcast.podcast_id === podcastId
  );

  if (!podcastState) {
    const newPodcastState = userDoc.info.create({
      podcast_id: podcastId,
      downloaded_episodes: [episodeId],
    });
    userDoc.info.push(newPodcastState);
  } else if (!podcastState.downloaded_episodes.includes(episodeId)) {
    podcastState.downloaded_episodes.push(episodeId);
  }
  console.log("userDoc in addDOwnloadedEpisode", userDoc);
  await userDoc.save();
  return JSON.parse(JSON.stringify(userDoc));
};

export const findOrCreateUser = async (userId: string): Promise<UserType> => {
  await connectToDatabase();
  const user: UserDocument = await User.findOneAndUpdate(
    { email: userId }, // Filter by userId and podcastId
    { $setOnInsert: { email: userId } }, // Insert a new user state if not found
    { upsert: true, new: true }
  );
  const data: UserType = JSON.parse(JSON.stringify(user));
  return data;
};
