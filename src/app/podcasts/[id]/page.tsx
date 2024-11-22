import { PodcastSearchBar } from "@/components/podcastSearchBar";
import { geistSans, geistMono } from "@/app/fonts";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { PodcastOverview } from "@/components/podcastOverview";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";

type Params = Promise<{
  id: string;
}>;

export default async function PodcastPage({ params }: { params: Params }) {
  const id = (await params).id;

  const decodedId = decodeURIComponent(id);

  if (!decodedId) return <div>Page not found</div>;

  return (
    <main
      className={`flex flex-col gap-8 ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-dvh`}
    >
      <div
        className={cn(
          "flex flex-col h-full w-full gap-4 items-center justify-start sm:justify-center p-2 sm:p-8"
        )}
      >
        <Suspense
          fallback={
            <div className="flex justify-center items-center">
              <LoadingSpinner />
            </div>
          }
        >
          <PodcastSearchBar />
          <PodcastOverview id={decodedId} />
        </Suspense>
      </div>
    </main>
  );
}
