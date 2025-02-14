import { Badge } from '@/components/ui/badge';
import { PodcastSearchBarV1 } from './podcastSearchBar';

export function HeroV1() {
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
        <p className="font-thin italic">
          THIS IS THE OLD VERSION, USING APPLE&apos;S PODCAST API.
        </p>
        <PodcastSearchBarV1 />

        <div className="flex justify-center space-x-4">
          <Badge variant="secondary" className="px-4 py-1">
            10K+ Visitors
          </Badge>
          <Badge variant="secondary" className="px-4 py-1">
            20+ Supporters
          </Badge>
        </div>
      </div>
    </section>
  );
}
