import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Server, 
  Cloud,
  Layers,
} from 'lucide-react';

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
      icon: Layers,
      description: 'Responsive, high-performance interfaces built for interactivity and accessibility.',
      items: [
        { name: 'React', category: 'Library', version: '18+' },
        { name: 'Astro', category: 'Framework', version: '4.0+' },
        { name: 'TypeScript', category: 'Language', version: '5.x' },
        { name: 'Tailwind CSS', category: 'Styling', version: 'v4' },
        { name: 'Redux / Zustand', category: 'State' },
        { name: 'Framer Motion', category: 'Animation' }
      ]
    },
    {
      id: 'backend',
      name: 'Server Logic Layer',
      icon: Server,
      description: 'Scalable APIs and microservices handling complex business logic.',
      items: [
        { name: 'Node.js', category: 'Runtime' },
        { name: 'Python', category: 'Language' },
        { name: 'Go', category: 'Language' },
        { name: 'GraphQL', category: 'API Query' },
        { name: 'REST', category: 'Architecture' },
        { name: 'Docker', category: 'Containerization' }
      ]
    },
    {
      id: 'database',
      name: 'Data Persistence Layer',
      icon: Database,
      description: 'Robust data storage solutions optimized for integrity and retrieval speed.',
      items: [
        { name: 'PostgreSQL', category: 'RDBMS' },
        { name: 'MongoDB', category: 'NoSQL' },
        { name: 'Redis', category: 'Caching' },
        { name: 'IBM DB2', category: 'Enterprise' },
        { name: 'ElasticSearch', category: 'Search Engine' }
      ]
    },
    {
      id: 'cloud',
      name: 'Infrastructure Layer',
      icon: Cloud,
      description: 'Secure cloud environments managed for high availability and compliance.',
      items: [
        { name: 'AWS', category: 'Public Cloud' },
        { name: 'Microsoft Azure', category: 'Public Cloud' },
        { name: 'BDK Private Cloud', category: 'Hybrid Hosting' },
        { name: 'Kubernetes', category: 'Orchestration' },
        { name: 'Terraform', category: 'IaC' }
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto my-24">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl font-bold font-display text-foreground mb-4">
          Technical Specifications
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Our standard stack is selected for enterprise reliability, security, and long-term maintainability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {layers.map((layer) => (
          <div 
            key={layer.id}
            className="group relative overflow-hidden rounded-lg border border-border bg-card/40 backdrop-blur-sm transition-all hover:border-primary/40"
          >
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-border bg-muted/20 p-5 group-hover:bg-primary/5 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background ring-1 ring-border shadow-sm group-hover:ring-primary/40 group-hover:shadow-[0_0_10px_rgba(0,212,255,0.1)] transition-all">
                <layer.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">{layer.name}</h3>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {layer.id.toUpperCase()}_SPEC_V1.0
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="px-6 py-4 border-b border-border/50">
              <p className="text-sm text-muted-foreground">{layer.description}</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-px bg-border/30 sm:grid-cols-3">
              {layer.items.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-card/40 p-4 hover:bg-primary/5 transition-colors flex flex-col justify-center"
                >
                  <span className="font-medium text-foreground text-sm mb-1">{item.name}</span>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight font-mono">{item.category}</span>
                    {item.version && (
                      <span className="text-[10px] text-primary/70 font-mono bg-primary/10 px-1 rounded">
                        {item.version}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 -rotate-45 transform origin-bottom-left translate-x-4 -translate-y-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
