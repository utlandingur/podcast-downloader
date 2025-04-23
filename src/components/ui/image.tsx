'use client';
/* eslint-disable @next/next/no-img-element */
import { type ImgHTMLAttributes, useState } from 'react';
import { Skeleton } from './skeleton';

type Props = {
  width?: number | string;
  height?: number | string;
  alt?: string;
} & ImgHTMLAttributes<HTMLImageElement>;

export const Image = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      style={{ width: props.width, height: props.height }}
      className="relative"
    >
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
      <img
        {...props}
        alt={props.alt}
        onLoad={() => setIsLoading(false)}
        className={`${isLoading ? 'invisible' : 'visible'} ${
          props.className || ''
        }`}
      />
    </div>
  );
};
