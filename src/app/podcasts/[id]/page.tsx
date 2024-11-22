import { PodcastSearchBar } from "@/components/podcastSearchBar";
import { geistSans, geistMono } from "@/app/fonts";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { lookupPodcastEpisodes } from "@/serverActions/looksPodcastEpisodes";
import { PodcastOverview } from "@/components/podcastOverview";

type PodcastPageProps = {
  params: {
    id: string;
  };
};

export default async function PodcastPage({ params }: PodcastPageProps) {
  const { id } = params;
  const decodedId = decodeURIComponent(id);

  // const podcast = await lookupPodcast(decodedId);

  // const { collectionName, artworkUrl100, artworkUrl600, feedUrl, trackCount } =
  //   podcast;

  const podcastEpisodes = await lookupPodcastEpisodes(decodedId);

  if (!id) return <div>Page not found</div>;

  return (
    <main
      className={`flex flex-col gap-8 ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-dvh`}
    >
      <div
        className={cn(
          "flex flex-col h-full w-full gap-4 items-center justify-start sm:justify-center p-8 sm:p-0"
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <PodcastSearchBar />
          <PodcastOverview podcastEpisodes={podcastEpisodes} />
        </Suspense>
      </div>
    </main>
  );
}
