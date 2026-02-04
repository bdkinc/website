import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PiGlobe, PiDesktop, PiShieldCheck, PiWifiHigh } from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';

const regions = [
  {
    id: 'us-east',
    name: 'US East (Virginia)',
    lat: 30,
    lng: 25,
    status: 'operational',
    load: 42,
  },
  {
    id: 'us-west',
    name: 'US West (Oregon)',
    lat: 35,
    lng: 15,
    status: 'operational',
    load: 38,
  },
  {
    id: 'eu-cent',
    name: 'EU Central (Frankfurt)',
    lat: 25,
    lng: 55,
    status: 'operational',
    load: 65,
  },
  {
    id: 'asia-east',
    name: 'Asia Pacific (Tokyo)',
    lat: 35,
    lng: 85,
    status: 'operational',
    load: 51,
  },
];

export function GlobalNetworkMap() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  return (
    <TechCard
      variant="technical"
      interactive={false}
      metadata="GLOBAL_AVAILABILITY_NET"
      className="w-full"
    >
      {/* Header */}
      <div className="border-primary/10 bg-muted/20 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <PiGlobe className="text-primary h-5 w-5" />
          <span className="font-display text-foreground font-bold tracking-wider">
            Global Availability Net
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
            <span className="text-muted-foreground">Status: Optimal</span>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <PiShieldCheck className="text-primary h-4 w-4" />
            <span className="text-muted-foreground">Shield: Active</span>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative aspect-[21/9] w-full overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(0,212,255,0.05)_0%,_transparent_100%)]">
        {/* Abstract Map Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] bg-[size:40px_40px]" />

        {/* World Map Silhouette */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,212,255,0.1)_0%,_transparent_60%)]" />
        </div>

        {/* Region Nodes */}
        {regions.map((region) => (
          <div
            key={region.id}
            className="group/node absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
            style={{ left: `${region.lng}%`, top: `${region.lat}%` }}
            onMouseEnter={() => setActiveRegion(region.id)}
            onMouseLeave={() => setActiveRegion(null)}
          >
            {/* Ping Wave Animation */}
            <div className="border-primary/30 absolute inset-0 -m-4 animate-ping rounded-full border opacity-75 duration-[3s]" />

            {/* Node Icon */}
            <div
              className={cn(
                'border-primary/50 bg-background relative flex h-6 w-6 items-center justify-center rounded-none border shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300',
                activeRegion === region.id
                  ? 'border-primary bg-primary/20 scale-125'
                  : ''
              )}
            >
              <PiDesktop className="text-primary h-3 w-3" />
            </div>

            {/* Connecting Lines (Decorative) */}
            <div className="from-primary/20 pointer-events-none absolute top-1/2 left-1/2 h-[1px] w-[200px] origin-left -rotate-45 bg-gradient-to-r to-transparent opacity-0 transition-opacity group-hover/node:opacity-100" />

            {/* Tooltip */}
            <div
              className={cn(
                'border-primary/40 bg-card/95 absolute top-10 left-1/2 z-20 w-48 -translate-x-1/2 rounded-none border p-3 shadow-2xl backdrop-blur-md transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300',
                activeRegion === region.id
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none -translate-y-2 opacity-0'
              )}
            >
              <div className="border-primary/20 mb-2 flex items-center justify-between border-b pb-1">
                <span className="text-primary font-mono text-[10px] font-bold tracking-widest">
                  {region.name}
                </span>
                <PiWifiHigh className="h-3 w-3 text-green-500" />
              </div>
              <div className="space-y-1 text-left">
                <div className="text-muted-foreground flex justify-between font-mono text-[9px]">
                  <span>Latency</span>
                  <span className="text-foreground">12ms</span>
                </div>
                <div className="text-muted-foreground flex justify-between font-mono text-[9px]">
                  <span>System Load</span>
                  <span className="text-foreground">{region.load}%</span>
                </div>
                <div className="bg-primary/10 border-primary/5 mt-1 h-1 w-full overflow-hidden rounded-none border">
                  <div
                    className="bg-primary h-full shadow-[0_0_8px_rgba(0,212,255,0.5)]"
                    style={{ width: `${region.load}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Connection Arcs (SVG) */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 25 30 Q 40 10 55 25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary animate-pulse"
          />
          <path
            d="M 55 25 Q 70 40 85 35"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary animate-pulse delay-75"
          />
          <path
            d="M 15 35 Q 20 50 25 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary animate-pulse delay-150"
          />
        </svg>
      </div>

      {/* Footer Stats */}
      <div className="divide-primary/10 border-primary/10 bg-muted/20 grid grid-cols-2 divide-x border-t md:grid-cols-4">
        {['99.999% Uptime', 'Terabit Backbone', 'ISO 27001', '24/7 NOC'].map(
          (stat, i) => (
            <div
              key={i}
              className="text-muted-foreground hover:text-primary py-3 text-center font-mono text-[10px] font-bold tracking-widest transition-colors"
            >
              {stat}
            </div>
          )
        )}
      </div>
    </TechCard>
  );
}
