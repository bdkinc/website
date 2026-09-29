import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import {
  PiCode,
  PiCloud,
  PiArrowRight,
  PiArrowsClockwise,
  PiShieldCheck,
  PiLightning,
  PiLock,
} from 'react-icons/pi';
import { motion } from 'motion/react';
import { TechCard } from '@/components/TechCard';
import { cn } from '@bdkinc/design-system';

const hover = '@media (hover: hover)';
const md = '@media (min-width: 48rem)';
const motionTransition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const timing = 'cubic-bezier(0.4, 0, 0.2, 1)';
// Card-hovered states scope to the TechCard defaultMarker (the original `group` boundary).

const styles = stylex.create({
  root: {
    position: 'relative',
    width: '100%',
    maxWidth: '72rem',
    marginInline: 'auto',
    marginBlock: '6rem',
  },
  wash: {
    position: 'absolute',
    inset: 0,
    zIndex: -10,
    borderRadius: '1.5rem',
    backgroundColor: 'color-mix(in oklab, var(--primary) 5%, transparent)',
    filter: 'blur(64px)',
  },
  header: {
    marginBottom: '4rem',
    textAlign: 'center',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    marginBottom: '1rem',
  },
  lede: {
    color: 'var(--muted-foreground)',
    maxWidth: '42rem',
    marginInline: 'auto',
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      [md]: 'repeat(3, minmax(0, 1fr))',
    },
    alignItems: 'center',
    gap: '2rem',
  },
  phase: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  phaseIconPrimary: {
    display: 'flex',
    height: '4rem',
    width: '4rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    backgroundColor: {
      default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
        [stylex.when.ancestor(':hover')]:
          'color-mix(in oklab, var(--primary) 20%, transparent)',
      },
    },
    marginBottom: '1.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    scale: {
      default: 1,
      [hover]: { default: 1, [stylex.when.ancestor(':hover')]: 1.1 },
    },
    transitionProperty: motionTransition,
    transitionDuration: '500ms',
    transitionTimingFunction: timing,
  },
  phaseIconSecondary: {
    display: 'flex',
    height: '4rem',
    width: '4rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
    backgroundColor: {
      default: 'color-mix(in oklab, var(--secondary) 10%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--secondary) 10%, transparent)',
        [stylex.when.ancestor(':hover')]:
          'color-mix(in oklab, var(--secondary) 20%, transparent)',
      },
    },
    marginBottom: '1.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    scale: {
      default: 1,
      [hover]: { default: 1, [stylex.when.ancestor(':hover')]: 1.1 },
    },
    transitionProperty: motionTransition,
    transitionDuration: '500ms',
    transitionTimingFunction: timing,
  },
  phaseGlyphPrimary: {
    height: '2rem',
    width: '2rem',
    color: 'var(--primary)',
  },
  phaseGlyphSecondary: {
    height: '2rem',
    width: '2rem',
    color: 'var(--secondary)',
  },
  phaseTitle: {
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    marginBottom: '0.75rem',
  },
  phaseBody: {
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: 1.625,
    marginBottom: '1.5rem',
  },
  badgeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '100%',
    marginTop: 'auto',
    textAlign: 'left',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--muted-foreground)',
    fontSize: '0.625rem',
    letterSpacing: '0.1em',
  },
  badgeIconPrimary: {
    height: '0.75rem',
    width: '0.75rem',
    color: 'var(--primary)',
  },
  badgeIconSecondary: {
    height: '0.75rem',
    width: '0.75rem',
    color: 'var(--secondary)',
  },
  connector: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    paddingBlock: { default: '2rem', [md]: 0 },
  },
  flowRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  // Motion drives width inline; no width here so the animation wins.
  flowLineForward: {
    height: 1,
    borderRadius: 0,
    backgroundImage:
      'linear-gradient(to right in oklab, var(--primary), var(--secondary))',
  },
  flowLineBack: {
    height: 1,
    borderRadius: 0,
    backgroundImage:
      'linear-gradient(to right in oklab, var(--secondary), var(--primary))',
  },
  arrowForward: {
    height: '1.5rem',
    width: '1.5rem',
    color: 'var(--secondary)',
  },
  arrowBack: {
    height: '1rem',
    width: '1rem',
    color: 'var(--primary)',
  },
  pipelineLabel: {
    borderRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--secondary) 30%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--secondary) 10%, transparent)',
    color: 'var(--secondary)',
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
  },
  feedback: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transform: 'rotate(180deg)',
    opacity: 0.5,
  },
  benefit: {
    marginTop: '3rem',
    textAlign: 'center',
  },
  benefitPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--primary) 5%, transparent)',
    color: 'var(--foreground)',
    paddingInline: '1.5rem',
    paddingBlock: '0.75rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
  },
  benefitIcon: {
    height: '1.25rem',
    width: '1.25rem',
    color: 'var(--primary)',
  },
});

interface Props {
  copy: import('@bdkinc/content').PageData<'service-application-development'>['lifecycle']['visualization'];
  className?: string;
  xstyle?: StyleXStyles;
}

export default function LifecycleVisualization({
  copy,
  className,
  xstyle,
}: Props) {
  const root = stylex.props(styles.root, xstyle);
  return (
    <div {...root} className={cn(root.className, className)}>
      <div {...stylex.props(styles.wash)}></div>
      <div {...stylex.props(styles.header)}>
        <h2 {...stylex.props(styles.heading)}>{copy.heading}</h2>
        <p {...stylex.props(styles.lede)}>{copy.body}</p>
      </div>
      <div {...stylex.props(styles.grid)}>
        {/* Phase 1: Build */}
        <TechCard variant="technical" interactive>
          <div {...stylex.props(styles.phase)}>
            <div {...stylex.props(styles.phaseIconPrimary)}>
              <PiCode {...stylex.props(styles.phaseGlyphPrimary)} />
            </div>
            <h3 {...stylex.props(styles.phaseTitle)}>{copy.build.title}</h3>
            <p {...stylex.props(styles.phaseBody)}>{copy.build.description}</p>
            <ul {...stylex.props(styles.badgeList)}>
              <li {...stylex.props(styles.badge)}>
                <PiLightning {...stylex.props(styles.badgeIconPrimary)} />{' '}
                {copy.build.performanceBadge}
              </li>
              <li {...stylex.props(styles.badge)}>
                <PiLock {...stylex.props(styles.badgeIconPrimary)} />{' '}
                {copy.build.securityBadge}
              </li>
            </ul>
          </div>
        </TechCard>
        {/* Connection / Animation */}
        <div {...stylex.props(styles.connector)}>
          {/* Forward Flow */}
          <div {...stylex.props(styles.flowRow)}>
            <motion.div
              {...stylex.props(styles.flowLineForward)}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: '100px', opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            />
            <PiArrowRight {...stylex.props(styles.arrowForward)} />
          </div>
          <div {...stylex.props(styles.pipelineLabel)}>
            {copy.pipelineLabel}
          </div>
          {/* Feedback Loop */}
          <div {...stylex.props(styles.feedback)}>
            <motion.div
              {...stylex.props(styles.flowLineBack)}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: '100px', opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            <PiArrowsClockwise {...stylex.props(styles.arrowBack)} />
          </div>
        </div>
        {/* Phase 2: Host */}
        <TechCard variant="technical" interactive>
          <div {...stylex.props(styles.phase)}>
            <div {...stylex.props(styles.phaseIconSecondary)}>
              <PiCloud {...stylex.props(styles.phaseGlyphSecondary)} />
            </div>
            <h3 {...stylex.props(styles.phaseTitle)}>{copy.run.title}</h3>
            <p {...stylex.props(styles.phaseBody)}>{copy.run.description}</p>
            <ul {...stylex.props(styles.badgeList)}>
              <li {...stylex.props(styles.badge)}>
                <PiShieldCheck {...stylex.props(styles.badgeIconSecondary)} />{' '}
                {copy.run.uptimeBadge}
              </li>
              <li {...stylex.props(styles.badge)}>
                <PiArrowsClockwise
                  {...stylex.props(styles.badgeIconSecondary)}
                />{' '}
                {copy.run.scalingBadge}
              </li>
            </ul>
          </div>
        </TechCard>
      </div>
      {/* Unified Benefit */}
      <div {...stylex.props(styles.benefit)}>
        <div {...stylex.props(styles.benefitPill)}>
          <PiShieldCheck {...stylex.props(styles.benefitIcon)} />
          <span>{copy.accountability}</span>
        </div>
      </div>
    </div>
  );
}
