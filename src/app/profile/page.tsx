import type { Metadata } from 'next';
import { auth } from '../../../auth';
import { redirect } from 'next/navigation';
import { geistSans, geistMono } from '../fonts';
import { ProfileOverview } from '@/components/profileOverview';
import { fetchUser } from '@/lib/fetchUser';
import { lookupPodcastV2 } from '@/serverActions/lookupPodcast';
import { PodcastSearchBar } from '@/components/podcastSearchBar';
import { cn } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Profile page for Podcast To Mp3`,
    description: `View your profile and download your favorite podcasts as mp3s.`,
  };
}

export default async function PodcastPage() {
  const session = await auth();
  const user = session?.user;

  if (!user?.email) {
    redirect('/');
  }

  const dbUser = await fetchUser(user.email);
  if (dbUser.error) {
    console.error('Error fetching user:', dbUser.error);
    setTimeout(() => {
      redirect('/');
    }, 5000);
    return (
      <main
        className={`flex flex-col gap-8 ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-full items-center justify-center sm:justify-center p-8 sm:px-4 text-center`}
      >
        <h1>Hi, {user?.name} </h1>
        <p>Sorry, there was an error fetching your profile!</p>
        <p>You will be redirected to the home page in 5 seconds.</p>
      </main>
    );
  }

  const favouritePodcastIds = dbUser.user?.info
    .filter((info) => info.favourited)
    .map((info) => info.podcast_id);

  const favouritePodcasts = await Promise.allSettled(
    favouritePodcastIds.map((id) => lookupPodcastV2(id)),
  );

  const successfulPodcasts = favouritePodcasts
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);

  return (
    <main
      className={`flex flex-col gap-8 ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-full items-center justify-center sm:justify-center p-8 sm:px-4 text-center`}
    >
      <h1>Hi, {user?.name} </h1>
      <div className={cn('p-8 flex flex-col items-center gap-4')}>
        <h2 className={cn('text-xl')}>Search for another podcast</h2>
        <PodcastSearchBar />
      </div>
      <ProfileOverview
        session={session}
        favouritePodcasts={successfulPodcasts}
      />
    </main>
  );
}
