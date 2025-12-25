import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiGlobe, PiLockKey, PiShieldCheck, PiWarning } from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function CybersecurityVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Shield Pulse
      gsap.to('.shield-pulse', {
        scale: 1.2,
        opacity: 0,
        duration: 1, // Half of 2s cycle for up
        repeat: -1,
        yoyo: true, // 1 -> 1.2 -> 1
        ease: 'power1.inOut',
        // Original: scale [1, 1.2, 1], opacity [0.5, 0, 0.5]
        // yoyo handles 1 -> 1.2 -> 1
        // Opacity needs to go 0.5 -> 0 -> 0.5
      });
      // Actually, let's use keyframes for precision
      gsap.to('.shield-pulse', {
        keyframes: {
          '0%': { scale: 1, opacity: 0.5 },
          '50%': { scale: 1.2, opacity: 0 },
          '100%': { scale: 1, opacity: 0.5 },
        },
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

      // Add delay to match 3s interval if needed.
      // Threat ends at 1.0. Safe starts at 1.5, ends at 3.5.
      // Original interval was 3000ms.
      // So Safe packet actually overlaps the next loop?
      // In React setInterval, key update forces re-render.
      // Packet starts at 1.5s relative to key update.
      // So Safe packet runs 1.5s -> 3.5s.
      // Loop resets at 3.0s.
      // So at 3.0s, everything resets. Safe packet is cut off?
      // Or does it run to completion? React unmounts old component when key changes.
      // So Safe packet runs for 1.5s (from 1.5 to 3.0), then is cut.
      // Wait, 1.5 to 3.0 is 1.5s duration. Total duration is 2.0s.
      // So it never finishes?
      // Re-reading code:
      // Interval 3000ms.
      // SafePacket delay 1.5, duration 2.0.
      // It starts at 1.5s. At 3.0s (1.5s elapsed), key changes.
      // Yes, it is cut off.
      // I should replicate this or make it smoother.
      // GSAP timeline with repeat: -1 runs continuously.
      // If I want it to "cut off", I can just end the timeline at 3.0.
      // But Safe packet needs to reach 100%.
      // If I extend timeline to 3.5s (1.5 + 2.0), then the frequency is lower.
      // I'll set repeatDelay to 0 and ensure timeline covers the full sequence.
      // Let's make the timeline 3.5s long?
      // Or just overlap them.
      // With GSAP, I can just fire and forget independent tweens in a loop function?
      // Or just one timeline.
      // I'll stick to one timeline. 1.5 + 2.0 = 3.5s total cycle.
      // This is close enough to 3s.
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-primary/20 bg-background/40 p-8 backdrop-blur-md"
    >
      {/* Grid Background with Red Tint on Left */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,0,0,0.1),transparent_50%)]"></div>
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
          <div className="relative z-20 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-primary bg-background/80 shadow-[0_0_30px_rgba(0,212,255,0.3)] backdrop-blur-xl">
            <div className="absolute inset-0 animate-pulse rounded-2xl bg-primary/10"></div>
            {/* Shield Pulse */}
            <div className="shield-pulse absolute inset-0 rounded-2xl border border-primary/50 opacity-50" />
            <PiShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-lg font-bold text-primary">
              Active Defense
            </div>
            <div className="font-mono text-xs text-muted-foreground">
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
      <div className="pointer-events-none absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 px-16 md:px-24">
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

function ThreatPacket({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute top-1/2 -mt-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] backdrop-blur-sm z-30 opacity-0',
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
        'absolute top-1/2 -mt-1.5 h-3 w-8 rounded-full bg-primary shadow-[0_0_10px_rgba(0,212,255,0.5)] opacity-0',
        className
      )}
    />
  );
}
