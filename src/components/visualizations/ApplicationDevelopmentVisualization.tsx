import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiCode, PiGearSix, PiCloud, PiGitMerge, PiRocket } from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function ApplicationDevelopmentVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 }); // 3.8s + 0.2s = 4.0s loop approximately

      // Packet 1: Development -> Pipeline
      tl.fromTo(
        '.packet-1',
        { left: '0%', opacity: 0, scale: 0.5 },
        {
          left: '50%',
          opacity: 1, // We'll handle full opacity cycle in keyframes if needed, but simplified:
          scale: 1,
          duration: 1.8,
          ease: 'power1.inOut',
          keyframes: {
            '0%': { opacity: 0, scale: 0.5 },
            '50%': { opacity: 1, scale: 1 },
            '100%': { opacity: 0, scale: 0.5 },
          },
        },
        0
      );

      // Packet 2: Pipeline -> Production
      tl.fromTo(
        '.packet-2',
        { left: '50%', opacity: 0, scale: 0.5 },
        {
          left: '100%',
          opacity: 1,
          scale: 1,
          duration: 1.8,
          ease: 'power1.inOut',
          keyframes: {
            '0%': { opacity: 0, scale: 0.5 },
            '50%': { opacity: 1, scale: 1 },
            '100%': { opacity: 0, scale: 0.5 },
          },
        },
        2.0
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="circuit-overlay pointer-events-none absolute inset-0 opacity-10" />

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        {/* Node 1: Development */}
        <Node
          icon={PiCode}
          label="Development"
          sublabel="Code & Commit"
          color="primary"
        />

        <Conduit />

        {/* Node 2: CI/CD Pipeline */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-secondary bg-background/80 shadow-[0_0_30px_rgba(124,58,237,0.3)] backdrop-blur-xl">
            <div className="absolute inset-0 animate-pulse rounded-2xl bg-secondary/10"></div>
            <PiGearSix className="animate-spin-slow h-10 w-10 text-secondary" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-secondary">
              CI/CD Pipeline
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Build, Test, Deploy
            </div>
          </div>
        </div>

        <Conduit />

        {/* Node 3: Cloud Production */}
        <Node
          icon={PiCloud}
          label="Production"
          sublabel="Scale & Run"
          color="accent"
        />
      </div>

      {/* Animated Packets */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Commit Packet */}
        <DataPacket
          className="packet-1"
          color="bg-primary"
          icon={PiGitMerge}
        />

        {/* Deploy Packet */}
        <DataPacket
          className="packet-2"
          color="bg-secondary"
          icon={PiRocket}
        />
      </div>

      {/* Status Legend */}
      <div className="mt-12 flex items-center justify-center gap-6 border-t border-border/50 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
          <span className="font-mono text-xs text-muted-foreground">
            AGILE WORKFLOW
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-secondary"></div>
          <span className="font-mono text-xs text-muted-foreground">
            AUTOMATED DEPLOY
          </span>
        </div>
      </div>
    </div>
  );
}

function Node({
  icon: Icon,
  label,
  sublabel,
  color = 'primary',
}: {
  icon: any;
  label: string;
  sublabel: string;
  color?: 'primary' | 'secondary' | 'accent';
}) {
  const colorClasses = {
    primary: 'border-primary text-primary shadow-primary/20',
    secondary: 'border-secondary text-secondary shadow-secondary/20',
    accent: 'border-brand-accent text-brand-accent shadow-brand-accent/20',
  };

  return (
    <div className="relative z-10 flex flex-col items-center">
      <div
        className={cn(
          'flex h-20 w-20 items-center justify-center rounded-xl border bg-card/80 shadow-lg backdrop-blur-md transition-all hover:scale-105',
          colorClasses[color]
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
      <div className="mt-4 text-center">
        <div className="font-display text-sm font-bold text-foreground">
          {label}
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          {sublabel}
        </div>
      </div>
    </div>
  );
}

function Conduit() {
  return (
    <div className="relative hidden h-2 flex-1 overflow-hidden rounded-full bg-muted/20 md:block">
      <div className="absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-border"></div>
      <div className="animate-shimmer absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.1),transparent)] bg-[length:200%_100%]"></div>
    </div>
  );
}

function DataPacket({
  color,
  icon: Icon,
  className,
}: {
  color: string;
  icon?: any;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'absolute top-1/2 -mt-4 z-30 flex h-8 w-8 items-center justify-center rounded-full shadow-[0_0_10px_currentColor] backdrop-blur-sm opacity-0',
        color,
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4 text-white" />}
    </div>
  );
}
