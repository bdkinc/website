import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiGlobe, PiHardDrives, PiUsers } from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function CloudHostingVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.1 }); // ~2.5s loop

      // Orbiting Ring
      gsap.to('.orbit-ring', {
        rotation: 360,
        duration: 8,
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

      // Background Pulse
      gsap.to('.bg-pulse', {
        scale: 1.1,
        opacity: 0.3,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Circuit Overlay Animation
      gsap.to('.circuit-path', {
        strokeDashoffset: 0,
        duration: 4,
        repeat: -1,
        ease: 'linear',
      });

      // Burst of 3 request packets
      const reqTargets = ['.req-1', '.req-2', '.req-3'];
      reqTargets.forEach((target, i) => {
        tl.fromTo(
          target,
          { left: '0%', opacity: 0, scale: 0.5 },
          {
            left: '50%',
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power1.inOut',
            keyframes: {
              '0%': { opacity: 0, scale: 0.5 },
              '50%': { opacity: 1, scale: 1 },
              '100%': { opacity: 0, scale: 0.5 },
            },
          },
          i * 0.2 // Stagger start: 0, 0.2, 0.4
        );
      });

      // Response packets
      const resTargets = ['.res-1', '.res-2'];
      resTargets.forEach((target, i) => {
        tl.fromTo(
          target,
          { left: '50%', opacity: 0, scale: 0.5 },
          {
            left: '100%',
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power1.inOut',
            keyframes: {
              '0%': { opacity: 0, scale: 0.5 },
              '50%': { opacity: 1, scale: 1 },
              '100%': { opacity: 0, scale: 0.5 },
            },
          },
          1.5 + i * 0.2 // Start at 1.5, 1.7
        );
      });

      // Scalability Indicator (Independent Loop)
      gsap.fromTo(
        '.scalability-text',
        { opacity: 0, x: 10 },
        {
          opacity: 1,
          x: 0,
          duration: 1.5,
          ease: 'power1.inOut',
          yoyo: true, // Go back to start? No, original was keyframes [10, 0, -10] and opacity [0, 1, 0]
          // Replicating exactly:
          keyframes: {
            '0%': { opacity: 0, x: 10 },
            '50%': { opacity: 1, x: 0 },
            '100%': { opacity: 0, x: -10 },
          },
          repeat: -1,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md"
    >
      {/* Map Background (Abstract) */}
      <div className="absolute inset-0 z-0 opacity-20 overflow-hidden">
        <div className="bg-pulse absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      </div>

      <div className="circuit-overlay pointer-events-none absolute inset-0 opacity-10">
         <svg className="h-full w-full" preserveAspectRatio="none">
            <path
              d="M0 50 Q 50 20 100 50 T 200 50"
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
        {/* Node 1: Global Traffic */}
        <Node
          icon={PiUsers}
          label="Global Traffic"
          sublabel="Users & Devices"
          color="primary"
        />

        <Conduit />

        {/* Node 2: Load Balancer */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-24 w-24 items-center justify-center rounded-full border-2 border-secondary bg-background/80 shadow-[0_0_30px_rgba(124,58,237,0.3)] backdrop-blur-xl">
            <div className="absolute inset-0 animate-pulse rounded-full bg-secondary/10"></div>
            {/* Orbiting ring */}
            <div className="orbit-ring absolute -inset-2 rounded-full border border-secondary/30"></div>
            <PiGlobe className="h-10 w-10 text-secondary" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-secondary">
              Global Gateway
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Load Balancing
            </div>
          </div>
        </div>

        <Conduit />

        {/* Node 3: Scalable Infrastructure */}
        <Node
          icon={PiHardDrives}
          label="Cloud Cluster"
          sublabel="Auto-Scaling Nodes"
          color="accent"
        />
      </div>

      {/* Traffic Packets */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Burst of 3 packets */}
        <RequestPacket className="req-1" color="bg-primary" />
        <RequestPacket className="req-2" color="bg-primary" />
        <RequestPacket className="req-3" color="bg-primary" />

        {/* Response */}
        <RequestPacket className="res-1" color="bg-brand-accent" />
        <RequestPacket className="res-2" color="bg-brand-accent" />
      </div>

      {/* Floating Scalability Indicators */}
      <div className="absolute bottom-8 right-12 hidden flex-col gap-1 pointer-events-none md:flex">
        <div className="scalability-text text-xs font-mono text-brand-accent opacity-0">
          + NODE ADDED
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
      <div className="conduit-shimmer absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.1),transparent)] bg-[length:50%_100%]"></div>
    </div>
  );
}

function RequestPacket({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'absolute top-1/2 -mt-1.5 h-3 w-3 rounded-full shadow-[0_0_10px_currentColor] opacity-0',
        color,
        className
      )}
    />
  );
}
