import { useRef } from 'react';
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
      // Stacking Squares Animation
      gsap.to('.stack-square-1', {
        y: -5,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 0.1,
      });
      gsap.to('.stack-square-2', {
        y: -5,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 0.2,
      });

      // Conduit Shimmer
      gsap.to('.conduit-shimmer', {
        x: '100%',
        duration: 2,
        repeat: -1,
        ease: 'linear',
      });

      // Background Grid Pulse
      gsap.to('.erp-grid', {
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
      className="border-primary/20 bg-background/40 relative w-full overflow-hidden rounded-xl border p-8 backdrop-blur-md"
    >
      {/* Background Grid */}
      <div className="erp-grid absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

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
          <div className="border-primary bg-background/80 relative z-20 flex h-24 w-24 items-center justify-center rounded-lg border-2 shadow-lg backdrop-blur-xl">
            <div className="bg-primary/10 absolute inset-0 rounded-lg"></div>
            {/* Stacking squares animation */}
            <div className="stack-square-1 bg-primary/20 absolute -top-2 -right-2 h-6 w-6 rounded"></div>
            <div className="stack-square-2 bg-primary/20 absolute -bottom-2 -left-2 h-6 w-6 rounded"></div>
            <PiBuildings className="text-primary h-10 w-10" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-primary text-lg font-bold">
              Hosted ERP
            </div>
            <div className="text-muted-foreground font-mono text-xs">
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
      <div className="pointer-events-none absolute top-1/2 left-0 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Sales Order (Left to Center) */}
        <TransPacket
          className="packet-1"
          color="bg-secondary"
          icon={PiFileText}
        />

        {/* Shipment Order (Center to Right) */}
        <TransPacket className="packet-2" color="bg-primary" icon={PiPackage} />

        {/* Confirmation (Right to Left - Full) */}
        <TransPacket
          className="packet-3"
          color="bg-accent"
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
    accent: 'border-accent text-accent-foreground shadow-accent/20',
  };

  return (
    <div className="relative z-10 flex flex-col items-center">
      <div
        className={cn(
          'bg-card/80 flex h-20 w-20 items-center justify-center rounded-xl border shadow-lg backdrop-blur-md transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] hover:scale-105',
          colorClasses[color]
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
      <div className="mt-4 text-center">
        <div className="font-display text-foreground text-sm font-bold">
          {label}
        </div>
        <div className="text-muted-foreground font-mono text-xs">
          {sublabel}
        </div>
      </div>
    </div>
  );
}

function Conduit() {
  return (
    <div className="bg-muted/20 relative hidden h-2 flex-1 overflow-hidden rounded-full md:block">
      <div className="bg-border absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2"></div>
      <div className="conduit-shimmer absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,hsl(var(--primary)/0.10),transparent)] bg-[length:50%_100%]"></div>
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
        'absolute top-1/2 z-30 -mt-4 flex h-8 w-8 items-center justify-center rounded-lg opacity-0 shadow-md backdrop-blur-sm',
        color,
        className
      )}
    >
      <Icon className="h-4 w-4 text-white" />
    </div>
  );
}
