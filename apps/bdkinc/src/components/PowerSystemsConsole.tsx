import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import {
  PiDesktop,
  PiShieldCheck,
  PiDatabase,
  PiLightning,
  PiPulse,
  PiArrowsClockwise,
} from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';
import type { PageData } from '@bdkinc/content';

const md = '@media (min-width: 48rem)';
const lg = '@media (min-width: 64rem)';
const easeOut = 'cubic-bezier(0, 0, 0.2, 1)';
const colorTransition = 'color, background-color, border-color';

const styles = stylex.create({
  root: { position: 'relative', width: '100%', paddingBlock: '3rem' },
  grid: {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      [md]: 'repeat(2, minmax(0, 1fr))',
      [lg]: 'repeat(3, minmax(0, 1fr))',
    },
  },
  body: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    padding: '1.5rem',
    textAlign: 'center',
  },
  iconRow: {
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // TechCard drives --tech-hover-opacity to 1 while hovered (the old `group-hover:`).
  iconBox: {
    borderRadius: '0.25rem',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: '0.5rem',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: easeOut,
  },
  iconBoxPrimary: {
    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    backgroundColor:
      'color-mix(in oklab, var(--primary) calc(5% + 5% * var(--tech-hover-opacity, 0)), transparent)',
  },
  iconBoxSecondary: {
    borderColor: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
    backgroundColor:
      'color-mix(in oklab, var(--secondary) calc(5% + 5% * var(--tech-hover-opacity, 0)), transparent)',
  },
  iconBoxAccent: {
    borderColor: 'color-mix(in oklab, var(--accent) 20%, transparent)',
    backgroundColor:
      'color-mix(in oklab, var(--accent) calc(5% + 5% * var(--tech-hover-opacity, 0)), transparent)',
  },
  glyph: { height: '1.5rem', width: '1.5rem' },
  glyphPrimary: { color: 'var(--primary)' },
  glyphSecondary: { color: 'var(--secondary)' },
  glyphAccent: { color: 'var(--accent)' },
  title: {
    marginBottom: '0.5rem',
    fontFamily: 'var(--font-display)',
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: easeOut,
  },
  titlePrimary: { color: 'var(--tech-title-color, var(--foreground))' },
  titleSecondary: {
    color:
      'color-mix(in oklab, var(--secondary) calc(100% * var(--tech-hover-opacity, 0)), var(--foreground))',
  },
  titleAccent: {
    color:
      'color-mix(in oklab, var(--accent) calc(100% * var(--tech-hover-opacity, 0)), var(--foreground))',
  },
  description: {
    marginBottom: '1.5rem',
    flexGrow: 1,
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: 1.625,
  },
});

type Tone = 'primary' | 'secondary' | 'accent';

const toneStyles: Record<
  Tone,
  { box: StyleXStyles; glyph: StyleXStyles; title: StyleXStyles }
> = {
  primary: {
    box: styles.iconBoxPrimary,
    glyph: styles.glyphPrimary,
    title: styles.titlePrimary,
  },
  secondary: {
    box: styles.iconBoxSecondary,
    glyph: styles.glyphSecondary,
    title: styles.titleSecondary,
  },
  accent: {
    box: styles.iconBoxAccent,
    glyph: styles.glyphAccent,
    title: styles.titleAccent,
  },
};

interface Props {
  copy: PageData<'service-ibm-power'>['infrastructure']['services'];
  xstyle?: StyleXStyles;
}

export function PowerSystemsConsole({ copy, xstyle }: Props) {
  const services = [
    { ...copy.managedHosting, icon: PiDesktop },
    { ...copy.modernization, icon: PiArrowsClockwise },
    { ...copy.disasterRecovery, icon: PiShieldCheck },
    { ...copy.performanceTuning, icon: PiLightning },
    { ...copy.osLifecycle, icon: PiPulse },
    { ...copy.hybridIntegration, icon: PiDatabase },
  ];
  return (
    <div {...stylex.props(styles.root, xstyle)}>
      {/* Console Grid */}
      <div {...stylex.props(styles.grid)}>
        {services.map((s, i) => {
          const trackingColor: Tone =
            i % 3 === 1 ? 'secondary' : i % 3 === 2 ? 'accent' : 'primary';
          const tone = toneStyles[trackingColor];

          return (
            <TechCard
              key={i}
              variant="technical"
              interactive
              delay={i * 100}
              trackingColor={trackingColor}
            >
              <div {...stylex.props(styles.body)}>
                <div {...stylex.props(styles.iconRow)}>
                  <div {...stylex.props(styles.iconBox, tone.box)}>
                    <s.icon {...stylex.props(styles.glyph, tone.glyph)} />
                  </div>
                </div>
                <h4 {...stylex.props(styles.title, tone.title)}>{s.title}</h4>
                <p {...stylex.props(styles.description)}>{s.desc}</p>
              </div>
            </TechCard>
          );
        })}
      </div>
    </div>
  );
}
