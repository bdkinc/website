import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  PiCode,
  PiGearSix,
  PiCloud,
  PiGitMerge,
  PiRocket,
} from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function ApplicationDevelopmentVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Gear Rotation
      gsap.to('.gear-icon', {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: 'linear',
      });

      // Circuit Overlay Animation
      gsap.to('.circuit-path', {
        strokeDashoffset: 0,
        duration: 3,
        repeat: -1,
        ease: 'linear',
      });

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
      className="border-primary/20 bg-background/40 relative w-full overflow-hidden rounded-xl border p-8 backdrop-blur-md"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
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
          <div className="border-secondary bg-background/80 relative z-20 flex h-24 w-24 items-center justify-center rounded-2xl border-2 shadow-lg backdrop-blur-xl">
            <div className="bg-secondary/8 absolute inset-0 rounded-2xl"></div>
            <PiGearSix className="gear-icon text-secondary h-10 w-10" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-secondary text-lg font-bold">
              CI/CD Pipeline
            </div>
            <div className="text-muted-foreground font-mono text-xs">
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
      <div className="pointer-events-none absolute top-1/2 left-0 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Commit Packet */}
        <DataPacket className="packet-1" color="bg-primary" icon={PiGitMerge} />

        {/* Deploy Packet */}
        <DataPacket className="packet-2" color="bg-secondary" icon={PiRocket} />
      </div>

      {/* Status Legend */}
      <div className="border-border/50 mt-12 flex items-center justify-center gap-6 border-t pt-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/70 h-2 w-2 rounded-full"></div>
          <span className="text-muted-foreground font-mono text-xs">
            AGILE WORKFLOW
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-secondary h-2 w-2 rounded-full"></div>
          <span className="text-muted-foreground font-mono text-xs">
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
    accent: 'border-accent text-accent-foreground shadow-accent/20',
  };

  return (
    <div className="relative z-10 flex flex-col items-center">
      <div
        className={cn(
          'bg-card/80 flex h-20 w-20 items-center justify-center rounded-xl border shadow-lg backdrop-blur-md transition-all hover:scale-105',
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
        'absolute top-1/2 z-30 -mt-4 flex h-8 w-8 items-center justify-center rounded-full opacity-0 shadow-md backdrop-blur-sm',
        color,
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4 text-white" />}
    </div>
  );
}
