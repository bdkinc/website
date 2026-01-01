import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiDesktop, PiHeadset, PiPulse } from 'react-icons/pi';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export default function ManagedITVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ecgScanRef = useRef<SVGPathElement>(null);

  useGSAP(
    (context) => {
      // Radar Sweep (Spin)
      gsap.to('.radar-sweep', {
        rotation: 360,
        duration: 3,
        repeat: -1,
        ease: 'linear',
      });

      // ECG Line Animation (Scan effect like hospital monitor)
      if (ecgScanRef.current) {
        const pathLength = ecgScanRef.current.getTotalLength();
        ecgScanRef.current.style.strokeDasharray = pathLength.toString();
        ecgScanRef.current.style.strokeDashoffset = pathLength.toString();

        gsap.to(ecgScanRef.current, {
          strokeDashoffset: 0,
          duration: 2.5,
          repeat: -1,
          ease: 'none',
        });
      }

      // Status dot pulse - Removed
      // gsap.to('.status-dot', {
      //   scale: 1.3,
      //   opacity: 1,
      //   duration: 0.6,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: 'power1.inOut',
      // });

      return () => {
        // Cleanup
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="border-primary/20 bg-background/40 relative w-full overflow-hidden rounded-xl border px-8 pt-24 pb-8 backdrop-blur-md"
    >
      {/* ECG Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
        <svg
          className="h-20 w-full"
          preserveAspectRatio="none"
          viewBox="0 0 1000 100"
        >
          <defs>
            <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Base line - always visible */}
          <path
            d="M0,50 L140,50 L145,55 L155,5 L165,95 L170,50 L185,35 L200,50 L440,50 L445,55 L455,5 L465,95 L470,50 L485,35 L500,50 L740,50 L745,55 L755,5 L765,95 L770,50 L785,35 L800,50 L1000,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary"
            opacity="0.2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Scanning line - hospital monitor effect */}
          <path
            ref={ecgScanRef}
            d="M0,50 L140,50 L145,55 L155,5 L165,95 L170,50 L185,35 L200,50 L440,50 L445,55 L455,5 L465,95 L470,50 L485,35 L500,50 L740,50 L745,55 L755,5 L765,95 L770,50 L785,35 L800,50 L1000,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-primary ecg-scan"
            strokeLinecap="round"
            filter="drop-shadow(0 0 8px currentColor)"
            vectorEffect="non-scaling-stroke"
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

        {/* Node 2: Proactive Monitoring */}
        <div className="relative flex flex-col items-center">
          <div className="border-primary bg-background/80 relative z-20 flex h-24 w-24 items-center justify-center rounded-full border-2 shadow-lg backdrop-blur-xl">
            {/* Radar Sweep */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="radar-sweep via-primary/20 to-primary/40 absolute inset-0 left-0 h-full w-1/2 origin-right bg-gradient-to-r from-transparent from-0% via-50% to-100%"></div>
            </div>
            <PiPulse className="text-primary relative z-10 h-10 w-10" />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-primary text-lg font-bold">
              24/7 Monitoring
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              Proactive Health Check
            </div>
          </div>
        </div>

        {/* Node 3: Expert Support */}
        <Node
          icon={PiHeadset}
          label="Expert Support"
          sublabel="Instant Resolution"
          color="accent"
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
