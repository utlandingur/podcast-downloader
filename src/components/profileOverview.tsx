import { Session } from 'next-auth';
import { PodcastList } from './podcastList/podcastList';
import type { PodcastV2 } from '@/types/podcasts';

type Props = {
  session: Session | null;
  favouritePodcasts: PodcastV2[];
};

export const ProfileOverview = ({ favouritePodcasts }: Props) => {
  return (
    <div className="text-align-left w-full max-w-[720px] ">
      <div className="border border-muted p-4 rounded-lg flex flex-col pt-8 gap-4">
        <h2 className="text-left text-lg">Favourite podcasts</h2>
        <PodcastList podcasts={favouritePodcasts} />
      </div>
    </div>
  );
};
