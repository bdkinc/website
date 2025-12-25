import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PiBuildings, PiShoppingCart, PiPackage, PiFileText, PiCheck } from 'react-icons/pi';
import { cn } from '@/lib/utils';

export default function HostedERPVisualization() {
  const [transKey, setTransKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransKey(k => k + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>
      
      <div className="circuit-overlay absolute inset-0 opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        
        {/* Node 1: Sales Channel */}
        <Node 
          icon={PiShoppingCart} 
          label="Sales Channel" 
          sublabel="Orders & POS"
          color="secondary"
        />

        <Conduit />

        {/* Node 2: Central ERP */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-24 w-24 items-center justify-center rounded-lg border-2 border-primary bg-background/80 shadow-[0_0_30px_rgba(0,212,255,0.3)] backdrop-blur-xl">
             <div className="absolute inset-0 animate-pulse rounded-lg bg-primary/10"></div>
             {/* Stacking squares animation */}
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded bg-primary/20 animate-bounce delay-75"></div>
            <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded bg-primary/20 animate-bounce delay-150"></div>
            <PiBuildings className="h-10 w-10 text-primary" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-primary">Hosted ERP</div>
            <div className="font-mono text-xs text-muted-foreground">Central Operation</div>
          </div>
        </div>

        <Conduit />

        {/* Node 3: Logistics */}
        <Node 
          icon={PiPackage} 
          label="Logistics" 
          sublabel="Inventory & Ship"
          color="accent"
        />
      </div>

      {/* Transaction Packets */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Sales Order (Left to Center) */}
        <TransPacket 
          delay={0} 
          start="0%" 
          end="50%" 
          color="bg-secondary" 
          key={`t1-${transKey}`}
          icon={PiFileText}
        />
        
        {/* Shipment Order (Center to Right) */}
        <TransPacket 
          delay={1.5} 
          start="50%" 
          end="100%" 
          color="bg-primary" 
          key={`t2-${transKey}`}
          icon={PiPackage}
        />

        {/* Confirmation (Right to Left - Full) */}
        <TransPacket 
          delay={3.0} 
          start="100%" 
          end="0%" 
          color="bg-brand-accent" 
          key={`t3-${transKey}`} 
          reverse
          icon={PiCheck}
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

function TransPacket({ delay, start, end, color, reverse = false, icon: Icon }: { delay: number, start: string, end: string, color: string, reverse?: boolean, icon: any }) {
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
        "absolute top-1/2 -mt-4 flex h-8 w-8 items-center justify-center rounded-lg shadow-md backdrop-blur-sm z-30",
        color
      )}
    >
      <Icon className="h-4 w-4 text-white" />
    </motion.div>
  );
}
