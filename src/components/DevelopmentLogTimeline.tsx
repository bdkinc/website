import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface DevelopmentLogTimelineProps {
  milestones: Milestone[];
}

export default function DevelopmentLogTimeline({
  milestones,
}: DevelopmentLogTimelineProps) {
  const { ref: containerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={containerRef as any} className="relative py-12">
      {/* Central Axis Line */}
      <div className="bg-border/40 absolute top-0 bottom-0 left-8 w-px md:left-1/2 md:-ml-px">
        <div className="via-primary/50 absolute inset-0 bg-linear-to-b from-transparent to-transparent" />
      </div>

      <div className="space-y-12">
        {milestones.map((milestone, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className={cn(
                'relative flex flex-col items-center gap-8 transition-all duration-700 ease-out md:flex-row',
                isIntersecting
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Date Marker (Mobile: Left, Desktop: Center) */}
              <div className="absolute left-8 z-10 -ml-3 flex h-6 w-6 items-center justify-center md:left-1/2 md:-ml-3">
                <div className="bg-primary h-3 w-3 animate-pulse rounded-full shadow-[0_0_10px_var(--color-primary)]" />
              </div>

              {/* Content Card */}
              <div
                className={cn(
                  'w-full pl-16 md:w-[calc(50%-2rem)] md:pl-0',
                  isEven
                    ? 'md:pr-12 md:text-right'
                    : 'md:ml-auto md:flex-row-reverse md:pl-12 md:text-left'
                )}
              >
                <div className="group border-border/60 bg-card/40 hover:border-primary/50 relative overflow-hidden rounded-lg border p-6 backdrop-blur-sm transition-colors duration-300">
                  {/* Scanline overlay */}
                  <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.03]" />

                  <div className="relative z-10 space-y-2">
                    <div className="text-primary/80 mb-2 flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
                      <span className="bg-primary/40 inline-block h-2 w-2" />
                      {milestone.year}
                    </div>

                    <h3 className="font-display text-foreground group-hover:text-primary text-xl font-bold transition-colors">
                      {milestone.title}
                    </h3>

                    <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                      {index === 0 ? (
                        <>
                          <span className="text-primary font-bold">BDKinc</span>{' '}
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
