import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { cn } from '@bdkinc/design-system';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import CircuitBoard from '@/components/CircuitBoard';
import React, { useEffect, useState, useCallback } from 'react';
import { iconMap } from '@/lib/icons';

const AUTOPLAY_DURATION = 8000; // ms per slide

const hover = '@media (hover: hover)';
const sm = '@media (min-width: 40rem)';
const lg = '@media (min-width: 64rem)';
const colorTransition =
  'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to';
const transition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Mirrors tw-animate-css `enter` with fade-in + slide-in-from-bottom-8.
const enter = stylex.keyframes({
  from: {
    opacity: 0,
    transform: 'translate3d(0, 2rem, 0) scale3d(1, 1, 1) rotate(0)',
    filter: 'blur(0)',
  },
});

// Tailwind `focus-visible:ring-2 ring-primary/40 ring-offset-2 ring-offset-background`.
const focusRing = {
  default: null,
  ':focus-visible':
    '0 0 0 2px var(--background), 0 0 0 4px color-mix(in oklab, var(--primary) 40%, transparent)',
} as const;

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: { default: 'column', [lg]: 'row' },
    alignItems: { default: null, [lg]: 'stretch' },
    justifyContent: { default: null, [lg]: 'space-between' },
    gap: '2.5rem',
    animationName: enter,
    animationDuration: '700ms',
    animationTimingFunction: 'ease',
    animationDelay: '0s',
    animationIterationCount: 1,
    animationDirection: 'normal',
    animationFillMode: 'none',
    transitionDuration: '700ms',
  },
  listColumn: {
    position: 'relative',
    width: '100%',
    maxWidth: { default: null, [lg]: '560px' },
  },
  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  // `outline-hidden`: outline none, restored only in forced-colors mode.
  item: {
    position: 'relative',
    minHeight: '140px',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 'calc(var(--radius) + 4px)',
    borderWidth: 1,
    borderStyle: 'solid',
    paddingInline: '1.25rem',
    paddingBlock: '1.25rem',
    textAlign: 'left',
    transitionProperty: colorTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easing,
    boxShadow: focusRing,
    outlineStyle: {
      default: null,
      ':focus-visible': {
        default: 'none',
        '@media (forced-colors: active)': 'solid',
      },
    },
    outlineWidth: {
      default: null,
      ':focus-visible': { default: null, '@media (forced-colors: active)': 2 },
    },
    outlineColor: {
      default: null,
      ':focus-visible': {
        default: null,
        '@media (forced-colors: active)': 'transparent',
      },
    },
    outlineOffset: {
      default: null,
      ':focus-visible': { default: null, '@media (forced-colors: active)': 2 },
    },
  },
  itemSelected: {
    borderColor: 'color-mix(in oklab, var(--primary) 40%, transparent)',
    backgroundImage:
      'linear-gradient(to bottom right in oklab, color-mix(in oklab, var(--primary) 10%, transparent), transparent, color-mix(in oklab, var(--secondary) 10%, transparent))',
  },
  itemIdle: {
    borderColor: {
      default: 'color-mix(in oklab, var(--border) 60%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--border) 60%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 30%, transparent)',
      },
    },
    backgroundColor: {
      default: 'color-mix(in oklab, var(--card) 20%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--card) 20%, transparent)',
        ':hover': 'color-mix(in oklab, var(--card) 40%, transparent)',
      },
    },
  },
  progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '0.125rem',
    width: '100%',
    transformOrigin: 'left',
    backgroundImage:
      'linear-gradient(to right in oklab, var(--primary), var(--secondary))',
  },
  row: { display: 'flex', alignItems: 'flex-start', gap: '1rem' },
  iconBox: {
    marginTop: '0.125rem',
    display: 'flex',
    height: '2.5rem',
    width: '2.5rem',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius)',
    borderWidth: 1,
    borderStyle: 'solid',
    transitionProperty: colorTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easing,
  },
  iconBoxSelected: {
    borderColor: 'color-mix(in oklab, var(--secondary) 40%, transparent)',
    backgroundImage:
      'linear-gradient(to bottom right in oklab, color-mix(in oklab, var(--secondary) 20%, transparent), color-mix(in oklab, var(--secondary) 10%, transparent))',
  },
  iconBoxIdle: {
    borderColor: {
      default: 'color-mix(in oklab, var(--border) 60%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--border) 60%, transparent)',
        [stylex.when.ancestor(':hover')]:
          'color-mix(in oklab, var(--secondary) 25%, transparent)',
      },
    },
    backgroundColor: 'color-mix(in oklab, var(--card) 30%, transparent)',
  },
  icon: { height: '1.25rem', width: '1.25rem' },
  iconSelected: { color: 'var(--secondary)' },
  iconIdle: {
    color: {
      default: 'var(--muted-foreground)',
      [hover]: {
        default: 'var(--muted-foreground)',
        [stylex.when.ancestor(':hover')]: 'var(--secondary)',
      },
    },
  },
  textCol: { minWidth: 0, flex: '1 1 0%' },
  titleRow: { display: 'flex', alignItems: 'center' },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    lineHeight: 1.5,
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  titleSelected: { color: 'var(--foreground)' },
  titleIdle: {
    color: 'color-mix(in oklab, var(--foreground) 90%, transparent)',
  },
  description: {
    marginTop: '0.5rem',
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: 1.625,
  },
  highlight: { color: 'var(--accent)', fontWeight: 600 },
  indicators: {
    pointerEvents: 'none',
    marginTop: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '0.5rem',
  },
  pip: {
    height: '0.5rem',
    width: '0.5rem',
    borderRadius: '9999px',
    transitionProperty: colorTransition,
    transitionDuration: '500ms',
    transitionTimingFunction: easing,
  },
  pipSelected: {
    backgroundColor: 'color-mix(in oklab, var(--primary) 40%, transparent)',
  },
  pipIdle: {
    backgroundColor: {
      default: 'color-mix(in oklab, var(--primary) 15%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--primary) 15%, transparent)',
        [stylex.when.ancestor(':hover')]:
          'color-mix(in oklab, var(--primary) 25%, transparent)',
      },
    },
  },
  pill: {
    height: '0.25rem',
    borderRadius: '9999px',
    transitionProperty: transition,
    transitionDuration: '500ms',
    transitionTimingFunction: easing,
  },
  pillSelected: {
    backgroundColor: 'color-mix(in oklab, var(--primary) 40%, transparent)',
    width: '3.5rem',
  },
  pillIdle: {
    backgroundColor: {
      default: 'color-mix(in oklab, var(--primary) 15%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--primary) 15%, transparent)',
        [stylex.when.ancestor(':hover')]:
          'color-mix(in oklab, var(--primary) 25%, transparent)',
      },
    },
    width: {
      default: '2.5rem',
      [hover]: {
        default: '2.5rem',
        [stylex.when.ancestor(':hover')]: '3rem',
      },
    },
  },
  panel: {
    position: 'relative',
    width: '100%',
    maxWidth: '680px',
    flex: '1 1 0%',
    overflow: 'hidden',
    borderRadius: '1rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    backgroundColor: 'color-mix(in oklab, var(--card) 20%, transparent)',
    alignSelf: { default: null, [lg]: 'stretch' },
  },
  panelWash: {
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(to bottom right in oklab, color-mix(in oklab, var(--primary) 5%, transparent), transparent, color-mix(in oklab, var(--secondary) 5%, transparent))',
  },
  circuit: { position: 'absolute', inset: 0 },
  circuitBoard: { opacity: 0.25 },
  panelBody: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '2rem',
    minHeight: { default: null, [lg]: '100%' },
  },
  bigIcon: {
    marginBottom: '1.5rem',
    display: 'inline-flex',
    height: '4rem',
    width: '4rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
    backgroundImage:
      'linear-gradient(to bottom right in oklab, color-mix(in oklab, var(--secondary) 10%, transparent), color-mix(in oklab, var(--secondary) 5%, transparent))',
    transitionProperty: colorTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easing,
  },
  bigGlyph: { height: '2rem', width: '2rem', color: 'var(--secondary)' },
  heading: {
    color: 'var(--foreground)',
    fontFamily: 'var(--font-display)',
    fontSize: { default: '1.875rem', [sm]: '2.25rem' },
    lineHeight: { default: 'calc(2.25 / 1.875)', [sm]: 'calc(2.5 / 2.25)' },
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  detail: {
    marginTop: '1rem',
    maxWidth: '42rem',
    color: 'var(--muted-foreground)',
    fontFamily: 'var(--font-sans)',
    fontSize: '1.125rem',
    lineHeight: 1.625,
  },
  dots: {
    marginTop: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  dot: {
    height: '0.625rem',
    width: '0.625rem',
    borderRadius: '9999px',
    borderWidth: 1,
    borderStyle: 'solid',
    transitionProperty: colorTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easing,
    boxShadow: focusRing,
    outlineStyle: {
      default: null,
      ':focus-visible': {
        default: 'none',
        '@media (forced-colors: active)': 'solid',
      },
    },
    outlineWidth: {
      default: null,
      ':focus-visible': { default: null, '@media (forced-colors: active)': 2 },
    },
    outlineColor: {
      default: null,
      ':focus-visible': {
        default: null,
        '@media (forced-colors: active)': 'transparent',
      },
    },
    outlineOffset: {
      default: null,
      ':focus-visible': { default: null, '@media (forced-colors: active)': 2 },
    },
  },
  dotSelected: {
    borderColor: 'color-mix(in oklab, var(--primary) 50%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--primary) 40%, transparent)',
  },
  dotIdle: {
    borderColor: {
      default: 'color-mix(in oklab, var(--border) 60%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--border) 60%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 30%, transparent)',
      },
    },
    backgroundColor: 'color-mix(in oklab, var(--card) 30%, transparent)',
  },
});

export interface Feature {
  icon: keyof typeof iconMap;
  title: string;
  description: string;
  highlight: string;
  detail: string;
}

interface FeatureCarouselProps {
  features: Feature[];
  className?: string;
  xstyle?: StyleXStyles;
}

export default function FeatureCarousel({
  features,
  className,
  xstyle,
}: FeatureCarouselProps) {
  // Not triggerOnce: autoplay pauses while the carousel is off screen.
  const { ref: carouselRef, isIntersecting: inView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: false,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setAutoplay(!mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % features.length);
  }, [features.length]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      goTo((index + 1) % features.length);
      return;
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo((index - 1 + features.length) % features.length);
      return;
    }
  };

  const active = features[activeIndex];
  const root = stylex.props(styles.root, xstyle);

  return (
    <div
      ref={carouselRef as any}
      {...root}
      className={cn(root.className, className)}
    >
      <div {...stylex.props(styles.listColumn)}>
        <div {...stylex.props(styles.list)}>
          {features.map((feature, index) => {
            const selected = index === activeIndex;
            const Icon = iconMap[feature.icon];
            const highlightIndex = feature.highlight
              ? feature.description.indexOf(feature.highlight)
              : -1;

            return (
              <button
                key={feature.title}
                type="button"
                {...stylex.props(
                  stylex.defaultMarker(),
                  styles.item,
                  selected ? styles.itemSelected : styles.itemIdle
                )}
                aria-pressed={selected}
                onMouseEnter={() => {
                  goTo(index);
                  setIsPaused(true);
                }}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => goTo(index)}
                onClick={() => goTo(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {/* Progress bar at bottom of active card */}
                {selected && autoplay && (
                  <div
                    {...stylex.props(styles.progress)}
                    style={{
                      animationName: 'autoplay-progress',
                      animationDuration: `${AUTOPLAY_DURATION}ms`,
                      animationTimingFunction: 'linear',
                      animationFillMode: 'both',
                      animationPlayState:
                        isPaused || !inView ? 'paused' : 'running',
                    }}
                    onAnimationEnd={advance}
                    aria-hidden
                  />
                )}
                <div {...stylex.props(styles.row)}>
                  <div
                    {...stylex.props(
                      styles.iconBox,
                      selected ? styles.iconBoxSelected : styles.iconBoxIdle
                    )}
                    aria-hidden
                  >
                    <Icon
                      {...stylex.props(
                        styles.icon,
                        selected ? styles.iconSelected : styles.iconIdle
                      )}
                      aria-hidden
                    />
                  </div>

                  <div {...stylex.props(styles.textCol)}>
                    <div {...stylex.props(styles.titleRow)}>
                      <p
                        {...stylex.props(
                          styles.title,
                          selected ? styles.titleSelected : styles.titleIdle
                        )}
                      >
                        {feature.title}
                      </p>
                    </div>
                    <p {...stylex.props(styles.description)}>
                      {highlightIndex < 0 ? (
                        feature.description
                      ) : (
                        <>
                          {feature.description.slice(0, highlightIndex)}
                          <span {...stylex.props(styles.highlight)}>
                            {feature.highlight}
                          </span>
                          {feature.description.slice(
                            highlightIndex + feature.highlight.length
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div {...stylex.props(styles.indicators)}>
                  <div
                    {...stylex.props(
                      styles.pip,
                      selected ? styles.pipSelected : styles.pipIdle
                    )}
                    aria-hidden
                  />
                  <div
                    {...stylex.props(
                      styles.pill,
                      selected ? styles.pillSelected : styles.pillIdle
                    )}
                    aria-hidden
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div {...stylex.props(styles.panel)}>
        <div {...stylex.props(styles.panelWash)} />
        <div {...stylex.props(styles.circuit)}>
          <CircuitBoard xstyle={styles.circuitBoard} />
        </div>

        <div {...stylex.props(styles.panelBody)}>
          <div>
            <div {...stylex.props(styles.bigIcon)} aria-hidden>
              {(() => {
                const ActiveIcon = iconMap[active.icon];
                return <ActiveIcon {...stylex.props(styles.bigGlyph)} />;
              })()}
            </div>

            <h3 {...stylex.props(styles.heading)}>{active.title}</h3>

            <p {...stylex.props(styles.detail)}>{active.detail}</p>
          </div>

          <div {...stylex.props(styles.dots)}>
            {features.map((feature, index) => (
              <button
                key={feature.title}
                type="button"
                aria-label={`Select ${feature.title}`}
                {...stylex.props(
                  styles.dot,
                  index === activeIndex ? styles.dotSelected : styles.dotIdle
                )}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
