'use client';
import { useSyncUser } from '@/hooks/useSyncUser';
import { Session } from 'next-auth';
import { PodcastList } from './podcastList/podcastList';

type Props = {
  session: Session | null;
  favouritePodcasts: string[];
};

export const ProfileOverview = ({ session, favouritePodcasts }: Props) => {
  useSyncUser(session || null);

  return (
    <div className="text-align-left w-full max-w-[720px] ">
      <div className="border border-muted p-4 rounded-lg flex flex-col pt-8 gap-4">
        <h2 className="text-left text-lg">Favourite podcasts</h2>
        <PodcastList ids={favouritePodcasts} />
      </div>
    </div>
  );
};
