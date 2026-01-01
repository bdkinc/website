import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiGlobe, PiLockKey, PiShieldCheck, PiWarning } from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function CybersecurityVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Conduit Shimmer
      gsap.to('.conduit-shimmer', {
        x: '100%',
        duration: 2,
        repeat: -1,
        ease: 'linear',
      });

      const tl = gsap.timeline({ repeat: -1 }); // 3s loop

      // Threat Packet (Blocked)
      tl.fromTo(
        '.packet-threat',
        { left: '0%', opacity: 0, scale: 0.5 },
        {
          left: '50%',
          opacity: 1,
          scale: 1, // Shrink to 0 at end? Original: scale [0.5, 1, 0, 0]
          // Let's use keyframes
          keyframes: {
            '0%': { opacity: 0, scale: 0.5 },
            '50%': { opacity: 1, scale: 1 },
            '80%': { opacity: 1, scale: 0 },
            '100%': { opacity: 0, scale: 0 },
          },
          duration: 1.0,
          ease: 'linear',
        },
        0
      );

      // Safe Packet (Allowed)
      tl.fromTo(
        '.packet-safe',
        { left: '0%', opacity: 0, scale: 0.5 },
        {
          left: '100%',
          opacity: 1,
          scale: 1,
          duration: 2.0,
          ease: 'power1.inOut',
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
      className="border-primary/20 bg-background/40 relative w-full overflow-hidden rounded-xl border p-8 backdrop-blur-md"
    >
      {/* Grid Background with Red Tint on Left */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted))_0%,transparent_55%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
        {/* Node 1: External Network */}
        <Node
          icon={PiGlobe}
          label="External Network"
          sublabel="Public Internet"
          color="secondary"
        />

        <Conduit />

        {/* Node 2: Active Defense */}
        <div className="relative flex flex-col items-center">
          <div className="border-primary bg-background/80 relative z-20 flex h-24 w-24 items-center justify-center rounded-2xl border-2 shadow-lg backdrop-blur-xl">
            <div className="bg-primary/8 absolute inset-0 rounded-2xl" />
            <PiShieldCheck className="text-primary h-12 w-12" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-primary text-lg font-bold">
              Active Defense
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              Threat Neutralized
            </div>
          </div>
        </div>

        <Conduit />

        {/* Node 3: Secure Core */}
        <Node
          icon={PiLockKey}
          label="Secure Core"
          sublabel="Protected Assets"
          color="accent"
        />
      </div>

      {/* Threats and Safe Traffic */}
      <div className="pointer-events-none absolute top-1/2 left-0 h-20 w-full -translate-y-1/2 px-16 md:px-24">
        {/* Threat Packet (Blocked) */}
        <ThreatPacket className="packet-threat" />

        {/* Safe Packet (Allowed) */}
        <SafePacket className="packet-safe" />
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
      <div className="conduit-shimmer absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.1),transparent)] bg-[length:50%_100%]"></div>
    </div>
  );
}

function ThreatPacket({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'border-border bg-card/70 text-muted-foreground absolute top-1/2 z-30 -mt-3 flex h-6 w-6 items-center justify-center rounded-full border opacity-0 shadow-sm backdrop-blur-sm',
        className
      )}
    >
      <PiWarning className="h-4 w-4" />
    </div>
  );
}

function SafePacket({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-primary/80 absolute top-1/2 -mt-1.5 h-3 w-8 rounded-full opacity-0 shadow-sm',
        className
      )}
    />
  );
}
