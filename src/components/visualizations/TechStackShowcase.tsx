import React from 'react';
import { PiDatabase, PiDesktop, PiCloud, PiStack } from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';

interface TechItem {
  name: string;
  category: string;
  version?: string;
}

interface TechLayer {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  items: TechItem[];
}

export default function TechStackShowcase() {
  const layers: TechLayer[] = [
    {
      id: 'frontend',
      name: 'Client Presentation Layer',
      icon: PiStack,
      description:
        'Responsive, high-performance interfaces built for interactivity and accessibility.',
      items: [
        { name: 'React', category: 'Library', version: '19' },
        { name: 'Astro', category: 'Framework', version: '5.0' },
        { name: 'TypeScript', category: 'Language', version: '5.x' },
        { name: 'Tailwind CSS', category: 'Styling', version: 'v4' },
        { name: 'GSAP', category: 'Animation' },
        { name: 'Phosphor', category: 'Icons' },
      ],
    },
    {
      id: 'backend',
      name: 'Server Logic Layer',
      icon: PiDesktop,
      description:
        'Scalable APIs and microservices handling complex business logic.',
      items: [
        { name: 'Node.js', category: 'Runtime' },
        { name: 'Python', category: 'Language' },
        { name: 'Go', category: 'Language' },
        { name: 'GraphQL', category: 'API Query' },
        { name: 'REST', category: 'Architecture' },
        { name: 'Docker', category: 'Containers' },
      ],
    },
    {
      id: 'database',
      name: 'Data Persistence Layer',
      icon: PiDatabase,
      description:
        'Robust data storage solutions optimized for integrity and retrieval speed.',
      items: [
        { name: 'PostgreSQL', category: 'RDBMS' },
        { name: 'MongoDB', category: 'NoSQL' },
        { name: 'Redis', category: 'Caching' },
        { name: 'IBM DB2', category: 'Enterprise' },
        { name: 'ElasticSearch', category: 'Search' },
        { name: 'Vector DB', category: 'AI/RAG' },
      ],
    },
    {
      id: 'cloud',
      name: 'Infrastructure Layer',
      icon: PiCloud,
      description:
        'Secure cloud environments managed for high availability and compliance.',
      items: [
        { name: 'AWS', category: 'Public Cloud' },
        { name: 'Azure', category: 'Public Cloud' },
        { name: 'BDK Cloud', category: 'Private' },
        { name: 'Kubernetes', category: 'Orch.' },
        { name: 'Terraform', category: 'IaC' },
        { name: 'OpenShift', category: 'IBM' },
      ],
    },
  ];

  return (
    <div className="mx-auto my-24 w-full max-w-7xl">
      <div className="mb-12 text-center md:text-left">
        <h2 className="font-display text-foreground mb-4 text-3xl font-bold tracking-tight uppercase">
          Technical Specifications
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Our standard stack is selected for enterprise reliability, security,
          and long-term maintainability.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {layers.map((layer) => (
          <TechCard
            key={layer.id}
            variant="technical"
            interactive
            metadata={`${layer.id.toUpperCase()}_STACK_V5.0`}
          >
            <div className="relative z-10 flex h-full flex-col text-left">
              {/* Header */}
              <div className="border-primary/10 bg-muted/20 group-hover:bg-primary/5 flex items-center gap-4 border-b p-6 transition-colors">
                <div className="bg-background border-primary/20 group-hover:border-primary/40 flex h-12 w-12 items-center justify-center rounded-lg border shadow-sm transition-all group-hover:shadow-md">
                  <layer.icon className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-foreground group-hover:text-primary text-lg font-bold tracking-tight uppercase transition-colors">
                    {layer.name}
                  </h3>
                  <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                    {layer.id.toUpperCase()}_CORE_MODULE
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="border-primary/5 border-b px-6 py-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {layer.description}
                </p>
              </div>

              {/* Grid */}
              <div className="bg-primary/10 grid grid-cols-2 gap-px sm:grid-cols-3">
                {layer.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-card/40 hover:bg-primary/5 border-primary/5 flex flex-col justify-center border-r border-b p-4 transition-colors last:border-r-0"
                  >
                    <span className="text-foreground mb-1 text-xs font-bold tracking-tight uppercase">
                      {item.name}
                    </span>
                    <div className="flex items-end justify-between">
                      <span className="text-muted-foreground font-mono text-[9px] tracking-tighter uppercase">
                        {item.category}
                      </span>
                      {item.version && (
                        <span className="text-primary/70 bg-primary/10 border-primary/20 rounded-none border px-1 font-mono text-[9px]">
                          v{item.version}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TechCard>
        ))}
      </div>
    </div>
  );
}
