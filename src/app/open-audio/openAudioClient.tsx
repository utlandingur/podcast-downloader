'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const getAudioUrl = (rawUrl: string | null) => {
  if (!rawUrl) return null;

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString();
  } catch {
    return null;
  }
};

export const OpenAudioClient = () => {
  const searchParams = useSearchParams();
  const audioUrl = useMemo(
    () => getAudioUrl(searchParams.get('url')),
    [searchParams],
  );

  if (!audioUrl) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-xl font-semibold">Invalid audio link</h1>
        <p className="text-sm text-muted-foreground">
          We could not open that episode. Please go back and try again.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col gap-4 px-4 py-10">
      <h1 className="text-xl font-semibold">Episode player</h1>
      <p className="text-sm text-muted-foreground">
        Some hosts block direct downloads.
        Use the three-dot menu in the player to download if needed.
      </p>
      <audio className="w-full" controls preload="metadata" src={audioUrl} />
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <a href={audioUrl} rel="noreferrer" target="_blank">
            Open audio file
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
};
