import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PiCloud, PiGlobe, PiHardDrives, PiUsers } from 'react-icons/pi';
import { cn } from '@/lib/utils';

export default function CloudHostingVisualization() {
  const [trafficKey, setTrafficKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficKey(k => k + 1);
    }, 2500); // Faster traffic
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md">
      {/* Map Background (Abstract) */}
      <div className="absolute inset-0 z-0 opacity-20">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      </div>
      
      <div className="circuit-overlay absolute inset-0 opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        
        {/* Node 1: Global Traffic */}
        <Node 
          icon={PiUsers} 
          label="Global Traffic" 
          sublabel="Users & Devices"
          color="primary"
        />

        <Conduit />

        {/* Node 2: Load Balancer */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-24 w-24 items-center justify-center rounded-full border-2 border-secondary bg-background/80 shadow-[0_0_30px_rgba(124,58,237,0.3)] backdrop-blur-xl">
             <div className="absolute inset-0 animate-pulse rounded-full bg-secondary/10"></div>
             {/* Orbiting ring */}
            <div className="absolute -inset-2 rounded-full border border-secondary/30 animate-[spin_8s_linear_infinite]"></div>
            <PiGlobe className="h-10 w-10 text-secondary" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-secondary">Global Gateway</div>
            <div className="font-mono text-xs text-muted-foreground">Load Balancing</div>
          </div>
        </div>

        <Conduit />

        {/* Node 3: Scalable Infrastructure */}
        <Node 
          icon={PiHardDrives} 
          label="Cloud Cluster" 
          sublabel="Auto-Scaling Nodes"
          color="accent"
        />
      </div>

      {/* Traffic Packets */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Burst of 3 packets */}
        <RequestPacket delay={0} start="0%" end="50%" color="bg-primary" key={`req1-${trafficKey}`} />
        <RequestPacket delay={0.2} start="0%" end="50%" color="bg-primary" key={`req2-${trafficKey}`} />
        <RequestPacket delay={0.4} start="0%" end="50%" color="bg-primary" key={`req3-${trafficKey}`} />
        
        {/* Response */}
        <RequestPacket delay={1.5} start="50%" end="100%" color="bg-brand-accent" key={`res1-${trafficKey}`} />
        <RequestPacket delay={1.7} start="50%" end="100%" color="bg-brand-accent" key={`res2-${trafficKey}`} />
      </div>
      
      {/* Floating Scalability Indicators */}
      <div className="absolute bottom-8 right-12 hidden md:flex flex-col gap-1 pointer-events-none">
         <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: [0, 1, 0], x: [10, 0, -10] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0 }}
            className="text-xs font-mono text-brand-accent"
         >
            + NODE ADDED
         </motion.div>
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

function RequestPacket({ delay, start, end, color }: { delay: number, start: string, end: string, color: string }) {
  return (
    <motion.div
      initial={{ left: start, opacity: 0, scale: 0.5 }}
      animate={{ 
        left: end, 
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.5]
      }}
      transition={{ 
        duration: 1.2, 
        delay: delay,
        ease: "linear" 
      }}
      className={cn(
        "absolute top-1/2 -mt-1.5 h-3 w-3 rounded-full shadow-[0_0_10px_currentColor]",
        color
      )}
    />
  );
}
