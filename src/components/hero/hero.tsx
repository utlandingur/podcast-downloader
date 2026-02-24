import { Badge } from '@/components/ui/badge';
import { PodcastSearchBar } from '../podcastSearchBar';
import { CanScrollIcon } from './canScrollIcon';
import { DesktopDownloadButton } from './desktopDownloadButton';

export function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-56px)] flex items-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="flex w-full items-center py-16 sm:py-20 justify-center">
        <div className="flex w-full max-w-4xl flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Badge
              variant="secondary"
              className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.2em]"
            >
              Loved by 240+ supporters
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              The easy way to download podcast MP3s
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Search any show, save single episodes, or bulk download full
              seasons for offline listening. No paywalls. No fluff. Just
              downloads.
            </p>
          </div>
          <div className="w-full max-w-2xl px-2">
            <PodcastSearchBar
              autoFocus={true}
              showButton
              width="w-full"
              inputClassName="h-12 sm:h-14 rounded-full bg-background/80 shadow-md focus-visible:ring-2 py-0 md:text-2xl"
              buttonClassName="h-12 sm:h-14 rounded-full px-6 sm:text-lg"
            />
          </div>

          <DesktopDownloadButton />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-medium backdrop-blur"
            >
              No ads or tracking whatsoever
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-medium backdrop-blur"
            >
              Completely free and open source
            </Badge>
          </div>
        </div>
      </div>
      <CanScrollIcon />
    </section>
  );
}
