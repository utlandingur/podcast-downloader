import { PodcastSearchBar } from "@/components/PodcastSearchBar";

import { geistSans, geistMono } from "./fonts";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main
        className={`flex flex-col gap-8 justify-center items-center sm:items-start ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <h1>Download podcasts to mp3</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <PodcastSearchBar />
        </Suspense>
      </main>
    </div>
  );
}
