import type { Metadata } from "next";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { geistSans, geistMono } from "../fonts";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Profile page for Podcast To Mp3`,
    description: `View your profile and download your favorite podcasts as mp3s.`,
  };
}

export default async function PodcastPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/");
  }

  return (
    <main
      className={`flex flex-col gap-8 ${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-full items-center justify-center sm:justify-center p-8 sm:px-4 text-center`}
    >
      <h1>Your profile </h1>
      <p>Welcome back, {user?.name}! </p>
      <p>
        I&apos;m currently working on showing your favourites here in a single
        filterable list. Check back later!
      </p>
    </main>
  );
}
