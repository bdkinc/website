import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { cn } from '@bdkinc/design-system';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { TechCard } from '@/components/TechCard';
import type { PageData, Partner } from '@bdkinc/content';

const hover = '@media (hover: hover)';
const sm = '@media (min-width: 40rem)';
const md = '@media (min-width: 48rem)';
const lg = '@media (min-width: 64rem)';
const colorTransition =
  'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke';
const motionTransition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const timing = 'cubic-bezier(0.4, 0, 0.2, 1)';
const easeOut = 'cubic-bezier(0, 0, 0.2, 1)';
// TechCard no longer carries a `group` marker, so card-hovered states reuse
// the ancestor-hover pattern to preserve the original group-hover styling.

const styles = stylex.create({
  section: {
    position: 'relative',
    paddingInline: {
      default: '1rem',
      [sm]: '1.5rem',
      [lg]: '2rem',
    },
    paddingBlock: '5rem',
  },
  divider: {
    position: 'absolute',
    top: 0,
    left: '50%',
    height: 1,
    width: '100%',
    transform: 'translateX(-50%)',
    backgroundImage:
      'linear-gradient(to right in oklab, transparent, color-mix(in oklab, var(--border) 60%, transparent), transparent)',
  },
  container: {
    maxWidth: '80rem',
    marginInline: 'auto',
  },
  header: {
    marginBottom: '4rem',
    textAlign: 'center',
    transitionProperty: motionTransition,
    transitionDuration: '700ms',
    transitionTimingFunction: easeOut,
  },
  headerShown: {
    transform: 'translateY(0)',
    opacity: 1,
  },
  headerHidden: {
    transform: 'translateY(2rem)',
    opacity: 0,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: { default: '2.25rem', [md]: '3rem' },
    lineHeight: { default: '2.5rem', [md]: 1 },
    fontWeight: 700,
    letterSpacing: '-0.025em',
    marginBottom: '1rem',
  },
  titleLead: {
    color: 'var(--foreground)',
  },
  titleAccent: {
    backgroundImage:
      'linear-gradient(to bottom right in oklab, var(--primary), var(--secondary))',
    backgroundClip: 'text',
    color: 'transparent',
  },
  lede: {
    fontFamily: 'var(--font-sans)',
    color: 'var(--muted-foreground)',
    maxWidth: '42rem',
    marginInline: 'auto',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
  },
  ledeAccent: {
    color: 'var(--accent)',
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      [md]: 'repeat(2, minmax(0, 1fr))',
    },
    gap: '1.5rem',
  },
  gridCols4: {
    gridTemplateColumns: { [lg]: 'repeat(4, minmax(0, 1fr))' },
  },
  gridCols3: {
    gridTemplateColumns: { [lg]: 'repeat(3, minmax(0, 1fr))' },
  },
  cardBody: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    padding: '1.5rem',
    paddingBottom: '3rem',
    textAlign: 'left',
  },
  cardMain: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  logo: {
    height: '2rem',
    width: 'auto',
    maxWidth: 150,
    opacity: 1,
    scale: {
      default: 1,
      [hover]: { default: 1, [stylex.when.ancestor(':hover')]: 1.05 },
    },
    transitionProperty: motionTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: timing,
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    marginBottom: '0.5rem',
  },
  cardDetail: {
    fontFamily: 'var(--font-sans)',
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    lineHeight: 1.625,
  },
  footer: {
    position: 'absolute',
    bottom: '1.5rem',
    left: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '0.5rem',
  },
  dot: {
    height: '0.5rem',
    width: '0.5rem',
    borderRadius: '9999px',
    backgroundColor: {
      default: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
        [stylex.when.ancestor(':hover')]:
          'color-mix(in oklab, var(--secondary) 50%, transparent)',
      },
    },
    transitionProperty: colorTransition,
    transitionDuration: '500ms',
    transitionTimingFunction: timing,
  },
  bar: {
    height: '0.25rem',
    width: {
      default: '3rem',
      [hover]: { default: '3rem', [stylex.when.ancestor(':hover')]: '5rem' },
    },
    borderRadius: '9999px',
    backgroundColor: {
      default: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
        [stylex.when.ancestor(':hover')]:
          'color-mix(in oklab, var(--secondary) 50%, transparent)',
      },
    },
    transitionProperty: motionTransition,
    transitionDuration: '500ms',
    transitionTimingFunction: timing,
  },
});

export interface TrustShowcaseProps {
  copy: PageData<'home'>['trust'];
  partners: Array<Partner & { id: string }>;
  showAllPartners?: boolean;
  className?: string;
  xstyle?: StyleXStyles;
}
export default function TrustShowcase({
  copy,
  partners,
  showAllPartners = false,
  className,
  xstyle,
}: TrustShowcaseProps) {
  const { ref: headerRef, isIntersecting: headerInView } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.2,
      triggerOnce: true,
    });
  const { ref: gridRef, isIntersecting: gridInView } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      triggerOnce: true,
    });
  const visiblePartners = showAllPartners ? partners : partners.slice(0, 4);
  const section = stylex.props(styles.section, xstyle);
  return (
    <section
      {...section}
      id="trust-showcase"
      className={cn(section.className, className)}
    >
      <div {...stylex.props(styles.divider)} />
      <div {...stylex.props(styles.container)}>
        <div
          ref={headerRef}
          {...stylex.props(
            styles.header,
            headerInView ? styles.headerShown : styles.headerHidden
          )}
        >
          <h2 {...stylex.props(styles.title)}>
            <span {...stylex.props(styles.titleLead)}>
              {copy.headingLead.trim()}{' '}
            </span>
            <span {...stylex.props(styles.titleAccent)}>
              {copy.headingAccent}
            </span>
          </h2>
          <p {...stylex.props(styles.lede)}>
            {copy.bodyLead.trim()}{' '}
            <span {...stylex.props(styles.ledeAccent)}>{copy.bodyAccent}</span>{' '}
            {copy.bodyEnd.trim()}
          </p>
        </div>
        <div
          ref={gridRef}
          {...stylex.props(
            styles.grid,
            visiblePartners.length === 4 ? styles.gridCols4 : styles.gridCols3
          )}
        >
          {visiblePartners.map((partner, index) => (
            <TechCard
              key={partner.id}
              variant="simple"
              interactive
              delay={index * 150}
              animated={gridInView}
            >
              <div {...stylex.props(styles.cardBody)}>
                <div {...stylex.props(styles.cardMain)}>
                  <div {...stylex.props(styles.logoRow)}>
                    {partner.logo && (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        loading="lazy"
                        width={150}
                        height={32}
                        {...stylex.props(styles.logo)}
                      />
                    )}
                  </div>
                  <h3 {...stylex.props(styles.cardTitle)}>
                    {partner.id === 'cloudflare'
                      ? copy.cloudflare.description
                      : partner.id === 'vmware'
                        ? copy.vmware.description
                        : partner.description}
                  </h3>
                  <p {...stylex.props(styles.cardDetail)}>
                    {partner.id === 'cloudflare'
                      ? copy.cloudflare.detail
                      : partner.id === 'vmware'
                        ? copy.vmware.detail
                        : partner.detail}
                  </p>
                </div>
                {/* Custom footer decoration (flipped TechCard footer) */}
                <div {...stylex.props(styles.footer)}>
                  <div {...stylex.props(styles.dot)} />
                  <div {...stylex.props(styles.bar)} />
                </div>
              </div>
            </TechCard>
          ))}
        </div>
      </div>
    </section>
  );
}
