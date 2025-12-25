import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  PiChartBar,
  PiDatabase,
  PiFunnel,
  PiTable,
  PiTrendUp,
} from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function BusinessAnalyticsVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Falling particles in the funnel
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const particleTl = gsap.timeline({ repeat: -1 });
      // 3 particles falling with different delays
      ['.falling-1', '.falling-2', '.falling-3'].forEach((target, i) => {
        gsap.fromTo(
          target,
          { y: 0, opacity: 1 },
          {
            y: 20,
            opacity: 0,
            duration: 1 + i * 0.1, // variation in speed? Original had 1, 1.2, 0.8 durations.
            repeat: -1,
            ease: 'power1.in',
            delay: i * 0.2,
          }
        );
      });

      // Packet Flow
      const flowTl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 }); // 3.8s + 0.2s = 4s

      // Raw Data Packet: 0 -> 50%
      flowTl.fromTo(
        '.packet-raw',
        { left: '0%', opacity: 0 },
        {
          left: '50%',
          opacity: 1,
          duration: 1.8,
          ease: 'power1.inOut',
          keyframes: {
            '0%': { opacity: 0 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0 },
          },
        },
        0
      );

      // Chart Packet: 50% -> 100%
      flowTl.fromTo(
        '.packet-chart',
        { left: '50%', opacity: 0 },
        {
          left: '100%',
          opacity: 1,
          duration: 1.8,
          ease: 'power1.inOut',
          keyframes: {
            '0%': { opacity: 0 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0 },
          },
        },
        2.0
      );
      // Background Grid Pulse
      gsap.to('.analytics-grid', {
        opacity: 0.3,
        scale: 1.05,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Pipeline Shimmer
      gsap.to('.pipeline-shimmer', {
        x: '100%',
        duration: 2,
        repeat: -1,
        ease: 'linear',
      });

      // Floating Stats
      gsap.to('.stat-bar', {
        scaleX: 1.2,
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: 'power1.inOut',
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10 analytics-grid">
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
            <div className="absolute top-2 flex w-full justify-center gap-1 opacity-50">
              <div className="falling-1 h-1 w-1 rounded-full bg-secondary" />
              <div className="falling-2 h-1 w-1 rounded-full bg-secondary" />
              <div className="falling-3 h-1 w-1 rounded-full bg-secondary" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-secondary">
              Processing
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Clean & Aggregate
            </div>
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
          className="packet-raw"
          color="bg-primary"
          type="raw"
        />

        {/* Refined Data Packet */}
        <ChartPacket
          className="packet-chart"
          color="bg-brand-accent"
          type="chart"
        />
      </div>

      {/* Floating Stats Background */}
      <div className="pointer-events-none absolute right-8 top-4 flex flex-col gap-1 opacity-20">
        <div className="stat-bar h-1 w-16 rounded bg-primary origin-left"></div>
        <div className="stat-bar h-1 w-10 rounded bg-primary origin-left"></div>
        <div className="stat-bar h-1 w-24 rounded bg-primary origin-left"></div>
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

function PipelineConduit() {
  return (
    <div className="relative hidden h-2 flex-1 overflow-hidden rounded-full bg-muted/20 md:block">
      <div className="absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-border"></div>
      <div className="pipeline-shimmer absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.1),transparent)] bg-[length:50%_100%]"></div>
    </div>
  );
}

function ChartPacket({
  color,
  type,
  className,
}: {
  color: string;
  type: 'raw' | 'chart';
  className?: string;
}) {
  return (
    <div className={cn('absolute top-1/2 -mt-4 z-30 opacity-0', className)}>
      {type === 'raw' ? (
        <div className={cn('flex gap-1', color.replace('bg-', 'text-'))}>
          <PiTable className="h-6 w-6" />
        </div>
      ) : (
        <div className={cn('flex gap-1', color.replace('bg-', 'text-'))}>
          <PiTrendUp className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
