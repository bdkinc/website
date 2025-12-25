import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  PiBuildings,
  PiCheck,
  PiFileText,
  PiPackage,
  PiShoppingCart,
} from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function HostedERPVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1 }); // ~4.5s loop

      // Sales Order (Left to Center)
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

      // Shipment Order (Center to Right)
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

      // Confirmation (Right to Left - Full)
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
        3.0
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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="circuit-overlay pointer-events-none absolute inset-0 opacity-10" />

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
            <div className="absolute -right-2 -top-2 h-6 w-6 animate-bounce rounded bg-primary/20 delay-75"></div>
            <div className="absolute -bottom-2 -left-2 h-6 w-6 animate-bounce rounded bg-primary/20 delay-150"></div>
            <PiBuildings className="h-10 w-10 text-primary" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-primary">
              Hosted ERP
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Central Operation
            </div>
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
          className="packet-1"
          color="bg-secondary"
          icon={PiFileText}
        />

        {/* Shipment Order (Center to Right) */}
        <TransPacket
          className="packet-2"
          color="bg-primary"
          icon={PiPackage}
        />

        {/* Confirmation (Right to Left - Full) */}
        <TransPacket
          className="packet-3"
          color="bg-brand-accent"
          icon={PiCheck}
          reverse
        />
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

function TransPacket({
  color,
  reverse: _reverse = false,
  icon: Icon,
  className,
}: {
  color: string;
  reverse?: boolean;
  icon: any;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'absolute top-1/2 -mt-4 flex h-8 w-8 items-center justify-center rounded-lg shadow-md backdrop-blur-sm z-30 opacity-0',
        color,
        className
      )}
    >
      <Icon className="h-4 w-4 text-white" />
    </div>
  );
}
