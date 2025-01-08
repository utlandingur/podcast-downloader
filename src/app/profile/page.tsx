import type { Metadata } from "next";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { Main } from "@/components/ui/main";

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
    <Main>
      <h1>Your profile </h1>
      <p>Welcome back, {user?.name}! </p>
      <p>
        I&apos;m currently working on showing your favourites here in a single
        filterable list. Check back later!
      </p>
    </Main>
  );
}
