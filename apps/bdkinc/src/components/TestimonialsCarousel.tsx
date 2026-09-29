'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi';

import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import {
  TestimonialCard,
  type Testimonial,
} from '@/components/TestimonialCard';

export type TestimonialItem = Testimonial;

export interface TestimonialsCarouselProps {
  testimonials: TestimonialItem[];
  xstyle?: StyleXStyles;
}

const hover = '@media (hover: hover)';
const sm = '@media (min-width: 40rem)';
const md = '@media (min-width: 48rem)';
const lg = '@media (min-width: 64rem)';

const styles = stylex.create({
  section: { marginInline: 'auto', width: '100%' },
  container: { marginInline: 'auto', width: '100%' },
  inner: {
    position: 'relative',
    marginInline: 'auto',
    width: '100%',
    paddingInline: 0,
    paddingBlock: { default: '1.5rem', [sm]: '2rem' },
  },
  stage: {
    position: 'relative',
    marginInline: 'auto',
    height: { default: '520px', [sm]: '480px' },
    width: '100%',
    maxWidth: '80rem',
  },
  track: { position: 'relative', height: '100%', width: '100%' },
  slot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: 'auto',
    width: '100%',
    maxWidth: { default: '420px', [md]: '460px', [lg]: '500px' },
  },
  pointer: { cursor: 'pointer' },
  defaultCursor: { cursor: 'default' },
  controls: {
    marginTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  group: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  // Tailwind `focus-visible:ring-2 ring-primary/40 ring-offset-2 ring-offset-background outline-none`.
  focusable: {
    boxShadow: {
      default: null,
      ':focus-visible':
        '0 0 0 2px var(--background), 0 0 0 4px color-mix(in oklab, var(--primary) 40%, transparent)',
    },
    outlineStyle: { default: null, ':focus-visible': 'none' },
  },
  arrow: {
    display: 'flex',
    height: '2.25rem',
    width: '2.25rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'calc(var(--radius) + 4px)',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderColor: {
      default: 'color-mix(in oklab, var(--border) 50%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--border) 50%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 40%, transparent)',
      },
    },
    color: {
      default: 'var(--muted-foreground)',
      [hover]: {
        default: 'var(--muted-foreground)',
        ':hover': 'var(--primary)',
      },
    },
    transitionProperty:
      'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to',
    transitionDuration: '200ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  arrowIcon: { height: '1rem', width: '1rem' },
  dot: {
    height: '0.625rem',
    borderRadius: '9999px',
    borderWidth: 1,
    borderStyle: 'solid',
    transitionProperty: 'width, background-color, border-color',
    transitionDuration: '500ms',
    transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  dotActive: {
    borderColor: 'color-mix(in oklab, var(--secondary) 60%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--secondary) 70%, transparent)',
    width: '2rem',
  },
  dotIdle: {
    width: '0.625rem',
    borderColor: {
      default: 'color-mix(in oklab, var(--border) 50%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--border) 50%, transparent)',
        ':hover': 'color-mix(in oklab, var(--secondary) 50%, transparent)',
      },
    },
    backgroundColor: {
      default: 'color-mix(in oklab, var(--border) 30%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--border) 30%, transparent)',
        ':hover': 'color-mix(in oklab, var(--secondary) 40%, transparent)',
      },
    },
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
});

type SlotName = 'left' | 'center' | 'right';

interface SlotTarget {
  xPercent: number;
  yPercent: number;
  scale: number;
  opacity: number;
  filter: string;
  zIndex: number;
}

const SLOT_TARGETS: Record<SlotName, SlotTarget> = {
  left: {
    xPercent: -150,
    yPercent: -50,
    scale: 0.85,
    opacity: 0.5,
    filter: 'blur(1px)',
    zIndex: 10,
  },
  center: {
    xPercent: -50,
    yPercent: -50,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    zIndex: 30,
  },
  right: {
    xPercent: 50,
    yPercent: -50,
    scale: 0.85,
    opacity: 0.5,
    filter: 'blur(1px)',
    zIndex: 10,
  },
};

const OFFSCREEN_LEFT_X = -250;
const OFFSCREEN_RIGHT_X = 150;
const AUTOPLAY_DURATION = 7000;

export default function TestimonialsCarousel({
  testimonials,
  xstyle,
}: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // Not triggerOnce: autoplay pauses while the carousel is off screen.
  const { ref: sectionRef, isIntersecting: inView } =
    useIntersectionObserver<HTMLElement>({
      threshold: 0.1,
      triggerOnce: false,
    });

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLButtonElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLButtonElement | null>(null);

  const isFirstRender = useRef(true);
  const prevIndexRef = useRef(activeIndex);
  const isAnimatingRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const length = testimonials.length;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduceMotion(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Autoplay is driven by the progress bar's CSS animation ending.
  const autoplayEnabled = !reduceMotion && length > 1;
  const handleAutoplayEnd = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % length);
  }, [length]);

  const showSides = length > 2;

  const indices = useMemo(() => {
    if (length === 0) return { left: 0, center: 0, right: 0 };
    const center = ((activeIndex % length) + length) % length;
    const left = (center - 1 + length) % length;
    const right = (center + 1) % length;
    return { left, center, right };
  }, [activeIndex, length]);

  const setHomePositions = useCallback(() => {
    const leftEl = leftRef.current;
    const centerEl = centerRef.current;
    const rightEl = rightRef.current;
    if (centerEl) gsap.set(centerEl, { ...SLOT_TARGETS.center });
    if (showSides && leftEl) gsap.set(leftEl, { ...SLOT_TARGETS.left });
    if (showSides && rightEl) gsap.set(rightEl, { ...SLOT_TARGETS.right });
  }, [showSides]);

  useEffect(() => {
    if (length === 0) return;

    const leftEl = leftRef.current;
    const centerEl = centerRef.current;
    const rightEl = rightRef.current;

    if (!centerEl) return;

    if (isFirstRender.current) {
      setHomePositions();
      isFirstRender.current = false;
      prevIndexRef.current = activeIndex;
      return;
    }

    if (prevIndexRef.current === activeIndex) return;

    const prevIndex = prevIndexRef.current;
    const diff = activeIndex - prevIndex;
    const isNext =
      diff === 1 ||
      diff === -(length - 1) ||
      (diff > 1 && diff <= length / 2) ||
      diff < -(length / 2);

    prevIndexRef.current = activeIndex;

    if (reduceMotion || !showSides || !leftEl || !rightEl) {
      setHomePositions();
      return;
    }

    if (timelineRef.current) timelineRef.current.kill();
    gsap.killTweensOf([leftEl, centerEl, rightEl]);

    isAnimatingRef.current = true;

    const duration = 0.6;
    const ease = 'power2.out';

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    timelineRef.current = tl;

    if (isNext) {
      gsap.set(leftEl, { ...SLOT_TARGETS.center, zIndex: 20 });
      tl.to(leftEl, { ...SLOT_TARGETS.left, duration, ease }, 0);

      gsap.set(centerEl, { ...SLOT_TARGETS.right, zIndex: 30 });
      tl.to(centerEl, { ...SLOT_TARGETS.center, duration, ease }, 0);

      gsap.set(rightEl, {
        xPercent: OFFSCREEN_RIGHT_X,
        yPercent: SLOT_TARGETS.center.yPercent,
        scale: SLOT_TARGETS.right.scale,
        opacity: 0,
        filter: 'blur(4px)',
        zIndex: 10,
      });
      tl.to(rightEl, { ...SLOT_TARGETS.right, duration, ease }, 0);
    } else {
      gsap.set(rightEl, { ...SLOT_TARGETS.center, zIndex: 20 });
      tl.to(rightEl, { ...SLOT_TARGETS.right, duration, ease }, 0);

      gsap.set(centerEl, { ...SLOT_TARGETS.left, zIndex: 30 });
      tl.to(centerEl, { ...SLOT_TARGETS.center, duration, ease }, 0);

      gsap.set(leftEl, {
        xPercent: OFFSCREEN_LEFT_X,
        yPercent: SLOT_TARGETS.center.yPercent,
        scale: SLOT_TARGETS.left.scale,
        opacity: 0,
        filter: 'blur(4px)',
        zIndex: 10,
      });
      tl.to(leftEl, { ...SLOT_TARGETS.left, duration, ease }, 0);
    }

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
      isAnimatingRef.current = false;
    };
  }, [activeIndex, length, reduceMotion, setHomePositions, showSides]);

  if (length === 0) return null;

  const goTo = (index: number) => {
    if (index === activeIndex || isAnimatingRef.current) return;
    setActiveIndex(index);
  };

  const handlePrev = () => {
    if (isAnimatingRef.current) return;
    setActiveIndex((prev) => (prev - 1 + length) % length);
  };

  const handleNext = () => {
    if (isAnimatingRef.current) return;
    setActiveIndex((prev) => (prev + 1) % length);
  };

  const handleLeftClick = () => {
    if (isAnimatingRef.current) return;
    goTo(indices.left);
  };

  const handleRightClick = () => {
    if (isAnimatingRef.current) return;
    goTo(indices.right);
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Client success stories carousel"
      {...stylex.props(styles.section, xstyle)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.inner)}>
          {/* Card stage */}
          <div
            ref={containerRef}
            {...stylex.props(styles.stage)}
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
            }}
          >
            <div {...stylex.props(styles.track)}>
              {showSides && (
                <button
                  ref={leftRef}
                  type="button"
                  aria-label={`Show testimonial from ${testimonials[indices.left].author}`}
                  onClick={handleLeftClick}
                  {...stylex.props(styles.slot, styles.pointer)}
                >
                  <TestimonialCard testimonial={testimonials[indices.left]} />
                </button>
              )}

              <div
                ref={centerRef}
                aria-label={`Currently highlighted testimonial from ${testimonials[indices.center].author}`}
                {...stylex.props(styles.slot, styles.defaultCursor)}
              >
                <TestimonialCard
                  key={activeIndex}
                  testimonial={testimonials[indices.center]}
                  autoplay={
                    autoplayEnabled
                      ? {
                          durationMs: AUTOPLAY_DURATION,
                          paused: isPaused || !inView,
                          onEnd: handleAutoplayEnd,
                        }
                      : undefined
                  }
                />
              </div>

              {showSides && (
                <button
                  ref={rightRef}
                  type="button"
                  aria-label={`Show testimonial from ${testimonials[indices.right].author}`}
                  onClick={handleRightClick}
                  {...stylex.props(styles.slot, styles.pointer)}
                >
                  <TestimonialCard testimonial={testimonials[indices.right]} />
                </button>
              )}
            </div>
          </div>

          {/* Controls */}
          <div {...stylex.props(styles.controls)}>
            {/* Prev / Next */}
            <div {...stylex.props(styles.group)}>
              <button
                type="button"
                aria-label="Show previous testimonial"
                onClick={handlePrev}
                {...stylex.props(styles.arrow, styles.focusable)}
              >
                <PiArrowLeft {...stylex.props(styles.arrowIcon)} aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Show next testimonial"
                onClick={handleNext}
                {...stylex.props(styles.arrow, styles.focusable)}
              >
                <PiArrowRight {...stylex.props(styles.arrowIcon)} aria-hidden />
              </button>
            </div>

            {/* Dot indicators */}
            <div {...stylex.props(styles.group)}>
              {testimonials.map((t, index) => (
                <button
                  key={`indicator-${index}`}
                  type="button"
                  aria-label={`Jump to testimonial ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => goTo(index)}
                  {...stylex.props(
                    styles.dot,
                    styles.focusable,
                    index === activeIndex ? styles.dotActive : styles.dotIdle
                  )}
                >
                  <span {...stylex.props(styles.srOnly)}>
                    {index === activeIndex ? 'Active' : `Go to ${t.author}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
