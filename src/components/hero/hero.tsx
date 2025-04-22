import { Badge } from '@/components/ui/badge';
import { PodcastSearchBar } from '../podcastSearchBar';
import { CanScrollIcon } from './canScrollIcon';

export function Hero() {
  return (
    <section className="h-[calc(100vh-56px)] justify-center flex items-center">
      <div className="container space-y-8 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Download Podcasts as MP3s
          </h1>

          <p className="text-xl font-thin text-foreground mx-auto max-w-[600px]">
            🥇 Top-rated on Google
          </p>
        </div>

        <PodcastSearchBar autoFocus={true} />

        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <Badge variant="secondary" className="px-4 py-2 text-base">
            15k+ Monthly Users
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-base">
            75k+ Monthly Downloads
          </Badge>
        </div>
      </div>
      <CanScrollIcon />
    </section>
  );
}
