import { useId, useMemo } from 'react';
import {
  PiBuildings,
  PiShieldCheck,
  PiChartLineUp,
  PiCloudCheck,
  PiPlugsConnected,
} from 'react-icons/pi';

interface Pill {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function StrategicPartnershipVisualization() {
  const gradientId = useId();

  const pills = useMemo<Pill[]>(
    () => [
      { label: 'roadmap', icon: PiChartLineUp },
      { label: 'security', icon: PiShieldCheck },
      { label: 'cloud and data', icon: PiCloudCheck },
      { label: 'integrations', icon: PiPlugsConnected },
    ],
    []
  );

  return (
    <div className="border-border/60 bg-background/40 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md sm:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.35)" />
              <stop offset="55%" stopColor="hsl(var(--secondary) / 0.22)" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.15)" />
            </linearGradient>
          </defs>
          <path
            d="M40 290 C 170 250, 260 170, 400 200 C 540 230, 600 120, 760 120"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M40 300 C 190 280, 260 210, 400 240 C 540 270, 610 160, 760 150"
            fill="none"
            stroke="hsl(var(--border) / 0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary border-primary/20 flex h-12 w-12 items-center justify-center rounded-xl border">
              <PiBuildings className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="text-foreground font-display text-lg font-bold">
                Strategic partnership
              </div>
              <div className="text-muted-foreground text-sm">
                A shared operating model that stays accountable
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {pills.map((pill) => (
              <div
                key={pill.label}
                className="border-border/60 bg-card/40 flex items-center gap-3 rounded-xl border px-4 py-3"
              >
                <pill.icon
                  className="text-primary h-5 w-5"
                  aria-hidden="true"
                />
                <span className="text-foreground text-sm font-medium">
                  {pill.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border/60 bg-card/40 relative overflow-hidden rounded-2xl border p-6 sm:p-8">
          <div className="text-muted-foreground text-xs font-medium">
            what you get
          </div>
          <div className="mt-2 text-2xl font-bold">
            vCIO guidance + deep engineering
          </div>
          <div className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Clear priorities, consistent execution, and a cadence that fits your
            business.
          </div>
          <div className="mt-6 grid gap-3">
            <div className="border-border/60 flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground text-sm">
                quarterly roadmap
              </span>
              <span className="text-foreground text-sm font-semibold">
                included
              </span>
            </div>
            <div className="border-border/60 flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground text-sm">
                security baseline
              </span>
              <span className="text-foreground text-sm font-semibold">
                standard
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                ticket visibility
              </span>
              <span className="text-foreground text-sm font-semibold">
                shared
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
