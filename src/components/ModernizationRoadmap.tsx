import { cn } from '@/lib/utils';
import {
  PiDesktop,
  PiDeviceMobile,
  PiStack,
  PiCaretDown,
} from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';
export function ModernizationRoadmap() {
  const steps = [
    {
      id: 'legacy',
      title: 'Legacy Foundation',
      description:
        'Stabilize AS/400 & iSeries workloads. Hardware refresh, OS upgrades, and security hardening.',
      icon: PiDesktop,
      color: 'text-primary',
    },
    {
      id: 'hybrid',
      title: 'Hybrid Integration',
      description:
        'Connect legacy data to modern workflows. REST APIs, cloud connectors, and bi-directional sync.',
      icon: PiStack,
      color: 'text-secondary',
    },
    {
      id: 'future',
      title: 'Future State',
      description:
        'Full digital agility. Web/Mobile front-ends, real-time analytics, and microservices architecture.',
      icon: PiDeviceMobile,
      color: 'text-primary',
    },
  ];
  return (
    <div className="relative w-full py-12">
      <div className="bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)] bg-[bottom_1px_center]" />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h3 className="font-display text-foreground text-3xl font-bold tracking-tight">
            Systems Upgrade Flow
          </h3>
          <p className="text-muted-foreground mt-2 font-mono text-xs tracking-widest">
            The path from legacy stability to digital agility
          </p>
        </div>
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector Line (Desktop) */}
          <div className="from-primary/30 via-secondary/30 to-primary/30 absolute top-12 right-[16%] left-[16%] z-0 hidden h-px bg-gradient-to-r md:block" />
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="group relative z-10 flex flex-col items-center text-center"
            >
              {/* Step Marker */}
              <div
                className={cn(
                  'bg-card border-primary/20 group-hover:border-primary/50 relative mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border shadow-lg transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-500 group-hover:scale-110',
                  'glass shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                )}
              >
                {/* Scanline inside circle */}
                <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.05]" />
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity duration-300 group-hover:opacity-20',
                    index === 0
                      ? 'from-primary to-transparent'
                      : index === 1
                        ? 'from-secondary to-transparent'
                        : 'from-primary to-transparent'
                  )}
                />
                <step.icon
                  className={cn(
                    'h-10 w-10 transition-transform duration-500 group-hover:scale-110',
                    step.color
                  )}
                />
                {/* Status Indicator */}
                <div
                  className={cn(
                    'absolute right-2 bottom-2 h-2 w-2 animate-pulse rounded-full shadow-[0_0_8px_currentColor]',
                    index === 0
                      ? 'bg-primary'
                      : index === 1
                        ? 'bg-secondary'
                        : 'bg-primary'
                  )}
                />
              </div>
              {/* Content */}
              <TechCard
                variant="technical"
                interactive
                delay={index * 150}
                className="w-full"
              >
                <div className="relative flex h-full flex-col items-center p-6">
                  <div className="bg-background border-primary/20 text-primary absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-none border font-mono text-[10px] font-bold shadow-[0_0_10px_rgba(0,212,255,0.2)]">
                    0{index + 1}
                  </div>
                  <h4 className="text-foreground font-display group-hover:text-primary mt-4 mb-3 text-lg font-bold tracking-tight transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </TechCard>
              {/* Mobile Arrow */}
              {index < steps.length - 1 && (
                <div className="text-primary/30 my-6 md:hidden">
                  <PiCaretDown className="h-8 w-8 animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
