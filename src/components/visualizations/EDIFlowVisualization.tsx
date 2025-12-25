import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiBuilding, PiDatabase, PiDesktop } from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function EDIFlowVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Central Node Spin
      gsap.to('.spin-ring', {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: 'linear',
      });

      // Conduit Shimmer
      gsap.to('.conduit-shimmer', {
        x: '100%',
        duration: 2,
        repeat: -1,
        ease: 'linear',
      });

      // Status Pulse
      gsap.to('.status-dot', {
        opacity: 0.4,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Background Pulse
      gsap.to('.edi-grid', {
        opacity: 0.3,
        scale: 1.05,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Circuit Overlay Animation
      gsap.to('.circuit-path', {
        strokeDashoffset: 0,
        duration: 3,
        repeat: -1,
        ease: 'linear',
      });

      const tl = gsap.timeline({ repeat: -1 }); // 4s loop

      // Packet 1 (Partner -> Engine)
      tl.fromTo(
        '.packet-1',
        { left: '0%', opacity: 0, scale: 0.5 },
        {
          left: '50%',
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power1.inOut',
          keyframes: {
            '0%': { opacity: 0, scale: 0.5 },
            '50%': { opacity: 1, scale: 1 },
            '100%': { opacity: 0, scale: 0.5 },
          },
        },
        0
      );

      // Packet 2 (Engine -> ERP)
      tl.fromTo(
        '.packet-2',
        { left: '50%', opacity: 0, scale: 0.5 },
        {
          left: '100%',
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power1.inOut',
          keyframes: {
            '0%': { opacity: 0, scale: 0.5 },
            '50%': { opacity: 1, scale: 1 },
            '100%': { opacity: 0, scale: 0.5 },
          },
        },
        1.5
      );

      // Packet 3 (ERP -> Partner) - moving backwards
      tl.fromTo(
        '.packet-3',
        { left: '100%', opacity: 0, scale: 0.5 },
        {
          left: '0%',
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power1.inOut',
          keyframes: {
            '0%': { opacity: 0, scale: 0.5 },
            '50%': { opacity: 1, scale: 1 },
            '100%': { opacity: 0, scale: 0.5 },
          },
        },
        2.5
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md"
    >
      {/* Background Grid & Decorations */}
      <div className="absolute inset-0 z-0 opacity-20 edi-grid">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Circuit Overlay */}
      <div className="circuit-overlay pointer-events-none absolute inset-0 opacity-10">
         <svg className="h-full w-full" preserveAspectRatio="none">
            <path
              d="M0 20 H 100 V 80 H 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary circuit-path"
              strokeDasharray="20 20"
              vectorEffect="non-scaling-stroke"
            />
         </svg>
      </div>

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
            <div className="spin-ring absolute -inset-1 rounded-2xl border border-dashed border-primary/30"></div>
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-primary">
              BDK Engine
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Translation & Routing
            </div>
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
        <DataPacket className="packet-1" color="bg-secondary" />

        {/* Forward Packet 2 (Engine -> ERP) */}
        <DataPacket className="packet-2" color="bg-primary" />

        {/* Acknowledge Packet (ERP -> Partner) - moving backwards */}
        <DataPacket className="packet-3" color="bg-brand-accent" reverse />
      </div>

      {/* Legend / Status */}
      <div className="mt-12 flex items-center justify-center gap-6 border-t border-border/50 pt-4">
        <div className="flex items-center gap-2">
          <div className="status-dot h-2 w-2 rounded-full bg-green-500"></div>
          <span className="font-mono text-xs text-muted-foreground">
            SYSTEM ONLINE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary"></div>
          <span className="font-mono text-xs text-muted-foreground">
            2.4ms LATENCY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-secondary"></div>
          <span className="font-mono text-xs text-muted-foreground">
            ENCRYPTED (AES-256)
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
      {/* Static line */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-border"></div>

      {/* Animated flow background */}
      <div className="conduit-shimmer absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.1),transparent)] bg-[length:50%_100%]"></div>
    </div>
  );
}

function DataPacket({
  color,
  reverse: _reverse = false,
  className,
}: {
  color: string;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'absolute top-1/2 -mt-3 flex h-6 w-16 items-center justify-center rounded-full shadow-[0_0_10px_currentColor] backdrop-blur-sm opacity-0',
        color,
        className
      )}
    >
      <div className="flex gap-1">
        <div className="h-1 w-1 rounded-full bg-white/80"></div>
        <div className="h-1 w-4 rounded-full bg-white/80"></div>
      </div>
      <div className="absolute inset-0 rounded-full bg-white/20 blur-[2px]"></div>
    </div>
  );
}
