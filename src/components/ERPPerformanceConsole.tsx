import { cn } from '@/lib/utils';
import {
  PiPulse,
  PiCaretRight,
  PiNetwork,
  PiCpu,
  PiHeadphones,
} from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';

const systemStats = [
  { label: 'INFRASTRUCTURE HEALTH', value: 'OPTIMAL', color: 'text-green-500' },
  { label: 'RESOURCE ALLOCATION', value: 'DYNAMIC', color: 'text-primary' },
  { label: 'THREAT DETECTION', value: 'ACTIVE', color: 'text-primary' },
];

export function ERPPerformanceConsole() {
  const capabilities = [
    {
      title: 'High-Performance Hosting',
      desc: 'Dedicated, single-tenant environments optimized for ERP workloads. Achieve 99.99% uptime with redundant power and cooling.',
      icon: PiCpu,
      stat: '99.99% UPTIME',
      tag: 'COMPUTE',
    },
    {
      title: 'Seamless Integration',
      desc: 'Bridging legacy mainframes and modern cloud microservices. Real-time data exchange via REST, EDI, and direct SQL.',
      icon: PiNetwork,
      stat: '<1ms LATENCY',
      tag: 'CONNECT',
    },
    {
      title: 'Expert Technical Support',
      desc: '24/7/365 access to Tier-3 engineers with deep expertise in database tuning, OS hardening, and application troubleshooting.',
      icon: PiHeadphones,
      stat: '15min RESPONSE',
      tag: 'SUPPORT',
    },
  ];

  return (
    <div className="w-full">
      {/* Console Header */}
      <div className="border-primary/20 bg-card/40 mb-8 flex flex-col gap-6 rounded-none border p-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="border-primary/30 bg-primary/10 relative flex h-14 w-14 items-center justify-center rounded-lg border shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <PiPulse className="text-primary h-7 w-7 animate-pulse" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
          </div>
          <div className="text-left">
            <h3 className="font-display text-foreground text-xl font-bold tracking-tight uppercase">
              ERP Performance Console
            </h3>
            <div className="flex items-center gap-2">
              <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
              <p className="text-muted-foreground font-mono text-xs uppercase">
                SYSTEM_MONITOR::ACTIVE
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
          {systemStats.map((stat) => (
            <div
              key={stat.label}
              className="border-primary/20 border-l-2 pl-4 text-left"
            >
              <div className="text-muted-foreground mb-1 font-mono text-[10px] tracking-widest uppercase">
                {stat.label}
              </div>
              <div className={cn('font-mono text-sm font-bold', stat.color)}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {capabilities.map((item, index) => (
          <TechCard
            key={index}
            variant="technical"
            interactive
            delay={index * 150}
            metadata={item.tag}
          >
            <div className="relative z-10 flex h-full flex-col p-6 text-left">
              <div className="mb-6 flex items-start justify-between">
                <div className="bg-primary/10 ring-primary/20 group-hover:bg-primary/20 group-hover:ring-primary/40 flex h-12 w-12 items-center justify-center rounded-lg ring-1 transition-all duration-300 group-hover:scale-110">
                  <item.icon className="text-primary h-6 w-6" />
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-muted-foreground font-mono text-[10px]">
                    {item.stat}
                  </span>
                </div>
              </div>

              <h4 className="font-display text-foreground group-hover:text-primary mb-3 text-lg font-bold tracking-tight uppercase transition-colors">
                {item.title}
              </h4>

              <p className="text-muted-foreground mb-6 flex-grow text-sm leading-relaxed">
                {item.desc}
              </p>

              <div className="text-primary mt-auto flex items-center font-mono text-[10px] font-bold tracking-widest uppercase opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                INITIATE_PROTOCOL <PiCaretRight className="ml-1 h-3 w-3" />
              </div>
            </div>
          </TechCard>
        ))}
      </div>
    </div>
  );
}
