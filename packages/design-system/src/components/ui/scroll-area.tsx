import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';

import { cn } from '../../lib/cn';

const styles = stylex.create({
  root: { position: 'relative' },
  viewport: {
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    outlineWidth: { default: 0, ':focus-visible': 1 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': 'currentColor' },
    boxShadow: {
      default: 'none',
      ':focus-visible':
        '0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent)',
    },
  },
  scrollbar: {
    display: 'flex',
    transitionProperty: 'color, background-color, border-color',
    transitionDuration: '150ms',
    userSelect: 'none',
  },
  vertical: {
    height: '100%',
    width: 10,
  },
  horizontal: {
    height: 10,
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
  },
  thumb: {
    position: 'relative',
    flex: 1,
    borderRadius: '9999px',
    backgroundColor: 'var(--border)',
  },
});

type RootProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  xstyle?: StyleXStyles;
};
type BarProps = React.ComponentProps<typeof ScrollAreaPrimitive.Scrollbar> & {
  xstyle?: StyleXStyles;
};

function ScrollArea({
  className,
  children,
  xstyle,
  style,
  ...props
}: RootProps) {
  const applied = stylex.props(styles.root, xstyle);
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        {...stylex.props(styles.viewport)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = 'vertical',
  xstyle,
  style,
  ...props
}: BarProps) {
  const applied = stylex.props(
    styles.scrollbar,
    orientation === 'vertical' ? styles.vertical : styles.horizontal,
    xstyle
  );
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        {...stylex.props(styles.thumb)}
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
