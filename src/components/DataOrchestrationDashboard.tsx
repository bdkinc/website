import React from 'react';
import { PiLayout, PiNetwork, PiBrain } from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

export default function DataOrchestrationDashboard() {
  const modules = [
    {
      title: 'BI Dashboards',
      status: 'Active',
      latency: '12ms',
      icon: PiLayout,
      description: 'Real-time visualization layers',
      highlight: '99.9% Uptime',
      metadata: 'VIS_NODE_01'
    },
    {
      title: 'Data Pipelines',
      status: 'Processing',
      latency: '24ms',
      icon: PiNetwork,
      description: 'Automated ETL/ELT workflows',
      highlight: 'High Throughput',
      metadata: 'PIPE_NODE_02'
    },
    {
      title: 'Predictive Models',
      status: 'Learning',
      latency: 'n/a',
      icon: PiBrain,
      description: 'ML-driven trend forecasting',
      highlight: 'Adaptive Logic',
      metadata: 'ML_NODE_03'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto mb-20">
       <h2 className="text-foreground mb-12 text-center text-3xl font-bold font-display uppercase tracking-tight">
         Data Command Center
       </h2>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {modules.map((module, index) => (
          <ServiceCard
            key={index}
            variant="technical"
            interactive
            delay={index * 150}
            metadata={module.metadata}
          >
            <div className="relative z-10 flex h-full flex-col p-8 text-left">
              {/* Header with Status */}
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                  <module.icon className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-primary/80 bg-primary/5 px-2 py-1 rounded-none border border-primary/20 uppercase tracking-widest">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary shadow-[0_0_5px_var(--color-primary)]"></span>
                    </span>
                    {module.status}
                  </div>
                  <div className="text-[9px] text-muted-foreground font-mono mt-2 uppercase tracking-tighter">
                    LATENCY: {module.latency}
                  </div>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3 font-display uppercase tracking-tight group-hover:text-primary transition-colors">{module.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">{module.description}</p>

              {/* Footer / Highlight */}
              <div className="mt-auto pt-4 border-t border-primary/10 flex justify-between items-center">
                  <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest">MODULE_STREAM</span>
                  <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">{module.highlight}</span>
              </div>
            </div>
          </ServiceCard>
        ))}
      </div>
    </div>
  );
}
