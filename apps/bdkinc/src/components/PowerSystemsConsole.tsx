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
      {/* Console Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <TechCard key={i} variant="technical" interactive delay={i * 100}>
            <div className="relative z-10 flex h-full flex-col p-6 text-center">
              <div className="mb-4 flex items-center justify-center">
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
              <div className="text-primary group-hover:text-primary flex items-center justify-center font-mono text-[10px] font-bold tracking-widest opacity-0 transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                System Access <PiCaretRight className="ml-1 h-3 w-3" />
              </div>
            </div>
          </TechCard>
        ))}
      </div>
    </div>
  );
}
