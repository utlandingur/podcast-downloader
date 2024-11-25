import { PodcastSearchBar } from "@/components/podcastSearchBar";

import { geistSans, geistMono } from "./fonts";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";
import { HowItWorks } from "@/components/howItWorks";

export const metadata: Metadata = {
  title: "PodcastToMp3 - Download Podcasts as MP3",
  description:
    "Easily convert and download podcasts into MP3 format for offline listening. Discover your favorite shows and take them wherever you go!",
  keywords: [
    "podcast downloader",
    "download podcasts",
    "mp3 podcasts",
    "offline podcasts",
    "free podcast download",
    "download podcast episodes",
    "podcast to mp3",
  ],
  openGraph: {
    title: "PodcastToMp3 - Download Podcasts as MP3",
    description:
      "Convert and download your favorite podcasts as MP3 files. Perfect for offline listening!",
    url: "https://podcasttomp3.com",
    // images: [
    //   {
    //     url: "https://podcasttomp3.com/images/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "PodcastToMp3 website preview",
    //   },
    // ],
    siteName: "PodcastToMp3",
  },
  twitter: {
    card: "summary",
    title: "PodcastToMp3 - Download Podcasts as MP3",
    description:
      "Easily convert and download podcasts into MP3 format for offline listening. Discover your favorite shows and take them wherever you go!",
    // images: ["https://podcasttomp3.com/images/og-image.jpg"],
  },
};

export default async function Home() {
  return (
    <main
      className={`flex flex-col gap-8 ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-full gap-8 items-center justify-start sm:justify-center p-8 sm:px-4 text-center`}
    >
      <h1>Download podcasts as mp3</h1>
      <p>
        Easily convert and download podcasts into MP3 format for offline
        listening. Discover your favorite shows and take them wherever you go!
      </p>
      <section id="how it works" className={cn("m-y-2")}>
        <h2>How it works</h2>
        <p>
          1. Search for your favourite podcast.
          <br />
          2. Download episodes as mp3 files.
        </p>
      </section>
      <Suspense fallback={<div>Loading...</div>}>
        <div className={cn("pb-12")}>
          <PodcastSearchBar />
        </div>
      </Suspense>
      <HowItWorks />
    </main>
  );
}
