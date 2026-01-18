import { Suspense } from 'react';
import { OpenAudioClient } from './openAudioClient';

export const dynamic = 'force-static';

export default function OpenAudioPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="text-sm text-muted-foreground">Loading player...</div>
        </main>
      }
    >
      <OpenAudioClient />
    </Suspense>
  );
}
