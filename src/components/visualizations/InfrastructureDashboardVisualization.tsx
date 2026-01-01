import { useId, useMemo } from 'react';
import {
  PiStackSimple,
  PiHardDrives,
  PiCloud,
  PiShieldCheck,
  PiGauge,
  PiArrowsClockwise,
} from 'react-icons/pi';

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'primary' | 'secondary' | 'accent';
}

export default function InfrastructureDashboardVisualization() {
  const barsId = useId();

  const stats = useMemo<Stat[]>(
    () => [
      {
        label: 'patch compliance',
        value: '98%',
        icon: PiArrowsClockwise,
        tone: 'primary',
      },
      {
        label: 'backup success',
        value: '99.5%',
        icon: PiHardDrives,
        tone: 'secondary',
      },
      {
        label: 'security health',
        value: 'strong',
        icon: PiShieldCheck,
        tone: 'accent',
      },
      {
        label: 'capacity headroom',
        value: '32%',
        icon: PiGauge,
        tone: 'primary',
      },
    ],
    []
  );

  return (
    <div className="border-border/60 bg-background/40 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md sm:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 800 360"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={barsId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.08)" />
              <stop offset="50%" stopColor="hsl(var(--secondary) / 0.08)" />
              <stop offset="100%" stopColor="hsl(var(--brand-accent) / 0.08)" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="800" height="360" fill={`url(#${barsId})`} />
          <path
            d="M0 280 L120 240 L220 250 L320 190 L420 210 L520 140 L620 170 L800 120"
            fill="none"
            stroke="hsl(var(--primary) / 0.35)"
            strokeWidth="2"
          />
          <path
            d="M0 300 L120 270 L220 280 L320 220 L420 240 L520 170 L620 200 L800 160"
            fill="none"
            stroke="hsl(var(--secondary) / 0.28)"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary border-primary/20 flex h-12 w-12 items-center justify-center rounded-xl border">
              <PiStackSimple className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="text-foreground font-display text-lg font-bold">
                Infrastructure and operations
              </div>
              <div className="text-muted-foreground text-sm">
                Monitoring, patching, backups, and change control
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <PiCloud
              className="text-muted-foreground h-5 w-5"
              aria-hidden="true"
            />
            <span className="text-muted-foreground text-xs font-medium">
              hybrid ready
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-border/60 bg-card/40 rounded-2xl border p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={
                      stat.tone === 'primary'
                        ? 'bg-primary/10 text-primary'
                        : stat.tone === 'secondary'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-[color:oklch(var(--brand-accent)/0.12)] text-[color:oklch(var(--brand-accent))]'
                    }
                  >
                    <div className="border-border/60 flex h-10 w-10 items-center justify-center rounded-xl border">
                      <stat.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-muted-foreground text-xs font-medium">
                    {stat.label}
                  </div>
                </div>
                <div className="text-foreground text-lg font-bold">
                  {stat.value}
                </div>
              </div>
              <div className="bg-border/40 mt-4 h-2 w-full overflow-hidden rounded-full">
                <div
                  className={
                    stat.tone === 'primary'
                      ? 'bg-primary/50 h-full w-[78%] rounded-full'
                      : stat.tone === 'secondary'
                        ? 'bg-secondary/45 h-full w-[84%] rounded-full'
                        : 'h-full w-[72%] rounded-full bg-[color:oklch(var(--brand-accent)/0.45)]'
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-muted-foreground mt-6 text-xs">
          Example dashboard view. Metrics shown for illustration.
        </div>
      </div>
    </div>
  );
}
