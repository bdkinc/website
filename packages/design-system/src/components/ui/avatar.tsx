import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';

import { cn } from '../../lib/cn';

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'flex',
    width: 32,
    height: 32,
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: '50%',
  },
  image: { aspectRatio: 1, width: '100%', height: '100%' },
  fallback: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'var(--muted)',
  },
});

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  xstyle?: StyleXStyles;
};
type ImageProps = React.ComponentProps<typeof AvatarPrimitive.Image> & {
  xstyle?: StyleXStyles;
};
type FallbackProps = React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  xstyle?: StyleXStyles;
};

function Avatar({ className, xstyle, style, ...props }: AvatarProps) {
  const applied = stylex.props(styles.root, xstyle);
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

function AvatarImage({ className, xstyle, style, ...props }: ImageProps) {
  const applied = stylex.props(styles.image, xstyle);
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

function AvatarFallback({ className, xstyle, style, ...props }: FallbackProps) {
  const applied = stylex.props(styles.fallback, xstyle);
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
