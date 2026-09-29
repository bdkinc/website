import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { Command as CommandPrimitive } from 'cmdk';
import { PiMagnifyingGlass } from 'react-icons/pi';

import { cn } from '../../lib/cn';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog';

const styles = stylex.create({
  command: {
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 'calc(var(--radius) - 2px)',
  },
  dialog: { overflow: 'hidden', padding: 0 },
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
  inputWrapper: {
    display: 'flex',
    height: 36,
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--border)',
    paddingInline: 12,
  },
  searchIcon: {
    width: 16,
    height: 16,
    flexShrink: 0,
    opacity: 0.5,
  },
  input: {
    display: 'flex',
    height: 40,
    width: '100%',
    borderRadius: 'calc(var(--radius) - 2px)',
    backgroundColor: 'transparent',
    paddingBlock: 12,
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    cursor: { default: 'auto', ':disabled': 'not-allowed' },
    opacity: { default: 1, ':disabled': 0.5 },
  },
  list: {
    overflowY: 'auto',
  },
  empty: {
    paddingBlock: 24,
    textAlign: 'center',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
  },
  group: {
    overflow: 'hidden',
    color: 'var(--foreground)',
  },
  separator: { height: 1, backgroundColor: 'var(--border)' },
  item: {
    position: 'relative',
    display: 'flex',
    cursor: 'default',
    alignItems: 'center',
    gap: 8,
    borderRadius: 'calc(var(--radius) - 4px)',
    paddingInline: 8,
    paddingBlock: 6,
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    userSelect: 'none',
    pointerEvents: { default: 'auto', '[data-disabled="true"]': 'none' },
    opacity: { default: 1, '[data-disabled="true"]': 0.5 },
  },
  shortcut: {
    marginLeft: 'auto',
    color: 'var(--muted-foreground)',
    fontSize: '.75rem',
    lineHeight: '1rem',
    letterSpacing: '.1em',
  },
});

type XStyle = { xstyle?: StyleXStyles };

function Command({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive> & XStyle) {
  const applied = stylex.props(styles.command, xstyle);
  return (
    <CommandPrimitive
      data-slot="command"
      {...applied}
      className={cn(applied.className, 'bdk-command', className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = true,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, 'children'> & {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader xstyle={styles.srOnly}>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        xstyle={styles.dialog}
        className={className}
        showCloseButton={showCloseButton}
      >
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & XStyle) {
  const applied = stylex.props(styles.input, xstyle);
  return (
    <div
      data-slot="command-input-wrapper"
      {...stylex.props(styles.inputWrapper)}
    >
      <PiMagnifyingGlass {...stylex.props(styles.searchIcon)} />
      <CommandPrimitive.Input
        data-slot="command-input"
        {...applied}
        className={cn(applied.className, className)}
        style={{ ...applied.style, ...style }}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List> & XStyle) {
  const applied = stylex.props(styles.list, xstyle);
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function CommandEmpty({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty> & XStyle) {
  const applied = stylex.props(styles.empty, xstyle);
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function CommandGroup({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group> & XStyle) {
  const applied = stylex.props(styles.group, xstyle);
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function CommandSeparator({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator> & XStyle) {
  const applied = stylex.props(styles.separator, xstyle);
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function CommandItem({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item> & XStyle) {
  const applied = stylex.props(styles.item, xstyle);
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function CommandShortcut({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<'span'> & XStyle) {
  const applied = stylex.props(styles.shortcut, xstyle);
  return (
    <span
      data-slot="command-shortcut"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
