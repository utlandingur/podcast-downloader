'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AudioPlayerCard } from '@/components/audioPlayerCard';

type BatchItem = {
  title: string;
  url: string;
};

type BatchPayload = {
  createdAt?: number;
  items?: BatchItem[];
};

const BATCH_TTL_MS = 24 * 60 * 60 * 1000;

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

const useBatchItems = (batchKey: string | null) => {
  const [state, setState] = useState<{
    status: 'loading' | 'ready' | 'missing' | 'expired';
    items: BatchItem[];
  }>({ status: 'loading', items: [] });

  useEffect(() => {
    if (!batchKey) return;
    const raw = localStorage.getItem(batchKey);
    if (!raw) {
      setState({ status: 'missing', items: [] });
      return;
    }
    try {
      const parsed = JSON.parse(raw) as BatchPayload | BatchItem[];
      const payload = Array.isArray(parsed)
        ? { createdAt: Date.now(), items: parsed }
        : parsed;
      const createdAt = payload.createdAt ?? Date.now();
      if (Date.now() - createdAt > BATCH_TTL_MS) {
        localStorage.removeItem(batchKey);
        setState({ status: 'expired', items: [] });
        return;
      }
      const sanitized = (payload.items ?? [])
        .map((item) => ({
          title: item.title,
          url: getAudioUrl(item.url) || '',
        }))
        .filter((item) => item.url);
      setState({
        status: sanitized.length ? 'ready' : 'missing',
        items: sanitized,
      });
    } catch {
      setState({ status: 'missing', items: [] });
    }
  }, [batchKey]);

  return state;
};

export const OpenAudioClient = () => {
  const searchParams = useSearchParams();
  const batchKey = searchParams.get('batch');
  const batchState = useBatchItems(batchKey);

  const audioUrl = useMemo(
    () => getAudioUrl(searchParams.get('url')),
    [searchParams],
  );

  if (batchKey) {
    if (batchState.status === 'loading') {
      return (
        <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="text-sm text-muted-foreground">Loading list...</div>
        </main>
      );
    }

    if (batchState.status === 'expired') {
      return (
        <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-xl font-semibold">Download list expired</h1>
          <p className="text-sm text-muted-foreground">
            This list is more than a day old. Please run the bulk download
            again to regenerate it.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </main>
      );
    }

    if (batchState.status === 'missing') {
      return (
        <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-xl font-semibold">No downloads found</h1>
          <p className="text-sm text-muted-foreground">
            We could not find the download list for this session.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </main>
      );
    }

    const { items } = batchState;

    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col gap-4 px-4 py-10">
        <h1 className="text-xl font-semibold">Manual downloads</h1>
        <p className="text-sm text-muted-foreground">
          Some downloads need a manual step. Use the player controls or open
          the file directly to download.

          Chrome on desktop has 3 dots menu in the audio player with a download
          option.
        </p>
        <div className="max-h-[70vh] overflow-y-auto rounded-md border p-3">
          {items.map((item, index) => (
            <AudioPlayerCard
              key={`${item.url}-${index}`}
              title={item.title}
              url={item.url}
              compact
            />
          ))}
        </div>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </main>
    );
  }

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
        Some hosts block direct downloads. Use the three-dot menu in the player
        to download if needed.
      </p>
      <AudioPlayerCard title="Now playing" url={audioUrl} />
      <Button asChild variant="outline">
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
};
