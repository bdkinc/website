'use client';

import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

import { cn } from '../../lib/cn';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';

const styles = stylex.create({
  group: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    minWidth: 0,
    height: 36,
    alignItems: 'center',
    borderRadius: 'calc(var(--radius) - 2px)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'var(--input)',
      ':has([data-slot="input-group-control"]:focus-visible)': 'var(--ring)',
      ':has([data-slot][aria-invalid="true"])': 'var(--destructive)',
    },
    '--field-ring-color': {
      default: 'var(--field-focus-ring)',
      ':has([data-slot][aria-invalid="true"])': 'var(--field-invalid-ring)',
    },
    boxShadow: {
      default: null,
      ':has([data-slot="input-group-control"]:focus-visible)':
        '0 0 0 3px var(--field-ring-color)',
    },
    outline: 'none',
  },
  addon: {
    display: 'flex',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 6,
    paddingBottom: 6,
    color: 'var(--muted-foreground)',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    userSelect: 'none',
  },
  inlineStart: { order: -9999 },
  inlineEnd: { order: 9999 },
  blockStart: {
    order: -9999,
    width: '100%',
    justifyContent: 'flex-start',
    paddingInline: 12,
    paddingTop: 12,
  },
  blockEnd: {
    order: 9999,
    width: '100%',
    justifyContent: 'flex-start',
    paddingInline: 12,
    paddingBottom: 12,
  },
  // Button keeps its default size styles underneath; only the properties the
  // original tailwind-merge kept are overridden here.
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '.875rem',
    lineHeight: '1.25rem',
  },
  xs: { height: 24, gap: 4, paddingInline: 8 },
  sm: { height: 32, gap: 6, paddingInline: 0 },
  iconXs: { height: 'auto', paddingInline: 0, paddingBlock: 0 },
  // Zero padding uses the same logical longhands as the Button size
  // defaults so the original `p-0` override wins deterministically instead
  // of racing them as a shorthand.
  iconSm: { width: 32, height: 32, paddingInline: 0, paddingBlock: 0 },
  text: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: 'var(--muted-foreground)',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
  },
  control: {
    flex: 1,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    boxShadow: { default: 'none', ':focus-visible': 'none' },
  },
  textarea: { resize: 'none', paddingBlock: 12 },
});

type XStyle = { xstyle?: StyleXStyles };

function InputGroup({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<'div'> & XStyle) {
  const applied = stylex.props(styles.group, xstyle);
  return (
    <div
      data-slot="input-group"
      role="group"
      {...applied}
      className={cn(applied.className, 'bdk-input-group', className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

const aligns = {
  'inline-start': styles.inlineStart,
  'inline-end': styles.inlineEnd,
  'block-start': styles.blockStart,
  'block-end': styles.blockEnd,
};
type AddonAlign = keyof typeof aligns;
function InputGroupAddon({
  className,
  align = 'inline-start',
  xstyle,
  style,
  ...props
}: React.ComponentProps<'div'> & { align?: AddonAlign | null } & XStyle) {
  const applied = stylex.props(
    styles.addon,
    align !== null && aligns[align ?? 'inline-start'],
    xstyle
  );
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      role="button"
      tabIndex={0}
      {...applied}
      className={cn(applied.className, 'bdk-input-group-addon', className)}
      style={{ ...applied.style, ...style }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if ((e.target as HTMLElement).closest('button')) return;
        e.preventDefault();
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

const sizes = {
  xs: styles.xs,
  sm: styles.sm,
  'icon-xs': styles.iconXs,
  'icon-sm': styles.iconSm,
};
type GroupButtonSize = keyof typeof sizes;
function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  xstyle,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> & {
  size?: GroupButtonSize | null;
}) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      xstyle={[styles.button, size !== null && sizes[size ?? 'xs'], xstyle]}
      className={cn('bdk-input-group-button', className)}
      {...props}
    />
  );
}
function InputGroupText({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<'span'> & XStyle) {
  const applied = stylex.props(styles.text, xstyle);
  return (
    <span
      {...applied}
      className={cn(applied.className, 'bdk-input-group-text', className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function InputGroupInput({
  xstyle,
  ...props
}: React.ComponentProps<typeof Input> & XStyle) {
  return (
    <Input
      data-slot="input-group-control"
      xstyle={[styles.control, xstyle]}
      {...props}
    />
  );
}
function InputGroupTextarea({
  xstyle,
  ...props
}: React.ComponentProps<typeof Textarea> & XStyle) {
  return (
    <Textarea
      data-slot="input-group-control"
      xstyle={[styles.control, styles.textarea, xstyle]}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
