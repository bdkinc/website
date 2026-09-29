import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import React from 'react';
import { PiDatabase, PiDesktop, PiCloud, PiStack } from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';
import { cn } from '@bdkinc/design-system';

const hover = '@media (hover: hover)';
const sm = '@media (min-width: 40rem)';
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
    marginBlock: '6rem',
  },
  header: {
    marginBottom: '3rem',
    textAlign: { default: 'center', [md]: 'left' },
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
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      [lg]: 'repeat(2, minmax(0, 1fr))',
    },
    gap: '2rem',
  },
  body: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    textAlign: 'left',
  },
  layerHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    backgroundColor: {
      default: 'color-mix(in oklab, var(--muted) 20%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--muted) 20%, transparent)',
        [stylex.when.ancestor(':hover')]:
          'color-mix(in oklab, var(--primary) 5%, transparent)',
      },
    },
    padding: '1.5rem',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: timing,
  },
  layerIcon: {
    display: 'flex',
    height: '3rem',
    width: '3rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
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
    backgroundColor: 'var(--background)',
    boxShadow: {
      default: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      [hover]: {
        default: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        [stylex.when.ancestor(':hover')]:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
    },
    transitionProperty:
      'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing',
    transitionDuration: '150ms',
    transitionTimingFunction: timing,
  },
  layerGlyph: {
    height: '1.5rem',
    width: '1.5rem',
    color: 'var(--primary)',
  },
  layerName: {
    fontFamily: 'var(--font-display)',
    color: {
      default: 'var(--foreground)',
      [hover]: {
        default: 'var(--foreground)',
        [stylex.when.ancestor(':hover')]: 'var(--primary)',
      },
    },
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: timing,
  },
  moduleLabel: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--muted-foreground)',
    fontSize: '0.625rem',
    letterSpacing: '0.1em',
  },
  layerDesc: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'color-mix(in oklab, var(--primary) 5%, transparent)',
    paddingInline: '1.5rem',
    paddingBlock: '1rem',
  },
  layerDescText: {
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: 1.625,
  },
  itemGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      [sm]: 'repeat(3, minmax(0, 1fr))',
    },
    gap: 1,
    backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
  },
  cell: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRightWidth: {
      default: 1,
      ':last-child': 0,
    },
    borderRightStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 5%, transparent)',
    backgroundColor: {
      default: 'color-mix(in oklab, var(--card) 40%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--card) 40%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 5%, transparent)',
      },
    },
    padding: '1rem',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: timing,
  },
  itemName: {
    color: 'var(--foreground)',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    marginBottom: '0.25rem',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemCategory: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--muted-foreground)',
    fontSize: '0.5625rem',
    letterSpacing: '-0.05em',
  },
  itemVersion: {
    borderRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    color: 'color-mix(in oklab, var(--primary) 70%, transparent)',
    paddingInline: '0.25rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.5625rem',
  },
});

interface TechItem {
  name: string;
  category: string;
  version?: string;
}
interface TechLayer {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  items: TechItem[];
  moduleLabel: string;
}
interface Props {
  copy: import('@bdkinc/content').PageData<'service-application-development'>['techStack'];
  className?: string;
  xstyle?: StyleXStyles;
}
export default function TechStackShowcase({ copy, className, xstyle }: Props) {
  const layers: TechLayer[] = [
    {
      id: 'frontend',
      ...copy.layers.clientPresentationLayer,
      icon: PiStack,
      items: [
        'react',
        'astro',
        'typescript',
        'tailwindCss',
        'gsap',
        'phosphor',
      ].map(
        (key) =>
          copy.layers.clientPresentationLayer.items[
            key as keyof typeof copy.layers.clientPresentationLayer.items
          ]
      ),
    },
    {
      id: 'backend',
      ...copy.layers.serverLogicLayer,
      icon: PiDesktop,
      items: (
        ['nodeJs', 'python', 'go', 'graphql', 'rest', 'docker'] as const
      ).map((key) => copy.layers.serverLogicLayer.items[key]),
    },
    {
      id: 'database',
      ...copy.layers.dataPersistenceLayer,
      icon: PiDatabase,
      items: (
        [
          'postgresql',
          'mongodb',
          'redis',
          'ibmDb2',
          'elasticsearch',
          'vectorDb',
        ] as const
      ).map((key) => copy.layers.dataPersistenceLayer.items[key]),
    },
    {
      id: 'cloud',
      ...copy.layers.infrastructureLayer,
      icon: PiCloud,
      items: (
        [
          'aws',
          'azure',
          'bdkCloud',
          'kubernetes',
          'terraform',
          'openshift',
        ] as const
      ).map((key) => copy.layers.infrastructureLayer.items[key]),
    },
  ];
  const root = stylex.props(styles.root, xstyle);
  return (
    <div {...root} className={cn(root.className, className)}>
      <div {...stylex.props(styles.header)}>
        <h2 {...stylex.props(styles.heading)}>{copy.heading}</h2>
        <p {...stylex.props(styles.lede)}>{copy.body}</p>
      </div>
      <div {...stylex.props(styles.grid)}>
        {layers.map((layer) => (
          <TechCard key={layer.id} variant="technical" interactive>
            <div {...stylex.props(styles.body)}>
              {/* Header */}
              <div {...stylex.props(styles.layerHead)}>
                <div {...stylex.props(styles.layerIcon)}>
                  <layer.icon {...stylex.props(styles.layerGlyph)} />
                </div>
                <div>
                  <h3 {...stylex.props(styles.layerName)}>{layer.name}</h3>
                  <p {...stylex.props(styles.moduleLabel)}>
                    {layer.moduleLabel}
                  </p>
                </div>
              </div>
              {/* Description */}
              <div {...stylex.props(styles.layerDesc)}>
                <p {...stylex.props(styles.layerDescText)}>
                  {layer.description}
                </p>
              </div>
              {/* Grid */}
              <div {...stylex.props(styles.itemGrid)}>
                {layer.items.map((item, idx) => (
                  <div key={idx} {...stylex.props(styles.cell)}>
                    <span {...stylex.props(styles.itemName)}>{item.name}</span>
                    <div {...stylex.props(styles.itemRow)}>
                      <span {...stylex.props(styles.itemCategory)}>
                        {item.category}
                      </span>
                      {item.version && (
                        <span {...stylex.props(styles.itemVersion)}>
                          v{item.version}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TechCard>
        ))}
      </div>
    </div>
  );
}
