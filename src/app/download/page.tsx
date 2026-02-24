import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Download Desktop App - PodcastToMp3',
  description:
    'Download the PodcastToMp3 desktop app for Windows and macOS with simple setup steps.',
};

export default function DownloadPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 text-left sm:px-6">
      <section className="space-y-3">
        <p className="inline-block rounded-full border border-amber-300/40 bg-amber-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
          Alpha
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Download the desktop app for faster bulk downloads
        </h1>
        <p className="text-muted-foreground">
          Built for people downloading lots of episodes. The desktop app avoids
          browser download issues and keeps everything local on your computer.
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-xl font-semibold">Why download the desktop app?</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Bulk downloads are faster and more reliable.</li>
          <li>No browser pop-up/tab/download blocking problems.</li>
          <li>All files are downloaded and stored locally on your computer.</li>
        </ul>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-xl font-semibold">1) Download</h2>
        <p className="text-muted-foreground">
          Open the latest release and download the file for your system:
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="https://github.com/utlandingur/podcast-downloader/releases/latest" target="_blank">
            <Button>Latest Release</Button>
          </Link>
          <Link href="https://github.com/utlandingur/podcast-downloader" target="_blank">
            <Button variant="outline">View Source Code</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-border bg-card p-5">
          <h3 className="text-lg font-semibold">macOS (.dmg)</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Open the downloaded `.dmg`.</li>
            <li>Drag `PodcastToMp3.app` into `Applications`.</li>
            <li>Right-click the app and choose `Open` the first time.</li>
          </ol>
        </div>

        <div className="space-y-2 rounded-xl border border-border bg-card p-5">
          <h3 className="text-lg font-semibold">Windows (.exe)</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Run the downloaded `.exe` installer.</li>
            <li>Complete setup and launch PodcastToMp3.</li>
            <li>If SmartScreen appears, click `More info` then `Run anyway`.</li>
          </ol>
        </div>
      </section>

      <section className="rounded-xl border border-amber-300/30 bg-amber-200/10 p-5 text-sm text-amber-100">
        <p>
          The app is still in alpha and not signed/notarized yet, so your OS
          may show an untrusted app warning. Follow the steps above to open it.
        </p>
      </section>
    </main>
  );
}
