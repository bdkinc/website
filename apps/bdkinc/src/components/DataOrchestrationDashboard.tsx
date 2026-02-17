import { PiLayout, PiNetwork, PiBrain } from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';
export default function DataOrchestrationDashboard() {
  const modules = [
    {
      title: 'BI Dashboards',
      status: 'Active',
      latency: '12ms',
      icon: PiLayout,
      description: 'Real-time visualization layers',
      highlight: '99.9% Uptime',
    },
    {
      title: 'Data Pipelines',
      status: 'Processing',
      latency: '24ms',
      icon: PiNetwork,
      description: 'Automated ETL/ELT workflows',
      highlight: 'High Throughput',
    },
    {
      title: 'Predictive Models',
      status: 'Learning',
      latency: 'n/a',
      icon: PiBrain,
      description: 'ML-driven trend forecasting',
      highlight: 'Adaptive Logic',
    },
  ];
  return (
    <div className="mx-auto mb-20 w-full max-w-7xl">
      <h2 className="text-foreground font-display mb-12 text-center text-3xl font-bold tracking-tight">
        Data Command Center
      </h2>
      <div className="grid gap-6 lg:grid-cols-3">
        {modules.map((module, index) => (
          <TechCard
            key={index}
            variant="technical"
            interactive
            delay={index * 150}
          >
            <div className="relative z-10 flex h-full flex-col p-8 text-left">
              {/* Header with Status */}
              <div className="mb-8 flex items-start justify-between">
                <div className="bg-primary/10 border-primary/20 text-primary group-hover:bg-primary/20 rounded-lg border p-3 shadow-[0_0_15px_rgba(0,212,255,0.1)] transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-500 group-hover:scale-110">
                  <module.icon className="h-8 w-8" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-primary/80 bg-primary/5 border-primary/20 flex items-center gap-2 rounded-none border px-2 py-1 font-mono text-[10px] font-bold tracking-widest">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                      <span className="bg-primary relative inline-flex h-1.5 w-1.5 rounded-full shadow-[0_0_5px_var(--color-primary)]"></span>
                    </span>
                    {module.status}
                  </div>
                  <div className="text-muted-foreground mt-2 font-mono text-[9px] tracking-tighter">
                    Latency: {module.latency}
                  </div>
                </div>
              </div>
              {/* Content */}
              <h3 className="text-foreground font-display group-hover:text-primary mb-3 text-xl font-bold tracking-tight transition-colors">
                {module.title}
              </h3>
              <p className="text-muted-foreground mb-6 flex-grow text-sm leading-relaxed">
                {module.description}
              </p>
              {/* Footer / Highlight */}
              <div className="border-primary/10 mt-auto flex items-center justify-between border-t pt-4">
                <span className="text-muted-foreground/60 font-mono text-[9px] tracking-widest">
                  Module Stream
                </span>
                <span className="text-primary font-mono text-[10px] font-bold tracking-widest">
                  {module.highlight}
                </span>
              </div>
            </div>
          </TechCard>
        ))}
      </div>
    </div>
  );
}
