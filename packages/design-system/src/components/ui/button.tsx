import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

import { cn } from '../../lib/cn';
import { Slot } from './slot';

const hover = '@media (hover: hover)';
const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
    borderRadius: 'calc(var(--radius) - 2px)',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    transitionProperty:
      'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
    cursor: 'pointer',
    flexShrink: 0,
    outline: 'none',
    pointerEvents: { default: 'auto', ':disabled': 'none' },
    opacity: { default: 1, ':disabled': 0.5 },
    '--button-ring': {
      default: 'var(--ring)',
      '[aria-invalid="true"]': 'var(--button-invalid-ring)',
    },
    boxShadow: {
      default: 'none',
      ':focus-visible':
        '0 0 0 2px var(--background), 0 0 0 4px var(--button-ring)',
    },
    borderColor: {
      default: 'transparent',
      '[aria-invalid="true"]': 'var(--destructive)',
    },
  },
  default: {
    backgroundColor: {
      default: 'var(--primary)',
      [hover]: {
        default: 'var(--primary)',
        ':hover': 'color-mix(in oklab, var(--primary) 90%, transparent)',
      },
    },
    color: 'var(--primary-foreground)',
  },
  destructive: {
    backgroundColor: 'var(--destructive)',
    color: '#fff',
    '--button-ring': 'var(--destructive)',
  },
  outline: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: {
      default: 'var(--primary)',
      '[aria-invalid="true"]': 'var(--destructive)',
    },
    backgroundColor: {
      default: 'var(--background)',
      [hover]: {
        default: 'var(--background)',
        ':hover': 'color-mix(in oklab, var(--primary) 10%, transparent)',
      },
    },
    color: 'var(--primary)',
  },
  secondary: {
    backgroundColor: 'var(--secondary)',
  },
  ghost: {
    backgroundColor: {
      default: 'transparent',
      [hover]: {
        default: 'transparent',
        ':hover': 'var(--button-ghost-hover)',
      },
    },
    color: {
      default: 'inherit',
      [hover]: { default: 'inherit', ':hover': 'var(--accent-foreground)' },
    },
  },
  link: {
    color: 'var(--primary)',
  },
  sizeDefault: {
    minHeight: 44,
    height: 44,
    paddingInline: 16,
    paddingBlock: 8,
  },
  sm: {
    height: 36,
    borderRadius: 'calc(var(--radius) - 2px)',
    gap: 6,
    paddingInline: 12,
  },
  lg: {
    minHeight: 44,
    height: 44,
    borderRadius: 'calc(var(--radius) - 2px)',
    paddingInline: 24,
  },
  cta: {
    minHeight: 44,
    height: 44,
    borderRadius: 'calc(var(--radius) - 2px)',
    paddingInline: 32,
    paddingBlock: 12,
  },
  icon: { minWidth: 44, minHeight: 44 },
  // size-9/min-h-9/min-w-9 were never generated, so icon-sm rendered unsized.
  iconSm: {},
  iconLg: { minWidth: 44, minHeight: 44 },
});

type ButtonVariant =
  'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize =
  'default' | 'sm' | 'lg' | 'cta' | 'icon' | 'icon-sm' | 'icon-lg';
interface ButtonVariants {
  variant?: ButtonVariant | null;
  size?: ButtonSize | null;
}

const variants = {
  default: styles.default,
  destructive: styles.destructive,
  outline: styles.outline,
  secondary: styles.secondary,
  ghost: styles.ghost,
  link: styles.link,
};
const sizes = {
  default: styles.sizeDefault,
  sm: styles.sm,
  lg: styles.lg,
  cta: styles.cta,
  icon: styles.icon,
  'icon-sm': styles.iconSm,
  'icon-lg': styles.iconLg,
};

// Keep the string API for Astro consumers.
function buttonVariants(
  options: ButtonVariants & { class?: string; className?: string } = {}
) {
  return cn(
    stylex.props(
      styles.base,
      options.variant !== null && variants[options.variant ?? 'default'],
      options.size !== null && sizes[options.size ?? 'default']
    ).className,
    'bdk-button',
    options.class,
    options.className
  );
}

interface ButtonProps extends React.ComponentProps<'button'>, ButtonVariants {
  asChild?: boolean;
  xstyle?: StyleXStyles;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  xstyle,
  style,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  const applied = stylex.props(
    styles.base,
    variant !== null && variants[variant ?? 'default'],
    size !== null && sizes[size ?? 'default'],
    xstyle
  );
  return (
    <Comp
      data-slot="button"
      {...applied}
      className={cn(applied.className, 'bdk-button', className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

export { Button, buttonVariants };
