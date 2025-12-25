import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PiDesktop, PiBuilding, PiDatabase, PiFileText, PiCheckCircle, PiArrowRight } from 'react-icons/pi';
import { cn } from '@/lib/utils';

export default function EDIFlowVisualization() {
  // State to trigger packet animations
  const [packetKey, setPacketKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPacketKey(k => k + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md">
      {/* Background Grid & Decorations */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      {/* Circuit Overlay */}
      <div className="circuit-overlay absolute inset-0 opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        
        {/* Node 1: Partners */}
        <Node 
          icon={PiBuilding} 
          label="Trading Partners" 
          sublabel="Retailers, Suppliers, 3PLs"
          color="secondary"
        />

        {/* Conduit 1 */}
        <Conduit />

        {/* Node 2: BDK Engine */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-primary bg-background/80 shadow-[0_0_30px_rgba(0,212,255,0.3)] backdrop-blur-xl">
            <div className="absolute inset-0 animate-pulse rounded-2xl bg-primary/10"></div>
            <PiDesktop className="h-10 w-10 text-primary" />
            
            {/* Orbiting particles */}
            <div className="absolute -inset-1 animate-[spin_4s_linear_infinite] rounded-2xl border border-dashed border-primary/30"></div>
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-primary">BDK Engine</div>
            <div className="font-mono text-xs text-muted-foreground">Translation & Routing</div>
          </div>
        </div>

        {/* Conduit 2 */}
        <Conduit />

        {/* Node 3: ERP */}
        <Node 
          icon={PiDatabase} 
          label="Internal ERP" 
          sublabel="SAP, Oracle, NetSuite"
          color="accent"
        />
      </div>

      {/* Animated Packets Layer */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Forward Packet 1 (Partner -> Engine) */}
        <DataPacket 
          delay={0} 
          start="0%" 
          end="50%" 
          color="bg-secondary" 
          key={`p1-${packetKey}`} 
        />
        
        {/* Forward Packet 2 (Engine -> ERP) */}
        <DataPacket 
          delay={1.5} 
          start="50%" 
          end="100%" 
          color="bg-primary" 
          key={`p2-${packetKey}`} 
        />

        {/* Acknowledge Packet (ERP -> Partner) - moving backwards */}
        <DataPacket 
          delay={2.5} 
          start="100%" 
          end="0%" 
          color="bg-brand-accent" 
          key={`p3-${packetKey}`} 
          reverse
        />
      </div>
      
      {/* Legend / Status */}
      <div className="mt-12 flex items-center justify-center gap-6 border-t border-border/50 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-mono text-xs text-muted-foreground">SYSTEM ONLINE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary"></div>
          <span className="font-mono text-xs text-muted-foreground">2.4ms LATENCY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-secondary"></div>
          <span className="font-mono text-xs text-muted-foreground">ENCRYPTED (AES-256)</span>
        </div>
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
      {/* Static line */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-border"></div>
      
      {/* Animated flow background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.1),transparent)] bg-[length:200%_100%] animate-shimmer"></div>
    </div>
  );
}

function DataPacket({ delay, start, end, color, reverse = false }: { delay: number, start: string, end: string, color: string, reverse?: boolean }) {
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
        ease: "easeInOut" 
      }}
      className={cn(
        "absolute top-1/2 -mt-3 flex h-6 w-16 items-center justify-center rounded-full shadow-[0_0_10px_currentColor] backdrop-blur-sm",
        color
      )}
    >
      <div className="flex gap-1">
        <div className="h-1 w-1 rounded-full bg-white/80"></div>
        <div className="h-1 w-4 rounded-full bg-white/80"></div>
      </div>
      <div className="absolute inset-0 rounded-full bg-white/20 blur-[2px]"></div>
    </motion.div>
  );
}
