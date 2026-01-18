import { PodcastSearchBar } from "@/components/podcastSearchBar";

import { Suspense } from "react";

import { geistMono, geistSans } from "../fonts";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it Works - PodcastToMp3",
  description:
    "Learn how to easily convert and download podcasts into MP3 format with PodcastToMp3, including Spotify podcast favorites. Step-by-step guide for downloading your favorite episodes.",
  keywords: [
    "how it works podcast downloader",
    "download podcasts as mp3",
    "how to download podcasts",
    "podcast to mp3 guide",
    "podcast download tutorial",
    "spotify podcasts",
    "download spotify podcasts",
    "spotify podcast downloader",
    "spotify podcast to mp3",
    "apple podcast downloader",
    "download podcast mp3",
  ],
  openGraph: {
    title: "How it Works - PodcastToMp3",
    description:
      "Step-by-step guide on how to convert and download podcasts as MP3 files, including Spotify podcast favorites.",
    url: "https://podcasttomp3.com/how-it-works",
    images: [
      {
        url: "https://podcasttomp3.com/assets/screenshot.png", // Replace with an image specific to the "How it Works" page
        width: 1200,
        height: 630,
        alt: "How it Works - PodcastToMp3", // Descriptive alt text
      },
    ],
    siteName: "PodcastToMp3",
  },
  twitter: {
    card: "summary", // Use a larger image for Twitter sharing
    title: "How it Works - PodcastToMp3",
    description:
      "Step-by-step guide on how to convert and download podcasts as MP3 files, including Spotify podcast favorites.",
    images: ["https://podcasttomp3.com/assets/screenshot.png"], // Twitter card image
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

        <div className={cn("flex flex-col gap-8")}>
          <section id="faq" className={cn("m-y-2 flex flex-col gap-2")}>
            <h2>FAQs</h2>
            <div className={cn("flex flex-col gap-8")}>
              <div>
                <h3>How do I download a podcast as an MP3?</h3>
                <p>
                  Simply search for your favorite podcast in the search bar
                  above, select an episode, and download it directly as an MP3
                  file. The process is seamless, straightforward, and compatible
                  with most devices.
                </p>
              </div>
              <div>
                <h3>What happens if there is an error while downloading?</h3>
                <p>
                  If there is an issue, the episode will open in a new browser
                  tab. Just click the ellipsis menu in the player and hit
                  &quot;Download&quot; to save the file.
                </p>
              </div>
              <div>
                <h3>Is PodcastToMp3.com free?</h3>
                <p>
                  Yes, our service is completely free to use! No hidden fees or
                  subscriptions required.
                </p>
              </div>
              <div>
                <h3>Do you host podcast files on your servers?</h3>
                <p>
                  No, we don’t host or serve any files. Downloads are
                  facilitated directly from the original podcast source for a
                  reliable and secure experience.
                </p>
              </div>
            </div>
          </section>

          <section id="benefits" className={cn("m-y-2 flex flex-col ")}>
            <h2>Why Use PodcastToMp3.com?</h2>
            <ul className={cn("flex flex-col gap-4 pt-4")}>
              <li>Fast and easy-to-use platform for downloading podcasts.</li>
              <li>
                Download podcasts to your waterproof headphones for swimming or
                exercise.
              </li>
              <li>
                Enjoy episodes offline during long flights, road trips,
                commuting or workouts.
              </li>
              <li>
                Direct downloads from the original podcast source ensure
                security and reliability.
              </li>
              <li>
                Compatible with all devices and MP3 players, including older
                ones.
              </li>
              <li>No need to sign up or install any software.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
