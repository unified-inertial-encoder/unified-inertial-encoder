'use client';

import * as React from 'react';

import { asset, cn } from '@/lib/utils';

type Item = { src: string; label: string };

/** One looping video at a time with prev / next arrows on either side. */
export default function VideoCarousel({ items, className }: { items: Item[]; className?: string }) {
  const [i, setI] = React.useState(0);
  const n = items.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  const item = items[i];

  const arrow = (d: -1 | 1) => (
    <button
      type='button'
      onClick={() => go(d)}
      aria-label={d < 0 ? 'Previous set' : 'Next set'}
      className={cn(
        'flex h-12 w-8 shrink-0 items-center justify-center self-center border border-gray-300 bg-white text-gray-600',
        'hover:border-gray-800 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
      )}
    >
      <svg viewBox='0 0 24 24' className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
        <path d={d < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    </button>
  );

  return (
    <div className={className}>
      <div className='flex items-stretch gap-3'>
        {arrow(-1)}
        {/* key on src so the browser restarts playback from the first frame */}
        <video key={item.src} autoPlay loop muted playsInline className='min-w-0 flex-1' aria-label={item.label}>
          <source src={asset(item.src)} type='video/mp4' />
        </video>
        {arrow(1)}
      </div>
      <div className='mt-2 flex items-center justify-center gap-3 text-xs text-gray-500'>
        <span className='tabular-nums'>
          {i + 1} / {n}
        </span>
        <span aria-hidden='true'>·</span>
        <span>{item.label}</span>
        <span className='ml-2 flex gap-1.5' role='tablist' aria-label='Trajectory sets'>
          {items.map((it, j) => (
            <button
              key={it.src}
              type='button'
              role='tab'
              aria-selected={j === i}
              aria-label={it.label}
              onClick={() => setI(j)}
              className={cn('h-2 w-2', j === i ? 'bg-gray-800' : 'bg-gray-300 hover:bg-gray-500')}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
