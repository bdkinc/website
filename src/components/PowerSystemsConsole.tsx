import React from 'react';
import { cn } from '@/lib/utils';
import { 
  PiDesktop, 
  PiShieldCheck, 
  PiDatabase, 
  PiLightning, 
  PiPulse, 
  PiArrowsClockwise,
  PiCaretRight
} from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

const powerStats = [
  { label: 'SYSTEM STATUS', value: 'OPERATIONAL', color: 'text-green-500' },
  { label: 'CPW UTILIZATION', value: '42%', color: 'text-primary' },
  { label: 'SECURITY LEVEL', value: 'HIGH', color: 'text-primary' },
  { label: 'ACTIVE LPARS', value: '12', color: 'text-primary' }
];

export function PowerSystemsConsole() {
  const services = [
    {
      title: "Managed Hosting",
      desc: "Secure, scalable hosting for IBM i, AIX, and Linux with 99.99% availability.",
      icon: PiDesktop,
      tag: "CORE"
    },
    {
      title: "Modernization",
      desc: "RPG/COBOL modernization and integration with modern API-driven workflows.",
      icon: PiArrowsClockwise,
      tag: "INNOVATE"
    },
    {
      title: "Disaster Recovery",
      desc: "Real-time replication and rapid recovery protocols for business continuity.",
      icon: PiShieldCheck,
      tag: "PROTECT"
    },
    {
      title: "Performance Tuning",
      desc: "Deep-layer optimization of CPW, memory, and I/O for peak efficiency.",
      icon: PiLightning,
      tag: "OPTIMIZE"
    },
    {
      title: "OS Lifecycle",
      desc: "Precision management of version upgrades, PTFs, and security patches.",
      icon: PiPulse,
      tag: "MANAGE"
    },
    {
      title: "Hybrid Integration",
      desc: "Connecting Power workloads with Azure, AWS, and modern cloud stacks.",
      icon: PiDatabase,
      tag: "SCALE"
    }
  ];

  return (
    <div className="relative w-full py-12">
      {/* Console Header */}
      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-primary/20 pb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center border border-primary/30">
            <PiDatabase className="text-primary h-6 w-6" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold font-display tracking-tight uppercase">IBM Power Console v10.4</h3>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">BDKinc Managed Services Interface</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {powerStats.map((stat) => (
            <div key={stat.label} className="text-left">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              <div className={cn("text-sm font-bold font-mono", stat.color)}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Console Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <ServiceCard
            key={i}
            variant="technical"
            interactive
            delay={i * 100}
            metadata={s.tag}
          >
            <div className="p-6 relative z-10 text-left h-full flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <div className="p-2 rounded bg-primary/5 border border-primary/20 group-hover:bg-primary/10 transition-colors">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <h4 className="text-lg font-bold mb-2 font-display uppercase tracking-tight group-hover:text-primary transition-colors">{s.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                {s.desc}
              </p>
              
              <div className="flex items-center text-[10px] font-mono font-bold text-primary opacity-0 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1 group-hover:opacity-100 uppercase tracking-widest">
                SYSTEM_ACCESS <PiCaretRight className="h-3 w-3 ml-1" />
              </div>
            </div>
          </ServiceCard>
        ))}
      </div>
    </div>
  );
}
