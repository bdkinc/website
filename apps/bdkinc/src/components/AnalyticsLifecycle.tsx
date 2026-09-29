import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { motion } from 'motion/react';
import {
  PiDatabase,
  PiCpu,
  PiLightbulb,
  PiLightning,
  PiStackSimple,
} from 'react-icons/pi';
import { useState, useEffect } from 'react';

const hover = '@media (hover: hover)';
const desktop = '@media (min-width: 64rem)';
const easeOut = 'cubic-bezier(0, 0, 0.2, 1)';
const colorTransition = 'color, background-color, border-color';
const cardTransition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const flowGradient =
  'linear-gradient(to right, transparent, currentColor, transparent)';

const ping = stylex.keyframes({
  '0%': { transform: 'scale(1)', opacity: 0.2 },
  '75%': { transform: 'scale(2)', opacity: 0 },
  '100%': { transform: 'scale(2)', opacity: 0 },
});

type Accent = 'primary' | 'secondary' | 'accent';

const softBg = (token: string) =>
  `color-mix(in oklab, var(--${token}) 10%, transparent)` as const;
const borderMix = (token: string) =>
  `color-mix(in oklab, var(--${token}) 20%, transparent)` as const;
const ringShadow = (token: string) =>
  `0 0 0 1px color-mix(in oklab, var(--${token}) 20%, transparent)` as const;

const styles = stylex.create({
  root: {
    position: 'relative',
    marginInline: 'auto',
    width: '100%',
    maxWidth: '72rem',
    paddingInline: '1rem',
    paddingBlock: '3rem',
  },
  grid: {
    position: 'relative',
    zIndex: 10,
    display: 'grid',
    gap: { default: '3rem', [desktop]: '2rem' },
    gridTemplateColumns: {
      default: null,
      [desktop]: 'repeat(3, minmax(0, 1fr))',
    },
  },
  stepWrap: {
    position: 'relative',
    display: { default: 'flex', [desktop]: 'block' },
    flexDirection: 'column',
    alignItems: 'center',
  },
  connector: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 0,
    height: '100%',
    width: '100%',
    display: { default: 'none', [desktop]: 'block' },
    translate: '0 -50%',
    overflow: 'visible',
  },
  track: {
    position: 'absolute',
    top: '50%',
    left: 0,
    height: 1,
    width: '100%',
    translate: '0 -50%',
    backgroundColor: 'color-mix(in oklab, var(--border) 20%, transparent)',
  },
  flowBase: {
    position: 'absolute',
    left: 0,
    width: '100%',
    transformOrigin: 'left',
    backgroundImage: flowGradient,
  },
  flowMain: { top: '50%', height: 2, translate: '0 -50%', opacity: 1 },
  flowUpper: { top: '20%', height: 1, opacity: 0.4 },
  flowLower: { top: '80%', height: 1, opacity: 0.4, filter: 'blur(1px)' },
  flowTopEdge: { top: '10%', height: 1, opacity: 0.2 },
  flowBottomEdge: { top: '90%', height: 1, opacity: 0.2 },
  particle: {
    position: 'absolute',
    zIndex: 10,
    borderRadius: 9999,
    boxShadow: '0 0 8px currentColor',
  },
  particleLg: { height: '0.375rem', width: '0.375rem' },
  particleSm: { height: '0.25rem', width: '0.25rem', opacity: 0.7 },
  particleCenter: { top: '50%', translate: '0 -50%' },
  particle20: { top: '20%' },
  particle80: { top: '80%' },
  particle35: { top: '35%' },
  particle65: { top: '65%', filter: 'blur(1px)' },
  particle10: { top: '10%' },
  particle90: { top: '90%' },
  particleWhite: { color: 'white' },
  mobileConnector: {
    position: 'absolute',
    bottom: '-3rem',
    left: '50%',
    zIndex: 0,
    height: '3rem',
    width: 2,
    display: { default: 'block', [desktop]: 'none' },
    marginLeft: -1,
    overflow: 'hidden',
    backgroundColor: 'color-mix(in oklab, var(--border) 20%, transparent)',
  },
  mobileFlow: {
    position: 'absolute',
    inset: 0,
    height: '33.333%',
    width: '100%',
    opacity: 0.5,
    backgroundImage:
      'linear-gradient(to bottom, transparent, currentColor, transparent)',
  },
  cardMotion: { position: 'relative', height: '100%', width: '100%' },
  card: {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: '1rem',
    padding: '2rem',
    backdropFilter: 'blur(12px)',
    transitionProperty: cardTransition,
    transitionDuration: '700ms',
    transitionTimingFunction: easeOut,
  },
  cardInactive: {
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: {
      default: 'rgba(255, 255, 255, 0.05)',
      [hover]: {
        default: 'rgba(255, 255, 255, 0.05)',
        ':hover': 'rgba(255, 255, 255, 0.07)',
      },
    },
  },
  cardInactiveBorderHover: {
    borderColor: {
      default: 'rgba(255, 255, 255, 0.05)',
      [hover]: {
        default: 'rgba(255, 255, 255, 0.05)',
        ':hover': 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  inner: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  iconBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: '0.75rem',
    padding: '0.75rem',
    transitionProperty: cardTransition,
    transitionDuration: '500ms',
    transitionTimingFunction: easeOut,
  },
  iconBoxInactive: {
    color: 'var(--muted-foreground)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  glyph: {
    position: 'relative',
    zIndex: 10,
    height: '2rem',
    width: '2rem',
    transitionProperty: cardTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  ping: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    borderRadius: '0.75rem',
    backgroundColor: 'currentColor',
    opacity: 0.2,
    animationName: ping,
    animationDuration: '1s',
    animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
    animationIterationCount: 'infinite',
  },
  body: { display: 'flex', flexGrow: 1, flexDirection: 'column', gap: '1rem' },
  title: {
    marginBottom: '0.75rem',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    transitionProperty: colorTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  titleInactive: { color: 'var(--foreground)' },
  description: {
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: 1.625,
    fontWeight: 500,
  },
  details: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    paddingTop: '1.25rem',
    transitionProperty: colorTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  detailsInactiveBorder: { borderTopColor: 'rgba(255, 255, 255, 0.05)' },
  detailList: { display: 'flex', flexDirection: 'column', gap: '0.625rem' },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    letterSpacing: '0.025em',
    transitionProperty: colorTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  detailItemActive: { color: 'var(--muted-foreground)' },
  detailItemInactive: {
    color: 'color-mix(in oklab, var(--muted-foreground) 60%, transparent)',
  },
  detailIcon: { marginRight: '0.5rem', height: '0.75rem', width: '0.75rem' },
  detailIconInactive: {
    color: 'color-mix(in oklab, var(--muted-foreground) 30%, transparent)',
  },
  progressWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 4,
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: '1rem',
    borderBottomRightRadius: '1rem',
  },
  progressFill: { height: '100%', width: '100%' },
  // Per-accent tokens replacing the legacy color/bg/border/ring/glow strings.
  textPrimary: { color: 'var(--primary)' },
  textSecondary: { color: 'var(--secondary)' },
  textAccent: { color: 'var(--accent)' },
  softPrimary: { backgroundColor: softBg('primary') },
  softSecondary: { backgroundColor: softBg('secondary') },
  softAccent: { backgroundColor: softBg('accent') },
  solidPrimary: { backgroundColor: 'var(--primary)' },
  solidSecondary: { backgroundColor: 'var(--secondary)' },
  solidAccent: { backgroundColor: 'var(--accent)' },
  borderPrimary: { borderColor: borderMix('primary') },
  borderSecondary: { borderColor: borderMix('secondary') },
  borderAccent: { borderColor: borderMix('accent') },
  detailsBorderPrimary: { borderTopColor: borderMix('primary') },
  detailsBorderSecondary: { borderTopColor: borderMix('secondary') },
  detailsBorderAccent: { borderTopColor: borderMix('accent') },
  ringPrimary: { boxShadow: ringShadow('primary') },
  ringSecondary: { boxShadow: ringShadow('secondary') },
  ringAccent: { boxShadow: ringShadow('accent') },
  iconActivePrimary: {
    backgroundColor: softBg('primary'),
    borderColor: borderMix('primary'),
    color: 'var(--primary)',
    scale: 1.1,
    boxShadow:
      '0 10px 15px -3px color-mix(in oklab, var(--primary) 20%, transparent), 0 4px 6px -4px color-mix(in oklab, var(--primary) 20%, transparent)',
  },
  iconActiveSecondary: {
    backgroundColor: softBg('secondary'),
    borderColor: borderMix('secondary'),
    color: 'var(--secondary)',
    scale: 1.1,
    boxShadow:
      '0 10px 15px -3px color-mix(in oklab, var(--secondary) 20%, transparent), 0 4px 6px -4px color-mix(in oklab, var(--secondary) 20%, transparent)',
  },
  iconActiveAccent: {
    backgroundColor: softBg('accent'),
    borderColor: borderMix('accent'),
    color: 'var(--accent)',
    scale: 1.1,
    boxShadow:
      '0 10px 15px -3px color-mix(in oklab, var(--accent) 20%, transparent), 0 4px 6px -4px color-mix(in oklab, var(--accent) 20%, transparent)',
  },
});

const accentStyles: Record<
  Accent,
  {
    text: StyleXStyles;
    soft: StyleXStyles;
    solid: StyleXStyles;
    border: StyleXStyles;
    detailsBorder: StyleXStyles;
    ring: StyleXStyles;
    iconActive: StyleXStyles;
  }
> = {
  primary: {
    text: styles.textPrimary,
    soft: styles.softPrimary,
    solid: styles.solidPrimary,
    border: styles.borderPrimary,
    detailsBorder: styles.detailsBorderPrimary,
    ring: styles.ringPrimary,
    iconActive: styles.iconActivePrimary,
  },
  secondary: {
    text: styles.textSecondary,
    soft: styles.softSecondary,
    solid: styles.solidSecondary,
    border: styles.borderSecondary,
    detailsBorder: styles.detailsBorderSecondary,
    ring: styles.ringSecondary,
    iconActive: styles.iconActiveSecondary,
  },
  accent: {
    text: styles.textAccent,
    soft: styles.softAccent,
    solid: styles.solidAccent,
    border: styles.borderAccent,
    detailsBorder: styles.detailsBorderAccent,
    ring: styles.ringAccent,
    iconActive: styles.iconActiveAccent,
  },
};

interface Step {
  id: string;
  title: string;
  icon: any;
  description: string;
  details: string[];
  accent: Accent;
}

interface Props {
  copy: import('@bdkinc/content').PageData<'service-business-analytics'>['lifecycle']['steps'];
  xstyle?: StyleXStyles;
}

export default function AnalyticsLifecycle({ copy, xstyle }: Props) {
  const steps: Step[] = [
    {
      id: '01',
      ...copy.ingestion,
      icon: PiDatabase,
      details: [
        copy.ingestion.details.apiConnectors,
        copy.ingestion.details.streamProcessing,
        copy.ingestion.details.schemaValidation,
      ],
      accent: 'primary',
    },
    {
      id: '02',
      ...copy.processing,
      icon: PiCpu,
      details: [
        copy.processing.details.etlEltPipelines,
        copy.processing.details.dataLakeStorage,
        copy.processing.details.sanitizationLogic,
      ],
      accent: 'secondary',
    },
    {
      id: '03',
      ...copy.insight,
      icon: PiLightbulb,
      details: [
        copy.insight.details.mlModels,
        copy.insight.details.biDashboards,
        copy.insight.details.decisionEngines,
      ],
      accent: 'accent',
    },
  ];

  const [activeStep, setActiveStep] = useState(0);

  // Cycle through steps for the "pipeline" effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000); // 3 seconds per step focus
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div {...stylex.props(styles.root, xstyle)}>
      <div {...stylex.props(styles.grid)}>
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const accent = accentStyles[step.accent];

          return (
            <div key={step.id} {...stylex.props(styles.stepWrap)}>
              {/* Desktop Connector Line */}
              {index < steps.length - 1 && (
                <div {...stylex.props(styles.connector)}>
                  {/* Central Static track */}
                  <div {...stylex.props(styles.track)} />

                  {/* Multiple Active Flows */}
                  {isActive && (
                    <>
                      {/* Main central flow */}
                      <motion.div
                        {...stylex.props(
                          styles.flowBase,
                          styles.flowMain,
                          accent.text
                        )}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: [0, 1],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />

                      {/* Upper flow (faster, thinner) */}
                      <motion.div
                        {...stylex.props(
                          styles.flowBase,
                          styles.flowUpper,
                          accent.text
                        )}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: [0, 1],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'circOut',
                          delay: 0.2,
                        }}
                      />

                      {/* Lower flow (slower, thinner) */}
                      <motion.div
                        {...stylex.props(
                          styles.flowBase,
                          styles.flowLower,
                          accent.text
                        )}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: [0, 1],
                          opacity: [0, 0.4, 0],
                        }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.5,
                        }}
                      />

                      {/* Top Edge flow */}
                      <motion.div
                        {...stylex.props(
                          styles.flowBase,
                          styles.flowTopEdge,
                          accent.text
                        )}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: [0, 1],
                          opacity: [0, 0.3, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: 0.8,
                        }}
                      />

                      {/* Bottom Edge flow */}
                      <motion.div
                        {...stylex.props(
                          styles.flowBase,
                          styles.flowBottomEdge,
                          accent.text
                        )}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: [0, 1],
                          opacity: [0, 0.3, 0],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: 1,
                        }}
                      />
                    </>
                  )}

                  {/* Particles */}
                  {isActive && (
                    <>
                      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                          key={i}
                          {...stylex.props(
                            styles.particle,
                            i % 2 === 0 ? styles.particleLg : styles.particleSm,
                            i === 0 && styles.particleCenter,
                            i === 1 && styles.particle20,
                            i === 2 && styles.particle80,
                            i === 3 && styles.particle35,
                            i === 4 && styles.particle65,
                            i === 5 && styles.particle10,
                            i === 6 && styles.particle90,
                            i === 3 && styles.particleWhite,
                            accent.solid,
                            accent.text
                          )}
                          initial={{ left: '0%', opacity: 0 }}
                          animate={{
                            left: '100%',
                            opacity: [0, 1, 1, 0],
                          }}
                          transition={{
                            duration: i % 2 === 0 ? 1.5 : 2.2, // vary speeds
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: 'linear',
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Mobile Connector */}
              {index < steps.length - 1 && (
                <div {...stylex.props(styles.mobileConnector)}>
                  <motion.div
                    {...stylex.props(styles.mobileFlow, accent.text)}
                    animate={{
                      y: ['-100%', '300%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>
              )}

              <StepCard step={step} index={index} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepCard({
  step,
  index,
  isActive,
}: {
  step: Step;
  index: number;
  isActive: boolean;
}) {
  const accent = accentStyles[step.accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      {...stylex.props(styles.cardMotion)}
    >
      <div
        {...stylex.props(
          styles.card,
          isActive
            ? [accent.soft, accent.border, accent.ring]
            : [styles.cardInactive, styles.cardInactiveBorderHover]
        )}
      >
        {/* Active Gradient Overlay - Removed */}
        <div {...stylex.props(styles.inner)}>
          {/* Header: Icon + Number */}
          <div {...stylex.props(styles.headerRow)}>
            <div
              {...stylex.props(
                styles.iconBox,
                isActive ? accent.iconActive : styles.iconBoxInactive
              )}
            >
              <step.icon {...stylex.props(styles.glyph)} />
              {/* Pulse Ring when active */}
              {isActive && <span {...stylex.props(styles.ping)} />}
            </div>
          </div>

          {/* Content Body */}
          <div {...stylex.props(styles.body)}>
            <div>
              <h4
                {...stylex.props(
                  styles.title,
                  isActive ? accent.text : styles.titleInactive
                )}
              >
                {step.title}
              </h4>
              <p {...stylex.props(styles.description)}>{step.description}</p>
            </div>

            {/* Technical Details List */}
            <div
              {...stylex.props(
                styles.details,
                isActive ? accent.detailsBorder : styles.detailsInactiveBorder
              )}
            >
              <ul {...stylex.props(styles.detailList)}>
                {step.details.map((detail, idx) => (
                  <li
                    key={idx}
                    {...stylex.props(
                      styles.detailItem,
                      isActive
                        ? styles.detailItemActive
                        : styles.detailItemInactive
                    )}
                  >
                    {isActive ? (
                      <PiStackSimple
                        {...stylex.props(styles.detailIcon, accent.text)}
                      />
                    ) : (
                      <PiLightning
                        {...stylex.props(
                          styles.detailIcon,
                          styles.detailIconInactive
                        )}
                      />
                    )}
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar Activity Indicator */}
        <div {...stylex.props(styles.progressWrap)}>
          {isActive && (
            <motion.div
              {...stylex.props(styles.progressFill, accent.solid)}
              layoutId="active-step-bar"
              transition={{
                layout: { type: 'spring', stiffness: 300, damping: 30 },
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
