import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PiCpu, PiDatabase, PiLightning, PiShieldCheck } from 'react-icons/pi';
import { cn } from '@/lib/utils';

export default function IBMPowerVisualization() {
  const [powerKey, setPowerKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPowerKey(k => k + 1);
    }, 2000); // High frequency
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md">
      {/* Circuit Background */}
      <div className="absolute inset-0 z-0 opacity-15">
        <svg className="h-full w-full">
            <pattern id="circuit-board" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 10 L30 10 L30 30" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
                <path d="M70 70 L90 70 L90 90" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
                <circle cx="30" cy="30" r="2" fill="currentColor" className="text-primary" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit-board)" />
        </svg>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        
        {/* Node 1: Mission Critical Workload */}
        <Node 
          icon={PiDatabase} 
          label="Workloads" 
          sublabel="Heavy Data Processing"
          color="secondary"
        />

        <PowerLine />

        {/* Node 2: IBM Power CPU */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-28 w-28 items-center justify-center rounded-xl border-2 border-primary bg-background/90 shadow-[0_0_50px_rgba(0,212,255,0.4)] backdrop-blur-xl">
             <div className="absolute inset-0 animate-pulse rounded-xl bg-primary/20"></div>
             {/* Radiating Energy */}
            <div className="absolute -inset-4 z-0 rounded-xl border border-primary/30 opacity-50 scale-110 animate-ping"></div>
            <PiCpu className="h-14 w-14 text-primary relative z-10" />
            {/* Electrical Arcs */}
            <PiLightning className="absolute -top-3 -right-3 h-6 w-6 text-yellow-400 animate-bounce" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-primary">IBM Power</div>
            <div className="font-mono text-xs text-muted-foreground">High Performance</div>
          </div>
        </div>

        <PowerLine />

        {/* Node 3: Reliability */}
        <Node 
          icon={PiShieldCheck} 
          label="Reliability" 
          sublabel="99.999% Uptime"
          color="accent"
        />
      </div>

      {/* Energy Packets */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Fast Stream */}
        <EnergyPacket delay={0} start="0%" end="50%" color="bg-secondary" key={`e1-${powerKey}`} />
        <EnergyPacket delay={0.1} start="0%" end="50%" color="bg-secondary" key={`e2-${powerKey}`} />
        <EnergyPacket delay={0.2} start="0%" end="50%" color="bg-secondary" key={`e3-${powerKey}`} />
        
        {/* Processed Output */}
        <EnergyPacket delay={0.8} start="50%" end="100%" color="bg-primary" key={`e4-${powerKey}`} />
        <EnergyPacket delay={0.9} start="50%" end="100%" color="bg-primary" key={`e5-${powerKey}`} />
        <EnergyPacket delay={1.0} start="50%" end="100%" color="bg-primary" key={`e6-${powerKey}`} />
      </div>
    </div>
  );
}

function Node({ icon: Icon, label, sublabel, color = "primary" }: { icon: any, label: string, sublabel: string, color?: "primary" | "secondary" | "accent" }) {
    const colorClasses = {
      primary: "border-primary text-primary shadow-primary/20",
      secondary: "border-secondary text-secondary shadow-secondary/20",
      accent: "border-brand-accent text-brand-accent shadow-brand-accent/20"
    };
  
    return (
      <div className="relative z-10 flex flex-col items-center">
        <div className={cn(
          "flex h-20 w-20 items-center justify-center rounded-xl border bg-card/80 shadow-lg backdrop-blur-md transition-all hover:scale-105",
          colorClasses[color]
        )}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="mt-4 text-center">
          <div className="font-display text-sm font-bold text-foreground">{label}</div>
          <div className="font-mono text-xs text-muted-foreground">{sublabel}</div>
        </div>
      </div>
    );
  }

function PowerLine() {
    return (
      <div className="relative hidden h-4 flex-1 items-center md:flex">
         <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
             <div className="h-full w-full bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)] bg-[length:50%_100%] animate-[shimmer_1s_infinite_linear]"></div>
         </div>
      </div>
    );
}

function EnergyPacket({ delay, start, end, color }: { delay: number, start: string, end: string, color: string }) {
  return (
    <motion.div
      initial={{ left: start, opacity: 0, scale: 0.5 }}
      animate={{ 
        left: end, 
        opacity: [0, 1, 1, 0],
        scale: [1, 1.5, 1.5, 1]
      }}
      transition={{ 
        duration: 0.8, // Very fast
        delay: delay,
        ease: "linear" 
      }}
      className={cn(
        "absolute top-1/2 -mt-1 h-2 w-8 rounded-full shadow-[0_0_15px_currentColor]",
        color
      )}
    />
  );
}
