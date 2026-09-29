import React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { cn } from '@bdkinc/design-system';

interface TechnicalSectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  overlayOpacity?: string;
  id?: string;
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  section: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    paddingBlock: { default: 96, '@media (min-width: 40rem)': 128 },
  },
  overlay: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  opacity20: { opacity: 0.2 },
  opacity10: { opacity: 0.1 },
  frame: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '80rem',
    marginInline: 'auto',
    paddingInline: {
      default: 16,
      '@media (min-width: 40rem)': 24,
      '@media (min-width: 64rem)': 32,
    },
  },
  panel: {
    position: 'relative',
    borderRadius: 'calc(var(--radius) + 4px)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--background) 95%, transparent)',
    padding: { default: 32, '@media (min-width: 48rem)': 64 },
    boxShadow: '0 0 50px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
  },
  content: { position: 'relative', zIndex: 10 },
});

export default function TechnicalSection({
  children,
  className,
  containerClassName,
  overlayOpacity = 'opacity-20',
  id,
  xstyle,
}: TechnicalSectionProps) {
  const applied = stylex.props(styles.section, xstyle);
  const overlay = stylex.props(
    styles.overlay,
    overlayOpacity === 'opacity-10' ? styles.opacity10 : styles.opacity20
  );
  const panel = stylex.props(styles.panel);
  return (
    <section id={id} {...applied} className={cn(applied.className, className)}>
      {/* The semantic class retains the existing global circuit-pattern artwork. */}
      <div
        className={cn(
          overlay.className,
          'circuit-overlay',
          overlayOpacity !== 'opacity-10' &&
            overlayOpacity !== 'opacity-20' &&
            overlayOpacity
        )}
        style={overlay.style}
      />
      <div {...stylex.props(styles.frame)}>
        <div {...panel} className={cn(panel.className, containerClassName)}>
          <div {...stylex.props(styles.content)}>{children}</div>
        </div>
      </div>
    </section>
  );
}
