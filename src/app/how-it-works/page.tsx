import { PodcastSearchBar } from "@/components/podcastSearchBar";

import { Suspense } from "react";

import { HowItWorks } from "@/components/howItWorks";
import { geistMono, geistSans } from "../fonts";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it Works - PodcastToMp3",
  description:
    "Learn how to easily convert and download podcasts into MP3 format with PodcastToMp3. Step-by-step guide for downloading your favorite episodes.",
  keywords: [
    "how it works podcast downloader",
    "download podcasts as mp3",
    "how to download podcasts",
    "podcast to mp3 guide",
    "podcast download tutorial",
  ],
  openGraph: {
    title: "How it Works - PodcastToMp3",
    description:
      "Step-by-step guide on how to convert and download podcasts as MP3 files. Easily download your favorite podcast episodes.",
    url: "https://podcasttomp3.com/how-it-works",
    // images: [
    //   {
    //     url: "https://podcasttomp3.com/images/og-how-it-works.jpg", // Replace with an image specific to the "How it Works" page
    //     width: 1200,
    //     height: 630,
    //     alt: "How it Works - PodcastToMp3", // Descriptive alt text
    //   },
    // ],
    siteName: "PodcastToMp3",
  },
  twitter: {
    card: "summary", // Use a larger image for Twitter sharing
    title: "How it Works - PodcastToMp3",
    description:
      "Step-by-step guide on how to convert and download podcasts as MP3 files. Easily download your favorite podcast episodes.",
    // images: ["https://podcasttomp3.com/images/og-how-it-works.jpg"], // Twitter card image
  },
};

export default async function HowItWorksPage() {
  return (
    <main
      className={`flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-full  items-center justify-start sm:justify-center p-8 sm:px-4 text-center`}
    >
      <div
        className={cn("max-w-[600px] flex flex-col gap-8 p-4 sm:px-4 w-full")}
      >
        <h1>Search for a podcast to download</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <div className={cn("p-4")}>
            <PodcastSearchBar />
          </div>
        </Suspense>

        <HowItWorks />
      </div>
    </main>
  );
}
