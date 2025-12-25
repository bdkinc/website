import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiCpu, PiDatabase, PiLightning, PiShieldCheck } from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function IBMPowerVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Lightning Bounce
      gsap.to('.lightning-icon', {
        y: -10,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Energy Pulse (Ping effect)
      gsap.to('.energy-pulse', {
        scale: 1.4,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: 'power1.out',
      });

      // Power Line Shimmer
      gsap.to('.power-shimmer', {
        x: '200%',
        duration: 1,
        repeat: -1,
        ease: 'linear',
      });

      // Background Circuit Pulse
      gsap.to('.ibm-circuit', {
        opacity: 0.3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 }); // ~2s loop

      // Fast Stream (Workloads -> CPU)
      const stream1 = ['.packet-1', '.packet-2', '.packet-3'];
      stream1.forEach((target, i) => {
        tl.fromTo(
          target,
          { left: '0%', opacity: 0, scale: 0.5 },
          {
            left: '50%',
            opacity: 1,
            scale: 1,
            duration: 0.8, // Very fast
            ease: 'linear',
            keyframes: {
              '0%': { opacity: 0, scale: 0.5 },
              '50%': { opacity: 1, scale: 1 },
              '100%': { opacity: 0, scale: 0.5 },
            },
          },
          i * 0.1 // 0, 0.1, 0.2
        );
      });

      // Processed Output (CPU -> Reliability)
      const stream2 = ['.packet-4', '.packet-5', '.packet-6'];
      stream2.forEach((target, i) => {
        tl.fromTo(
          target,
          { left: '50%', opacity: 0, scale: 0.5 },
          {
            left: '100%',
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'linear',
            keyframes: {
              '0%': { opacity: 0, scale: 0.5 },
              '50%': { opacity: 1, scale: 1 },
              '100%': { opacity: 0, scale: 0.5 },
            },
          },
          0.8 + i * 0.1 // 0.8, 0.9, 1.0
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md"
    >
      {/* Circuit Background */}
      <div className="absolute inset-0 z-0 opacity-15 ibm-circuit">
        <svg className="h-full w-full">
          <pattern
            id="circuit-board"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M10 10 L30 10 L30 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary"
            />
            <path
              d="M70 70 L90 70 L90 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary"
            />
            <circle
              cx="30"
              cy="30"
              r="2"
              fill="currentColor"
              className="text-primary"
            />
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
            <div className="energy-pulse absolute -inset-4 z-0 rounded-xl border border-primary/30 opacity-50 scale-100"></div>
            <PiCpu className="relative z-10 h-14 w-14 text-primary" />
            {/* Electrical Arcs */}
            <PiLightning className="lightning-icon absolute -right-3 -top-3 h-6 w-6 text-yellow-400" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-primary">
              IBM Power
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              High Performance
            </div>
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
        <EnergyPacket className="packet-1" color="bg-secondary" />
        <EnergyPacket className="packet-2" color="bg-secondary" />
        <EnergyPacket className="packet-3" color="bg-secondary" />

        {/* Processed Output */}
        <EnergyPacket className="packet-4" color="bg-primary" />
        <EnergyPacket className="packet-5" color="bg-primary" />
        <EnergyPacket className="packet-6" color="bg-primary" />
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

function PowerLine() {
  return (
    <div className="relative hidden h-4 flex-1 items-center md:flex">
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted/30 relative">
        <div className="power-shimmer h-full w-full absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)] bg-[length:50%_100%]"></div>
      </div>
    </div>
  );
}

function EnergyPacket({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'absolute top-1/2 -mt-1 h-2 w-8 rounded-full shadow-[0_0_15px_currentColor] opacity-0',
        color,
        className
      )}
    />
  );
}
