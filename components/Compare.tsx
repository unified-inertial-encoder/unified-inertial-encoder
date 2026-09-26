'use client';

import React, { useCallback, useRef, useState } from 'react';

import { asset } from '@/lib/utils';

type Props = {
  leftSrc: string;
  rightSrc: string;
  leftAlt?: string;
  rightAlt?: string;
  initial?: number; // [0,1]
  leftLabel?: string;
  rightLabel?: string;
  className?: string; // you can pass "aspect-[4/3]" here
  fit?: 'cover' | 'contain'; // how to place images inside the frame
  objectPosition?: string; // e.g. 'center', 'left top'
};

export default function ImageCompare({
  leftSrc,
  rightSrc,
  leftAlt = '',
  rightAlt = '',
  initial = 0.5,
  leftLabel,
  rightLabel,
  className = '',
  fit = 'cover',
  objectPosition = 'center',
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [t, setT] = useState<number>(clamp01(initial));
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setT(clamp01((clientX - rect.left) / Math.max(rect.width, 1)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    containerRef.current?.setPointerCapture(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) updateFromClientX(e.clientX);
  };
  const stopDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer capture may already be released */
    }
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setT((v) => clamp01(v - step));
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setT((v) => clamp01(v + step));
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setT(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      setT(1);
    }
  };

  const percent = Math.round(t * 100);
  const clip = `inset(0 ${100 - percent}% 0 0)`;
  const fitClass = fit === 'cover' ? 'object-cover' : 'object-contain';
  const posClass =
    objectPosition === 'left top'
      ? 'object-left-top'
      : objectPosition === 'left'
        ? 'object-left'
        : objectPosition === 'right'
          ? 'object-right'
          : objectPosition === 'top'
            ? 'object-top'
            : objectPosition === 'bottom'
              ? 'object-bottom'
              : 'object-center';

  return (
    <div
      ref={containerRef}
      className={[
        'relative overflow-hidden select-none touch-none',
        'rounded-xl shadow ring-1 ring-black/5 bg-black/5',
        className,
      ].join(' ')}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onPointerLeave={stopDrag}
      onClick={(e) => updateFromClientX(e.clientX)}
    >
      {/* Sizer: keeps layout when using intrinsic image or aspect-[x/y] */}
      <img
        src={asset(leftSrc)}
        alt=''
        aria-hidden='true'
        className='block w-full h-auto opacity-0 pointer-events-none select-none'
        draggable={false}
      />

      {/* Visible base (left) image */}
      <img
        src={asset(leftSrc)}
        alt={leftAlt}
        className={`absolute inset-0 w-full h-full ${fitClass} ${posClass} pointer-events-none select-none`}
        draggable={false}
      />

      {/* Visible overlay (right) image, clipped */}
      <img
        src={asset(rightSrc)}
        alt={rightAlt}
        className={`absolute inset-0 w-full h-full ${fitClass} ${posClass} pointer-events-none select-none`}
        style={{ clipPath: clip, WebkitClipPath: clip }}
        draggable={false}
      />

      {/* Divider / handle */}
      <div
        role='slider'
        aria-label='Image comparison position'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className='absolute top-0 bottom-0 w-8 -ml-4 cursor-col-resize outline-none'
        style={{ left: `${percent}%` }}
      >
        <div className='absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-white/70 bg-black/40 backdrop-blur-sm' />
      </div>

      {leftLabel && (
        <div className='absolute left-2 top-2 text-xs font-medium px-1.5 py-0.5 rounded bg-black/60 text-white'>
          {leftLabel}
        </div>
      )}
      {rightLabel && (
        <div className='absolute right-2 top-2 text-xs font-medium px-1.5 py-0.5 rounded bg-black/60 text-primary-400'>
          {rightLabel}
        </div>
      )}
    </div>
  );
}

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}
