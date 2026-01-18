'use client';
import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  url: string;
  compact?: boolean;
};

export const AudioPlayerCard = ({ title, url, compact }: Props) => (
  <div
    className={
      compact
        ? 'flex flex-col gap-3 border-b pb-4 last:border-b-0 last:pb-0'
        : 'flex flex-col gap-3'
    }
  >
    <div className="text-sm font-medium">{title}</div>
    <audio className="w-full" controls preload="metadata" src={url} />
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm" variant="outline">
        <a href={url} rel="noreferrer" target="_blank">
          Open audio file
        </a>
      </Button>
    </div>
  </div>
);
