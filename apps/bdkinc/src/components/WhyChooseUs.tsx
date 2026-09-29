import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { cn } from '@bdkinc/design-system';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import FeatureCarousel from '@/components/FeatureCarousel';

import type { PageData } from '@bdkinc/content';
interface WhyChooseUsProps {
  copy: PageData<'home'>['whyUs'];
  className?: string;
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  section: {
    position: 'relative',
    backgroundColor: 'var(--page-why-bg)',
    paddingBlock: '5rem',
    paddingInline: {
      default: '1rem',
      '@media (min-width: 40rem)': '1.5rem',
      '@media (min-width: 64rem)': '2rem',
    },
  },
  divider: {
    position: 'absolute',
    top: 0,
    left: '50%',
    height: 1,
    width: '100%',
    translate: '-50% 0',
    backgroundImage:
      'linear-gradient(to right in oklab, transparent, color-mix(in oklab, var(--border) 60%, transparent), transparent)',
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
  headingBrand: {
    backgroundImage:
      'linear-gradient(to bottom right in oklab, var(--primary), var(--secondary))',
    backgroundClip: 'text',
    color: 'transparent',
    fontWeight: 800,
  },
  brandLead: { fontWeight: 800 },
  body: {
    marginInline: 'auto',
    marginTop: '1rem',
    maxWidth: '42rem',
    color: 'var(--muted-foreground)',
    fontFamily: 'var(--font-sans)',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
  },
  bodyAccent: { color: 'var(--accent)', fontWeight: 600 },
});

export default function WhyChooseUs({
  copy,
  className,
  xstyle,
}: WhyChooseUsProps) {
  const reasons = [
    { ...copy.response, icon: 'Lightning' as const },
    { ...copy.expertise, icon: 'ShieldCheck' as const },
    { ...copy.service, icon: 'Users' as const },
  ];
  const { ref: headerRef, isIntersecting: headerInView } =
    useIntersectionObserver({
      threshold: 0.2,
      rootMargin: '0px',
      triggerOnce: true,
    });
  const section = stylex.props(styles.section, xstyle);

  return (
    <section
      id="why-choose-us"
      {...section}
      className={cn(section.className, className)}
    >
      <div {...stylex.props(styles.divider)} />

      <div {...stylex.props(styles.container)}>
        <div
          ref={headerRef as any}
          {...stylex.props(styles.header, headerInView && styles.headerVisible)}
        >
          <h2 {...stylex.props(styles.heading)}>
            <span {...stylex.props(styles.headingLead)}>
              {copy.headingLead.trim()}{' '}
            </span>
            <span {...stylex.props(styles.headingBrand)}>
              <span {...stylex.props(styles.brandLead)}>{copy.brandLead}</span>
              {copy.brandEnd}
            </span>
          </h2>
          <p {...stylex.props(styles.body)}>
            {copy.bodyLead.trim()}{' '}
            <span {...stylex.props(styles.bodyAccent)}>{copy.bodyAccent}</span>
            {copy.bodyEnd}
          </p>
        </div>

        <FeatureCarousel features={reasons} />
      </div>
    </section>
  );
}
