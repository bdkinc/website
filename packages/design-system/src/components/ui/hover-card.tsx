'use client';

import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { PreviewCard as HoverCardPrimitive } from '@base-ui/react/preview-card';

import { cn } from '../../lib/cn';

const styles = stylex.create({
  content: {
    zIndex: 50,
    width: 256,
    borderRadius: 'calc(var(--radius) - 2px)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    padding: 16,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1)',
  },
});

const HoverCardDelayContext = React.createContext<{
  openDelay?: number;
  closeDelay?: number;
}>({});

function HoverCard({
  openDelay,
  closeDelay,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root> & {
  openDelay?: number;
  closeDelay?: number;
}) {
  return (
    <HoverCardDelayContext.Provider value={{ openDelay, closeDelay }}>
      <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
    </HoverCardDelayContext.Provider>
  );
}

function HoverCardTrigger({
  asChild = false,
  children,
  delay,
  closeDelay,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger> & {
  asChild?: boolean;
}) {
  const defaults = React.useContext(HoverCardDelayContext);

  if (asChild && React.isValidElement(children)) {
    return (
      <HoverCardPrimitive.Trigger
        closeDelay={closeDelay ?? defaults.closeDelay}
        data-slot="hover-card-trigger"
        delay={delay ?? defaults.openDelay}
        render={children}
        {...props}
      >
        {(children.props as { children?: React.ReactNode }).children}
      </HoverCardPrimitive.Trigger>
    );
  }

  return (
    <HoverCardPrimitive.Trigger
      closeDelay={closeDelay ?? defaults.closeDelay}
      data-slot="hover-card-trigger"
      delay={delay ?? defaults.openDelay}
      {...props}
    >
      {children}
    </HoverCardPrimitive.Trigger>
  );
}

function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Popup> & {
  xstyle?: StyleXStyles;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}) {
  const applied = stylex.props(styles.content, xstyle);
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Positioner align={align} sideOffset={sideOffset}>
        <HoverCardPrimitive.Popup
          data-slot="hover-card-content"
          {...applied}
          className={cn(applied.className, className)}
          style={{ ...applied.style, ...style }}
          {...props}
        />
      </HoverCardPrimitive.Positioner>
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
