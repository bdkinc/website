import React from 'react';
import { 
  PiDatabase, 
  PiDesktop, 
  PiCloud,
  PiStack,
} from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

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
      description: 'Responsive, high-performance interfaces built for interactivity and accessibility.',
      items: [
        { name: 'React', category: 'Library', version: '19' },
        { name: 'Astro', category: 'Framework', version: '5.0' },
        { name: 'TypeScript', category: 'Language', version: '5.x' },
        { name: 'Tailwind CSS', category: 'Styling', version: 'v4' },
        { name: 'GSAP', category: 'Animation' },
        { name: 'Phosphor', category: 'Icons' }
      ]
    },
    {
      id: 'backend',
      name: 'Server Logic Layer',
      icon: PiDesktop,
      description: 'Scalable APIs and microservices handling complex business logic.',
      items: [
        { name: 'Node.js', category: 'Runtime' },
        { name: 'Python', category: 'Language' },
        { name: 'Go', category: 'Language' },
        { name: 'GraphQL', category: 'API Query' },
        { name: 'REST', category: 'Architecture' },
        { name: 'Docker', category: 'Containers' }
      ]
    },
    {
      id: 'database',
      name: 'Data Persistence Layer',
      icon: PiDatabase,
      description: 'Robust data storage solutions optimized for integrity and retrieval speed.',
      items: [
        { name: 'PostgreSQL', category: 'RDBMS' },
        { name: 'MongoDB', category: 'NoSQL' },
        { name: 'Redis', category: 'Caching' },
        { name: 'IBM DB2', category: 'Enterprise' },
        { name: 'ElasticSearch', category: 'Search' },
        { name: 'Vector DB', category: 'AI/RAG' }
      ]
    },
    {
      id: 'cloud',
      name: 'Infrastructure Layer',
      icon: PiCloud,
      description: 'Secure cloud environments managed for high availability and compliance.',
      items: [
        { name: 'AWS', category: 'Public Cloud' },
        { name: 'Azure', category: 'Public Cloud' },
        { name: 'BDK Cloud', category: 'Private' },
        { name: 'Kubernetes', category: 'Orch.' },
        { name: 'Terraform', category: 'IaC' },
        { name: 'OpenShift', category: 'IBM' }
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto my-24">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl font-bold font-display text-foreground mb-4 uppercase tracking-tight">
          Technical Specifications
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Our standard stack is selected for enterprise reliability, security, and long-term maintainability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {layers.map((layer) => (
          <ServiceCard
            key={layer.id}
            variant="technical"
            interactive
            metadata={`${layer.id.toUpperCase()}_STACK_V5.0`}
          >
            <div className="relative z-10 flex h-full flex-col text-left">
              {/* Header */}
              <div className="flex items-center gap-4 border-b border-primary/10 bg-muted/20 p-6 group-hover:bg-primary/5 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background border border-primary/20 shadow-sm group-hover:border-primary/40 group-hover:shadow-[0_0_15px_rgba(0,212,255,0.1)] transition-all">
                  <layer.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{layer.name}</h3>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    {layer.id.toUpperCase()}_CORE_MODULE
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="px-6 py-4 border-b border-primary/5">
                <p className="text-sm text-muted-foreground leading-relaxed">{layer.description}</p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 gap-px bg-primary/10 sm:grid-cols-3">
                {layer.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-card/40 p-4 hover:bg-primary/5 transition-colors flex flex-col justify-center border-r border-b border-primary/5 last:border-r-0"
                  >
                    <span className="font-bold text-foreground text-xs uppercase tracking-tight mb-1">{item.name}</span>
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] text-muted-foreground uppercase tracking-tighter font-mono">{item.category}</span>
                      {item.version && (
                        <span className="text-[9px] text-primary/70 font-mono bg-primary/10 px-1 rounded-none border border-primary/20">
                          v{item.version}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ServiceCard>
        ))}
      </div>
    </div>
  );
}
