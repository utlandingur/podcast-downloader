'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Coffee, Podcast } from 'lucide-react';
import { Button } from './ui/button';

export const Header = () => {
  return (
    <div
      className={cn(
        'p-3 flex w-full font-semibold justify-between items-center border-b-2 border-b-text-foreground h-16',
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-foreground shadow-sm"
      >
        <Podcast className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold tracking-tight sm:text-base">
          PodcastToMP3
        </span>
      </Link>
      <Link href="https://buymeacoffee.com/utlandingur" target="_blank">
        <Button variant="ghost" className="rounded-full px-3">
          <Coffee className="fill-yellow-300" />
          <span>Support</span>
        </Button>
      </Link>
    </div>
  );
};
