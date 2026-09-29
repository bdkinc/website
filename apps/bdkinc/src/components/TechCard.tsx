import React, { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { Card, Slot, cn } from '@bdkinc/design-system';

const enter = stylex.keyframes({
  from: { opacity: 0, transform: 'translate3d(0, 24px, 0)' },
  to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
});
const transition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const styles = stylex.create({
  wrapper: {
    position: 'relative',
    display: 'block',
    height: '100%',
    outline: { default: 'none', ':focus-visible': 'none' },
    boxShadow: {
      default: 'none',
      ':focus-visible': '0 0 0 2px var(--primary), 0 0 0 4px var(--background)',
    },
    '--tech-hover-opacity': '0',
    '--tech-line-width': '3rem',
    '--tech-accent-alpha': '20%',
  },
  hoverable: {
    '--tech-hover-opacity': {
      default: '0',
      '@media (hover: hover)': { default: '0', ':hover': '1' },
    },
    '--tech-line-width': {
      default: '3rem',
      '@media (hover: hover)': { default: '3rem', ':hover': '5rem' },
    },
    '--tech-accent-alpha': {
      default: '20%',
      '@media (hover: hover)': { default: '20%', ':hover': '60%' },
    },
    '--tech-title-color': {
      default: 'var(--foreground)',
      '@media (hover: hover)': {
        default: 'var(--foreground)',
        ':hover': 'var(--primary)',
      },
    },
  },
  animated: {
    animationName: enter,
    animationDuration: '600ms',
    animationTimingFunction: 'ease',
    animationFillMode: 'both',
  },
  card: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: 'color-mix(in oklab, var(--card) 60%, transparent)',
    borderColor:
      'color-mix(in oklab, var(--tech-tracking-color, var(--border)) var(--tech-border-alpha, 50%), transparent)',
    backdropFilter: 'blur(24px)',
    transitionProperty: transition,
    transitionDuration: '300ms',
    boxShadow: 'none',
  },
  technical: { borderStyle: 'solid', '--tech-border-alpha': '20%' },
  interactive: {
    '--tech-border-alpha': {
      default: '20%',
      '@media (hover: hover)': { default: '20%', ':hover': '40%' },
    },
    boxShadow: {
      default: 'none',
      '@media (hover: hover)': {
        default: 'none',
        ':hover': 'var(--shadow-glow-sm)',
      },
    },
  },
  primary: { borderStyle: 'solid', '--tech-tracking-color': 'var(--primary)' },
  secondary: {
    borderStyle: 'solid',
    '--tech-tracking-color': 'var(--secondary)',
  },
  accent: { borderStyle: 'solid', '--tech-tracking-color': 'var(--accent)' },
  texture: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.03,
  },
  wash: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    pointerEvents: 'none',
    opacity: 'var(--tech-hover-opacity)',
    transitionProperty: 'opacity',
    transitionDuration: '300ms',
    backgroundImage:
      'linear-gradient(to bottom right, color-mix(in oklab, var(--primary) 10%, transparent), color-mix(in oklab, var(--secondary) 10%, transparent), transparent)',
  },
  spotlight: {
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    pointerEvents: 'none',
    transitionProperty: 'opacity',
    transitionDuration: '300ms',
  },
  body: {
    position: 'relative',
    zIndex: 20,
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    color: 'var(--foreground)',
  },
  content: { width: '100%', flexGrow: 1 },
  footer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto',
    paddingTop: 24,
  },
  footerEnd: { justifyContent: 'flex-end' },
  footerStart: {
    justifyContent: 'flex-start',
    '--tech-tracking-color': 'var(--secondary)',
  },
  bar: {
    height: 4,
    width: 'var(--tech-line-width)',
    borderRadius: '9999px',
    backgroundColor:
      'color-mix(in oklab, var(--tech-tracking-color) var(--tech-accent-alpha), transparent)',
    transitionProperty: transition,
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease-out',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: '9999px',
    backgroundColor:
      'color-mix(in oklab, var(--tech-tracking-color) var(--tech-accent-alpha), transparent)',
    transitionProperty: transition,
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease-out',
  },
  grid: { display: 'grid', gap: 32, marginBottom: 80 },
  gridDefault: {
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      '@media (min-width: 48rem)': 'repeat(3, minmax(0, 1fr))',
    },
  },
});

export interface TechCardProps {
  children: React.ReactNode;
  className?: string;
  xstyle?: StyleXStyles;
  animated?: boolean;
  delay?: number;
  size?: 'default' | 'sm' | 'lg';
  interactive?: boolean;
  variant?: 'default' | 'technical' | 'simple' | 'blog';
  asChild?: boolean;
  trackingColor?: 'primary' | 'secondary' | 'accent' | string;
}

export function TechCard({
  children,
  className,
  xstyle,
  animated = true,
  delay = 0,
  size = 'lg',
  interactive = true,
  variant = 'technical',
  asChild = false,
  trackingColor = 'primary',
}: TechCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Component = asChild ? Slot : 'div';
  const chrome =
    variant === 'technical' || variant === 'simple' || variant === 'blog';
  const tracking = {
    primary: styles.primary,
    secondary: styles.secondary,
    accent: styles.accent,
  }[trackingColor as 'primary' | 'secondary' | 'accent'];
  // Restores the original interactive `group` boundary: descendants using
  // stylex.when.ancestor() scope to this marked card only.
  const wrapper = stylex.props(
    styles.wrapper,
    interactive && stylex.defaultMarker(),
    interactive && styles.hoverable,
    animated && styles.animated,
    xstyle
  );
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      '--mouse-x',
      `${((e.clientX - rect.left) / rect.width) * 100}%`
    );
    e.currentTarget.style.setProperty(
      '--mouse-y',
      `${((e.clientY - rect.top) / rect.height) * 100}%`
    );
  };
  const spotlightColors =
    trackingColor === 'primary'
      ? 'rgba(0, 212, 255, 0.12), rgba(124, 58, 237, 0.08)'
      : trackingColor === 'secondary'
        ? 'rgba(124, 58, 237, 0.12), rgba(0, 212, 255, 0.08)'
        : 'rgba(255, 107, 107, 0.12), rgba(124, 58, 237, 0.08)';
  return (
    <Component
      {...wrapper}
      className={cn(wrapper.className, className)}
      style={
        {
          ...wrapper.style,
          ...(animated ? { animationDelay: `${delay}ms` } : {}),
          ...(interactive ? { '--mouse-x': '50%', '--mouse-y': '50%' } : {}),
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      onPointerEnter={() => interactive && setIsHovered(true)}
      onPointerLeave={() => interactive && setIsHovered(false)}
    >
      <Card
        size={size}
        interactive={false}
        xstyle={[
          styles.card,
          chrome && styles.technical,
          interactive && chrome && styles.interactive,
          chrome && tracking,
        ]}
      >
        <div
          {...stylex.props(styles.texture)}
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, oklch(0.7 0.18 210) 2px, oklch(0.7 0.18 210) 4px)',
          }}
        />
        {interactive && <div {...stylex.props(styles.wash)} />}
        {interactive && (
          <div
            {...stylex.props(styles.spotlight)}
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${spotlightColors} 40%, transparent 60%)`,
            }}
          />
        )}
        <div {...stylex.props(styles.body)}>
          <div {...stylex.props(styles.content)}>{children}</div>
          {variant === 'technical' && (
            <div {...stylex.props(styles.footer, styles.footerEnd)}>
              <div {...stylex.props(styles.bar)} />
              <div {...stylex.props(styles.dot)} />
            </div>
          )}
          {variant === 'blog' && (
            <div {...stylex.props(styles.footer, styles.footerStart)}>
              <div {...stylex.props(styles.dot)} />
              <div {...stylex.props(styles.bar)} />
            </div>
          )}
        </div>
      </Card>
    </Component>
  );
}

export interface TechCardGridProps {
  children: React.ReactNode;
  className?: string;
  xstyle?: StyleXStyles;
}
export function TechCardGrid({
  children,
  className,
  xstyle,
}: TechCardGridProps) {
  const applied = stylex.props(
    styles.grid,
    !className && styles.gridDefault,
    xstyle
  );
  const childrenWithAnimations = React.Children.map(
    children,
    (child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(
          child as React.ReactElement<TechCardProps>,
          { delay: 150 + index * 80 } as Partial<TechCardProps>
        );
      }
      return child;
    }
  );
  // `not-prose` opts this grid out of an ancestor typography plugin's descendants.
  return (
    <div {...applied} className={cn(applied.className, 'not-prose', className)}>
      {childrenWithAnimations}
    </div>
  );
}
