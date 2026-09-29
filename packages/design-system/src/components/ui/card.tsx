import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

import { cn } from '../../lib/cn';

const hover = '@media (hover: hover)';
const styles = stylex.create({
  card: {
    borderRadius: 'calc(var(--radius) + 4px)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--border) 50%, transparent)',
    backgroundColor: 'var(--shared-card-glass)',
    backdropFilter: 'blur(12px)',
    transitionProperty:
      'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing',
    transitionDuration: '300ms',
    transitionTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
    animationFillMode: 'both',
  },
  sm: { padding: 16 },
  sizeDefault: { padding: 24 },
  lg: { padding: 32 },
  xl: { padding: 40 },
  interactive: {
    borderColor: {
      default: 'color-mix(in oklab, var(--border) 50%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--border) 50%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 50%, transparent)',
      },
    },
    scale: {
      default: 1,
      [hover]: { default: 1, ':hover': 1.05 },
    },
    outline: { default: null, ':focus-visible': 'none' },
  },
  header: { display: 'flex', flexDirection: 'column', gap: 6 },
  title: {
    fontSize: '1.5rem',
    lineHeight: 1,
    fontWeight: 600,
    letterSpacing: '-.025em',
  },
  description: {
    color: 'var(--muted-foreground)',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
  },
  footer: { display: 'flex', alignItems: 'center' },
});

export interface CardVariants {
  size?: 'sm' | 'default' | 'lg' | 'xl' | null;
  interactive?: boolean | null;
  holographic?: boolean | null;
}
const sizes = {
  sm: styles.sm,
  default: styles.sizeDefault,
  lg: styles.lg,
  xl: styles.xl,
};

// Only the holographic-card selector remains as legacy effect interoperability.
function cardVariants(
  options: CardVariants & { class?: string; className?: string } = {}
) {
  const applied = stylex.props(
    styles.card,
    options.size !== null && sizes[options.size ?? 'default'],
    options.interactive && styles.interactive
  );
  return cn(
    applied.className,
    options.holographic && 'holographic-card',
    options.class,
    options.className
  );
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, CardVariants {
  xstyle?: StyleXStyles;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, size, interactive, holographic, xstyle, style, ...props },
    ref
  ) => {
    const applied = stylex.props(
      styles.card,
      size !== null && sizes[size ?? 'default'],
      interactive && styles.interactive,
      xstyle
    );
    return (
      <div
        ref={ref}
        {...applied}
        className={cn(
          applied.className,
          holographic && 'holographic-card',
          className
        )}
        style={{ ...applied.style, ...style }}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

interface CardPartProps extends React.HTMLAttributes<HTMLDivElement> {
  xstyle?: StyleXStyles;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, xstyle, style, ...props }, ref) => {
    const applied = stylex.props(styles.header, xstyle);
    return (
      <div
        ref={ref}
        {...applied}
        className={cn(applied.className, className)}
        style={{ ...applied.style, ...style }}
        {...props}
      />
    );
  }
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, xstyle, style, ...props }, ref) => {
    const applied = stylex.props(styles.title, xstyle);
    return (
      <div
        ref={ref}
        {...applied}
        className={cn(applied.className, className)}
        style={{ ...applied.style, ...style }}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, xstyle, style, ...props }, ref) => {
    const applied = stylex.props(styles.description, xstyle);
    return (
      <div
        ref={ref}
        {...applied}
        className={cn(applied.className, className)}
        style={{ ...applied.style, ...style }}
        {...props}
      />
    );
  }
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, xstyle, style, ...props }, ref) => {
    const applied = stylex.props(xstyle);
    return (
      <div
        ref={ref}
        {...applied}
        className={cn(applied.className, className)}
        style={{ ...applied.style, ...style }}
        {...props}
      />
    );
  }
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, xstyle, style, ...props }, ref) => {
    const applied = stylex.props(styles.footer, xstyle);
    return (
      <div
        ref={ref}
        {...applied}
        className={cn(applied.className, className)}
        style={{ ...applied.style, ...style }}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
