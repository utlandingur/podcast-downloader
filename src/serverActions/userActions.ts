'use server';
import { connectToDatabase } from '@/lib/db';
import { PodcastStateType } from '@/models/podcastState';
import { UserDocument, User, type PlainUserType } from '@/models/user';

export const toggleFavouritePodcast = async (
  user: PlainUserType,
  podcastId: string,
  favourited: boolean,
): Promise<PlainUserType> => {
  await connectToDatabase();
  const userDoc: UserDocument = await User.hydrate(user);
  const podcastState = userDoc.info.find(
    (podcast: PodcastStateType) => podcast.podcast_id === podcastId,
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
  user: PlainUserType,
  podcastId: string,
  episodeId: string,
): Promise<PlainUserType> => {
  await connectToDatabase();
  const userDoc: UserDocument = User.hydrate(user);
  const podcastState = userDoc.info.find(
    (podcast: PodcastStateType) => podcast.podcast_id === podcastId,
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
  await userDoc.save();
  return JSON.parse(JSON.stringify(userDoc));
};

export const findOrCreateUser = async (
  email: string,
): Promise<PlainUserType> => {
  await connectToDatabase();
  const user: UserDocument = await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { email } }, // Insert a new user state if not found
    { upsert: true, new: true },
  );
  const data: PlainUserType = JSON.parse(JSON.stringify(user));
  return data;
};
