import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/container';
import { PodcastSearchBar } from '../podcastSearchBar';
import { CanScrollIcon } from './canScrollIcon';

export function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-56px)] flex items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <Container className="flex flex-col items-center gap-8 text-center py-20">
        <Badge
          variant="secondary"
          className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.2em]"
        >
          Now with bulk downloads
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Download podcasts fast. Keep them forever.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Search any show, grab single episodes, or bulk download entire seasons
          for offline listening on any device.
        </p>
        <div className="w-full max-w-2xl">
          <PodcastSearchBar
            autoFocus={true}
            showButton
            width="w-full max-w-2xl"
            inputClassName="h-12 sm:h-14 rounded-full bg-background/80 px-6 text-base shadow-md focus-visible:ring-2 sm:text-lg"
            buttonClassName="h-12 sm:h-14 rounded-full px-6 text-base sm:text-lg"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm font-medium backdrop-blur"
          >
            15k+ Users
          </Badge>
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm font-medium backdrop-blur"
          >
            75k+ Downloads
          </Badge>
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm font-medium backdrop-blur"
          >
            Bulk episode downloads
          </Badge>
        </div>
      </Container>
      <CanScrollIcon />
    </section>
  );
}
