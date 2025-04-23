import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import React from 'react';
import { FavouriteToggle } from './favouriteToggle';
import { Image } from '@/components/ui/image';

type Props = {
  title: string;
  id: number;
  style: CSSProperties;
  showBorder: boolean;
  image: string;
};

export const Podcast = React.memo(
  ({ title, style, showBorder, image, id }: Props) => {
    return (
      <div
        style={style}
        className={cn(
          `flex py-4 justify-center w-full items-center gap-4
        ${showBorder && 'border-b border-muted-foreground pt-4'}`,
        )}
      >
        <Image
          src={image}
          alt={title}
          height={88}
          width={88}
          className="rounded-lg"
        />
        <div className="flex w-full h-full items-center justify-between">
          <div className="line-clamp-1 m:line-clamp-2 text-left text-ellipsis">
            <p className="hidden sm:block">{title}</p>
          </div>
          <div className="flex justify-end gap-4">
            <Link
              href={`/podcasts/v2/${JSON.stringify(id)}`}
              aria-label={`Go to podcast ${title}`}
            >
              <Button variant="outline">View</Button>
            </Link>
            <FavouriteToggle id={id} />
          </div>
        </div>
      </div>
    );
  },
);

Podcast.displayName = 'Podcast Info';
