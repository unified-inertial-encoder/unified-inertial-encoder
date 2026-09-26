import Link, { LinkProps } from 'next/link';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type UnstyledLinkProps = {
  href: string;
  children: React.ReactNode;
  openNewTab?: boolean;
  className?: string;
  nextLinkProps?: Omit<LinkProps, 'href'>;
} & React.ComponentPropsWithRef<'a'>;

export default function UnstyledLink({
  children,
  href,
  openNewTab,
  className,
  nextLinkProps,
  ...rest
}: UnstyledLinkProps) {
  const isNewTab =
    openNewTab !== undefined
      ? openNewTab
      : href && !href.startsWith('/') && !href.startsWith('#');

  if (!isNewTab) {
    return (
      <Link href={href} className={className} {...rest} {...nextLinkProps}>
        {children}
      </Link>
    );
  }

  return (
    <a
      target='_blank'
      rel='noopener noreferrer'
      href={href}
      {...rest}
      className={cn('cursor-pointer', className)}
    >
      {children}
    </a>
  );
}
