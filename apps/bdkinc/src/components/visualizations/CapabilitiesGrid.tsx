import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import {
  PiLayout,
  PiDesktop,
  PiDatabase,
  PiGitBranch,
  PiTerminal,
} from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';
import { cn } from '@bdkinc/design-system';

const hover = '@media (hover: hover)';
const md = '@media (min-width: 48rem)';
const lg = '@media (min-width: 64rem)';
const colorTransition =
  'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke';
const timing = 'cubic-bezier(0.4, 0, 0.2, 1)';
// Card-hovered states scope to the TechCard defaultMarker (the original `group` boundary).

const styles = stylex.create({
  root: {
    width: '100%',
    maxWidth: '80rem',
    marginInline: 'auto',
    marginBlock: '4rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  headerIcon: {
    height: '1.25rem',
    width: '1.25rem',
    color: 'var(--primary)',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
  },
  rule: {
    height: 1,
    flexGrow: 1,
    marginLeft: '1rem',
    backgroundColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      [md]: 'repeat(2, minmax(0, 1fr))',
      [lg]: 'repeat(4, minmax(0, 1fr))',
    },
    gap: '1.5rem',
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
  iconRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  iconBox: {
    borderRadius: '0.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    backgroundColor: {
      default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
        [stylex.when.ancestor(':hover')]:
          'color-mix(in oklab, var(--primary) 15%, transparent)',
      },
    },
    padding: '0.75rem',
    scale: {
      default: 1,
      [hover]: { default: 1, [stylex.when.ancestor(':hover')]: 1.1 },
    },
    transitionProperty: 'transform, scale',
    transitionDuration: '500ms',
    transitionTimingFunction: timing,
  },
  icon: {
    height: '2rem',
    width: '2rem',
    color: 'var(--primary)',
  },
  title: {
    fontFamily: 'var(--font-display)',
    color: {
      default: 'var(--foreground)',
      [hover]: {
        default: 'var(--foreground)',
        [stylex.when.ancestor(':hover')]: 'var(--primary)',
      },
    },
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    marginBottom: '1.5rem',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: timing,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: 'auto',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    color: {
      default: 'var(--muted-foreground)',
      [hover]: {
        default: 'var(--muted-foreground)',
        [stylex.when.ancestor(':hover')]: 'var(--foreground)',
      },
    },
    fontSize: '0.625rem',
    letterSpacing: '0.1em',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: timing,
  },
  bullet: {
    height: '0.375rem',
    width: '0.375rem',
    borderRadius: 0,
    marginRight: '0.75rem',
    backgroundColor: {
      default: 'color-mix(in oklab, var(--primary) 40%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--primary) 40%, transparent)',
        [stylex.when.ancestor(':hover')]: 'var(--primary)',
      },
    },
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: timing,
  },
});

interface Props {
  copy: import('@bdkinc/content').PageData<'service-application-development'>['capabilities'];
  className?: string;
  xstyle?: StyleXStyles;
}

export default function CapabilitiesGrid({ copy, className, xstyle }: Props) {
  const capabilities = [
    {
      title: copy.items.frontendUx.title,
      icon: PiLayout,
      details: [
        copy.items.frontendUx.details.reactAstroArchitecture,
        copy.items.frontendUx.details.responsiveInterfaces,
        copy.items.frontendUx.details.stateManagement,
        copy.items.frontendUx.details.wcagAccessibility,
      ],
      code: 'FE_LAYER',
    },
    {
      title: copy.items.backendSystems.title,
      icon: PiDesktop,
      details: [
        copy.items.backendSystems.details.restGraphqlApis,
        copy.items.backendSystems.details.microservices,
        copy.items.backendSystems.details.serverlessFunctions,
        copy.items.backendSystems.details.realTimeSockets,
      ],
      code: 'BE_CORE',
    },
    {
      title: copy.items.dataArchitecture.title,
      icon: PiDatabase,
      details: [
        copy.items.dataArchitecture.details.sqlOptimization,
        copy.items.dataArchitecture.details.nosqlModeling,
        copy.items.dataArchitecture.details.dataWarehousing,
        copy.items.dataArchitecture.details.cachingStrategies,
      ],
      code: 'DB_STORE',
    },
    {
      title: copy.items.devsecops.title,
      icon: PiGitBranch,
      details: [
        copy.items.devsecops.details.ciCdPipelines,
        copy.items.devsecops.details.containerization,
        copy.items.devsecops.details.infrastructureAsCode,
        copy.items.devsecops.details.automatedTesting,
      ],
      code: 'OPS_PIPE',
    },
  ];
  const root = stylex.props(styles.root, xstyle);
  return (
    <div {...root} className={cn(root.className, className)}>
      <div {...stylex.props(styles.header)}>
        <PiTerminal {...stylex.props(styles.headerIcon)} />
        <h3 {...stylex.props(styles.heading)}>{copy.heading}</h3>
        <div {...stylex.props(styles.rule)}></div>
      </div>
      <div {...stylex.props(styles.grid)}>
        {capabilities.map((cap, index) => (
          <TechCard
            key={index}
            variant="technical"
            interactive
            delay={index * 100}
          >
            <div {...stylex.props(styles.body)}>
              <div {...stylex.props(styles.iconRow)}>
                <div {...stylex.props(styles.iconBox)}>
                  <cap.icon {...stylex.props(styles.icon)} />
                </div>
              </div>
              <h4 {...stylex.props(styles.title)}>{cap.title}</h4>
              <ul {...stylex.props(styles.list)}>
                {cap.details.map((detail, idx) => (
                  <li key={idx} {...stylex.props(styles.item)}>
                    <span {...stylex.props(styles.bullet)}></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </TechCard>
        ))}
      </div>
    </div>
  );
}
