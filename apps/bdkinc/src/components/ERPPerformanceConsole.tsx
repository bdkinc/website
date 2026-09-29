import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import {
  PiPulse,
  PiCaretRight,
  PiNetwork,
  PiCpu,
  PiHeadphones,
} from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';

const sm = '@media (min-width: 40rem)';
const md = '@media (min-width: 48rem)';
const motionOK = '@media (prefers-reduced-motion: no-preference)';
const easeOut = 'cubic-bezier(0, 0, 0.2, 1)';
const transition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const colorTransition = 'color, background-color, border-color';

// Tailwind `animate-pulse`: opacity 1 -> 0.5.
const pulse = stylex.keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
});

const systemStats = [
  { label: 'Infrastructure Health', value: 'Optimal', color: 'text-green-500' },
  { label: 'Resource Allocation', value: 'Dynamic', color: 'text-primary' },
  { label: 'Threat Detection', value: 'Active', color: 'text-primary' },
];

const styles = stylex.create({
  root: { width: '100%' },
  consoleBar: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: { default: 'column', [md]: 'row' },
    gap: '1.5rem',
    alignItems: { default: null, [md]: 'center' },
    justifyContent: { default: null, [md]: 'space-between' },
    borderRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--card) 40%, transparent)',
    padding: '1.5rem',
    backdropFilter: 'blur(4px)',
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  pulseIconBox: {
    position: 'relative',
    display: 'flex',
    height: '3.5rem',
    width: '3.5rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 30%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    boxShadow: '0 0 15px rgba(0, 212, 255, 0.2)',
  },
  pulseIcon: {
    height: '1.75rem',
    width: '1.75rem',
    color: 'var(--primary)',
    animationName: { default: 'none', [motionOK]: pulse },
    animationDuration: '2s',
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    animationIterationCount: 'infinite',
  },
  liveDot: {
    position: 'absolute',
    top: '-0.25rem',
    right: '-0.25rem',
    height: '0.75rem',
    width: '0.75rem',
    borderRadius: '9999px',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 5px #22c55e',
  },
  brandText: { textAlign: 'left' },
  consoleTitle: {
    color: 'var(--foreground)',
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  statusRow: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  statusDot: {
    height: '0.375rem',
    width: '0.375rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--primary)',
    animationName: { default: 'none', [motionOK]: pulse },
    animationDuration: '2s',
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    animationIterationCount: 'infinite',
  },
  statusText: {
    color: 'var(--muted-foreground)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  statsGrid: {
    display: 'grid',
    gap: { default: '1rem', [sm]: '2rem' },
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      [sm]: 'repeat(3, minmax(0, 1fr))',
    },
  },
  statCell: {
    borderLeftWidth: 2,
    borderLeftStyle: 'solid',
    borderLeftColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    paddingLeft: '1rem',
    textAlign: 'left',
  },
  statLabel: {
    marginBottom: '0.25rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    lineHeight: '1rem',
    letterSpacing: '0.1em',
    color: 'var(--muted-foreground)',
  },
  statValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 700,
  },
  statGreen: { color: '#22c55e' },
  statPrimary: { color: 'var(--primary)' },
  capGrid: {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      [md]: 'repeat(3, minmax(0, 1fr))',
    },
  },
  capBody: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    padding: '1.5rem',
    textAlign: 'left',
  },
  capTop: {
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  // TechCard drives --tech-hover-opacity to 1 while hovered (the old `group-hover:`).
  capIcon: {
    display: 'flex',
    height: '3rem',
    width: '3rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    boxShadow:
      '0 0 0 1px color-mix(in oklab, var(--primary) calc(20% + 20% * var(--tech-hover-opacity, 0)), transparent)',
    backgroundColor:
      'color-mix(in oklab, var(--primary) calc(10% + 10% * var(--tech-hover-opacity, 0)), transparent)',
    // group-hover:scale-110 sets the individual `scale` property, which is not in the transition list.
    scale: 'calc(1 + 0.1 * var(--tech-hover-opacity, 0))',
    transitionProperty: transition,
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  capIconGlyph: { height: '1.5rem', width: '1.5rem', color: 'var(--primary)' },
  capStatCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.25rem',
    textAlign: 'right',
  },
  capStat: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    lineHeight: '1rem',
    color: 'var(--muted-foreground)',
  },
  capTitle: {
    marginBottom: '0.75rem',
    color: 'var(--tech-title-color, var(--foreground))',
    fontFamily: 'var(--font-display)',
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: easeOut,
  },
  capDesc: {
    marginBottom: '1.5rem',
    flexGrow: 1,
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: 1.625,
  },
  capCta: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    lineHeight: '1rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--primary)',
    opacity: 'var(--tech-hover-opacity, 0)',
    transform: 'translateX(calc(0.5rem * var(--tech-hover-opacity, 0)))',
    transitionProperty: transition,
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  capCtaIcon: { marginLeft: '0.25rem', height: '0.75rem', width: '0.75rem' },
});

interface ERPPerformanceConsoleProps {
  xstyle?: StyleXStyles;
}

export function ERPPerformanceConsole({ xstyle }: ERPPerformanceConsoleProps) {
  const capabilities = [
    {
      title: 'High-Performance Hosting',
      desc: 'Dedicated, single-tenant environments optimized for ERP workloads. Achieve 99.99% uptime with redundant power and cooling.',
      icon: PiCpu,
      stat: '99.99% Uptime',
      tag: 'Compute',
    },
    {
      title: 'Seamless Integration',
      desc: 'Bridging legacy mainframes and modern cloud microservices. Real-time data exchange via REST, EDI, and direct SQL.',
      icon: PiNetwork,
      stat: '<1ms Latency',
      tag: 'Connect',
    },
    {
      title: 'Expert Technical Support',
      desc: '24/7/365 access to Tier-3 engineers with deep expertise in database tuning, OS hardening, and application troubleshooting.',
      icon: PiHeadphones,
      stat: '15min Response',
      tag: 'Support',
    },
  ];
  return (
    <div {...stylex.props(styles.root, xstyle)}>
      {/* Console Header */}
      <div {...stylex.props(styles.consoleBar)}>
        <div {...stylex.props(styles.brandRow)}>
          <div {...stylex.props(styles.pulseIconBox)}>
            <PiPulse {...stylex.props(styles.pulseIcon)} />
            <div {...stylex.props(styles.liveDot)} />
          </div>
          <div {...stylex.props(styles.brandText)}>
            <h3 {...stylex.props(styles.consoleTitle)}>
              ERP Performance Console
            </h3>
            <div {...stylex.props(styles.statusRow)}>
              <span {...stylex.props(styles.statusDot)} />
              <p {...stylex.props(styles.statusText)}>System Monitor::Active</p>
            </div>
          </div>
        </div>
        <div {...stylex.props(styles.statsGrid)}>
          {systemStats.map((stat) => (
            <div key={stat.label} {...stylex.props(styles.statCell)}>
              <div {...stylex.props(styles.statLabel)}>{stat.label}</div>
              <div
                {...stylex.props(
                  styles.statValue,
                  stat.color === 'text-green-500'
                    ? styles.statGreen
                    : styles.statPrimary
                )}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Capabilities Grid */}
      <div {...stylex.props(styles.capGrid)}>
        {capabilities.map((item, index) => (
          <TechCard
            key={index}
            variant="technical"
            interactive
            delay={index * 150}
          >
            <div {...stylex.props(styles.capBody)}>
              <div {...stylex.props(styles.capTop)}>
                <div {...stylex.props(styles.capIcon)}>
                  <item.icon {...stylex.props(styles.capIconGlyph)} />
                </div>
                <div {...stylex.props(styles.capStatCol)}>
                  <span {...stylex.props(styles.capStat)}>{item.stat}</span>
                </div>
              </div>
              <h4 {...stylex.props(styles.capTitle)}>{item.title}</h4>
              <p {...stylex.props(styles.capDesc)}>{item.desc}</p>
              <div {...stylex.props(styles.capCta)}>
                Initiate Protocol{' '}
                <PiCaretRight {...stylex.props(styles.capCtaIcon)} />
              </div>
            </div>
          </TechCard>
        ))}
      </div>
    </div>
  );
}
