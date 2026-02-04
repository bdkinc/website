import { cn } from '@/lib/utils';
import { TechCard } from '@/components/TechCard';
import {
  PiPulse,
  PiCheckCircle,
  PiArrowUpRight,
  PiArrowDownLeft,
  PiArrowsClockwise,
  PiClock,
} from 'react-icons/pi';

export default function TransactionConsole() {
  return (
    <div className="w-full space-y-6">
      <div className="border-border/50 flex flex-col items-start justify-between gap-4 border-b pb-4 md:flex-row md:items-center">
        <div className="text-left">
          <h2 className="font-display text-foreground text-2xl font-bold tracking-tight">
            Managed Operations Console
          </h2>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="font-mono text-xs tracking-widest">
              Live Monitoring Active
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge label="Uptime: 99.99%" active />
          <Badge label="Queue: Clear" active />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Feed */}
        <div className="lg:col-span-2">
          <TechCard
            variant="technical"
            interactive={false}
            metadata="TRANSACTION_STREAM.LOG"
            className="h-full"
          >
            <div className="border-primary/10 bg-muted/20 flex items-center justify-between border-b px-4 py-2">
              <span className="text-primary/60 font-mono text-[10px] font-bold tracking-widest">
                Live Data Feed
              </span>
              <PiArrowsClockwise className="text-primary animate-spin-slow h-3 w-3" />
            </div>
            <div className="relative h-[400px] overflow-hidden p-0 text-left">
              <div className="divide-primary/5 space-y-0 divide-y">
                <TransactionRow
                  id="TRX-8992-01"
                  type="850 Purchase Order"
                  partner="Walmart Inc."
                  status="success"
                  time="0s ago"
                  direction="in"
                />
                <TransactionRow
                  id="TRX-8992-00"
                  type="997 Functional Ack"
                  partner="Target Corp"
                  status="success"
                  time="2s ago"
                  direction="out"
                />
                <TransactionRow
                  id="TRX-8991-99"
                  type="810 Invoice"
                  partner="Amazon Vendor"
                  status="success"
                  time="5s ago"
                  direction="out"
                />
                <TransactionRow
                  id="TRX-8991-98"
                  type="856 Advance Ship"
                  partner="Home Depot"
                  status="processing"
                  time="8s ago"
                  direction="out"
                />
                <TransactionRow
                  id="TRX-8991-97"
                  type="850 Purchase Order"
                  partner="Kroger Co."
                  status="success"
                  time="12s ago"
                  direction="in"
                />
                <TransactionRow
                  id="TRX-8991-96"
                  type="846 Inventory"
                  partner="Best Buy"
                  status="success"
                  time="15s ago"
                  direction="out"
                />
              </div>

              {/* Fade out bottom */}
              <div className="from-background/80 pointer-events-none absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t to-transparent"></div>
            </div>
          </TechCard>
        </div>

        {/* Metrics Panel */}
        <div className="space-y-6">
          <MetricCard
            label="Throughput"
            value="1,240"
            unit="tpm"
            trend="+12%"
            icon={PiPulse}
            meta="FLOW_RATE"
          />
          <MetricCard
            label="Success Rate"
            value="99.99"
            unit="%"
            trend="+0.01%"
            icon={PiCheckCircle}
            color="text-green-500"
            meta="INTEGRITY"
          />
          <MetricCard
            label="Avg Latency"
            value="45"
            unit="ms"
            trend="-5ms"
            icon={PiClock}
            meta="DELAY_O"
          />

          <TechCard
            variant="technical"
            interactive={false}
            metadata="PROTOCOL_DENSITY"
            className="bg-muted/10 p-4"
          >
            <div className="p-4 text-left">
              <h4 className="text-primary/60 mb-4 font-mono text-[10px] font-bold tracking-widest">
                Active Protocols
              </h4>
              <div className="space-y-3">
                <ProgressBar label="AS2" percent={85} />
                <ProgressBar label="SFTP" percent={45} />
                <ProgressBar label="REST API" percent={30} />
              </div>
            </div>
          </TechCard>
        </div>
      </div>
    </div>
  );
}

function Badge({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center rounded-none border px-2 py-1 font-mono text-[10px] font-medium tracking-widest',
        active
          ? 'border-primary/30 bg-primary/10 text-primary shadow-[0_0_8px_rgba(0,212,255,0.2)]'
          : 'border-border bg-muted text-muted-foreground'
      )}
    >
      {label}
    </div>
  );
}

function TransactionRow({ id, type, partner, status, time, direction }: any) {
  return (
    <div className="hover:bg-primary/5 group/row flex items-center justify-between p-4 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-none border transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300',
            direction === 'in'
              ? 'border-secondary/30 text-secondary bg-secondary/5'
              : 'border-primary/30 text-primary bg-primary/5'
          )}
        >
          {direction === 'in' ? (
            <PiArrowDownLeft className="h-4 w-4" />
          ) : (
            <PiArrowUpRight className="h-4 w-4" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-foreground group-hover/row:text-primary font-mono text-xs font-bold transition-colors">
              {type}
            </span>
            <span className="border-primary/10 text-muted-foreground border px-1.5 py-0.5 font-mono text-[9px]">
              {id}
            </span>
          </div>
          <div className="text-muted-foreground text-[10px] tracking-wider">
            {partner}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {status === 'success' && (
            <PiCheckCircle className="h-3 w-3 text-green-500" />
          )}
          {status === 'processing' && (
            <PiArrowsClockwise className="h-3 w-3 animate-spin text-blue-500" />
          )}
          <span
            className={cn(
              'font-mono text-[10px] font-bold tracking-widest',
              status === 'success' ? 'text-green-500' : 'text-blue-500'
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <div className="text-muted-foreground w-12 text-right font-mono text-[10px]">
          {time}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  trend,
  icon: Icon,
  color = 'text-primary',
  meta,
}: any) {
  return (
    <TechCard
      variant="technical"
      interactive
      delay={0}
      metadata={meta}
      className="bg-background/60"
    >
      <div className="p-4 text-left">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-muted-foreground font-mono text-[10px] tracking-widest">
              {label}
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-foreground group-hover:text-primary text-2xl font-bold transition-colors">
                {value}
              </span>
              <span className="text-muted-foreground font-mono text-[10px]">
                {unit}
              </span>
            </div>
          </div>
          <div
            className={cn(
              'border-primary/10 bg-primary/5 group-hover:border-primary/30 rounded-lg border p-2 transition-colors',
              color
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-center font-mono text-[10px] text-green-500">
          <PiArrowUpRight className="mr-1 h-3 w-3" />
          {trend} {'// Peak Stability'}
        </div>
      </div>
    </TechCard>
  );
}

function ProgressBar({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="group">
      <div className="text-muted-foreground mb-1 flex items-center justify-between text-[10px]">
        <span className="font-mono tracking-widest">{label}</span>
        <span className="font-mono">{percent}%</span>
      </div>
      <div className="bg-primary/5 border-primary/10 h-1.5 w-full overflow-hidden rounded-none border">
        <div
          className="bg-primary group-hover:bg-brand-accent h-full shadow-[0_0_8px_rgba(0,212,255,0.4)] transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-1000"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
