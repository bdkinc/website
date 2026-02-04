import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import CircuitBoard from '@/components/CircuitBoard';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { PiLightning, PiShieldCheck, PiUsers } from 'react-icons/pi';

interface Reason {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  description: string;
  highlight: string;
  detail: string;
}

export default function WhyChooseUs() {
  // Viewport detection for section header
  const { ref: headerRef, isIntersecting: headerInView } =
    useIntersectionObserver({
      threshold: 0.2,
      rootMargin: '0px',
      triggerOnce: true,
    });

  const { ref: consoleRef, isIntersecting: consoleInView } =
    useIntersectionObserver({
      threshold: 0.1,
      rootMargin: '50px',
      triggerOnce: true,
    });

  const reasons = useMemo<Reason[]>(
    () => [
      {
        icon: PiLightning,
        title: 'Fast Response',
        description:
          'Quick turnaround times with dedicated support staff available 24/7.',
        highlight: 'support',
        detail:
          'When incidents happen, minutes matter. We route alerts, triage fast, and keep you operational—with clear communication at every step.',
      },
      {
        icon: PiShieldCheck,
        title: 'Proven Expertise',
        description:
          'Over 25 years of experience delivering reliable IT solutions.',
        highlight: 'experience',
        detail:
          'We build and run production systems across infrastructure, cloud, and security. You get battle-tested processes—not guesswork.',
      },
      {
        icon: PiUsers,
        title: 'Personalized Service',
        description:
          'Dedicated team that understands your unique business needs.',
        highlight: 'business',
        detail:
          'Your environment is documented, your stakeholders are known, and your roadmap is intentional. We operate like an extension of your team.',
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!consoleInView) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reasons.length);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [consoleInView, reasons.length]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIndex((index + 1) % reasons.length);
      return;
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIndex((index - 1 + reasons.length) % reasons.length);
      return;
    }
  };

  const active = reasons[activeIndex];

  return (
    <section id="why-choose-us" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="via-primary/20 absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-linear-to-r from-transparent to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div
          ref={headerRef as any}
          className={cn(
            'mb-16 text-center',
            'translate-y-8 opacity-0 transition-[opacity,transform] duration-700 ease-out',
            headerInView && 'translate-y-0 opacity-100'
          )}
        >
          <h2 className="font-display mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            <span className="text-foreground">Why choose </span>
            <span className="from-primary to-secondary bg-linear-to-br bg-clip-text font-extrabold text-transparent">
              <span className="font-extrabold">BDK</span>inc?
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl font-sans text-xl">
            Technical authority{' '}
            <span className="text-accent font-semibold">
              refined over decades
            </span>
            .
          </p>
        </div>

        <div
          ref={consoleRef as any}
          className={cn(
            'flex flex-col gap-10 lg:flex-row lg:items-stretch lg:justify-between',
            'translate-y-6 opacity-0 transition-[opacity,transform] duration-700 ease-out',
            consoleInView && 'translate-y-0 opacity-100'
          )}
        >
          <div className="relative w-full lg:max-w-[560px]">
            <div className="flex flex-col gap-2">
              {reasons.map((reason, index) => {
                const selected = index === activeIndex;
                const Icon = reason.icon;

                return (
                  <button
                    key={reason.title}
                    type="button"
                    className={cn(
                      'group focus-visible:ring-primary/40 focus-visible:ring-offset-background relative min-h-[140px] w-full rounded-xl border px-5 py-5 text-left transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
                      selected
                        ? 'border-primary/40 bg-primary/10'
                        : 'border-border/60 bg-card/20 hover:border-primary/30 hover:bg-card/40'
                    )}
                    aria-pressed={selected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300',
                          selected
                            ? 'border-primary/40 from-primary/20 to-secondary/10 bg-linear-to-br'
                            : 'border-border/60 bg-card/30 group-hover:border-primary/25'
                        )}
                        aria-hidden
                      >
                        <Icon
                          className={cn(
                            'h-5 w-5',
                            selected
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-primary'
                          )}
                          aria-hidden
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <p
                            className={cn(
                              'font-display text-base font-bold tracking-tight',
                              selected
                                ? 'text-foreground'
                                : 'text-foreground/90'
                            )}
                          >
                            {reason.title}
                          </p>
                        </div>
                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                          {reason.description.split(reason.highlight)[0]}
                          <span className="text-primary font-semibold">
                            {reason.highlight}
                          </span>
                          {reason.description.split(reason.highlight)[1]}
                        </p>
                      </div>
                    </div>

                    <div className="pointer-events-none mt-5 flex items-center justify-start gap-2">
                      {/* Left-aligned: Circle + Bar */}
                      <div
                        className={cn(
                          'h-2 w-2 rounded-full transition-colors duration-500',
                          selected
                            ? 'bg-primary/40'
                            : 'bg-primary/15 group-hover:bg-primary/25'
                        )}
                        aria-hidden
                      />
                      <div
                        className={cn(
                          'h-1 rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-500',
                          selected
                            ? 'bg-primary/40 w-14'
                            : 'bg-primary/15 group-hover:bg-primary/25 w-10 group-hover:w-12'
                        )}
                        aria-hidden
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-border bg-card/20 relative w-full max-w-[680px] flex-1 overflow-hidden rounded-2xl border lg:self-stretch">
            <div className="from-primary/5 to-secondary/5 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent" />
            <div className="absolute inset-0">
              <CircuitBoard className="opacity-25" />
            </div>

            <div className="relative flex h-full flex-col justify-between p-8 lg:min-h-full">
              <div>
                <div
                  className={cn(
                    'mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border bg-linear-to-br transition-colors duration-300',
                    'from-primary/10 to-secondary/5 border-primary/20'
                  )}
                  aria-hidden
                >
                  <active.icon className="text-primary h-8 w-8" aria-hidden />
                </div>

                <h3 className="font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  {active.title}
                </h3>

                <p className="text-muted-foreground mt-4 max-w-2xl font-sans text-lg leading-relaxed">
                  {active.detail}
                </p>
              </div>

              <div className="mt-10 flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  {reasons.map((reason, index) => (
                    <button
                      key={reason.title}
                      type="button"
                      aria-label={`Select ${reason.title}`}
                      className={cn(
                        'focus-visible:ring-primary/40 focus-visible:ring-offset-background h-2.5 w-2.5 rounded-full border transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
                        index === activeIndex
                          ? 'border-primary/50 bg-primary/40'
                          : 'border-border/60 bg-card/30 hover:border-primary/30'
                      )}
                      onClick={() => setActiveIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
