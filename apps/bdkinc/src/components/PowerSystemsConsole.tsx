import {
  PiDesktop,
  PiShieldCheck,
  PiDatabase,
  PiLightning,
  PiPulse,
  PiArrowsClockwise,
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
        {services.map((s, i) => {
          const trackingColor =
            i % 3 === 1 ? 'secondary' : i % 3 === 2 ? 'accent' : 'primary';
          const iconContainerClass =
            trackingColor === 'secondary'
              ? 'bg-secondary/5 border-secondary/20 group-hover:bg-secondary/10'
              : trackingColor === 'accent'
                ? 'bg-accent/5 border-accent/20 group-hover:bg-accent/10'
                : 'bg-primary/5 border-primary/20 group-hover:bg-primary/10';
          const iconClass =
            trackingColor === 'secondary'
              ? 'text-secondary h-6 w-6'
              : trackingColor === 'accent'
                ? 'text-accent h-6 w-6'
                : 'text-primary h-6 w-6';
          const titleHoverClass =
            trackingColor === 'secondary'
              ? 'group-hover:text-secondary'
              : trackingColor === 'accent'
                ? 'group-hover:text-accent'
                : 'group-hover:text-primary';

          return (
            <TechCard
              key={i}
              variant="technical"
              interactive
              delay={i * 100}
              trackingColor={trackingColor}
            >
              <div className="relative z-10 flex h-full flex-col p-6 text-center">
                <div className="mb-4 flex items-center justify-center">
                  <div
                    className={`${iconContainerClass} rounded border p-2 transition-colors`}
                  >
                    <s.icon className={iconClass} />
                  </div>
                </div>
                <h4
                  className={`font-display mb-2 text-lg font-bold tracking-tight transition-colors ${titleHoverClass}`}
                >
                  {s.title}
                </h4>
                <p className="text-muted-foreground mb-6 flex-grow text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </TechCard>
          );
        })}
      </div>
    </div>
  );
}
