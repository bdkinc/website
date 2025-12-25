import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { PiGlobe, PiDesktop, PiShieldCheck, PiWifiHigh } from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

const regions = [
  { id: 'us-east', name: 'US East (Virginia)', lat: 30, lng: 25, status: 'operational', load: 42 },
  { id: 'us-west', name: 'US West (Oregon)', lat: 35, lng: 15, status: 'operational', load: 38 },
  { id: 'eu-cent', name: 'EU Central (Frankfurt)', lat: 25, lng: 55, status: 'operational', load: 65 },
  { id: 'asia-east', name: 'Asia Pacific (Tokyo)', lat: 35, lng: 85, status: 'operational', load: 51 },
];

export function GlobalNetworkMap() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  return (
    <ServiceCard variant="technical" interactive={false} metadata="GLOBAL_AVAILABILITY_NET" className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-primary/10 bg-muted/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <PiGlobe className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-foreground uppercase tracking-wider">GLOBAL_AVAILABILITY_NET</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="text-muted-foreground uppercase">STATUS: OPTIMAL</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <PiShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground uppercase">SHIELD: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative aspect-[21/9] w-full overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(0,212,255,0.05)_0%,_transparent_100%)]">
        {/* Abstract Map Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        
        {/* World Map Silhouette */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,212,255,0.1)_0%,_transparent_60%)]" />
        </div>

        {/* Region Nodes */}
        {regions.map((region) => (
          <div
            key={region.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node"
            style={{ left: `${region.lng}%`, top: `${region.lat}%` }}
            onMouseEnter={() => setActiveRegion(region.id)}
            onMouseLeave={() => setActiveRegion(null)}
          >
            {/* Ping Wave Animation */}
            <div className="absolute inset-0 -m-4 animate-ping rounded-full border border-primary/30 opacity-75 duration-[3s]" />
            
            {/* Node Icon */}
            <div className={cn(
              "relative flex h-6 w-6 items-center justify-center rounded-none border border-primary/50 bg-background shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-300",
              activeRegion === region.id ? "scale-125 border-primary bg-primary/20" : ""
            )}>
              <PiDesktop className="h-3 w-3 text-primary" />
            </div>

            {/* Connecting Lines (Decorative) */}
            <div className="absolute top-1/2 left-1/2 h-[1px] w-[200px] bg-gradient-to-r from-primary/20 to-transparent origin-left -rotate-45 pointer-events-none opacity-0 group-hover/node:opacity-100 transition-opacity" />

            {/* Tooltip */}
            <div className={cn(
              "absolute left-1/2 top-10 w-48 -translate-x-1/2 rounded-none border border-primary/40 bg-card/95 p-3 shadow-2xl backdrop-blur-md transition-all duration-300 z-20",
              activeRegion === region.id ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            )}>
              <div className="mb-2 flex items-center justify-between border-b border-primary/20 pb-1">
                <span className="font-bold text-[10px] font-mono text-primary uppercase tracking-widest">{region.name}</span>
                <PiWifiHigh className="h-3 w-3 text-green-500" />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>LATENCY</span>
                  <span className="text-foreground">12ms</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>SYSTEM_LOAD</span>
                  <span className="text-foreground">{region.load}%</span>
                </div>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-none bg-primary/10 border border-primary/5">
                  <div className="h-full bg-primary shadow-[0_0_8px_rgba(0,212,255,0.5)]" style={{ width: `${region.load}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Connection Arcs (SVG) */}
        <svg className="absolute inset-0 pointer-events-none h-full w-full opacity-30">
          <path d="M 25% 30% Q 40% 10% 55% 25%" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary animate-pulse" />
          <path d="M 55% 25% Q 70% 40% 85% 35%" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary animate-pulse delay-75" />
          <path d="M 15% 35% Q 20% 50% 25% 30%" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary animate-pulse delay-150" />
        </svg>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 divide-x divide-primary/10 border-t border-primary/10 bg-muted/20 md:grid-cols-4">
        {['99.999% UPTIME', 'TERABIT BACKBONE', 'ISO 27001', '24/7 NOC'].map((stat, i) => (
          <div key={i} className="py-3 text-center text-[10px] font-mono font-bold text-muted-foreground hover:text-primary transition-colors tracking-widest">
            {stat}
          </div>
        ))}
      </div>
    </ServiceCard>
  );
}
