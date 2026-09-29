import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { PiLayout, PiNetwork, PiBrain } from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';

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

const styles = stylex.create({
  root: {
    marginInline: 'auto',
    marginBottom: '5rem',
    width: '100%',
    maxWidth: '80rem',
  },
  heading: {
    marginBottom: '3rem',
    color: 'var(--foreground)',
    fontFamily: 'var(--font-display)',
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      '@media (min-width: 64rem)': 'repeat(3, minmax(0, 1fr))',
    },
  },
  body: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    padding: '2rem',
    textAlign: 'left',
  },
  headerRow: {
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  // TechCard drives --tech-hover-opacity to 1 while hovered (the old `group-hover:`).
  iconBox: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    backgroundColor:
      'color-mix(in oklab, var(--primary) calc(10% + 10% * var(--tech-hover-opacity, 0)), transparent)',
    color: 'var(--primary)',
    // group-hover:scale-110 sets the individual `scale` property, which is not in the transition list.
    scale: 'calc(1 + 0.1 * var(--tech-hover-opacity, 0))',
    boxShadow: '0 0 15px rgba(0, 212, 255, 0.1)',
    transitionProperty: transition,
    transitionDuration: '500ms',
    transitionTimingFunction: easeOut,
  },
  icon: { height: '2rem', width: '2rem' },
  statusCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--primary) 5%, transparent)',
    paddingInline: '0.5rem',
    paddingBlock: '0.25rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    lineHeight: '1rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'color-mix(in oklab, var(--primary) 80%, transparent)',
  },
  dotWrap: {
    position: 'relative',
    display: 'flex',
    height: '0.375rem',
    width: '0.375rem',
  },
  pingDot: {
    position: 'absolute',
    inset: 0,
    display: 'inline-flex',
    height: '100%',
    width: '100%',
    borderRadius: '9999px',
    backgroundColor: 'var(--primary)',
    opacity: 0.75,
    animationName: { default: 'none', [motionOK]: ping },
    animationDuration: '1s',
    animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
    animationIterationCount: 'infinite',
  },
  dot: {
    position: 'relative',
    display: 'inline-flex',
    height: '0.375rem',
    width: '0.375rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--primary)',
    boxShadow: '0 0 5px var(--color-primary)',
  },
  latency: {
    marginTop: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.5625rem',
    lineHeight: '0.75rem',
    letterSpacing: '-0.05em',
    color: 'var(--muted-foreground)',
  },
  title: {
    marginBottom: '0.75rem',
    color: 'var(--tech-title-color, var(--foreground))',
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: easeOut,
  },
  description: {
    marginBottom: '1.5rem',
    flexGrow: 1,
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: 1.625,
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    paddingTop: '1rem',
  },
  footerLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.5625rem',
    lineHeight: '0.75rem',
    letterSpacing: '0.1em',
    color: 'color-mix(in oklab, var(--muted-foreground) 60%, transparent)',
  },
  footerValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    lineHeight: '1rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--primary)',
  },
});

interface DataOrchestrationDashboardProps {
  xstyle?: StyleXStyles;
}

export default function DataOrchestrationDashboard({
  xstyle,
}: DataOrchestrationDashboardProps) {
  const modules = [
    {
      title: 'BI Dashboards',
      status: 'Active',
      latency: '12ms',
      icon: PiLayout,
      description: 'Real-time visualization layers',
      highlight: '99.9% Uptime',
    },
    {
      title: 'Data Pipelines',
      status: 'Processing',
      latency: '24ms',
      icon: PiNetwork,
      description: 'Automated ETL/ELT workflows',
      highlight: 'High Throughput',
    },
    {
      title: 'Predictive Models',
      status: 'Learning',
      latency: 'n/a',
      icon: PiBrain,
      description: 'ML-driven trend forecasting',
      highlight: 'Adaptive Logic',
    },
  ];
  return (
    <div {...stylex.props(styles.root, xstyle)}>
      <h2 {...stylex.props(styles.heading)}>Data Command Center</h2>
      <div {...stylex.props(styles.grid)}>
        {modules.map((module, index) => (
          <TechCard
            key={index}
            variant="technical"
            interactive
            delay={index * 150}
          >
            <div {...stylex.props(styles.body)}>
              {/* Header with Status */}
              <div {...stylex.props(styles.headerRow)}>
                <div {...stylex.props(styles.iconBox)}>
                  <module.icon {...stylex.props(styles.icon)} />
                </div>
                <div {...stylex.props(styles.statusCol)}>
                  <div {...stylex.props(styles.statusPill)}>
                    <span {...stylex.props(styles.dotWrap)}>
                      <span {...stylex.props(styles.pingDot)}></span>
                      <span {...stylex.props(styles.dot)}></span>
                    </span>
                    {module.status}
                  </div>
                  <div {...stylex.props(styles.latency)}>
                    Latency: {module.latency}
                  </div>
                </div>
              </div>
              {/* Content */}
              <h3 {...stylex.props(styles.title)}>{module.title}</h3>
              <p {...stylex.props(styles.description)}>{module.description}</p>
              {/* Footer / Highlight */}
              <div {...stylex.props(styles.footer)}>
                <span {...stylex.props(styles.footerLabel)}>Module Stream</span>
                <span {...stylex.props(styles.footerValue)}>
                  {module.highlight}
                </span>
              </div>
            </div>
          </TechCard>
        ))}
      </div>
    </div>
  );
}
