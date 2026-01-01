import { useMemo } from 'react';
import {
  PiUsersThree,
  PiUserGear,
  PiHeadphones,
  PiShieldCheck,
  PiArrowsClockwise,
  PiChartLineUp,
} from 'react-icons/pi';

interface LaneItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function TeamAugmentationDiagram() {
  const internal = useMemo<LaneItem[]>(
    () => [
      { label: 'business apps', icon: PiUserGear },
      { label: 'ownership and strategy', icon: PiChartLineUp },
    ],
    []
  );

  const bdk = useMemo<LaneItem[]>(
    () => [
      { label: 'service desk', icon: PiHeadphones },
      { label: 'patching and change', icon: PiArrowsClockwise },
      { label: 'security operations', icon: PiShieldCheck },
    ],
    []
  );

  return (
    <div className="border-border/60 bg-background/40 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md sm:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
      >
        <div className="from-primary/10 via-secondary/10 absolute inset-0 bg-linear-to-br to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary border-primary/20 flex h-12 w-12 items-center justify-center rounded-xl border">
            <PiUsersThree className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-foreground font-display text-lg font-bold">
              Co‑managed operating model
            </div>
            <div className="text-muted-foreground text-sm">
              Clear handoffs, shared visibility, and aligned outcomes
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <Lane
            title="Your team"
            subtitle="what stays with you"
            items={internal}
          />

          <div className="hidden flex-col items-center justify-center lg:flex">
            <div className="bg-border/60 h-full w-px" />
          </div>

          <Lane
            title="BDKinc"
            subtitle="what we run day to day"
            items={bdk}
            tone="primary"
          />
        </div>

        <div className="border-border/60 mt-8 border-t pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MiniOutcome label="faster resolution" value="shared runbooks" />
            <MiniOutcome label="less noise" value="proactive monitoring" />
            <MiniOutcome label="better decisions" value="quarterly reviews" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Lane({
  title,
  subtitle,
  items,
  tone = 'secondary',
}: {
  title: string;
  subtitle: string;
  items: LaneItem[];
  tone?: 'primary' | 'secondary';
}) {
  const headerTone =
    tone === 'primary'
      ? 'from-primary/18 to-primary/6 border-primary/20'
      : 'from-secondary/18 to-secondary/6 border-secondary/20';

  return (
    <div className="border-border/60 bg-card/40 overflow-hidden rounded-2xl border">
      <div className={`bg-linear-to-br ${headerTone} border-b px-6 py-5`}>
        <div className="text-foreground font-display text-base font-bold">
          {title}
        </div>
        <div className="text-muted-foreground text-sm">{subtitle}</div>
      </div>

      <div className="p-6">
        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="border-border/60 flex items-center gap-3 border-b pb-3 last:border-b-0 last:pb-0"
            >
              <item.icon
                className={
                  tone === 'primary'
                    ? 'text-primary h-5 w-5'
                    : 'text-secondary h-5 w-5'
                }
                aria-hidden="true"
              />
              <span className="text-foreground text-sm font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniOutcome({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border/60 flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0 md:border-r md:border-b-0 md:pr-4 md:pb-0 md:last:border-r-0 md:last:pr-0">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="text-foreground text-sm font-semibold">{value}</div>
    </div>
  );
}
