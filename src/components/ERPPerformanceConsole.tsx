import { cn } from '@/lib/utils';
import { 
  PiPulse, 
  PiCaretRight,
  PiNetwork,
  PiCpu,
  PiHeadphones
} from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

const systemStats = [
  { label: 'INFRASTRUCTURE HEALTH', value: 'OPTIMAL', color: 'text-green-500' },
  { label: 'RESOURCE ALLOCATION', value: 'DYNAMIC', color: 'text-primary' },
  { label: 'THREAT DETECTION', value: 'ACTIVE', color: 'text-primary' },
];

export function ERPPerformanceConsole() {
  const capabilities = [
    {
      title: "High-Performance Hosting",
      desc: "Dedicated, single-tenant environments optimized for ERP workloads. Achieve 99.99% uptime with redundant power and cooling.",
      icon: PiCpu,
      stat: "99.99% UPTIME",
      tag: "COMPUTE"
    },
    {
      title: "Seamless Integration",
      desc: "Bridging legacy mainframes and modern cloud microservices. Real-time data exchange via REST, EDI, and direct SQL.",
      icon: PiNetwork,
      stat: "<1ms LATENCY",
      tag: "CONNECT"
    },
    {
      title: "Expert Technical Support",
      desc: "24/7/365 access to Tier-3 engineers with deep expertise in database tuning, OS hardening, and application troubleshooting.",
      icon: PiHeadphones,
      stat: "15min RESPONSE",
      tag: "SUPPORT"
    }
  ];

  return (
    <div className="w-full">
      {/* Console Header */}
      <div className="mb-8 flex flex-col gap-6 rounded-none border border-primary/20 bg-card/40 p-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <PiPulse className="h-7 w-7 text-primary animate-pulse" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
          </div>
          <div className="text-left">
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">ERP Performance Console</h3>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="font-mono text-xs text-muted-foreground uppercase">SYSTEM_MONITOR::ACTIVE</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
          {systemStats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-primary/20 pl-4 text-left">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              <div className={cn("font-mono text-sm font-bold", stat.color)}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {capabilities.map((item, index) => (
          <ServiceCard
            key={index}
            variant="technical"
            interactive
            delay={index * 150}
            metadata={item.tag}
          >
            <div className="relative z-10 flex h-full flex-col p-6 text-left">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:ring-primary/40">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {item.stat}
                  </span>
                </div>
              </div>
              
              <h4 className="mb-3 font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
                {item.title}
              </h4>
              
              <p className="mb-6 flex-grow text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
              
              <div className="mt-auto flex items-center text-[10px] font-mono font-bold text-primary opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100 uppercase tracking-widest">
                INITIATE_PROTOCOL <PiCaretRight className="ml-1 h-3 w-3" />
              </div>
            </div>
          </ServiceCard>
        ))}
      </div>
    </div>
  );
}
