'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi';

import { Button } from '@/components/ui/button';
import {
  TestimonialCard,
  type Testimonial,
} from '@/components/TestimonialCard';
import { cn } from '@/lib/utils';

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

export default function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

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

    if (prevIndexRef.current === activeIndex) {
      return;
    }

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

    if (timelineRef.current) {
      timelineRef.current.kill();
    }
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
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      isAnimatingRef.current = false;
    };
  }, [activeIndex, length, reduceMotion, setHomePositions, showSides]);

  if (length === 0) return null;

  const handlePrev = () => {
    if (isAnimatingRef.current) return;
    setActiveIndex((prev) => (prev - 1 + length) % length);
  };

  const handleNext = () => {
    if (isAnimatingRef.current) return;
    setActiveIndex((prev) => (prev + 1) % length);
  };

  const handleIndicatorClick = (index: number) => {
    if (index === activeIndex || isAnimatingRef.current) return;
    setActiveIndex(index);
  };

  const handleLeftClick = () => {
    if (isAnimatingRef.current) return;
    setActiveIndex(indices.left);
  };

  const handleRightClick = () => {
    if (isAnimatingRef.current) return;
    setActiveIndex(indices.right);
  };

  const slotBaseClasses =
    'group absolute top-1/2 left-1/2 h-auto w-full max-w-[420px] md:max-w-[460px] lg:max-w-[500px]';

  return (
    <section
      aria-label="Client success stories carousel"
      className="mx-auto w-full"
    >
      <div className="mx-auto w-full">
        <div className="relative mx-auto w-full px-0 py-6 sm:py-8">
          <div
            ref={containerRef}
            className="relative mx-auto h-[520px] w-full max-w-7xl overflow-hidden sm:h-[480px]"
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
                <TestimonialCard testimonial={testimonials[indices.center]} />
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

          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Show previous testimonial"
                onClick={handlePrev}
                className="border-border/40 bg-background/60 text-foreground hover:border-primary/60 border transition-colors duration-300"
              >
                <PiArrowLeft className="h-5 w-5" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Show next testimonial"
                onClick={handleNext}
                className="border-border/40 bg-background/60 text-foreground hover:border-primary/60 border transition-colors duration-300"
              >
                <PiArrowRight className="h-5 w-5" aria-hidden />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={`indicator-${index}`}
                  type="button"
                  aria-label={`Jump to testimonial ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => handleIndicatorClick(index)}
                  className={cn(
                    'focus-visible:ring-primary/40 focus-visible:ring-offset-background flex h-2.5 items-center justify-center rounded-full border transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    index === activeIndex
                      ? 'border-secondary/70 bg-secondary/70 w-8'
                      : 'border-border/50 bg-border/30 hover:border-secondary/60 hover:bg-secondary/40 w-2.5'
                  )}
                >
                  <span className="sr-only">
                    {index === activeIndex
                      ? 'Active testimonial'
                      : 'Inactive testimonial'}
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
