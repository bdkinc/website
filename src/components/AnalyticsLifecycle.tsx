import {
  PiDatabase,
  PiCpu,
  PiLightbulb,
  PiArrowRight,
  PiLightning,
} from 'react-icons/pi';
import { cn } from '@/lib/utils';
import { TechCard } from '@/components/TechCard';

export default function AnalyticsLifecycle() {
  const steps = [
    {
      id: '01',
      title: 'Ingestion',
      icon: PiDatabase,
      description: 'Multi-source data aggregation & normalization',
      details: ['API Connectors', 'Batch/Stream', 'Schema Validation'],
      color: 'text-primary',
      metadata: 'SIGNAL_INPUT_01',
    },
    {
      id: '02',
      title: 'Processing',
      icon: PiCpu,
      description: 'Transformation & warehousing architecture',
      details: ['ETL/ELT', 'Data Lake', 'Sanitization'],
      color: 'text-secondary',
      metadata: 'CORE_COMPUTE_02',
    },
    {
      id: '03',
      title: 'Insight',
      icon: PiLightbulb,
      description: 'Predictive analytics & visualization layer',
      details: ['ML Models', 'BI Dashboards', 'Decision Logic'],
      color: 'text-primary',
      metadata: 'INTEL_OUTPUT_03',
    },
  ];

  return (
    <section className="py-12">
      <div className="mb-12 text-center">
        <h3 className="text-foreground font-display mb-4 text-3xl font-bold tracking-tight">
          High-Velocity Data Pipeline
        </h3>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          From raw signal to strategic action. Our lifecycle architecture
          ensures data fidelity at every stage.
        </p>
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Connecting Line (Desktop) */}
        <div className="from-primary/20 via-secondary/20 to-primary/20 absolute top-1/2 left-0 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r md:block" />

        <div className="relative z-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              <TechCard
                variant="technical"
                interactive
                delay={index * 150}
                metadata={step.metadata}
              >
                <div className="flex h-full flex-col p-8 text-left">
                  {/* Step Number */}
                  <div className="text-primary/5 group-hover:text-primary/10 absolute top-4 right-4 font-mono text-4xl font-bold transition-colors">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      'bg-background/50 border-primary/20 group-hover:border-primary/40 mb-6 flex h-16 w-16 items-center justify-center rounded-xl border shadow-[0_0_15px_rgba(0,212,255,0.1)] shadow-inner transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-500 group-hover:scale-110',
                      step.color
                    )}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>

                  {/* Content */}
                  <h4 className="text-foreground font-display group-hover:text-primary mb-2 text-xl font-bold tracking-tight transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed font-medium">
                    {step.description}
                  </p>

                  {/* Technical Details */}
                  <ul className="mt-auto space-y-3">
                    {step.details.map((detail, i) => (
                      <li
                        key={i}
                        className="text-muted-foreground/80 flex items-center font-mono text-[10px] tracking-widest"
                      >
                        <PiLightning className="text-primary/50 mr-2 h-3 w-3" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </TechCard>

              {/* Arrow (Mobile only) */}
              {index < steps.length - 1 && (
                <div className="text-primary/20 mt-6 flex justify-center md:hidden">
                  <PiArrowRight className="h-6 w-6 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
