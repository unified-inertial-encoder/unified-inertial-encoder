import * as React from 'react';

import { asset, cn } from '@/lib/utils';

type FigureProp = {
  img_src: string;
  alt?: string;
  caption: React.ReactNode;
  isDark?: boolean;
  idx?: number;
  className?: string;
  imgClassName?: string;
};

const Figure = ({ img_src, alt = '', caption, isDark = false, idx, className, imgClassName }: FigureProp) => {
  const caption_clr = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <figure className={cn('flex flex-col items-center justify-center', className)}>
      <img
        src={asset(img_src)}
        alt={alt}
        loading='lazy'
        className={cn('w-full h-auto pt-4 pb-4', imgClassName)}
      />
      <figcaption className={cn(caption_clr, 'mt-2 font-light text-pretty')}>
        {idx !== undefined ? <span className='font-medium'>Figure {idx}. </span> : null}
        {caption}
      </figcaption>
    </figure>
  );
};

export default Figure;
