'use client';
/* eslint-disable @next/next/no-img-element */
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useState } from 'react';
import { Skeleton } from './skeleton';

export const Image = (props: NextImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      style={{ width: props.width, height: props.height }}
      className="relative"
    >
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
      <NextImage
        {...props}
        onLoad={() => setIsLoading(false)}
        className={`${isLoading ? 'invisible' : 'visible'} ${
          props.className || ''
        }`}
      />
    </div>
  );
};
