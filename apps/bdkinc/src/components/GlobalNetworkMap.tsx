import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { CSSProperties } from 'react';
import { PiGlobe, PiDesktop, PiShieldCheck, PiWifiHigh } from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';
import type { PageData } from '@bdkinc/content';

const hover = '@media (hover: hover)';
const md = '@media (min-width: 48rem)';
const motionOK = '@media (prefers-reduced-motion: no-preference)';
const easeOut = 'cubic-bezier(0, 0, 0.2, 1)';
const transition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const colorTransition = 'color, background-color, border-color';

// Tailwind `animate-ping`: scale 1 -> 2 while fading out.
const ping = stylex.keyframes({
  '0%': { transform: 'scale(1)', opacity: 0.75 },
  '75%': { transform: 'scale(2)', opacity: 0 },
  '100%': { transform: 'scale(2)', opacity: 0 },
});

// Tailwind `animate-pulse`: opacity 1 -> 0.5.
const pulse = stylex.keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
});

const styles = stylex.create({
  // Local width replacing the legacy internal `w-full` utility.
  fullWidth: { width: '100%' },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--muted) 20%, transparent)',
    paddingInline: '1.5rem',
    paddingBlock: '1rem',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  globeIcon: { height: '1.25rem', width: '1.25rem', color: 'var(--primary)' },
  headerTitle: {
    color: 'var(--foreground)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    letterSpacing: '0.025em',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    lineHeight: '1rem',
  },
  liveRow: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  liveDot: {
    height: '0.375rem',
    width: '0.375rem',
    borderRadius: '9999px',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 8px #22c55e',
    animationName: { default: 'none', [motionOK]: pulse },
    animationDuration: '2s',
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    animationIterationCount: 'infinite',
  },
  liveText: { color: 'var(--muted-foreground)' },
  shieldRow: {
    display: { default: 'none', [md]: 'flex' },
    alignItems: 'center',
    gap: '0.5rem',
  },
  shieldIcon: { height: '1rem', width: '1rem', color: 'var(--primary)' },
  shieldText: { color: 'var(--muted-foreground)' },
  mapArea: {
    position: 'relative',
    aspectRatio: '21 / 9',
    width: '100%',
    overflow: 'hidden',
    backgroundImage:
      'radial-gradient(circle at center, rgba(0, 212, 255, 0.05) 0%, transparent 100%)',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
  },
  glowOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.2,
  },
  glowCore: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 60%)',
  },
  node: {
    position: 'absolute',
    cursor: 'pointer',
    transform: 'translate(-50%, -50%)',
    '--node-hover': {
      default: '0',
      [hover]: { default: '0', ':hover': '1' },
    },
  },
  pingWave: {
    position: 'absolute',
    inset: 0,
    margin: '-1rem',
    borderRadius: '9999px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 30%, transparent)',
    opacity: 0.75,
    animationName: { default: 'none', [motionOK]: ping },
    animationDuration: '3s',
    animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
    animationIterationCount: 'infinite',
  },
  nodeBox: {
    position: 'relative',
    display: 'flex',
    height: '1.5rem',
    width: '1.5rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)',
    transitionProperty: transition,
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  nodeIdle: {
    borderColor: 'color-mix(in oklab, var(--primary) 50%, transparent)',
    backgroundColor: 'var(--background)',
    scale: 1,
  },
  nodeActive: {
    borderColor: 'var(--primary)',
    backgroundColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    scale: 1.25,
  },
  nodeGlyph: { height: '0.75rem', width: '0.75rem', color: 'var(--primary)' },
  linkLine: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: 1,
    width: 200,
    transformOrigin: 'left',
    transform: 'rotate(-45deg)',
    pointerEvents: 'none',
    backgroundImage:
      'linear-gradient(to right, color-mix(in oklab, var(--primary) 20%, transparent), transparent)',
    opacity: 'var(--node-hover, 0)',
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
    transitionTimingFunction: easeOut,
  },
  tooltip: {
    position: 'absolute',
    top: '2.5rem',
    left: '50%',
    zIndex: 20,
    width: '12rem',
    borderRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 40%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--card) 95%, transparent)',
    padding: '0.75rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(12px)',
    transitionProperty: transition,
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  tooltipHidden: {
    opacity: 0,
    transform: 'translate(-50%, -0.5rem)',
    pointerEvents: 'none',
  },
  tooltipVisible: { opacity: 1, transform: 'translate(-50%, 0)' },
  tipHead: {
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    paddingBottom: '0.25rem',
  },
  tipName: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    lineHeight: '1rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--primary)',
  },
  tipIcon: { height: '0.75rem', width: '0.75rem', color: '#22c55e' },
  // Replaces the legacy `space-y-1` sibling margins with parent gap.
  tipRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    textAlign: 'left',
  },
  tipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.5625rem',
    lineHeight: '0.75rem',
    color: 'var(--muted-foreground)',
  },
  tipValue: { color: 'var(--foreground)' },
  loadTrack: {
    marginTop: '0.25rem',
    height: '0.25rem',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 5%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
  },
  loadFill: {
    height: '100%',
    backgroundColor: 'var(--primary)',
    boxShadow: '0 0 8px rgba(0, 212, 255, 0.5)',
  },
  arcs: {
    position: 'absolute',
    inset: 0,
    height: '100%',
    width: '100%',
    pointerEvents: 'none',
    opacity: 0.3,
  },
  arc: {
    color: 'var(--primary)',
    animationName: { default: 'none', [motionOK]: pulse },
    animationDuration: '2s',
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    animationIterationCount: 'infinite',
  },
  arcDelay1: { animationDelay: '75ms' },
  arcDelay2: { animationDelay: '150ms' },
  footer: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      [md]: 'repeat(4, minmax(0, 1fr))',
    },
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--muted) 20%, transparent)',
  },
  // Replaces the legacy `divide-x` sibling borders.
  footCell: {
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    paddingBlock: '0.75rem',
    textAlign: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    lineHeight: '1rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: {
      default: 'var(--muted-foreground)',
      [hover]: {
        default: 'var(--muted-foreground)',
        ':hover': 'var(--primary)',
      },
    },
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: easeOut,
  },
  footCellFirst: {
    borderLeftWidth: 0,
    paddingBlock: '0.75rem',
    textAlign: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    lineHeight: '1rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: {
      default: 'var(--muted-foreground)',
      [hover]: {
        default: 'var(--muted-foreground)',
        ':hover': 'var(--primary)',
      },
    },
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: easeOut,
  },
});

interface Props {
  copy: PageData<'service-hosted-erp'>['network']['map'];
  className?: string;
  xstyle?: StyleXStyles;
}

export function GlobalNetworkMap({ copy, className, xstyle }: Props) {
  // Editorial marketing figures, not live network telemetry. Topology is code-owned.
  const regions = [
    { ...copy.regions.usEastVirginia, id: 'us-east', lat: 30, lng: 25 },
    { ...copy.regions.usWestOregon, id: 'us-west', lat: 35, lng: 15 },
    { ...copy.regions.euCentralFrankfurt, id: 'eu-cent', lat: 25, lng: 55 },
    { ...copy.regions.asiaPacificTokyo, id: 'asia-east', lat: 35, lng: 85 },
  ];
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  return (
    <TechCard
      variant="technical"
      interactive={false}
      className={className}
      xstyle={[styles.fullWidth, xstyle]}
    >
      {/* Header */}
      <div {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.headerLeft)}>
          <PiGlobe {...stylex.props(styles.globeIcon)} />
          <span {...stylex.props(styles.headerTitle)}>{copy.title}</span>
        </div>
        <div {...stylex.props(styles.headerRight)}>
          <div {...stylex.props(styles.liveRow)}>
            <div {...stylex.props(styles.liveDot)} />
            <span {...stylex.props(styles.liveText)}>{copy.status}</span>
          </div>
          <div {...stylex.props(styles.shieldRow)}>
            <PiShieldCheck {...stylex.props(styles.shieldIcon)} />
            <span {...stylex.props(styles.shieldText)}>
              {copy.shieldStatus}
            </span>
          </div>
        </div>
      </div>
      {/* Map Area */}
      <div {...stylex.props(styles.mapArea)}>
        {/* Abstract Map Grid */}
        <div {...stylex.props(styles.gridOverlay)} />
        {/* World Map Silhouette */}
        <div {...stylex.props(styles.glowOverlay)}>
          <div {...stylex.props(styles.glowCore)} />
        </div>
        {/* Region Nodes */}
        {regions.map((region) => {
          const node = stylex.props(styles.node);
          const load = stylex.props(styles.loadFill);
          return (
            <div
              key={region.id}
              {...node}
              style={
                {
                  ...node.style,
                  left: `${region.lng}%`,
                  top: `${region.lat}%`,
                } as CSSProperties
              }
              onMouseEnter={() => setActiveRegion(region.id)}
              onMouseLeave={() => setActiveRegion(null)}
            >
              {/* Ping Wave Animation */}
              <div {...stylex.props(styles.pingWave)} />
              {/* Node Icon */}
              <div
                {...stylex.props(
                  styles.nodeBox,
                  activeRegion === region.id
                    ? styles.nodeActive
                    : styles.nodeIdle
                )}
              >
                <PiDesktop {...stylex.props(styles.nodeGlyph)} />
              </div>
              {/* Connecting Lines (Decorative) */}
              <div {...stylex.props(styles.linkLine)} />
              {/* Tooltip */}
              <div
                {...stylex.props(
                  styles.tooltip,
                  activeRegion === region.id
                    ? styles.tooltipVisible
                    : styles.tooltipHidden
                )}
              >
                <div {...stylex.props(styles.tipHead)}>
                  <span {...stylex.props(styles.tipName)}>{region.name}</span>
                  <PiWifiHigh {...stylex.props(styles.tipIcon)} />
                </div>
                <div {...stylex.props(styles.tipRows)}>
                  <div {...stylex.props(styles.tipRow)}>
                    <span>{copy.latencyLabel}</span>
                    <span {...stylex.props(styles.tipValue)}>
                      {copy.latencyValue}
                    </span>
                  </div>
                  <div {...stylex.props(styles.tipRow)}>
                    <span>{copy.loadLabel}</span>
                    <span {...stylex.props(styles.tipValue)}>
                      {region.load}%
                    </span>
                  </div>
                  <div {...stylex.props(styles.loadTrack)}>
                    <div
                      {...load}
                      style={
                        {
                          ...load.style,
                          width: `${Math.min(100, Math.max(0, region.load))}%`,
                        } as CSSProperties
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Connection Arcs (SVG) */}
        <svg
          {...stylex.props(styles.arcs)}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 25 30 Q 40 10 55 25"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            {...stylex.props(styles.arc)}
          />
          <path
            d="M 55 25 Q 70 40 85 35"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            {...stylex.props(styles.arc, styles.arcDelay1)}
          />
          <path
            d="M 15 35 Q 20 50 25 30"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            {...stylex.props(styles.arc, styles.arcDelay2)}
          />
        </svg>
      </div>
      {/* Footer Stats */}
      <div {...stylex.props(styles.footer)}>
        {[
          copy.assurances.item99999Uptime,
          copy.assurances.terabitBackbone,
          copy.assurances.iso27001,
          copy.assurances.item247Noc,
        ].map((stat, i) => (
          <div
            key={i}
            {...stylex.props(i === 0 ? styles.footCellFirst : styles.footCell)}
          >
            {stat}
          </div>
        ))}
      </div>
    </TechCard>
  );
}
