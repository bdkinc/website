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

export default function DevelopmentLogTimeline({ milestones }: DevelopmentLogTimelineProps) {
  const { ref: containerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={containerRef as any} className="relative py-12">
      {/* Central Axis Line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-border/40 md:left-1/2 md:-ml-px">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
      </div>

      <div className="space-y-12">
        {milestones.map((milestone, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className={cn(
                'relative flex flex-col md:flex-row items-center gap-8 transition-all duration-700 ease-out',
                isIntersecting
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Date Marker (Mobile: Left, Desktop: Center) */}
              <div className="absolute left-8 md:left-1/2 -ml-3 md:-ml-3 w-6 h-6 flex items-center justify-center z-10">
                <div className="w-3 h-3 bg-background border border-primary rounded-full shadow-[0_0_10px_var(--color-primary)]">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                </div>
              </div>

              {/* Content Card */}
              <div className={cn(
                "w-full md:w-[calc(50%-2rem)] pl-16 md:pl-0",
                isEven ? "md:text-right md:pr-12" : "md:flex-row-reverse md:ml-auto md:text-left md:pl-12"
              )}>
                <div className="group relative overflow-hidden rounded-lg border border-border/60 bg-card/40 backdrop-blur-sm p-6 hover:border-primary/50 transition-colors duration-300">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 group-hover:border-primary transition-colors" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/40 group-hover:border-primary transition-colors" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/40 group-hover:border-primary transition-colors" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40 group-hover:border-primary transition-colors" />

                  {/* Scanline overlay */}
                  <div className="scanlines absolute inset-0 opacity-[0.03] pointer-events-none" />

                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-primary/80 font-mono text-xs uppercase tracking-widest">
                      <span className="inline-block w-2 h-2 bg-primary/40" />
                      LOG_ENTRY_{milestone.year}
                    </div>
                    
                    <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                      {milestone.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed font-mono">
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
