import { useRef } from 'react';
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
      className="border-primary/20 bg-background/40 relative w-full overflow-hidden rounded-xl border p-8 backdrop-blur-md"
    >
      {/* Grid Background */}
      <div className="analytics-grid absolute inset-0 z-0 opacity-10">
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
          <div className="border-secondary bg-background/80 relative z-20 flex h-24 w-24 items-center justify-center rounded-xl border-2 shadow-lg backdrop-blur-xl">
            <div className="bg-secondary/10 absolute inset-0 rounded-xl"></div>
            <PiFunnel className="text-secondary h-10 w-10" />
            {/* Falling particles effect inside */}
            <div className="absolute top-2 flex w-full justify-center gap-1 opacity-50">
              <div className="falling-1 bg-secondary h-1 w-1 rounded-full" />
              <div className="falling-2 bg-secondary h-1 w-1 rounded-full" />
              <div className="falling-3 bg-secondary h-1 w-1 rounded-full" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-secondary text-lg font-bold">
              Processing
            </div>
            <div className="text-muted-foreground font-mono text-xs">
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
      <div className="pointer-events-none absolute top-1/2 left-0 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Raw Data Packet */}
        <ChartPacket className="packet-raw" color="bg-primary" type="raw" />

        {/* Refined Data Packet */}
        <ChartPacket className="packet-chart" color="bg-accent" type="chart" />
      </div>

      {/* Floating Stats Background */}
      <div className="pointer-events-none absolute top-4 right-8 flex flex-col gap-1 opacity-20">
        <div className="stat-bar bg-primary h-1 w-16 origin-left rounded"></div>
        <div className="stat-bar bg-primary h-1 w-10 origin-left rounded"></div>
        <div className="stat-bar bg-primary h-1 w-24 origin-left rounded"></div>
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

function PipelineConduit() {
  return (
    <div className="bg-muted/20 relative hidden h-2 flex-1 overflow-hidden rounded-full md:block">
      <div className="bg-border absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2"></div>
      <div className="pipeline-shimmer absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,hsl(var(--primary)/0.10),transparent)] bg-[length:50%_100%]"></div>
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
    <div className={cn('absolute top-1/2 z-30 -mt-4 opacity-0', className)}>
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
