import { Badge } from '@/components/ui/badge';
import { PodcastSearchBar } from './podcastSearchBar';
import { GithubIcon } from './ui/icons/githubIcon';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="h-[calc(100vh-56px)] justify-center flex items-center">
      <div className="container space-y-8 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Download Your Favorite Podcasts as MP3s
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground">
            Download podcasts directly from their original source for offline
            listening. Perfect for flights, workouts, or anywhere without
            internet.
          </p>
        </div>

        <PodcastSearchBar />

        <div className="flex justify-center space-x-4">
          <Badge variant="secondary" className="px-4 py-1">
            10K+ Visitors
          </Badge>
          <Badge variant="secondary" className="px-4 py-1">
            30,000+ Downloads
          </Badge>
          <Badge variant="secondary" className="px-4 py-1">
            20+ Supporters
          </Badge>
        </div>
        <section className="flex justify-center space-x-4 mx-auto max-w-[600px]">
          <GithubIcon className="h-6 w-6" />
          <Link
            href="https://github.com/utlandingur/podcast-downloader"
            target="_blank"
          >
            <p className="text-muted-foreground">View source code here</p>
          </Link>
        </section>
      </div>
    </section>
  );
}
