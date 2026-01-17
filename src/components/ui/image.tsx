'use client';
/* eslint-disable @next/next/no-img-element */
import { type ImgHTMLAttributes, useEffect, useRef, useState } from 'react';
import { Skeleton } from './skeleton';

type Props = {
  width?: number | string;
  height?: number | string;
  alt?: string;
} & ImgHTMLAttributes<HTMLImageElement>;

export const Image = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setIsLoading(true);
  }, [props.src]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      setIsLoading(false);
      return;
    }
    if (img.decode) {
      img
        .decode()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [props.src]);

  return (
    <div
      style={{ width: props.width, height: props.height }}
      className="relative"
    >
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
      <img
        {...props}
        alt={props.alt}
        ref={imgRef}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        className={`${isLoading ? 'invisible' : 'visible'} ${
          props.className || ''
        }`}
      />
    </div>
  );
};
