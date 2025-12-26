import { PiDatabase, PiCpu, PiLightbulb, PiArrowRight, PiLightning } from 'react-icons/pi';
import { cn } from '@/lib/utils';
import { ServiceCard } from '@/components/ServiceCard';

export default function AnalyticsLifecycle() {
  const steps = [
    {
      id: '01',
      title: 'Ingestion',
      icon: PiDatabase,
      description: 'Multi-source data aggregation & normalization',
      details: ['API Connectors', 'Batch/Stream', 'Schema Validation'],
      color: 'text-primary',
      metadata: 'SIGNAL_INPUT_01'
    },
    {
      id: '02',
      title: 'Processing',
      icon: PiCpu,
      description: 'Transformation & warehousing architecture',
      details: ['ETL/ELT', 'Data Lake', 'Sanitization'],
      color: 'text-secondary',
      metadata: 'CORE_COMPUTE_02'
    },
    {
      id: '03',
      title: 'Insight',
      icon: PiLightbulb,
      description: 'Predictive analytics & visualization layer',
      details: ['ML Models', 'BI Dashboards', 'Decision Logic'],
      color: 'text-primary',
      metadata: 'INTEL_OUTPUT_03'
    }
  ];

  return (
    <section className="py-12">
       <div className="text-center mb-12">
        <h3 className="text-foreground text-3xl font-bold font-display mb-4 uppercase tracking-tight">
          High-Velocity Data Pipeline
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          From raw signal to strategic action. Our lifecycle architecture ensures data fidelity at every stage.
        </p>
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 -translate-y-1/2" />
        
        <div className="grid gap-8 md:grid-cols-3 relative z-10">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              <ServiceCard
                variant="technical"
                interactive
                delay={index * 150}
                metadata={step.metadata}
              >
                <div className="p-8 text-left h-full flex flex-col">
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 text-4xl font-bold text-primary/5 font-mono group-hover:text-primary/10 transition-colors">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div className={cn("w-16 h-16 rounded-xl bg-background/50 border border-primary/20 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:border-primary/40 transition-all duration-500 shadow-[0_0_15px_rgba(0,212,255,0.1)]", step.color)}>
                    <step.icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h4 className="text-xl font-bold text-foreground mb-2 font-display uppercase tracking-tight group-hover:text-primary transition-colors">{step.title}</h4>
                  <p className="text-sm text-muted-foreground mb-6 font-medium leading-relaxed">{step.description}</p>
                  
                  {/* Technical Details */}
                  <ul className="space-y-3 mt-auto">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center text-[10px] text-muted-foreground/80 font-mono uppercase tracking-widest">
                        <PiLightning className="w-3 h-3 mr-2 text-primary/50" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </ServiceCard>

              {/* Arrow (Mobile only) */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center mt-6 text-primary/20">
                  <PiArrowRight className="w-6 h-6 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
