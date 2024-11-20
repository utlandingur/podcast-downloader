import { PodcastSearchBar } from "@/components/PodcastSearchBar";
import { geistSans, geistMono } from "./fonts";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main
        className={`flex flex-col gap-8 justify-center items-center sm:items-start ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <h1>Download podcasts to mp3</h1>
        <PodcastSearchBar />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
