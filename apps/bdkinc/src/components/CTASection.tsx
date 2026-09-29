import type { CSSProperties, HTMLAttributeAnchorTarget } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { SiteSettings } from '@bdkinc/content';
import { Card } from '@bdkinc/design-system';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import CTAButton from '@/components/CTAButton.tsx';

export type CTAIcon =
  | 'mail'
  | 'phone'
  | 'sparkles'
  | 'arrow'
  | 'home'
  | 'back'
  | 'click'
  | 'search'
  | 'chat'
  | 'none';

export interface CTAAction {
  text: string;
  href: string;
  icon?: CTAIcon;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
}

export interface CTASectionProps {
  copy: SiteSettings['cta'];
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  icon?: CTAIcon;
  primaryAction?: CTAAction;
  secondaryAction?: CTAAction;
  /**
   * When true, skip the intersection observer and show immediately.
   * Useful for pages where the component is server-rendered without a client directive.
   */
  disableObserver?: boolean;
  xstyle?: StyleXStyles;
}

const hover = '@media (hover: hover)';
const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
const revealTransition = 'opacity, transform';
const styles = stylex.create({
  section: {
    paddingBlock: '8rem',
    paddingInline: {
      default: '1rem',
      '@media (min-width: 40rem)': '1.5rem',
      '@media (min-width: 64rem)': '2rem',
    },
  },
  container: {
    marginInline: 'auto',
    maxWidth: '56rem',
    textAlign: 'center',
    translate: '0 1rem',
    opacity: 0,
    transitionProperty: revealTransition,
    transitionDuration: '700ms',
    transitionTimingFunction: ease,
    willChange: 'transform',
  },
  containerVisible: { translate: '0 0', opacity: 1 },
  card: {
    backgroundColor: 'transparent',
    backgroundImage:
      'linear-gradient(to bottom right in oklab, color-mix(in oklab, var(--primary) 10%, transparent), transparent, color-mix(in oklab, var(--secondary) 10%, transparent))',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    padding: '2.5rem',
    opacity: 1,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    backdropFilter: 'blur(24px)',
  },
  title: {
    marginBottom: '1rem',
    color: 'var(--foreground)',
    fontSize: { default: '1.875rem', '@media (min-width: 48rem)': '2.25rem' },
    lineHeight: { default: '2.25rem', '@media (min-width: 48rem)': '2.5rem' },
    fontWeight: 700,
    translate: '0 1.25rem',
    opacity: 0,
    transitionProperty: revealTransition,
    transitionDuration: '700ms',
    transitionTimingFunction: ease,
  },
  description: {
    marginBottom: '2rem',
    color: 'var(--muted-foreground)',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    translate: '0 1.25rem',
    opacity: 0,
    transitionProperty: revealTransition,
    transitionDuration: '700ms',
    transitionTimingFunction: ease,
  },
  actionsReveal: {
    translate: '0 0.75rem',
    opacity: 0,
    transitionProperty: revealTransition,
    transitionDuration: '600ms',
    transitionTimingFunction: ease,
  },
  visible: { translate: '0 0', opacity: 1 },
  actions: {
    display: 'flex',
    flexDirection: { default: 'column', '@media (min-width: 40rem)': 'row' },
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  primarySlot: { position: 'relative', display: 'inline-block' },
  secondarySlot: { display: 'inline-block' },
  buttonMotion: {
    transitionProperty: 'transform, translate, scale, rotate',
    transitionDuration: '200ms',
    transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
    scale: { default: null, [hover]: { default: null, ':hover': 1.02 } },
  },
  primaryButton: {
    position: 'relative',
    zIndex: 10,
    cursor: 'pointer',
    boxShadow:
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  // A conditional override replaces the whole property, so the outline variant's default is restated.
  secondaryButton: {
    borderColor: {
      default: 'var(--primary)',
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
});

const delay = (inView: boolean, ms: number): CSSProperties => ({
  transitionDelay: inView ? `${ms}ms` : '0ms',
});

export default function CTASection({
  copy,
  title = copy.title,
  description = copy.description,
  buttonText = copy.buttonText,
  buttonHref = copy.buttonHref,
  icon,
  primaryAction,
  secondaryAction,
  disableObserver = false,
  xstyle,
}: CTASectionProps) {
  const resolvedPrimaryAction: CTAAction = {
    text: primaryAction?.text ?? buttonText,
    href: primaryAction?.href ?? buttonHref,
    icon: primaryAction?.icon ?? icon,
    target: primaryAction?.target,
    rel: primaryAction?.rel,
  };

  // Viewport detection for CTA section
  const { ref: sectionRef, isIntersecting } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.2,
      rootMargin: '0px',
      triggerOnce: true,
    });

  const sectionInView = disableObserver ? true : isIntersecting;

  return (
    <section {...stylex.props(styles.section, xstyle)}>
      <div
        ref={sectionRef}
        {...stylex.props(
          styles.container,
          sectionInView && styles.containerVisible
        )}
      >
        <Card size="xl" interactive={false} xstyle={styles.card}>
          <h2
            {...stylex.props(styles.title, sectionInView && styles.visible)}
            style={delay(sectionInView, 150)}
          >
            {title}
          </h2>
          <p
            {...stylex.props(
              styles.description,
              sectionInView && styles.visible
            )}
            style={delay(sectionInView, 300)}
          >
            {description}
          </p>
          <div
            {...stylex.props(
              styles.actionsReveal,
              sectionInView && styles.visible
            )}
            style={delay(sectionInView, 450)}
          >
            <div {...stylex.props(styles.actions)}>
              <div {...stylex.props(styles.primarySlot)}>
                <CTAButton
                  xstyle={[styles.buttonMotion, styles.primaryButton]}
                  icon={resolvedPrimaryAction.icon}
                  href={resolvedPrimaryAction.href}
                  target={resolvedPrimaryAction.target}
                  rel={resolvedPrimaryAction.rel}
                >
                  {resolvedPrimaryAction.text}
                </CTAButton>
              </div>
              {secondaryAction && (
                <div {...stylex.props(styles.secondarySlot)}>
                  <CTAButton
                    variant="outline"
                    xstyle={[styles.buttonMotion, styles.secondaryButton]}
                    icon={secondaryAction.icon}
                    href={secondaryAction.href}
                    target={secondaryAction.target}
                    rel={secondaryAction.rel}
                  >
                    {secondaryAction.text}
                  </CTAButton>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
