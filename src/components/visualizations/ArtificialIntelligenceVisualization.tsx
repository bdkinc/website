import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiBrain, PiDatabase, PiLightbulb } from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function ArtificialIntelligenceVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Rotating rings around brain
      gsap.to('.ring-dashed', {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: 'linear',
      });
      gsap.to('.ring-dotted', {
        rotation: -360,
        duration: 15,
        repeat: -1,
        ease: 'linear',
      });

      // Neural Conduit Flows
      gsap.to('.conduit-flow-1', {
        strokeDashoffset: -100,
        duration: 2,
        repeat: -1,
        ease: 'linear',
      });
      gsap.to('.conduit-flow-2', {
        strokeDashoffset: 100, // reverse
        duration: 2,
        repeat: -1,
        ease: 'linear',
      });

      // Synapse Pulses
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 }); // 2.5s + 0.5s = 3.0s loop

      // Pulse 1: 0 -> 50%
      tl.fromTo(
        '.pulse-1',
        { left: '0%', opacity: 0, scale: 0 },
        {
          left: '50%',
          opacity: 1,
          scale: 1.5,
          duration: 1.0,
          ease: 'power1.out',
          keyframes: {
            '0%': { opacity: 0, scale: 0 },
            '50%': { opacity: 1, scale: 1.5 },
            '100%': { opacity: 0, scale: 0 },
          },
        },
        0
      );

      // Pulse 2: 0 -> 50% (delay 0.5)
      tl.fromTo(
        '.pulse-2',
        { left: '0%', opacity: 0, scale: 0 },
        {
          left: '50%',
          opacity: 1,
          scale: 1.5,
          duration: 1.0,
          ease: 'power1.out',
          keyframes: {
            '0%': { opacity: 0, scale: 0 },
            '50%': { opacity: 1, scale: 1.5 },
            '100%': { opacity: 0, scale: 0 },
          },
        },
        0.5
      );

      // Pulse 3: 50% -> 100% (delay 1.5)
      tl.fromTo(
        '.pulse-3',
        { left: '50%', opacity: 0, scale: 0 },
        {
          left: '100%',
          opacity: 1,
          scale: 1.5,
          duration: 1.0,
          ease: 'power1.out',
          keyframes: {
            '0%': { opacity: 0, scale: 0 },
            '50%': { opacity: 1, scale: 1.5 },
            '100%': { opacity: 0, scale: 0 },
          },
        },
        1.5
      );

      // Background Pulse
      gsap.to('.neural-bg', {
        opacity: 0.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md"
    >
      {/* Neural Background */}
      <div className="neural-bg absolute inset-0 z-0 opacity-10">
        <svg className="h-full w-full">
          <pattern
            id="neural-net"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" className="fill-primary" />
            <path
              d="M2 2 L40 40 M2 40 L40 2"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary/30"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#neural-net)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        {/* Node 1: Raw Data */}
        <Node
          icon={PiDatabase}
          label="Raw Data"
          sublabel="Ingestion"
          color="primary"
        />

        <NeuralConduit className="conduit-flow-1" active={true} />

        {/* Node 2: Neural Processing */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-28 w-28 items-center justify-center rounded-full border-2 border-secondary bg-background/80 shadow-[0_0_40px_rgba(124,58,237,0.4)] backdrop-blur-xl">
            <div className="absolute inset-0 animate-pulse rounded-full bg-secondary/10"></div>
            {/* Brain/Chip Animation */}
            <div className="relative">
              <PiBrain className="relative z-10 h-12 w-12 text-secondary" />
              <div className="ring-dashed absolute -inset-4 rounded-full border border-dashed border-secondary/40" />
              <div className="ring-dotted absolute -inset-8 rounded-full border border-dotted border-secondary/20" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-secondary">
              Neural Engine
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Pattern Recognition
            </div>
          </div>
        </div>

        <NeuralConduit className="conduit-flow-2" active={true} reverse />

        {/* Node 3: Insights */}
        <Node
          icon={PiLightbulb}
          label="Insights"
          sublabel="Predictive Outcomes"
          color="accent"
        />
      </div>

      {/* Synapse Firings */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        <SynapsePulse className="pulse-1" color="bg-primary" />
        <SynapsePulse className="pulse-2" color="bg-primary" />
        <SynapsePulse className="pulse-3" color="bg-secondary" />
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

function NeuralConduit({
  active: _active,
  reverse,
  className,
}: {
  active: boolean;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className="relative hidden h-16 flex-1 items-center justify-center md:flex">
      {/* Connection Lines */}
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <path
          d="M0,32 C50,32 50,32 100,32"
          vectorEffect="non-scaling-stroke"
          className="stroke-border stroke-1 fill-none"
        />
        {/* Animated data flow */}
        <path
          d="M0,32 C50,32 50,32 100,32"
          vectorEffect="non-scaling-stroke"
          className={cn(
            'stroke-2 fill-none',
            reverse ? 'stroke-secondary' : 'stroke-primary',
            className
          )}
          strokeDasharray="10 10"
          style={{ opacity: 0.5 }}
        />
      </svg>
    </div>
  );
}

function SynapsePulse({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'absolute top-1/2 -mt-1.5 h-3 w-3 rounded-full shadow-[0_0_15px_currentColor] blur-[1px] opacity-0',
        color,
        className
      )}
    />
  );
}
