import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  PiCaretDown,
  PiDesktop,
  PiDeviceMobile,
  PiStack,
} from 'react-icons/pi';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

const steps = [
  {
    id: 'legacy',
    title: 'Legacy Foundation',
    description:
      'Stabilize AS/400 & iSeries workloads. Hardware refresh, OS upgrades, and security hardening.',
    icon: PiDesktop,
    color: 'primary',
  },
  {
    id: 'hybrid',
    title: 'Hybrid Integration',
    description:
      'Connect legacy data to modern workflows. REST APIs, cloud connectors, and bi-directional sync.',
    icon: PiStack,
    color: 'secondary',
  },
  {
    id: 'future',
    title: 'Future State',
    description:
      'Full digital agility. Web/Mobile front-ends, real-time analytics, and microservices architecture.',
    icon: PiDeviceMobile,
    color: 'primary',
  },
] as const;

export function ModernizationRoadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopShimmerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileShimmerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimated = useRef(false);

  const { ref: observerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  useGSAP(
    () => {
      if (!isIntersecting || hasAnimated.current) return;

      hasAnimated.current = true;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.2,
            ease: 'power2.out',
          }
        );
      });

      iconRefs.current.forEach((icon, index) => {
        if (!icon) return;
        gsap.fromTo(
          icon,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.2 + 0.3,
            ease: 'back.out(1.7)',
          }
        );
      });

      numberRefs.current.forEach((numberBadge, index) => {
        if (!numberBadge) return;
        gsap.fromTo(
          numberBadge,
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: index * 0.2 + 0.1,
            ease: 'power2.out',
          }
        );
      });

      desktopShimmerRefs.current.forEach((shimmer, index) => {
        if (!shimmer) return;
        gsap.set(shimmer, { x: '-100%' });
        gsap.to(shimmer, {
          x: '300%',
          duration: 2,
          repeat: -1,
          ease: 'linear',
          delay: index * 0.5 + 0.6,
        });
      });

      mobileShimmerRefs.current.forEach((shimmer, index) => {
        if (!shimmer) return;
        gsap.set(shimmer, { y: '-100%' });
        gsap.to(shimmer, {
          y: '300%',
          duration: 2,
          repeat: -1,
          ease: 'linear',
          delay: index * 0.5 + 0.6,
        });
      });
    },
    { scope: containerRef, dependencies: [isIntersecting] }
  );

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        observerRef.current = el;
      }}
      className="relative w-full py-12"
    >
      <div className="bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)] bg-[bottom_1px_center]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h3 className="text-foreground font-display text-3xl font-bold tracking-tight">
            Systems Upgrade Flow
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            const isSecondary = step.color === 'secondary';

            return (
              <div
                key={step.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="group relative"
                style={{ opacity: 0 }}
              >
                {!isLast && (
                  <div className="bg-muted absolute top-1/2 left-full hidden h-[2px] w-full -translate-y-1/2 overflow-hidden rounded-full md:block">
                    <div
                      ref={(el) => {
                        desktopShimmerRefs.current[index] = el;
                      }}
                      className="via-primary absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent to-transparent"
                    />
                  </div>
                )}

                {!isLast && (
                  <div className="bg-muted absolute top-full left-1/2 h-8 w-[2px] -translate-x-1/2 overflow-hidden rounded-full md:hidden">
                    <div
                      ref={(el) => {
                        mobileShimmerRefs.current[index] = el;
                      }}
                      className="via-primary absolute top-0 left-0 h-1/3 w-full bg-gradient-to-b from-transparent to-transparent"
                    />
                  </div>
                )}

                <div className="border-border bg-card/80 hover:border-primary/50 relative flex h-full flex-col items-center rounded-xl border px-6 pt-8 pb-6 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.15)]">
                  {/* Scanline texture */}
                  <div className="scanlines pointer-events-none absolute inset-0 overflow-hidden rounded-xl opacity-[0.03]" />

                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="border-primary h-2 w-2 border-t-2 border-r-2" />
                  </div>
                  <div className="absolute bottom-0 left-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="border-primary h-2 w-2 border-b-2 border-l-2" />
                  </div>

                  {/* Step number */}
                  <div
                    ref={(el) => {
                      numberRefs.current[index] = el;
                    }}
                    className="bg-background border-primary/20 text-primary mb-5 inline-flex h-6 w-9 items-center justify-center rounded border font-mono text-[10px] font-bold shadow-[0_0_10px_rgba(0,212,255,0.15)]"
                    style={{ opacity: 0 }}
                  >
                    {`0${index + 1}`}
                  </div>

                  {/* Icon */}
                  <div
                    ref={(el) => {
                      iconRefs.current[index] = el;
                    }}
                    className={cn(
                      'mb-6 inline-flex items-center justify-center rounded-2xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.08)] ring-1 ring-white/10 ring-inset',
                      isSecondary
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-primary/10 text-primary'
                    )}
                    style={{ opacity: 0 }}
                  >
                    <Icon className="h-9 w-9" />
                  </div>

                  {/* Title */}
                  <h4 className="text-foreground font-display mb-2 text-lg font-bold tracking-tight">
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p className="text-muted-foreground mb-auto max-w-[26ch] text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Status indicator */}
                  <div className="mt-6">
                    <div
                      className={cn(
                        'h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_8px_currentColor]',
                        isSecondary
                          ? 'bg-secondary text-secondary'
                          : 'bg-primary text-primary'
                      )}
                    />
                  </div>
                </div>

                {!isLast && (
                  <div className="text-primary/40 mt-2 flex justify-center md:hidden">
                    <PiCaretDown className="h-5 w-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
