'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { gsap } from 'gsap';
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi';


import { cn } from '@bdkinc/design-system';
import {
  TestimonialCard,
  type Testimonial,
} from '@/components/TestimonialCard';

export type TestimonialItem = Testimonial;

export interface TestimonialsCarouselProps {
  testimonials: TestimonialItem[];
}

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
}: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  // Autoplay with RAF-driven progress bar
  useEffect(() => {
    if (reduceMotion || isPaused || length <= 1) return;

    setProgress(0);
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min((elapsed / AUTOPLAY_DURATION) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setActiveIndex((prev) => (prev + 1) % length);
        setProgress(0);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [activeIndex, reduceMotion, isPaused, length]);

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
    setProgress(0);
  };

  const handlePrev = () => {
    if (isAnimatingRef.current) return;
    setActiveIndex((prev) => (prev - 1 + length) % length);
    setProgress(0);
  };

  const handleNext = () => {
    if (isAnimatingRef.current) return;
    setActiveIndex((prev) => (prev + 1) % length);
    setProgress(0);
  };

  const handleLeftClick = () => {
    if (isAnimatingRef.current) return;
    goTo(indices.left);
  };

  const handleRightClick = () => {
    if (isAnimatingRef.current) return;
    goTo(indices.right);
  };

  const slotBaseClasses =
    'group absolute top-1/2 left-1/2 h-auto w-full max-w-[420px] md:max-w-[460px] lg:max-w-[500px]';

  return (
    <section
      aria-label="Client success stories carousel"
      className="mx-auto w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto w-full">
        <div className="relative mx-auto w-full px-0 py-6 sm:py-8">
          {/* Card stage */}
          <div
            ref={containerRef}
            className="relative mx-auto h-[520px] w-full max-w-7xl sm:h-[480px]"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
            }}
          >
            <div className="relative h-full w-full">
              {showSides && (
                <button
                  ref={leftRef}
                  type="button"
                  aria-label={`Show testimonial from ${testimonials[indices.left].author}`}
                  onClick={handleLeftClick}
                  className={cn(slotBaseClasses, 'cursor-pointer')}
                >
                  <TestimonialCard testimonial={testimonials[indices.left]} />
                </button>
              )}

              <div
                ref={centerRef}
                aria-label={`Currently highlighted testimonial from ${testimonials[indices.center].author}`}
                className={cn(slotBaseClasses, 'cursor-default')}
              >
                <TestimonialCard
                  testimonial={testimonials[indices.center]}
                  progress={progress}
                />
              </div>

              {showSides && (
                <button
                  ref={rightRef}
                  type="button"
                  aria-label={`Show testimonial from ${testimonials[indices.right].author}`}
                  onClick={handleRightClick}
                  className={cn(slotBaseClasses, 'cursor-pointer')}
                >
                  <TestimonialCard testimonial={testimonials[indices.right]} />
                </button>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between gap-4">
            {/* Prev / Next */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Show previous testimonial"
                onClick={handlePrev}
                className="border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary focus-visible:ring-primary/40 focus-visible:ring-offset-background flex h-9 w-9 items-center justify-center rounded-xl border bg-transparent transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <PiArrowLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Show next testimonial"
                onClick={handleNext}
                className="border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary focus-visible:ring-primary/40 focus-visible:ring-offset-background flex h-9 w-9 items-center justify-center rounded-xl border bg-transparent transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <PiArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((t, index) => (
                <button
                  key={`indicator-${index}`}
                  type="button"
                  aria-label={`Jump to testimonial ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => goTo(index)}
                  className={cn(
                    'focus-visible:ring-primary/40 focus-visible:ring-offset-background h-2.5 rounded-full border transition-[width,background-color,border-color] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    index === activeIndex
                      ? 'border-secondary/60 bg-secondary/70 w-8'
                      : 'border-border/50 bg-border/30 hover:border-secondary/50 hover:bg-secondary/40 w-2.5'
                  )}
                >
                  <span className="sr-only">
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
