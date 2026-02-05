import { geistSans, geistMono } from '@/app/fonts';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { getPodcastV2 } from '@/lib/api/podcasts';
import { auth } from '../../../../../auth';
import { PodcastOverviewV2 } from '@/components/podcastOverviewV2';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Params = Promise<{
  id: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const id = (await params).id;

  const podcast = await getPodcastV2(id);

  if (!podcast) {
    return {
      title: 'Podcast not found',
      description: "The podcast you're looking for could not be found.",
    };
  }
  const { title } = podcast;

  return {
    title: `Download ${title} podcast episodes`,
    description: `View and download episodes from ${title}.`,
  };
}

export default async function PodcastPage({ params }: { params: Params }) {
  const id = (await params).id;

  const decodedId = decodeURIComponent(id);

  if (!decodedId) return <div>Page not found</div>;

  const podcast = await getPodcastV2(id);

  const session = await auth();

  return (
    <main
      className={`flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-full pt-4 pb-8 px-2 gap-4 sm:gap-0`}
    >
      <Link href={'/'}>
        <Button className="w-fit text-muted-foreground" variant={'link'}>
          <ArrowLeft className="h-6 w-6" />
          Back
        </Button>
      </Link>
      <div
        className={cn(
          'flex flex-col h-full w-full items-center justify-start sm:justify-center sm:p-8 gap-8',
        )}
      >
        <PodcastOverviewV2 podcast={podcast} session={session} />
      </div>
    </main>
  );
}
