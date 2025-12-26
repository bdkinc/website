
import { cn } from '@/lib/utils';
import { PiDesktop, PiDeviceMobile, PiStack, PiCaretDown } from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

export function ModernizationRoadmap() {
  const steps = [
    {
      id: 'legacy',
      title: 'Legacy Foundation',
      description: 'Stabilize AS/400 & iSeries workloads. Hardware refresh, OS upgrades, and security hardening.',
      icon: PiDesktop,
      color: 'text-primary',
      metadata: 'PHASE_ALPHA_01'
    },
    {
      id: 'hybrid',
      title: 'Hybrid Integration',
      description: 'Connect legacy data to modern workflows. REST APIs, cloud connectors, and bi-directional sync.',
      icon: PiStack,
      color: 'text-secondary',
      metadata: 'PHASE_BETA_02'
    },
    {
      id: 'future',
      title: 'Future State',
      description: 'Full digital agility. Web/Mobile front-ends, real-time analytics, and microservices architecture.',
      icon: PiDeviceMobile,
      color: 'text-primary',
      metadata: 'PHASE_GAMMA_03'
    }
  ];

  return (
    <div className="relative w-full py-12">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]" />
      
      <div className="relative mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold font-display text-foreground uppercase tracking-tight">Systems Upgrade Flow</h3>
          <p className="text-muted-foreground mt-2 font-mono text-xs uppercase tracking-widest">The path from legacy stability to digital agility</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 z-0" />

          {steps.map((step, index) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
              {/* Step Marker */}
              <div className={cn(
                "w-24 h-24 rounded-2xl bg-card border border-primary/20 flex items-center justify-center mb-8 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:border-primary/50 relative overflow-hidden",
                "glass shadow-[0_0_15px_rgba(0,212,255,0.1)]"
              )}>
                {/* Scanline inside circle */}
                <div className="scanlines absolute inset-0 opacity-[0.05] pointer-events-none" />
                
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity duration-300 group-hover:opacity-20",
                  index === 0 ? "from-primary to-transparent" :
                  index === 1 ? "from-secondary to-transparent" :
                  "from-primary to-transparent"
                )} />
                
                <step.icon className={cn("w-10 h-10 transition-transform duration-500 group-hover:scale-110", step.color)} />
                
                {/* Status Indicator */}
                <div className={cn(
                  "absolute bottom-2 right-2 w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]",
                  index === 0 ? "bg-primary" :
                  index === 1 ? "bg-secondary" :
                  "bg-primary"
                )} />
              </div>

              {/* Content */}
              <ServiceCard variant="technical" interactive delay={index * 150} metadata={step.metadata} className="w-full">
                <div className="relative p-6 flex flex-col items-center h-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-none bg-background border border-primary/20 flex items-center justify-center text-[10px] font-bold font-mono text-primary shadow-[0_0_10px_rgba(0,212,255,0.2)]">
                    0{index + 1}
                  </div>
                  
                  <h4 className="text-lg font-bold text-foreground mb-3 mt-4 font-display uppercase tracking-tight group-hover:text-primary transition-colors">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ServiceCard>

              {/* Mobile Arrow */}
              {index < steps.length - 1 && (
                <div className="md:hidden my-6 text-primary/30">
                  <PiCaretDown className="w-8 h-8 animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
