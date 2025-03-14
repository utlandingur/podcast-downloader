'use client';
import { ImgHTMLAttributes, useState } from 'react';
import { Skeleton } from './skeleton';

/* eslint-disable @next/next/no-img-element */
type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const Img = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      style={{ width: props.width, height: props.height }}
      className="relative"
    >
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
      <img
        {...props}
        onLoad={() => setIsLoading(false)}
        className={`${isLoading ? 'invisible' : 'visible'} ${
          props.className || ''
        }`}
        alt={props.alt}
      />
    </div>
  );
};
