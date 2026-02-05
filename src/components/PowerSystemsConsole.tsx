import { cn } from '@/lib/utils';
import {
  PiDesktop,
  PiShieldCheck,
  PiDatabase,
  PiLightning,
  PiPulse,
  PiArrowsClockwise,
  PiCaretRight,
} from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';
const powerStats = [
  { label: 'System Status', value: 'Operational', color: 'text-green-500' },
  { label: 'CPW Utilization', value: '42%', color: 'text-primary' },
  { label: 'Security Level', value: 'High', color: 'text-primary' },
  { label: 'Active LPARs', value: '12', color: 'text-primary' },
];
export function PowerSystemsConsole() {
  const services = [
    {
      title: 'Managed Hosting',
      desc: 'Secure, scalable hosting for IBM i, AIX, and Linux with 99.99% availability.',
      icon: PiDesktop,
      tag: 'Core',
    },
    {
      title: 'Modernization',
      desc: 'RPG/COBOL modernization and integration with modern API-driven workflows.',
      icon: PiArrowsClockwise,
      tag: 'Innovate',
    },
    {
      title: 'Disaster Recovery',
      desc: 'Real-time replication and rapid recovery protocols for business continuity.',
      icon: PiShieldCheck,
      tag: 'Protect',
    },
    {
      title: 'Performance Tuning',
      desc: 'Deep-layer optimization of CPW, memory, and I/O for peak efficiency.',
      icon: PiLightning,
      tag: 'Optimize',
    },
    {
      title: 'OS Lifecycle',
      desc: 'Precision management of version upgrades, PTFs, and security patches.',
      icon: PiPulse,
      tag: 'Manage',
    },
    {
      title: 'Hybrid Integration',
      desc: 'Connecting Power workloads with Azure, AWS, and modern cloud stacks.',
      icon: PiDatabase,
      tag: 'Scale',
    },
  ];
  return (
    <div className="relative w-full py-12">
      {/* Console Header */}
      <div className="border-primary/20 mb-12 flex flex-col items-center justify-between gap-6 border-b pb-8 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 border-primary/30 flex h-12 w-12 items-center justify-center rounded border">
            <PiDatabase className="text-primary h-6 w-6" />
          </div>
          <div className="text-left">
            <h3 className="font-display text-xl font-bold tracking-tight">
              IBM Power Console v10.4
            </h3>
            <p className="text-muted-foreground font-mono text-xs tracking-widest">
              BDKinc Managed Services Interface
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {powerStats.map((stat) => (
            <div key={stat.label} className="text-left">
              <div className="text-muted-foreground font-mono text-[10px] tracking-widest">
                {stat.label}
              </div>
              <div className={cn('font-mono text-sm font-bold', stat.color)}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Console Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <TechCard
            key={i}
            variant="technical"
            interactive
            delay={i * 100}
          >
            <div className="relative z-10 flex h-full flex-col p-6 text-left">
              <div className="mb-4 flex items-center justify-between">
                <div className="bg-primary/5 border-primary/20 group-hover:bg-primary/10 rounded border p-2 transition-colors">
                  <s.icon className="text-primary h-6 w-6" />
                </div>
              </div>
              <h4 className="font-display group-hover:text-primary mb-2 text-lg font-bold tracking-tight transition-colors">
                {s.title}
              </h4>
              <p className="text-muted-foreground mb-6 flex-grow text-sm leading-relaxed">
                {s.desc}
              </p>
              <div className="text-primary group-hover:text-primary flex items-center font-mono text-[10px] font-bold tracking-widest opacity-0 transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                System Access <PiCaretRight className="ml-1 h-3 w-3" />
              </div>
            </div>
          </TechCard>
        ))}
      </div>
    </div>
  );
}
