import {
  PiLayout,
  PiDesktop,
  PiDatabase,
  PiGitBranch,
  PiTerminal,
} from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';

export default function CapabilitiesGrid() {
  const capabilities = [
    {
      title: 'Frontend & UX',
      icon: PiLayout,
      details: [
        'React / Astro Architecture',
        'Responsive Interfaces',
        'State Management',
        'WCAG Accessibility',
      ],
      code: 'FE_LAYER',
    },
    {
      title: 'Backend Systems',
      icon: PiDesktop,
      details: [
        'REST & GraphQL APIs',
        'Microservices',
        'Serverless Functions',
        'Real-time Sockets',
      ],
      code: 'BE_CORE',
    },
    {
      title: 'Data Architecture',
      icon: PiDatabase,
      details: [
        'SQL Optimization',
        'NoSQL Modeling',
        'Data Warehousing',
        'Caching Strategies',
      ],
      code: 'DB_STORE',
    },
    {
      title: 'DevSecOps',
      icon: PiGitBranch,
      details: [
        'CI/CD Pipelines',
        'Containerization',
        'Infrastructure as Code',
        'Automated Testing',
      ],
      code: 'OPS_PIPE',
    },
  ];

  return (
    <div className="mx-auto my-16 w-full max-w-7xl">
      <div className="mb-8 flex items-center gap-2">
        <PiTerminal className="text-primary h-5 w-5" />
        <h3 className="font-display text-foreground text-xl font-bold tracking-widest">
          System Architecture Overview
        </h3>
        <div className="bg-primary/20 ml-4 h-px grow"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((cap, index) => (
          <TechCard
            key={index}
            variant="technical"
            interactive
            delay={index * 100}
            metadata={cap.code}
          >
            <div className="relative z-10 flex h-full flex-col p-8 text-left">
              <div className="mb-8 flex items-start justify-between">
                <div className="border-primary/20 bg-primary/10 group-hover:bg-primary/15 rounded-lg border p-3 transition-transform duration-500 group-hover:scale-110">
                  <cap.icon className="text-primary h-8 w-8" />
                </div>
              </div>

              <h4 className="font-display text-foreground group-hover:text-primary mb-6 text-xl font-bold tracking-tight transition-colors">
                {cap.title}
              </h4>

              <ul className="mt-auto space-y-4">
                {cap.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className="text-muted-foreground group-hover:text-foreground flex items-center font-mono text-[10px] tracking-widest transition-colors"
                  >
                    <span className="bg-primary/40 group-hover:bg-primary mr-3 h-1.5 w-1.5 rounded-none transition-colors"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </TechCard>
        ))}
      </div>
    </div>
  );
}
