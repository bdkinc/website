import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import {
  PiDatabase,
  PiShieldCheck,
  PiCpu,
  PiCheckCircle,
  PiBrain,
} from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';
import { cn } from '@bdkinc/design-system';

const hover = '@media (hover: hover)';
const sm = '@media (min-width: 40rem)';
const md = '@media (min-width: 48rem)';
const lg = '@media (min-width: 64rem)';
const colorTransition =
  'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke';
const timing = 'cubic-bezier(0.4, 0, 0.2, 1)';
// Module rows carry their own hover state, so row-hovered children reuse the
// ancestor-hover pattern to preserve the original group-hover styling.

const styles = stylex.create({
  section: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--background) 50%, transparent)',
    marginBlock: '6rem',
    padding: { default: '2rem', [md]: '3rem' },
  },
  glowTop: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'radial-gradient(circle at top right, rgba(0,102,255,0.08), transparent 40%)',
  },
  glowBottom: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'radial-gradient(circle at bottom left, rgba(36,64,143,0.08), transparent 40%)',
  },
  // `scanlines` supplies its CSS rule; positioning comes from StyleX.
  scanlines: {
    position: 'absolute',
    inset: 0,
    opacity: 0.03,
  },
  // `circuit-overlay` supplies its CSS rule; positioning comes from StyleX.
  circuit: {
    position: 'absolute',
    inset: 0,
    opacity: 0.02,
    pointerEvents: 'none',
  },
  grid: {
    position: 'relative',
    zIndex: 10,
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '3rem',
    alignItems: { [lg]: 'center' },
  },
  gridCols: {
    gridTemplateColumns: { [lg]: 'repeat(2, minmax(0, 1fr))' },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 30%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--primary) 5%, transparent)',
    color: 'var(--primary)',
    paddingInline: '1rem',
    paddingBlock: '0.375rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
  },
  eyebrowIcon: {
    height: '0.875rem',
    width: '0.875rem',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: { default: '1.875rem', [sm]: '2.25rem' },
    lineHeight: { default: '2.25rem', [sm]: '2.5rem' },
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  headingAccent: {
    color: 'var(--primary)',
  },
  body: {
    color: 'var(--muted-foreground)',
    fontSize: '1.125rem',
    lineHeight: 1.625,
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '1rem',
  },
  featuresCols: {
    gridTemplateColumns: { [sm]: 'repeat(2, minmax(0, 1fr))' },
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  featureIcon: {
    height: '1.25rem',
    width: '1.25rem',
    flexShrink: 0,
    color: 'var(--primary)',
  },
  featureLabel: {
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    letterSpacing: '0.025em',
  },
  visual: {
    position: 'relative',
  },
  cardShadow: {
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  moduleBody: {
    padding: '1.5rem',
  },
  moduleHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
  },
  dots: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  dotMuted: {
    height: '0.5rem',
    width: '0.5rem',
    borderRadius: '9999px',
    backgroundColor:
      'color-mix(in oklab, var(--muted-foreground) 50%, transparent)',
  },
  dotPrimary: {
    height: '0.5rem',
    width: '0.5rem',
    borderRadius: '9999px',
    backgroundColor: 'color-mix(in oklab, var(--primary) 50%, transparent)',
  },
  nodeStatus: {
    fontFamily: 'var(--font-mono)',
    color: 'color-mix(in oklab, var(--primary) 60%, transparent)',
    fontSize: '0.625rem',
    letterSpacing: '0.1em',
  },
  modules: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '1rem',
  },
  modulePrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 40%, transparent)',
      },
    },
    backgroundColor: {
      default: 'color-mix(in oklab, var(--background) 50%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--background) 50%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 5%, transparent)',
      },
    },
    padding: '1rem',
    transitionProperty:
      'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing',
    transitionDuration: '150ms',
    transitionTimingFunction: timing,
  },
  moduleMuted: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'color-mix(in oklab, var(--border) 60%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--border) 60%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 40%, transparent)',
      },
    },
    backgroundColor: {
      default: 'color-mix(in oklab, var(--background) 50%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--background) 50%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 5%, transparent)',
      },
    },
    padding: '1rem',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: timing,
  },
  moduleIconPrimary: {
    borderRadius: '0.375rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'color-mix(in oklab, var(--primary) 20%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--primary) 20%, transparent)',
        [stylex.when.ancestor(':hover')]:
          'color-mix(in oklab, var(--primary) 40%, transparent)',
      },
    },
    backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    color: 'var(--primary)',
    padding: '0.75rem',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: timing,
  },
  moduleIconSecondary: {
    borderRadius: '0.375rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
        [stylex.when.ancestor(':hover')]:
          'color-mix(in oklab, var(--secondary) 40%, transparent)',
      },
    },
    backgroundColor: 'color-mix(in oklab, var(--secondary) 10%, transparent)',
    color: 'var(--secondary)',
    padding: '0.75rem',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: timing,
  },
  moduleGlyph: {
    height: '1.5rem',
    width: '1.5rem',
  },
  moduleText: {
    textAlign: 'left',
  },
  moduleTitle: {
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  moduleDesc: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--muted-foreground)',
    fontSize: '0.625rem',
  },
  moduleMeta: {
    marginLeft: 'auto',
  },
  moduleDot: {
    height: '0.375rem',
    width: '0.375rem',
    borderRadius: '9999px',
    backgroundColor: 'color-mix(in oklab, var(--primary) 70%, transparent)',
  },
  moduleStatus: {
    marginLeft: 'auto',
    fontFamily: 'var(--font-mono)',
    color: 'color-mix(in oklab, var(--primary) 80%, transparent)',
    fontSize: '0.625rem',
    letterSpacing: '-0.05em',
  },
  backdrop: {
    position: 'absolute',
    inset: '-1rem',
    zIndex: -1,
    borderRadius: 0,
    backgroundImage:
      'linear-gradient(to bottom right in oklab, color-mix(in oklab, var(--primary) 10%, transparent), color-mix(in oklab, var(--secondary) 10%, transparent), transparent)',
    opacity: 0.4,
    filter: 'blur(64px)',
  },
});

interface Props {
  copy: import('@bdkinc/content').PageData<'service-artificial-intelligence'>['watsonx'];
  className?: string;
  xstyle?: StyleXStyles;
}

export default function WatsonxSpotlight({ copy, className, xstyle }: Props) {
  const section = stylex.props(styles.section, xstyle);
  const scanlines = stylex.props(styles.scanlines);
  const circuit = stylex.props(styles.circuit);
  return (
    <section {...section} className={cn(section.className, className)}>
      {/* Background Effects */}
      <div {...stylex.props(styles.glowTop)} />
      <div {...stylex.props(styles.glowBottom)} />
      <div {...scanlines} className={cn(scanlines.className, 'scanlines')} />
      <div {...circuit} className={cn(circuit.className, 'circuit-overlay')} />
      <div {...stylex.props(styles.grid, styles.gridCols)}>
        {/* Content Side */}
        <div {...stylex.props(styles.content)}>
          <div {...stylex.props(styles.eyebrow)}>
            <PiCpu {...stylex.props(styles.eyebrowIcon)} />
            {copy.eyebrow}
          </div>
          <h2 {...stylex.props(styles.heading)}>
            {copy.heading}{' '}
            <span {...stylex.props(styles.headingAccent)}>
              {copy.headingAccent}
            </span>
          </h2>
          <p {...stylex.props(styles.body)}>{copy.body}</p>
          <div {...stylex.props(styles.features, styles.featuresCols)}>
            {[
              copy.features.watsonxAiForGenerativeModels,
              copy.features.watsonxDataForLakehouseScale,
              copy.features.watsonxGovernanceForCompliance,
              copy.features.openshiftContainerization,
            ].map((feature, i) => (
              <div key={i} {...stylex.props(styles.feature)}>
                <PiCheckCircle {...stylex.props(styles.featureIcon)} />
                <span {...stylex.props(styles.featureLabel)}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Visual Side - "Module" Look */}
        <div {...stylex.props(styles.visual)}>
          <TechCard
            variant="technical"
            interactive={false}
            xstyle={styles.cardShadow}
          >
            <div {...stylex.props(styles.moduleBody)}>
              {/* Header */}
              <div {...stylex.props(styles.moduleHead)}>
                <div {...stylex.props(styles.dots)}>
                  <div {...stylex.props(styles.dotMuted)} />
                  <div {...stylex.props(styles.dotMuted)} />
                  <div {...stylex.props(styles.dotPrimary)} />
                </div>
                <div {...stylex.props(styles.nodeStatus)}>
                  {copy.nodeStatus}
                </div>
              </div>
              {/* Modules Grid */}
              <div {...stylex.props(styles.modules)}>
                <div
                  {...stylex.props(
                    stylex.defaultMarker(),
                    styles.modulePrimary
                  )}
                >
                  <div {...stylex.props(styles.moduleIconPrimary)}>
                    <PiBrain {...stylex.props(styles.moduleGlyph)} />
                  </div>
                  <div {...stylex.props(styles.moduleText)}>
                    <div {...stylex.props(styles.moduleTitle)}>
                      {copy.foundationModels.title}
                    </div>
                    <div {...stylex.props(styles.moduleDesc)}>
                      {copy.foundationModels.description}
                    </div>
                  </div>
                  <div {...stylex.props(styles.moduleMeta)}>
                    <div {...stylex.props(styles.moduleDot)} />
                  </div>
                </div>
                <div
                  {...stylex.props(stylex.defaultMarker(), styles.moduleMuted)}
                >
                  <div {...stylex.props(styles.moduleIconSecondary)}>
                    <PiDatabase {...stylex.props(styles.moduleGlyph)} />
                  </div>
                  <div {...stylex.props(styles.moduleText)}>
                    <div {...stylex.props(styles.moduleTitle)}>
                      {copy.vectorStore.title}
                    </div>
                    <div {...stylex.props(styles.moduleDesc)}>
                      {copy.vectorStore.description}
                    </div>
                  </div>
                  <div {...stylex.props(styles.moduleStatus)}>
                    {copy.vectorStore.status}
                  </div>
                </div>
                <div
                  {...stylex.props(stylex.defaultMarker(), styles.moduleMuted)}
                >
                  <div {...stylex.props(styles.moduleIconPrimary)}>
                    <PiShieldCheck {...stylex.props(styles.moduleGlyph)} />
                  </div>
                  <div {...stylex.props(styles.moduleText)}>
                    <div {...stylex.props(styles.moduleTitle)}>
                      {copy.governance.title}
                    </div>
                    <div {...stylex.props(styles.moduleDesc)}>
                      {copy.governance.description}
                    </div>
                  </div>
                  <div {...stylex.props(styles.moduleStatus)}>
                    {copy.governance.status}
                  </div>
                </div>
              </div>
            </div>
          </TechCard>
          {/* Background */}
          <div {...stylex.props(styles.backdrop)} />
        </div>
      </div>
    </section>
  );
}
