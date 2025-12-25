import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PiGlobe, PiShieldCheck, PiLockKey, PiWarning } from 'react-icons/pi';
import { cn } from '@/lib/utils';

export default function CybersecurityVisualization() {
  const [threatKey, setThreatKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreatKey(k => k + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md">
      {/* Grid Background with Red Tint on Left */}
      <div className="absolute inset-0 z-0 opacity-20">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,0,0,0.1),transparent_50%)]"></div>
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        
        {/* Node 1: External Network */}
        <Node 
          icon={PiGlobe} 
          label="External Network" 
          sublabel="Public Internet"
          color="secondary"
        />

        <Conduit />

        {/* Node 2: Active Defense */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-primary bg-background/80 shadow-[0_0_30px_rgba(0,212,255,0.3)] backdrop-blur-xl">
             <div className="absolute inset-0 animate-pulse rounded-2xl bg-primary/10"></div>
             {/* Shield Pulse */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl border border-primary/50"
            />
            <PiShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-primary">Active Defense</div>
            <div className="font-mono text-xs text-muted-foreground">Threat Neutralized</div>
          </div>
        </div>

        <Conduit />

        {/* Node 3: Secure Core */}
        <Node 
          icon={PiLockKey} 
          label="Secure Core" 
          sublabel="Protected Assets"
          color="accent"
        />
      </div>

      {/* Threats and Safe Traffic */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Threat Packet (Blocked) */}
        <ThreatPacket 
          delay={0} 
          start="0%" 
          end="50%" 
          key={`threat-${threatKey}`} 
        />
        
        {/* Safe Packet (Allowed) */}
        <SafePacket 
          delay={1.5} 
          start="0%" 
          end="100%" 
          key={`safe-${threatKey}`} 
        />
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

function Conduit() {
    return (
      <div className="relative hidden h-2 flex-1 overflow-hidden rounded-full bg-muted/20 md:block">
        <div className="absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-border"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.1),transparent)] bg-[length:200%_100%] animate-shimmer"></div>
      </div>
    );
}

function ThreatPacket({ delay, start, end }: { delay: number, start: string, end: string }) {
  return (
    <motion.div
      initial={{ left: start, opacity: 0, scale: 0.5 }}
      animate={{ 
        left: end, 
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 0, 0] // Shrinks to 0 at end (blocked)
      }}
      transition={{ 
        duration: 1.0, 
        delay: delay,
        ease: "linear" 
      }}
      className="absolute top-1/2 -mt-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] backdrop-blur-sm z-30"
    >
        <PiWarning className="h-4 w-4" />
    </motion.div>
  );
}

function SafePacket({ delay, start, end }: { delay: number, start: string, end: string }) {
    return (
      <motion.div
        initial={{ left: start, opacity: 0, scale: 0.5 }}
        animate={{ 
          left: end, 
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 1, 0.5]
        }}
        transition={{ 
          duration: 2.0, 
          delay: delay,
          ease: "easeInOut" 
        }}
        className="absolute top-1/2 -mt-1.5 h-3 w-8 rounded-full bg-primary shadow-[0_0_10px_rgba(0,212,255,0.5)]"
      />
    );
  }
