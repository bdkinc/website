import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PiBrain, PiDatabase, PiLightbulb, PiCpu, PiGraph } from 'react-icons/pi';
import { cn } from '@/lib/utils';

export default function ArtificialIntelligenceVisualization() {
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseKey(k => k + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md">
      {/* Neural Background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="h-full w-full">
            <pattern id="neural-net" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" className="fill-primary" />
                <path d="M2 2 L40 40 M2 40 L40 2" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#neural-net)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        
        {/* Node 1: Raw Data */}
        <Node 
          icon={PiDatabase} 
          label="Raw Data" 
          sublabel="Ingestion"
          color="primary"
        />

        <NeuralConduit active={true} />

        {/* Node 2: Neural Processing */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-28 w-28 items-center justify-center rounded-full border-2 border-secondary bg-background/80 shadow-[0_0_40px_rgba(124,58,237,0.4)] backdrop-blur-xl">
            <div className="absolute inset-0 animate-pulse rounded-full bg-secondary/10"></div>
            {/* Brain/Chip Animation */}
            <div className="relative">
                <PiBrain className="h-12 w-12 text-secondary relative z-10" />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 rounded-full border border-dashed border-secondary/40"
                />
                 <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-8 rounded-full border border-dotted border-secondary/20"
                />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-secondary">Neural Engine</div>
            <div className="font-mono text-xs text-muted-foreground">Pattern Recognition</div>
          </div>
        </div>

        <NeuralConduit active={true} reverse />

        {/* Node 3: Insights */}
        <Node 
          icon={PiLightbulb} 
          label="Insights" 
          sublabel="Predictive Outcomes"
          color="accent"
        />
      </div>

      {/* Synapse Firings */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        <SynapsePulse delay={0} start="0%" end="50%" color="bg-primary" key={`s1-${pulseKey}`} />
        <SynapsePulse delay={0.5} start="0%" end="50%" color="bg-primary" key={`s2-${pulseKey}`} />
        <SynapsePulse delay={1.5} start="50%" end="100%" color="bg-secondary" key={`s3-${pulseKey}`} />
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

function NeuralConduit({ active, reverse }: { active: boolean, reverse?: boolean }) {
    return (
      <div className="relative hidden h-16 flex-1 items-center justify-center md:flex">
        {/* Connection Lines */}
        <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
            <path 
                d="M0,32 C50,32 50,32 100,32" 
                vectorEffect="non-scaling-stroke"
                className="stroke-border stroke-1 fill-none" 
            />
            {/* Animated data flow */}
             <motion.path 
                d="M0,32 C50,32 50,32 100,32" 
                vectorEffect="non-scaling-stroke"
                className={cn("stroke-2 fill-none", reverse ? "stroke-secondary" : "stroke-primary")}
                strokeDasharray="10 10"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: reverse ? 100 : -100 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ opacity: 0.5 }}
            />
        </svg>
      </div>
    );
  }

function SynapsePulse({ delay, start, end, color }: { delay: number, start: string, end: string, color: string }) {
  return (
    <motion.div
      initial={{ left: start, opacity: 0, scale: 0 }}
      animate={{ 
        left: end, 
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.5, 1.5, 0]
      }}
      transition={{ 
        duration: 1.0, 
        delay: delay,
        ease: "easeOut" 
      }}
      className={cn(
        "absolute top-1/2 -mt-1.5 h-3 w-3 rounded-full shadow-[0_0_15px_currentColor] blur-[1px]",
        color
      )}
    />
  );
}
