import { PodcastSearchBar } from "@/components/podcastSearchBar";
import { geistSans, geistMono } from "@/app/fonts";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { PodcastOverview } from "@/components/podcastOverview";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import type { Metadata } from "next";
import type { PodcastEpisode } from "@/types/podcasts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

type Params = Promise<{
  id: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  // read route params
  const id = (await params).id;
  // Example function to fetch podcast data based on the ID
  // Replace this with your actual logic to fetch podcast details

  const response = await fetch(
    `https://itunes.apple.com/lookup?id=${id}&entity=podcast
    `,
    { cache: "force-cache" }
  );
  const data = await response.json();
  const episode: PodcastEpisode = data.results[0];

  if (!episode) {
    return {
      title: "Podcast not found",
      description: "The podcast you're looking for could not be found.",
    };
  }
  const { collectionName } = episode;

  return {
    title: `Download ${collectionName} podcast episodes`,
    description: `View and download episodes from ${collectionName}.`,
  };
}

export default async function PodcastPage({ params }: { params: Params }) {
  const id = (await params).id;

  const decodedId = decodeURIComponent(id);

  if (!decodedId) return <div>Page not found</div>;

  return (
    <main
      className={`flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-full`}
    >
      <div className={cn("px-8 pt-8 max-w-[720px] self-center")}>
        <Alert className={cn("bg-black text-secondary")}>
          <AlertTitle className={cn("font-black")}>
            🎉 Version 2 is Here!
          </AlertTitle>
          <AlertDescription>
            You may have bookmarked this page. Search for your podcast again to
            access all episodes, improved search, and future updates!
          </AlertDescription>
        </Alert>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        }
      >
        <div className={cn("p-8")}>
          <PodcastSearchBar />
        </div>
        <div
          className={cn(
            "flex flex-col h-full w-full items-center justify-start sm:justify-center p-2 pb-8 sm:p-8 gap-8"
          )}
        >
          <PodcastOverview id={decodedId} />
        </div>
      </Suspense>
    </main>
  );
}
