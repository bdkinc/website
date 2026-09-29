import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { CSSProperties } from 'react';
import { cn } from '@bdkinc/design-system';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';

const hover = '@media (hover: hover)';
const md = '@media (min-width: 48rem)';
const easeOut = 'cubic-bezier(0, 0, 0.2, 1)';
const transition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const colorTransition = 'color, background-color, border-color';

const styles = stylex.create({
  root: { position: 'relative', paddingBlock: '3rem' },
  axis: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: { default: '2rem', [md]: '50%' },
    width: 1,
    transform: 'translateX(-50%)',
    backgroundColor: 'color-mix(in oklab, var(--border) 40%, transparent)',
  },
  axisGlow: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(to bottom, transparent, color-mix(in oklab, var(--primary) 50%, transparent), transparent)',
  },
  // Replaces the legacy `space-y-12` sibling margins with parent gap.
  list: { display: 'flex', flexDirection: 'column', gap: '3rem' },
  row: {
    position: 'relative',
    display: 'flex',
    flexDirection: { default: 'column', [md]: 'row' },
    alignItems: 'center',
    gap: '2rem',
    transitionProperty: transition,
    transitionDuration: '700ms',
    transitionTimingFunction: easeOut,
  },
  rowVisible: { opacity: 1, transform: 'translateY(0)' },
  rowHidden: { opacity: 0, transform: 'translateY(2rem)' },
  marker: {
    position: 'absolute',
    left: { default: '2rem', [md]: '50%' },
    zIndex: 10,
    display: 'flex',
    height: '1.5rem',
    width: '1.5rem',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translateX(-50%)',
  },
  dot: {
    height: '0.75rem',
    width: '0.75rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--primary)',
  },
  side: {
    width: { default: '100%', [md]: 'calc(50% - 2rem)' },
    paddingLeft: { default: '4rem', [md]: 0 },
  },
  sideEven: {
    paddingRight: { default: null, [md]: '3rem' },
    textAlign: { default: null, [md]: 'right' },
  },
  sideOdd: {
    marginLeft: { default: null, [md]: 'auto' },
    paddingLeft: { default: null, [md]: '3rem' },
    textAlign: { default: null, [md]: 'left' },
  },
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '0.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'color-mix(in oklab, var(--border) 60%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--border) 60%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 50%, transparent)',
      },
    },
    backgroundColor: 'color-mix(in oklab, var(--card) 40%, transparent)',
    padding: '1.5rem',
    backdropFilter: 'blur(4px)',
    transitionProperty: colorTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  scan: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.03,
  },
  cardBody: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  year: {
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    letterSpacing: '0.1em',
    color: 'color-mix(in oklab, var(--primary) 80%, transparent)',
  },
  // The `group` is this card itself, so the legacy `group-hover:` is a self hover.
  cardTitle: {
    color: {
      default: 'var(--foreground)',
      [hover]: { default: 'var(--foreground)', ':hover': 'var(--primary)' },
    },
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: easeOut,
  },
  text: {
    color: 'var(--muted-foreground)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    lineHeight: 1.625,
  },
  brand: { color: 'var(--primary)', fontWeight: 700 },
});

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface DevelopmentLogTimelineProps {
  milestones: Milestone[];
  foundingBrand: string;
  xstyle?: StyleXStyles;
}

export default function DevelopmentLogTimeline({
  milestones,
  foundingBrand,
  xstyle,
}: DevelopmentLogTimelineProps) {
  const { ref: containerRef, isIntersecting } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      triggerOnce: true,
    });

  return (
    <div ref={containerRef} {...stylex.props(styles.root, xstyle)}>
      {/* Central Axis Line */}
      <div {...stylex.props(styles.axis)}>
        <div {...stylex.props(styles.axisGlow)} />
      </div>

      <div {...stylex.props(styles.list)}>
        {milestones.map((milestone, index) => {
          const isEven = index % 2 === 0;
          const row = stylex.props(
            styles.row,
            isIntersecting ? styles.rowVisible : styles.rowHidden
          );
          return (
            <div
              key={milestone.year}
              {...row}
              style={
                {
                  ...row.style,
                  transitionDelay: `${index * 150}ms`,
                } as CSSProperties
              }
            >
              {/* Date Marker (Mobile: Left, Desktop: Center) */}
              <div {...stylex.props(styles.marker)}>
                <div {...stylex.props(styles.dot)} />
              </div>

              {/* Content Card */}
              <div
                {...stylex.props(
                  styles.side,
                  isEven ? styles.sideEven : styles.sideOdd
                )}
              >
                <div {...stylex.props(styles.card)}>
                  {/* Scanline overlay */}
                  {/* Marker: `scanlines` supplies its CSS rule. */}
                  <div
                    className={cn(
                      stylex.props(styles.scan).className,
                      'scanlines'
                    )}
                  />

                  <div {...stylex.props(styles.cardBody)}>
                    <div {...stylex.props(styles.year)}>{milestone.year}</div>

                    <h3 {...stylex.props(styles.cardTitle)}>
                      {milestone.title}
                    </h3>

                    <p {...stylex.props(styles.text)}>
                      {index === 0 ? (
                        <>
                          <span {...stylex.props(styles.brand)}>
                            {foundingBrand}
                          </span>{' '}
                          {milestone.description}
                        </>
                      ) : (
                        milestone.description
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
