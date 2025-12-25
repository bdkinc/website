import React from 'react';
import { cn } from '@/lib/utils';
import { PiLayout, PiDesktop, PiDatabase, PiGitBranch, PiTerminal } from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

export default function CapabilitiesGrid() {
  const capabilities = [
    {
      title: 'Frontend & UX',
      icon: PiLayout,
      details: ['React / Astro Architecture', 'Responsive Interfaces', 'State Management', 'WCAG Accessibility'],
      code: 'FE_LAYER'
    },
    {
      title: 'Backend Systems',
      icon: PiDesktop,
      details: ['REST & GraphQL APIs', 'Microservices', 'Serverless Functions', 'Real-time Sockets'],
      code: 'BE_CORE'
    },
    {
      title: 'Data Architecture',
      icon: PiDatabase,
      details: ['SQL Optimization', 'NoSQL Modeling', 'Data Warehousing', 'Caching Strategies'],
      code: 'DB_STORE'
    },
    {
      title: 'DevSecOps',
      icon: PiGitBranch,
      details: ['CI/CD Pipelines', 'Containerization', 'Infrastructure as Code', 'Automated Testing'],
      code: 'OPS_PIPE'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto my-16">
      <div className="flex items-center gap-2 mb-8">
        <PiTerminal className="h-5 w-5 text-primary animate-pulse" />
        <h3 className="text-xl font-bold font-display uppercase tracking-widest text-foreground">
          System_Architecture_Overview
        </h3>
        <div className="h-px bg-primary/20 flex-grow ml-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {capabilities.map((cap, index) => (
          <ServiceCard
            key={index}
            variant="technical"
            interactive
            delay={index * 100}
            metadata={cap.code}
          >
            <div className="relative z-10 flex flex-col h-full p-8 text-left">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                  <cap.icon className="h-8 w-8 text-primary" />
                </div>
              </div>

              <h4 className="text-xl font-bold font-display text-foreground mb-6 uppercase tracking-tight group-hover:text-primary transition-colors">
                {cap.title}
              </h4>

              <ul className="space-y-4 mt-auto">
                {cap.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-[10px] text-muted-foreground font-mono uppercase tracking-widest group-hover:text-foreground transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-none mr-3 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(0,212,255,0.8)] transition-all"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </ServiceCard>
        ))}
      </div>
    </div>
  );
}
