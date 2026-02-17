import { cn } from '@/lib/utils';
import CircuitBoard from '@/components/CircuitBoard';
import React, { useEffect, useState } from 'react';
import { iconMap } from '@/lib/icons';

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
}

export default function FeatureCarousel({
  features,
  className,
}: FeatureCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [features.length]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIndex((index + 1) % features.length);
      return;
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIndex((index - 1 + features.length) % features.length);
      return;
    }
  };

  const active = features[activeIndex];

  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-bottom-8 flex flex-col gap-10 duration-700 lg:flex-row lg:items-stretch lg:justify-between',
        className
      )}
    >
      <div className="relative w-full lg:max-w-[560px]">
        <div className="flex flex-col gap-2">
          {features.map((feature, index) => {
            const selected = index === activeIndex;
            const Icon = iconMap[feature.icon];

            return (
              <button
                key={feature.title}
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
                          selected ? 'text-foreground' : 'text-foreground/90'
                        )}
                      >
                        {feature.title}
                      </p>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {feature.description.split(feature.highlight)[0]}
                      <span className="text-primary font-semibold">
                        {feature.highlight}
                      </span>
                      {feature.description.split(feature.highlight)[1]}
                    </p>
                  </div>
                </div>

                <div className="pointer-events-none mt-5 flex items-center justify-start gap-2">
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
              {(() => {
                const ActiveIcon = iconMap[active.icon];
                return <ActiveIcon className="text-primary h-8 w-8" />;
              })()}
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
              {features.map((feature, index) => (
                <button
                  key={feature.title}
                  type="button"
                  aria-label={`Select ${feature.title}`}
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
  );
}
