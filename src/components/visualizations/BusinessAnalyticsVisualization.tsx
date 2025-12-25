import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PiChartBar, PiDatabase, PiFunnel, PiTable, PiTrendUp } from 'react-icons/pi';
import { cn } from '@/lib/utils';

export default function BusinessAnalyticsVisualization() {
  const [flowKey, setFlowKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowKey(k => k + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        
        {/* Node 1: Data Sources */}
        <Node 
          icon={PiDatabase} 
          label="Data Sources" 
          sublabel="ERP, CRM, IoT"
          color="primary"
        />

        <PipelineConduit />

        {/* Node 2: Analytics Engine */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-24 w-24 items-center justify-center rounded-xl border-2 border-secondary bg-background/80 shadow-[0_0_30px_rgba(124,58,237,0.3)] backdrop-blur-xl">
             <div className="absolute inset-0 animate-pulse rounded-xl bg-secondary/10"></div>
            <PiFunnel className="h-10 w-10 text-secondary" />
             {/* Falling particles effect inside */}
             <div className="absolute top-2 w-full flex justify-center gap-1 opacity-50">
                <motion.div animate={{ y: [0, 20], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity }} className="h-1 w-1 rounded-full bg-secondary"/>
                <motion.div animate={{ y: [0, 20], opacity: [1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="h-1 w-1 rounded-full bg-secondary"/>
                <motion.div animate={{ y: [0, 20], opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} className="h-1 w-1 rounded-full bg-secondary"/>
             </div>
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-secondary">Processing</div>
            <div className="font-mono text-xs text-muted-foreground">Clean & Aggregate</div>
          </div>
        </div>

        <PipelineConduit />

        {/* Node 3: Dashboard */}
        <Node 
          icon={PiChartBar} 
          label="Visualization" 
          sublabel="Real-time Insights"
          color="accent"
        />
      </div>

      {/* Flowing Data */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Raw Data Packet */}
        <ChartPacket 
          delay={0} 
          start="0%" 
          end="50%" 
          color="bg-primary" 
          key={`bp1-${flowKey}`} 
          type="raw"
        />
        
        {/* Refined Data Packet */}
        <ChartPacket 
          delay={2} 
          start="50%" 
          end="100%" 
          color="bg-brand-accent" 
          key={`bp2-${flowKey}`} 
          type="chart"
        />
      </div>
      
       {/* Floating Stats Background */}
       <div className="absolute top-4 right-8 flex flex-col gap-1 pointer-events-none opacity-20">
          <div className="h-1 w-16 bg-primary rounded animate-pulse"></div>
          <div className="h-1 w-10 bg-primary rounded animate-pulse delay-75"></div>
          <div className="h-1 w-24 bg-primary rounded animate-pulse delay-150"></div>
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

function PipelineConduit() {
    return (
      <div className="relative hidden h-2 flex-1 overflow-hidden rounded-full bg-muted/20 md:block">
        <div className="absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-border"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.1),transparent)] bg-[length:200%_100%] animate-shimmer"></div>
      </div>
    );
}

function ChartPacket({ delay, start, end, color, type }: { delay: number, start: string, end: string, color: string, type: 'raw' | 'chart' }) {
  return (
    <motion.div
      initial={{ left: start, opacity: 0 }}
      animate={{ 
        left: end, 
        opacity: [0, 1, 1, 0],
      }}
      transition={{ 
        duration: 1.8, 
        delay: delay,
        ease: "easeInOut" 
      }}
      className="absolute top-1/2 -mt-4 z-30"
    >
        {type === 'raw' ? (
            <div className={cn("flex gap-1", color.replace('bg-', 'text-'))}>
                <PiTable className="h-6 w-6" />
            </div>
        ) : (
            <div className={cn("flex gap-1", color.replace('bg-', 'text-'))}>
                <PiTrendUp className="h-6 w-6" />
            </div>
        )}
    </motion.div>
  );
}
