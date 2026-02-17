'use client';

import * as React from 'react';
import { PreviewCard as HoverCardPrimitive } from '@base-ui/react/preview-card';

import { cn } from '@/lib/utils';

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
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Popup> & {
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Positioner align={align} sideOffset={sideOffset}>
        <HoverCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            'bg-popover text-popover-foreground z-50 w-64 rounded-md border p-4 shadow-md outline-hidden',
            className
          )}
          {...props}
        />
      </HoverCardPrimitive.Positioner>
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
