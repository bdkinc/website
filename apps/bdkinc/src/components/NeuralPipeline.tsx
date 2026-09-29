import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { PiScan, PiBrain, PiRocket } from 'react-icons/pi';

import type { PageData } from '@bdkinc/content';

const hover = '@media (hover: hover)';
const md = '@media (min-width: 48rem)';
const easeOut = 'cubic-bezier(0, 0, 0.2, 1)';
const colorTransition = 'color, background-color, border-color';

const styles = stylex.create({
  root: { position: 'relative', width: '100%', paddingBlock: '3rem' },
  bgGrid: { position: 'absolute', inset: 0, opacity: 0.1 },
  grid: {
    position: 'relative',
    zIndex: 10,
    display: 'grid',
    gap: '2rem',
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      [md]: 'repeat(3, minmax(0, 1fr))',
    },
  },
  // Local hover state replacing the legacy `group` / `group-hover:`.
  stepWrap: {
    position: 'relative',
    '--np-reveal': {
      default: '0',
      [hover]: { default: '0', ':hover': '1' },
    },
  },
  linkH: {
    position: 'absolute',
    top: '50%',
    left: '100%',
    zIndex: 0,
    display: { default: 'none', [md]: 'block' },
    height: 2,
    width: '100%',
    translate: '0 -50%',
  },
  linkV: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    zIndex: 0,
    display: { default: 'block', [md]: 'none' },
    height: '2rem',
    width: 2,
    translate: '-50% 0',
  },
  linkTrack: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    backgroundColor: 'var(--muted)',
  },
  shimmerH: {
    height: '100%',
    width: '50%',
    backgroundImage:
      'linear-gradient(to right in oklab, transparent, var(--primary), transparent)',
  },
  shimmerV: {
    height: '50%',
    width: '100%',
    backgroundImage:
      'linear-gradient(to bottom in oklab, transparent, var(--primary), transparent)',
  },
  card: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'color-mix(in oklab, var(--card) 80%, transparent)',
    padding: '1.5rem',
    textAlign: 'center',
    backdropFilter: 'blur(12px)',
    transitionProperty: 'box-shadow',
    transitionDuration: '500ms',
    transitionTimingFunction: easeOut,
    boxShadow: {
      default: 'none',
      [hover]: {
        default: 'none',
        ':hover': '0 0 30px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  // The original `border-[--color-*]/20` / `border-[--accent]/20` utilities
  // compile to an invalid `border-color` (bare `--var` inside `color-mix`),
  // so the declaration is dropped and the border keeps its default
  // `currentColor`. No border color is set here, preserving that fallback.
  scan: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    borderRadius: '0.75rem',
    pointerEvents: 'none',
    opacity: 0.03,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '0.5rem',
    opacity: 'var(--np-reveal, 0)',
    transitionProperty: 'opacity',
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: '0.5rem',
    opacity: 'var(--np-reveal, 0)',
    transitionProperty: 'opacity',
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  cornerTickTR: {
    height: '0.5rem',
    width: '0.5rem',
    borderTopWidth: 2,
    borderTopStyle: 'solid',
    borderRightWidth: 2,
    borderRightStyle: 'solid',
    borderColor: 'var(--primary)',
  },
  cornerTickBL: {
    height: '0.5rem',
    width: '0.5rem',
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderLeftWidth: 2,
    borderLeftStyle: 'solid',
    borderColor: 'var(--primary)',
  },
  // The original `bg-[--color-*]/10` / `bg-[--accent]/10` and
  // `text-[--color-*]` / `text-[--accent]` utilities compile to invalid
  // declarations (bare `--var` in `color-mix`, bare `--var` as `color`),
  // so they are dropped: the box stays transparent and the glyph inherits
  // its color. No background or color is set here, preserving that.
  iconBox: {
    marginBottom: '1.5rem',
    borderRadius: '1rem',
    padding: '1rem',
    boxShadow:
      '0 0 15px rgba(0, 0, 0, 0.1), inset 0 0 0 1px color-mix(in oklab, white 10%, transparent)',
  },
  icon: { height: '2.5rem', width: '2.5rem' },
  stepTitle: {
    marginBottom: '0.75rem',
    color: 'var(--foreground)',
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
  },
  stepDesc: {
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: 1.625,
  },
  pulseRing: {
    position: 'absolute',
    inset: 0,
    borderRadius: '0.75rem',
    pointerEvents: 'none',
    boxShadow:
      'inset 0 0 0 1px color-mix(in oklab, var(--primary) calc(20% + 30% * var(--np-reveal, 0)), transparent)',
    transitionProperty: colorTransition,
    transitionDuration: '500ms',
    transitionTimingFunction: easeOut,
  },
});

interface Props {
  copy: PageData<'service-artificial-intelligence'>['pipeline']['steps'];
  xstyle?: StyleXStyles;
}

export default function NeuralPipeline({ copy, xstyle }: Props) {
  const steps = [
    {
      id: 'discovery',
      ...copy.discoveryFeasibility,
      icon: PiScan,
    },
    {
      id: 'engineering',
      ...copy.modelEngineering,
      icon: PiBrain,
    },
    {
      id: 'production',
      ...copy.productionDeployment,
      icon: PiRocket,
    },
  ];

  const bgGrid = stylex.props(styles.bgGrid);

  return (
    <div {...stylex.props(styles.root, xstyle)}>
      {/* Background Grid */}
      <div
        {...bgGrid}
        style={
          {
            ...bgGrid.style,
            backgroundImage:
              'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          } as CSSProperties
        }
      ></div>

      <div {...stylex.props(styles.grid)}>
        {steps.map((step, index) => (
          <div key={step.id} {...stylex.props(styles.stepWrap)}>
            {/* Connection Line (Desktop) */}
            {index < steps.length - 1 && (
              <div {...stylex.props(styles.linkH)}>
                <div {...stylex.props(styles.linkTrack)}>
                  <motion.div
                    {...stylex.props(styles.shimmerH)}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: index * 0.5,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Connection Line (Mobile) */}
            {index < steps.length - 1 && (
              <div {...stylex.props(styles.linkV)}>
                <div {...stylex.props(styles.linkTrack)}>
                  <motion.div
                    {...stylex.props(styles.shimmerV)}
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: index * 0.5,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              {...stylex.props(styles.card)}
            >
              {/* Scanline Overlay */}
              {/* Marker: `scanlines` supplies its CSS rule. */}
              <div
                className={[
                  stylex.props(styles.scan).className,
                  'scanlines',
                ].join(' ')}
              />

              {/* Animated Corner Accents */}
              <div {...stylex.props(styles.cornerTR)}>
                <div {...stylex.props(styles.cornerTickTR)}></div>
              </div>
              <div {...stylex.props(styles.cornerBL)}>
                <div {...stylex.props(styles.cornerTickBL)}></div>
              </div>

              {/* Icon */}
              <div {...stylex.props(styles.iconBox)}>
                <step.icon {...stylex.props(styles.icon)} strokeWidth={1.5} />
              </div>

              <h4 {...stylex.props(styles.stepTitle)}>{step.title}</h4>
              <p {...stylex.props(styles.stepDesc)}>{step.description}</p>

              {/* Processing Pulse */}
              <div {...stylex.props(styles.pulseRing)}></div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
