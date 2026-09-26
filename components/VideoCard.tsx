'use client';

import * as React from 'react';

import { asset, cn } from '@/lib/utils';

type VideoCardProps = {
  src: string;
  poster: string;
  title: string;
  className?: string;
};

/** Poster with a play button; swaps to a playing <video> on click. */
export default function VideoCard({ src, poster, title, className }: VideoCardProps) {
  const [playing, setPlaying] = React.useState(false);

  if (playing) {
    return (
      <video autoPlay controls playsInline className={cn('w-full bg-black', className)}>
        <source src={asset(src)} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <button
      type='button'
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className={cn(
        'group relative block w-full overflow-hidden border border-gray-300 bg-white',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        className
      )}
    >
      <img src={asset(poster)} alt='' className='block w-full h-auto' loading='lazy' />
      <span className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5' />
      <span className='absolute inset-0 flex items-center justify-center'>
        <span className='flex h-14 w-14 items-center justify-center bg-primary-600 text-white transition group-hover:bg-primary-700'>
          <svg viewBox='0 0 24 24' className='ml-1 h-7 w-7' fill='currentColor' aria-hidden='true'>
            <path d='M8 5v14l11-7z' />
          </svg>
        </span>
      </span>
    </button>
  );
}
