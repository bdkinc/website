import React from 'react';
import { cn } from '@/lib/utils';
import { Layout, Server, Database, GitBranch, Terminal } from 'lucide-react';

export default function CapabilitiesGrid() {
  const capabilities = [
    {
      title: 'Frontend & UX',
      icon: Layout,
      details: ['React / Astro Architecture', 'Responsive Interfaces', 'State Management', 'WCAG Accessibility'],
      code: 'FE_LAYER'
    },
    {
      title: 'Backend Systems',
      icon: Server,
      details: ['REST & GraphQL APIs', 'Microservices', 'Serverless Functions', 'Real-time Sockets'],
      code: 'BE_CORE'
    },
    {
      title: 'Data Architecture',
      icon: Database,
      details: ['SQL Optimization', 'NoSQL Modeling', 'Data Warehousing', 'Caching Strategies'],
      code: 'DB_STORE'
    },
    {
      title: 'DevSecOps',
      icon: GitBranch,
      details: ['CI/CD Pipelines', 'Containerization', 'Infrastructure as Code', 'Automated Testing'],
      code: 'OPS_PIPE'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto my-16">
      <div className="flex items-center gap-2 mb-6">
        <Terminal className="h-5 w-5 text-primary animate-pulse" />
        <h3 className="text-xl font-bold font-display uppercase tracking-widest text-foreground">
          System_Architecture_Overview
        </h3>
        <div className="h-px bg-primary/30 flex-grow ml-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-primary/20 bg-card/30 backdrop-blur-sm relative overflow-hidden rounded-lg">
        {/* Scanline Background */}
        <div className="absolute inset-0 scanlines opacity-[0.03] pointer-events-none z-0"></div>
        
        {capabilities.map((cap, index) => (
          <div 
            key={index} 
            className={cn(
              "group relative p-8 border-b md:border-b-0 lg:border-r border-primary/20 last:border-r-0 last:border-b-0 md:nth-2:border-r-0",
              // Handle borders for grid
              index === 0 && "md:border-b md:border-r",
              index === 1 && "md:border-b lg:border-r-0",
              index === 2 && "lg:border-r",
              // Hover effect
              "hover:bg-primary/5 transition-colors duration-300"
            )}
          >
            {/* Animated Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/0 group-hover:border-primary/60 transition-colors duration-300"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/0 group-hover:border-primary/60 transition-colors duration-300"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/0 group-hover:border-primary/60 transition-colors duration-300"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/0 group-hover:border-primary/60 transition-colors duration-300"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary/10 rounded-md ring-1 ring-primary/30 group-hover:ring-primary/60 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                  <cap.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded border border-border">
                  {cap.code}
                </span>
              </div>

              <h4 className="text-xl font-bold font-display text-foreground mb-4 group-hover:text-primary transition-colors">
                {cap.title}
              </h4>

              <ul className="space-y-3 mt-auto">
                {cap.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-sm text-muted-foreground font-sans group-hover:text-foreground/80 transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full mr-3 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(0,212,255,0.8)] transition-all"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
