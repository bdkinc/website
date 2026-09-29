import { useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { CardTitle, CardDescription } from '@bdkinc/design-system';
import { iconMap } from '@/lib/icons';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { TechCard } from '@/components/TechCard';
import type { PageData } from '@bdkinc/content';
interface ServicesProps {
  copy: PageData<'home'>['services'];
  services: Array<{
    slug: string;
    title: string;
    description: string;
    icon: string;
  }>;
  xstyle?: StyleXStyles;
}

const colorTransition =
  'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to';
const styles = stylex.create({
  section: {
    paddingBlock: '6rem',
    paddingInline: {
      default: '1rem',
      '@media (min-width: 40rem)': '1.5rem',
      '@media (min-width: 64rem)': '2rem',
    },
  },
  container: { marginInline: 'auto', maxWidth: '80rem' },
  header: {
    marginBottom: '4rem',
    textAlign: 'center',
    translate: '0 2rem',
    opacity: 0,
    transitionProperty: 'opacity, transform',
    transitionDuration: '700ms',
    transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  headerVisible: { translate: '0 0', opacity: 1 },
  heading: {
    marginBottom: '1rem',
    fontFamily: 'var(--font-display)',
    fontSize: { default: '2.25rem', '@media (min-width: 48rem)': '3rem' },
    lineHeight: { default: '2.5rem', '@media (min-width: 48rem)': 1 },
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  headingLead: { color: 'var(--foreground)' },
  headingAccent: {
    backgroundImage:
      'linear-gradient(to bottom right in oklab, var(--primary), var(--secondary))',
    backgroundClip: 'text',
    color: 'transparent',
  },
  body: {
    marginInline: 'auto',
    maxWidth: '42rem',
    color: 'var(--muted-foreground)',
    fontFamily: 'var(--font-sans)',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
  },
  bodyAccent: { color: 'var(--accent)', fontWeight: 600 },
  grid: {
    display: 'grid',
    gridAutoRows: 'minmax(0, 1fr)',
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      '@media (min-width: 48rem)': 'repeat(3, minmax(0, 1fr))',
    },
    gap: '1.5rem',
  },
  link: {
    position: 'relative',
    zIndex: 20,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '2rem',
    textAlign: 'center',
  },
  // Border alpha rises by 30% while TechCard sets --tech-hover-opacity to 1 (group-hover).
  icon: {
    marginInline: 'auto',
    marginBottom: '1.5rem',
    display: 'flex',
    width: 'fit-content',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'calc(var(--radius) + 4px)',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: '1.25rem',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  iconPrimary: {
    backgroundImage:
      'linear-gradient(to bottom right in oklab, color-mix(in oklab, var(--primary) 10%, transparent), color-mix(in oklab, var(--primary) 5%, transparent))',
    borderColor:
      'color-mix(in oklab, var(--primary) calc(20% + 30% * var(--tech-hover-opacity)), transparent)',
  },
  iconSecondary: {
    backgroundImage:
      'linear-gradient(to bottom right in oklab, color-mix(in oklab, var(--secondary) 10%, transparent), color-mix(in oklab, var(--secondary) 5%, transparent))',
    borderColor:
      'color-mix(in oklab, var(--secondary) calc(20% + 30% * var(--tech-hover-opacity)), transparent)',
  },
  iconAccent: {
    backgroundImage:
      'linear-gradient(to bottom right in oklab, color-mix(in oklab, var(--accent) 20%, transparent), color-mix(in oklab, var(--accent) 10%, transparent))',
    borderColor:
      'color-mix(in oklab, var(--accent) calc(30% + 30% * var(--tech-hover-opacity)), transparent)',
  },
  glyph: { height: '2.5rem', width: '2.5rem' },
  glyphPrimary: { color: 'var(--primary)' },
  glyphSecondary: { color: 'var(--secondary)' },
  glyphAccent: { color: 'var(--accent)' },
  title: {
    marginBottom: '0.5rem',
    textAlign: 'center',
    fontFamily: 'var(--font-display)',
    color: 'var(--tech-title-color, var(--foreground))',
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    letterSpacing: '0.05em',
    transitionProperty: colorTransition,
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  description: { textAlign: 'center', lineHeight: 1.625 },
});

// Rotate icon accent colors: primary → secondary → accent
const iconColors = [
  { box: styles.iconPrimary, glyph: styles.glyphPrimary },
  { box: styles.iconSecondary, glyph: styles.glyphSecondary },
  { box: styles.iconAccent, glyph: styles.glyphAccent },
];

export default function Services({ services, copy, xstyle }: ServicesProps) {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  // Viewport detection for section header
  const { ref: headerRef, isIntersecting: headerInView } =
    useIntersectionObserver({
      threshold: 0.2,
      rootMargin: '0px',
      triggerOnce: true,
    });
  // Viewport detection for grid container
  const { ref: gridRef, isIntersecting: gridInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });
  useEffect(() => {
    // Apply view-transition names to icons, titles, and descriptions
    iconRefs.current.forEach((icon, index) => {
      const slug = services[index]?.slug;
      if (icon && slug) {
        icon.style.setProperty('view-transition-name', `service-icon-${slug}`);
      }
    });
    titleRefs.current.forEach((title, index) => {
      const slug = services[index]?.slug;
      if (title && slug) {
        title.style.setProperty(
          'view-transition-name',
          `service-title-${slug}`
        );
      }
    });
    descriptionRefs.current.forEach((description, index) => {
      const slug = services[index]?.slug;
      if (description && slug) {
        description.style.setProperty(
          'view-transition-name',
          `service-description-${slug}`
        );
      }
    });
  }, [services]);
  return (
    <section {...stylex.props(styles.section, xstyle)}>
      <div {...stylex.props(styles.container)}>
        {/* Section Header */}
        <div
          ref={headerRef as any}
          {...stylex.props(styles.header, headerInView && styles.headerVisible)}
        >
          <h2 {...stylex.props(styles.heading)}>
            <span {...stylex.props(styles.headingLead)}>
              {copy.headingLead.trim()}{' '}
            </span>
            <span {...stylex.props(styles.headingAccent)}>
              {copy.headingAccent}
            </span>
          </h2>
          <p {...stylex.props(styles.body)}>
            {copy.bodyLead.trim()}{' '}
            <span {...stylex.props(styles.bodyAccent)}>{copy.bodyAccent}</span>{' '}
            {copy.bodyEnd.trim()}
          </p>
        </div>
        {/* Services Grid */}
        <div ref={gridRef as any} {...stylex.props(styles.grid)}>
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            const delayMs = index * 100;
            const color = iconColors[index % iconColors.length];
            return (
              <TechCard
                key={service.slug}
                asChild
                interactive
                variant="technical"
                delay={delayMs}
                animated={gridInView}
                xstyle={styles.link}
              >
                <a href={`/services/${service.slug}`}>
                  <div
                    ref={(el) => {
                      iconRefs.current[index] = el;
                    }}
                    {...stylex.props(styles.icon, color.box)}
                  >
                    {Icon && (
                      <Icon {...stylex.props(styles.glyph, color.glyph)} />
                    )}
                  </div>
                  <CardTitle
                    ref={(el) => {
                      titleRefs.current[index] = el;
                    }}
                    xstyle={styles.title}
                  >
                    {service.title}
                  </CardTitle>
                  <CardDescription
                    ref={(el) => {
                      descriptionRefs.current[index] = el;
                    }}
                    xstyle={styles.description}
                  >
                    {service.description}
                  </CardDescription>
                </a>
              </TechCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
