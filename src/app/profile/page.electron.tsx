'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PodcastV2 } from '@/types/podcasts';
import { geistSans, geistMono } from '../fonts';
import { cn } from '@/lib/utils';
import { PodcastSearchBar } from '@/components/podcastSearchBar';
import { ProfileOverview } from '@/components/profileOverview';
import { lookupPodcastV2 } from '@/serverActions/lookupPodcast';
import { useSession } from '@/lib/authClient';
import { useUserStore } from '@/hooks/useUserStore';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, syncUser } = useUserStore((state) => state);
  const [favouritePodcasts, setFavouritePodcasts] = useState<PodcastV2[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.email) return;
    syncUser(session.user.email);
  }, [session?.user?.email, syncUser]);

  const favouritePodcastIds = useMemo(() => {
    return user?.info
      ?.filter((info) => info.favourited)
      .map((info) => info.podcast_id) ?? [];
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const loadPodcasts = async () => {
      if (!favouritePodcastIds.length) {
        setFavouritePodcasts([]);
        return;
      }
      setLoading(true);
      const results = await Promise.allSettled(
        favouritePodcastIds.map((id) => lookupPodcastV2(id)),
      );
      if (cancelled) return;
      const successful = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
      setFavouritePodcasts(successful);
      setLoading(false);
    };
    loadPodcasts();
    return () => {
      cancelled = true;
    };
  }, [favouritePodcastIds]);

  if (status === 'loading') {
    return (
      <main
        className={`flex flex-col gap-4 ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-full items-center justify-center p-8 sm:px-4 text-center`}
      >
        <p>Loading profile…</p>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <main
      className={`flex flex-col gap-8 ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-full items-center justify-center sm:justify-center p-8 sm:px-4 text-center`}
    >
      <h1>Hi, {session?.user?.name ?? 'there'} </h1>
      <div className={cn('p-8 flex flex-col items-center gap-4')}>
        <h2 className={cn('text-xl')}>Search for another podcast</h2>
        <PodcastSearchBar />
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading favourites…</p>
      ) : (
        <ProfileOverview session={null} favouritePodcasts={favouritePodcasts} />
      )}
    </main>
  );
}
