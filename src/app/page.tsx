import { PodcastSearchBar } from "@/components/google";

import { geistSans, geistMono } from "./fonts";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

export default async function Home() {
  return (
    <main
      className={`flex flex-col gap-8 ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-dvh`}
    >
      <div
        className={cn(
          "flex flex-col h-full w-full gap-4 items-center justify-start sm:justify-center p-8 sm:p-0"
        )}
      >
        <h1 className={cn("text-center")}>Download podcasts to mp3</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <PodcastSearchBar />
        </Suspense>
      </div>
    </main>
  );
}
