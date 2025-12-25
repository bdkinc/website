import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PiDesktop, PiPulse, PiCheckCircle, PiHeadset } from 'react-icons/pi';
import { cn } from '@/lib/utils';

export default function ManagedITVisualization() {
  const [monitorKey, setMonitorKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMonitorKey(k => k + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md">
      {/* ECG Background */}
      <div className="absolute inset-0 z-0 opacity-10 flex items-center">
         <svg className="w-full h-24" preserveAspectRatio="none">
            <path d="M0,12 L50,12 L60,0 L70,24 L80,12 L100,12 L110,0 L120,24 L130,12 L1000,12" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary animate-pulse" vectorEffect="non-scaling-stroke" />
         </svg>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        
        {/* Node 1: Endpoints */}
        <Node 
          icon={PiDesktop} 
          label="Endpoints" 
          sublabel="Workstations & Servers"
          color="secondary"
        />

        <MonitorLine />

        {/* Node 2: Proactive Monitoring */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background/80 shadow-[0_0_30px_rgba(0,212,255,0.3)] backdrop-blur-xl">
             {/* Radar Sweep */}
             <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent w-1/2 h-full animate-[spin_3s_linear_infinite] origin-right left-0"></div>
             </div>
            <PiPulse className="h-10 w-10 text-primary relative z-10" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-primary">24/7 Monitoring</div>
            <div className="font-mono text-xs text-muted-foreground">Proactive Health Check</div>
          </div>
        </div>

        <MonitorLine />

        {/* Node 3: Expert Support */}
        <Node 
          icon={PiHeadset} 
          label="Expert Support" 
          sublabel="Instant Resolution"
          color="accent"
        />
      </div>

      {/* Health Packets */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Health Check */}
        <HealthPacket 
            delay={0} 
            start="0%" 
            end="50%" 
            color="bg-green-500" 
            key={`h1-${monitorKey}`} 
        />
         {/* Ack */}
        <HealthPacket 
            delay={1.5} 
            start="50%" 
            end="100%" 
            color="bg-primary" 
            key={`h2-${monitorKey}`} 
        />
      </div>

       {/* Floating Status */}
       <div className="absolute top-4 left-4 hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-mono text-green-500">SYSTEM HEALTHY</span>
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

function MonitorLine() {
    return (
      <div className="relative hidden h-px flex-1 bg-border md:block">
         {/* Heartbeat dot */}
      </div>
    );
}

function HealthPacket({ delay, start, end, color }: { delay: number, start: string, end: string, color: string }) {
  return (
    <motion.div
      initial={{ left: start, opacity: 0, scale: 0.5 }}
      animate={{ 
        left: end, 
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.5]
      }}
      transition={{ 
        duration: 1.5, 
        delay: delay,
        ease: "linear" 
      }}
      className={cn(
        "absolute top-1/2 -mt-1.5 h-3 w-3 rounded-full shadow-[0_0_10px_currentColor]",
        color
      )}
    >
        <div className="absolute inset-0 animate-ping rounded-full opacity-75 bg-inherit"></div>
    </motion.div>
  );
}
