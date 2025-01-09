import { PodcastSearchBar } from "@/components/podcastSearchBar";
import { geistSans, geistMono } from "@/app/fonts";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { PodcastOverviewV2 } from "@/components/podcastOverview";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import type { Metadata } from "next";
import { lookupPodcastV2 } from "@/serverActions/lookupPodcast";
import { auth } from "../../../../../auth";

type Params = Promise<{
  id: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const id = (await params).id;

  const podcast = await lookupPodcastV2(id);

  if (!podcast) {
    return {
      title: "Podcast not found",
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

  const session = await auth();

  return (
    <main
      className={`flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-full`}
    >
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        }
      >
        <div className={cn("p-8 flex flex-col items-center gap-4")}>
          <h2 className={cn("text-xl")}>Search for another podcast</h2>
          <PodcastSearchBar />
        </div>
        <div
          className={cn(
            "flex flex-col h-full w-full items-center justify-start sm:justify-center p-2 pb-8 sm:p-8 gap-8"
          )}
        >
          <PodcastOverviewV2 id={decodedId} session={session} />
        </div>
      </Suspense>
    </main>
  );
}
