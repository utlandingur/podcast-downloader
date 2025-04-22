import { Badge } from '@/components/ui/badge';
import { PodcastSearchBar } from '../podcastSearchBar';
import { CanScrollIcon } from './canScrollIcon';

export function Hero() {
  return (
    <section className="h-[calc(100vh-56px)] justify-center flex items-center">
      <div className="container space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Download Podcasts as MP3s
        </h1>
        <p>
          Search for the name of a podcast, such as &quot;Joe Rogan&quot; or
          &quot;Crime Junkie&quot;
        </p>
        <PodcastSearchBar autoFocus={true} showButton />

        <div className="flex justify-center items-center gap-2">
          <Badge variant="outline" className="px-4 py-2">
            15k+ Users
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            75k+ Downloads
          </Badge>
        </div>
      </div>
      <CanScrollIcon />
    </section>
  );
}
