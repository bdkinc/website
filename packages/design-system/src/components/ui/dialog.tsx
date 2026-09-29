'use client';

import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { PiX } from 'react-icons/pi';

import { cn } from '../../lib/cn';

const styles = stylex.create({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
  },
  viewport: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    display: 'grid',
    width: '100%',
    gap: 16,
    borderRadius: 'var(--radius)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    backgroundColor: 'var(--background)',
    padding: 24,
    boxShadow:
      '0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1)',
    transitionDuration: '200ms',
  },
  close: {
    position: 'absolute',
    opacity: 0.7,
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
    outline: { default: 'none', ':focus': 'none' },
    boxShadow: {
      default: 'none',
      ':focus': '0 0 0 2px var(--ring), 0 0 0 4px var(--background)',
    },
    pointerEvents: { default: 'auto', ':disabled': 'none' },
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    textAlign: 'center',
  },
  footer: {
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 40rem)': 'row',
    },
    gap: 8,
  },
  title: { fontSize: '1.125rem', lineHeight: 1, fontWeight: 600 },
  description: {
    color: 'var(--muted-foreground)',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
  },
});

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}
function DialogTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}
function DialogPortal(
  props: React.ComponentProps<typeof DialogPrimitive.Portal>
) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}
function DialogClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>
) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop> & {
  xstyle?: StyleXStyles;
}) {
  const applied = stylex.props(styles.overlay, xstyle);
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & {
  showCloseButton?: boolean;
  xstyle?: StyleXStyles;
}) {
  const applied = stylex.props(styles.content, xstyle);
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Viewport {...stylex.props(styles.viewport)}>
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          {...applied}
          className={cn(applied.className, className)}
          style={{ ...applied.style, ...style }}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              {...stylex.props(styles.close)}
            >
              <PiX />
              <span {...stylex.props(styles.srOnly)}>Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<'div'> & { xstyle?: StyleXStyles }) {
  const applied = stylex.props(styles.header, xstyle);
  return (
    <div
      data-slot="dialog-header"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function DialogFooter({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<'div'> & { xstyle?: StyleXStyles }) {
  const applied = stylex.props(styles.footer, xstyle);
  return (
    <div
      data-slot="dialog-footer"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function DialogTitle({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & {
  xstyle?: StyleXStyles;
}) {
  const applied = stylex.props(styles.title, xstyle);
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function DialogDescription({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description> & {
  xstyle?: StyleXStyles;
}) {
  const applied = stylex.props(styles.description, xstyle);
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
