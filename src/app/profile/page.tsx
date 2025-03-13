import type { Metadata } from 'next';
import { auth } from '../../../auth';
import { redirect } from 'next/navigation';
import { geistSans, geistMono } from '../fonts';
import { ProfileOverview } from '@/components/profileOverview';
import { fetchUser } from '@/lib/fetchUser';

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

  const favouritePodcasts = dbUser.user?.info
    .filter((info) => info.favourited)
    .map((info) => info.podcast_id);

  return (
    <main
      className={`flex flex-col gap-8 ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-full items-center justify-center sm:justify-center p-8 sm:px-4 text-center`}
    >
      <h1>Hi, {user?.name} </h1>
      <ProfileOverview
        session={session}
        favouritePodcasts={favouritePodcasts}
      />
    </main>
  );
}
