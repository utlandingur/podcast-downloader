'use server';
import { connectToDatabase } from '@/lib/db';
import { PodcastStateType } from '@/models/podcastState';
import { UserDocument, User, type PlainUserType } from '@/models/user';
import { Document } from 'mongoose';

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
  return toPlainObject(userDoc);
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
  return toPlainObject(userDoc);
};

export const findOrCreateUser = async (
  email: string,
): Promise<PlainUserType> => {
  await connectToDatabase();
  const foundUser: PlainUserType | null = await findUserByEmail(email);
  if (foundUser) {
    return foundUser;
  }
  const user: PlainUserType = await createUser(email);
  return user;
};

const createUser = async (email: string): Promise<PlainUserType> => {
  try {
    const user: UserDocument = await User.create({ email, info: [] });
    return toPlainObject(user);
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
};

const findUserByEmail = async (
  email: string,
): Promise<PlainUserType | null> => {
  try {
    const user: UserDocument | null = await User.findOne({
      email,
    });
    if (!user) {
      return null;
    }
    return toPlainObject(user);
  } catch (error) {
    console.error('Error finding user:', error);
    throw new Error('Error finding user');
  }
};

const toPlainObject = <T extends Document>(doc: T) =>
  JSON.parse(JSON.stringify(doc));
