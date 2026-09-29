import { useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { cn } from '@bdkinc/design-system';
import CTAButton from '@/components/CTAButton';
import Aurora from '@/components/Aurora';
import CountUp from '@/components/CountUp';
import CircuitBoard from '@/components/CircuitBoard';

import type { PageData } from '@bdkinc/content';

interface HeroProps {
  copy: PageData<'home'>['hero'];
  xstyle?: StyleXStyles;
}

const hover = '@media (hover: hover)';
const transition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
// Mirrors tw-animate-css `enter`; each element sets the --enter-* variables.
const enter = stylex.keyframes({
  from: {
    opacity: 'var(--enter-opacity, 1)',
    transform:
      'translate3d(0, var(--enter-y, 0), 0) scale3d(var(--enter-scale, 1), var(--enter-scale, 1), var(--enter-scale, 1)) rotate(0)',
    filter: 'blur(0)',
  },
});

const styles = stylex.create({
  section: {
    position: 'relative',
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: '-4rem',
    paddingTop: '4rem',
  },
  layer: {
    position: 'absolute',
    top: '-4rem',
    right: 0,
    bottom: 0,
    left: 0,
  },
  aurora: { opacity: 'var(--page-hero-aurora-opacity)' },
  mesh: { opacity: 'var(--page-hero-mesh-opacity)' },
  veil: {
    backgroundImage:
      'linear-gradient(to bottom in oklab, transparent, var(--page-hero-fade-mid), var(--background))',
  },
  spotlight: {
    backgroundImage:
      'radial-gradient(ellipse at center, var(--page-hero-radial-start), transparent 70%)',
    opacity: 'var(--page-hero-radial-opacity)',
  },
  circuit: { pointerEvents: 'none', top: '-4rem' },
  content: {
    position: 'relative',
    zIndex: 20,
    marginInline: 'auto',
    maxWidth: '80rem',
    textAlign: 'center',
    paddingInline: {
      default: '1rem',
      '@media (min-width: 40rem)': '1.5rem',
      '@media (min-width: 64rem)': '2rem',
    },
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  spaced: { marginBottom: '2rem' },
  enter: {
    animationName: enter,
    animationTimingFunction: 'ease',
    animationFillMode: 'both',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '9999px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
    animationDuration: '500ms',
    '--enter-opacity': 0,
    '--enter-y': '-1rem',
  },
  badgeText: { fontSize: '0.875rem', lineHeight: '1.25rem' },
  badgeAccent: { color: 'var(--accent)', fontWeight: 600 },
  headingWrap: { position: 'relative', display: 'inline-block' },
  heading: {
    fontSize: { default: '3.75rem', '@media (min-width: 48rem)': '6rem' },
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: '-0.025em',
    animationDuration: '700ms',
    animationDelay: '100ms',
    '--enter-opacity': 0,
    '--enter-y': '2rem',
  },
  headingLead: { color: 'var(--foreground)' },
  headingAccent: {
    backgroundImage:
      'linear-gradient(to bottom right in oklab, var(--primary), var(--primary), var(--secondary))',
    backgroundClip: 'text',
    color: 'transparent',
  },
  body: {
    marginInline: 'auto',
    maxWidth: '42rem',
    color: 'var(--muted-foreground)',
    fontFamily: 'var(--font-sans)',
    fontSize: { default: '1.25rem', '@media (min-width: 48rem)': '1.5rem' },
    lineHeight: { default: '1.75rem', '@media (min-width: 48rem)': '2rem' },
    animationDuration: '700ms',
    animationDelay: '200ms',
    '--enter-opacity': 0,
    '--enter-y': '1.5rem',
  },
  actions: {
    position: 'relative',
    zIndex: 30,
    display: 'flex',
    flexDirection: { default: 'column', '@media (min-width: 40rem)': 'row' },
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  action: {
    animationDuration: '500ms',
    '--enter-opacity': 0,
    '--enter-y': '1rem',
  },
  actionFirst: { animationDelay: '300ms' },
  actionSecond: { animationDelay: '400ms' },
  ctaMotion: {
    transitionDuration: '300ms',
    scale: { default: null, [hover]: { default: null, ':hover': 1.05 } },
  },
  // Restates the outline variant's defaults because a conditional override replaces the whole property.
  ctaOutline: {
    borderColor: {
      default: 'var(--primary)',
      '[aria-invalid="true"]': 'var(--destructive)',
      [hover]: {
        default: null,
        ':hover': 'color-mix(in oklab, var(--primary) 50%, transparent)',
      },
    },
    backgroundColor: {
      default: 'var(--background)',
      [hover]: {
        default: 'var(--background)',
        ':hover': 'color-mix(in oklab, var(--primary) 5%, transparent)',
      },
    },
  },
  stats: {
    marginInline: 'auto',
    display: 'grid',
    maxWidth: '48rem',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '2rem',
    paddingTop: '3rem',
  },
  stat: {
    borderRadius: 'calc(var(--radius) + 4px)',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: '1.5rem',
    transitionProperty: transition,
    transitionDuration: '600ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    animationDuration: '600ms',
    '--enter-opacity': 0,
    '--enter-scale': 0,
    scale: { default: null, [hover]: { default: null, ':hover': 1.05 } },
  },
  statFirst: {
    transitionDelay: '500ms',
    animationDelay: '500ms',
    borderColor: {
      default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 30%, transparent)',
      },
    },
  },
  statSecond: {
    transitionDelay: '600ms',
    animationDelay: '600ms',
    borderColor: {
      default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 30%, transparent)',
      },
    },
  },
  // The original `hover:border-[--accent]/30` compiled to an invalid color, so this card has no border hover.
  statThird: {
    transitionDelay: '700ms',
    animationDelay: '700ms',
    borderColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
  },
  statBody: { marginBottom: '0.5rem' },
  statValue: {
    color: 'var(--primary)',
    fontSize: { default: '1.875rem', '@media (min-width: 48rem)': '2.25rem' },
    lineHeight: {
      default: '2.25rem',
      '@media (min-width: 48rem)': '2.5rem',
    },
    fontWeight: 700,
  },
  statValueAccent: { color: 'var(--accent)' },
  statLabel: {
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
  },
  // The original bottom bar's gradient used an invalid `[--accent]` stop, so it rendered no background.
  bar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    height: '0.25rem',
  },
});

export default function Hero({ copy, xstyle }: HeroProps) {
  const {
    heading,
    body,
    primaryCTAText,
    primaryCTALink,
    secondaryCTAText,
    secondaryCTALink,
    badge,
  } = copy;
  const years = new Date().getFullYear() - copy.experienceStartYear;
  const contentRef = useRef<HTMLDivElement>(null);
  const words = heading.trim().split(/\s+/);
  const headingAccent = words.pop() ?? '';
  const headingLead = words.join(' ');

  return (
    <section {...stylex.props(styles.section, xstyle)}>
      {/* Clean gradient background */}
      <div {...stylex.props(styles.layer, styles.aurora)}>
        <Aurora
          colorStops={['#00d4ff', '#7c3aed', '#00d4ff']}
          amplitude={1.5}
          blend={0.6}
          speed={0.6}
        />
      </div>

      {/* Light mode gradient mesh for depth */}
      {/* Marker: `gradient-mesh` supplies its CSS rule. */}
      <div
        className={cn(
          stylex.props(styles.layer, styles.mesh).className,
          'gradient-mesh'
        )}
      />

      {/* Circuit board effect */}
      <CircuitBoard xstyle={styles.circuit} />

      {/* Subtle gradient overlay */}
      <div {...stylex.props(styles.layer, styles.veil)}></div>

      {/* Radial gradient spotlight */}
      <div {...stylex.props(styles.layer, styles.spotlight)}></div>

      {/* Content */}
      <div ref={contentRef} {...stylex.props(styles.content)}>
        <div {...stylex.props(styles.stack)}>
          {/* Badge */}
          {/* Marker: `glass` supplies its CSS rule. */}
          <div
            className={cn(
              stylex.props(styles.spaced, styles.enter, styles.badge).className,
              'glass'
            )}
          >
            <span {...stylex.props(styles.badgeText)}>
              {years}
              {copy.badgeLead.trim()}{' '}
              <span {...stylex.props(styles.badgeAccent)}>{badge}</span>
            </span>
          </div>

          {/* Main heading - clean and bold */}
          <div {...stylex.props(styles.spaced, styles.headingWrap)}>
            <h1 {...stylex.props(styles.enter, styles.heading)}>
              <span {...stylex.props(styles.headingLead)}>{headingLead} </span>
              <span {...stylex.props(styles.headingAccent)}>
                {headingAccent}
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p {...stylex.props(styles.spaced, styles.enter, styles.body)}>
            {body}
          </p>

          {/* CTAs - clean with subtle animations */}
          <div {...stylex.props(styles.spaced, styles.actions)}>
            <div
              {...stylex.props(styles.enter, styles.action, styles.actionFirst)}
            >
              <CTAButton
                size="lg"
                xstyle={styles.ctaMotion}
                href={primaryCTALink}
                icon="click"
              >
                {primaryCTAText}
              </CTAButton>
            </div>
            <div
              {...stylex.props(
                styles.enter,
                styles.action,
                styles.actionSecond
              )}
            >
              <CTAButton
                size="lg"
                variant="outline"
                xstyle={[styles.ctaMotion, styles.ctaOutline]}
                href={secondaryCTALink}
                icon="search"
              >
                {secondaryCTAText}
              </CTAButton>
            </div>
          </div>

          {/* Stats - clean cards with subtle depth */}
          <div {...stylex.props(styles.stats)}>
            <div
              className={cn(
                stylex.props(styles.enter, styles.stat, styles.statFirst)
                  .className,
                'glass'
              )}
            >
              <div {...stylex.props(styles.statBody, styles.statValue)}>
                <CountUp from={0} to={years} duration={1.25} />
                {copy.yearsSuffix}
              </div>
              <div {...stylex.props(styles.statLabel)}>{copy.yearsLabel}</div>
            </div>
            <div
              className={cn(
                stylex.props(styles.enter, styles.stat, styles.statSecond)
                  .className,
                'glass'
              )}
            >
              <div {...stylex.props(styles.statBody, styles.statValue)}>
                <CountUp from={0} to={copy.clients} duration={1.25} />
                {copy.clientsSuffix}
              </div>
              <div {...stylex.props(styles.statLabel)}>{copy.clientsLabel}</div>
            </div>
            <div
              className={cn(
                stylex.props(styles.enter, styles.stat, styles.statThird)
                  .className,
                'glass'
              )}
            >
              <div
                {...stylex.props(
                  styles.statBody,
                  styles.statValue,
                  styles.statValueAccent
                )}
              >
                <CountUp from={0} to={copy.supportHours} duration={1.25} />
                {copy.supportSeparator}
                <CountUp from={0} to={copy.supportDays} duration={1.25} />
              </div>
              <div {...stylex.props(styles.statLabel)}>{copy.supportLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent bar - clean gradient */}
      <div {...stylex.props(styles.bar)}></div>
    </section>
  );
}
