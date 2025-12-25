import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiDesktop, PiHeadset, PiPulse } from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function ManagedITVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Radar Sweep (Spin)
      gsap.to('.radar-sweep', {
        rotation: 360,
        duration: 3,
        repeat: -1,
        ease: 'linear',
      });

      // Health Packet Ping
      gsap.to('.packet-ping', {
        scale: 1.5,
        opacity: 0,
        duration: 1,
        repeat: -1,
        ease: 'power1.out',
      });

      // Status Pulse
      gsap.to('.status-dot', {
        opacity: 0.4,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // ECG Line Animation (Draw)
      gsap.fromTo(
        '.ecg-path',
        { strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          duration: 3,
          repeat: -1,
          ease: 'linear',
        }
      );

      const tl = gsap.timeline({ repeat: -1 }); // 3s loop

      // Health Check (Endpoints -> Monitoring)
      tl.fromTo(
        '.packet-1',
        { left: '0%', opacity: 0, scale: 0.5 },
        {
          left: '50%',
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'linear',
          keyframes: {
            '0%': { opacity: 0, scale: 0.5 },
            '50%': { opacity: 1, scale: 1 },
            '100%': { opacity: 0, scale: 0.5 },
          },
        },
        0
      );

      // Ack (Monitoring -> Support)
      tl.fromTo(
        '.packet-2',
        { left: '50%', opacity: 0, scale: 0.5 },
        {
          left: '100%',
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'linear',
          keyframes: {
            '0%': { opacity: 0, scale: 0.5 },
            '50%': { opacity: 1, scale: 1 },
            '100%': { opacity: 0, scale: 0.5 },
          },
        },
        1.5
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md"
    >
      {/* ECG Background */}
      <div className="absolute inset-0 z-0 flex items-center opacity-10">
        <svg
          className="h-24 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,12 L50,12 L60,0 L70,24 L80,12 L100,12 L110,0 L120,24 L130,12 L1000,12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary ecg-path"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="1000 1000"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        {/* Node 1: Endpoints */}
        <Node
          icon={PiDesktop}
          label="Endpoints"
          sublabel="Workstations & Servers"
          color="secondary"
        />

        <MonitorLine />

        {/* Node 2: Proactive Monitoring */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background/80 shadow-[0_0_30px_rgba(0,212,255,0.3)] backdrop-blur-xl">
            {/* Radar Sweep */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="radar-sweep absolute left-0 inset-0 h-full w-1/2 origin-right bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            </div>
            <PiPulse className="relative z-10 h-10 w-10 text-primary" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-primary">
              24/7 Monitoring
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Proactive Health Check
            </div>
          </div>
        </div>

        <MonitorLine />

        {/* Node 3: Expert Support */}
        <Node
          icon={PiHeadset}
          label="Expert Support"
          sublabel="Instant Resolution"
          color="accent"
        />
      </div>

      {/* Health Packets */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Health Check */}
        <HealthPacket className="packet-1" color="bg-green-500" />
        {/* Ack */}
        <HealthPacket className="packet-2" color="bg-primary" />
      </div>

      {/* Floating Status */}
      <div className="absolute left-4 top-4 hidden items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 md:flex">
        <div className="status-dot h-2 w-2 rounded-full bg-green-500"></div>
        <span className="text-xs font-mono text-green-500">
          SYSTEM HEALTHY
        </span>
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

function MonitorLine() {
  return (
    <div className="relative hidden h-px flex-1 bg-border md:block">
      {/* Heartbeat dot */}
    </div>
  );
}

function HealthPacket({
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
    >
      <div className="packet-ping absolute inset-0 rounded-full bg-inherit opacity-75"></div>
    </div>
  );
}
