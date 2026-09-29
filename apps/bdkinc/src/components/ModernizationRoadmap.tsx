import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  PiCaretDown,
  PiDesktop,
  PiDeviceMobile,
  PiStack,
  PiArrowRight,
} from 'react-icons/pi';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { cn } from '@bdkinc/design-system';

gsap.registerPlugin(useGSAP);

const hover = '@media (hover: hover)';
const md = '@media (min-width: 48rem)';
const motionOK = '@media (prefers-reduced-motion: no-preference)';
const timing = 'cubic-bezier(0.4, 0, 0.2, 1)';
// Footer lines brighten when the footer cluster is hovered, preserving the
// original group-hover styling via the ancestor-hover pattern.

// Tailwind `animate-ping`: scale 1 -> 2 while fading out.
const ping = stylex.keyframes({
  '0%': { transform: 'scale(1)', opacity: 0.75 },
  '75%': { transform: 'scale(2)', opacity: 0 },
  '100%': { transform: 'scale(2)', opacity: 0 },
});

// Tailwind `animate-pulse`: opacity 1 -> 0.5.
const pulse = stylex.keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
});

const styles = stylex.create({
  root: {
    position: 'relative',
    width: '100%',
    paddingBlock: '3rem',
  },
  // NOTE: the legacy `bg-grid-slate-900/[0.04]` / `dark:bg-grid-slate-400/[0.05]`
  // utilities have no generated rule; only the mask and position rendered.
  gridLayer: {
    position: 'absolute',
    inset: 0,
    maskImage: 'linear-gradient(0deg, transparent, black)',
    backgroundPosition: 'bottom 1px center',
  },
  container: {
    position: 'relative',
    maxWidth: '64rem',
    marginInline: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '2rem',
  },
  gridCols: {
    gridTemplateColumns: { [md]: 'repeat(3, minmax(0, 1fr))' },
  },
  step: {
    position: 'relative',
  },
  linkDesktop: {
    position: 'absolute',
    top: '50%',
    left: '100%',
    display: { default: 'none', [md]: 'block' },
    height: 2,
    width: '100%',
    transform: 'translateY(-50%)',
    overflow: 'hidden',
    borderRadius: '9999px',
    backgroundColor: 'var(--muted)',
  },
  // GSAP drives x/y inline on shimmers; no transform here so it wins.
  shimmerX: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '33.333333%',
    backgroundImage:
      'linear-gradient(to right in oklab, transparent, var(--primary), transparent)',
  },
  linkMobile: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    display: { default: 'block', [md]: 'none' },
    height: '2rem',
    width: 2,
    transform: 'translateX(-50%)',
    overflow: 'hidden',
    borderRadius: '9999px',
    backgroundColor: 'var(--muted)',
  },
  shimmerY: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '33.333333%',
    width: '100%',
    backgroundImage:
      'linear-gradient(to bottom in oklab, transparent, var(--primary), transparent)',
  },
  card: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'var(--border)',
      [hover]: {
        default: 'var(--border)',
        ':hover': 'color-mix(in oklab, var(--primary) 50%, transparent)',
      },
    },
    backgroundColor: 'color-mix(in oklab, var(--card) 80%, transparent)',
    boxShadow: {
      default: null,
      [hover]: {
        default: null,
        ':hover': '0 0 30px rgba(0, 0, 0, 0.15)',
      },
    },
    paddingInline: '1.5rem',
    paddingTop: '2rem',
    paddingBottom: '1.5rem',
    backdropFilter: 'blur(12px)',
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: '300ms',
    transitionTimingFunction: timing,
  },
  // `scanlines` supplies its CSS rule; positioning comes from StyleX.
  cardTexture: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    borderRadius: '0.75rem',
    opacity: 0.03,
    pointerEvents: 'none',
  },
  // GSAP drives scale/opacity inline on icon badges; none here so it wins.
  iconBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1rem',
    padding: '1rem',
    marginBottom: '1.5rem',
    boxShadow:
      'inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 0, 0, 0.08)',
  },
  iconBadgePrimary: {
    backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    color: 'var(--primary)',
  },
  iconBadgeSecondary: {
    backgroundColor: 'color-mix(in oklab, var(--secondary) 10%, transparent)',
    color: 'var(--secondary)',
  },
  iconBadgeAccent: {
    backgroundColor: 'color-mix(in oklab, var(--accent) 10%, transparent)',
    color: 'var(--accent)',
  },
  iconGlyph: {
    height: '2.25rem',
    width: '2.25rem',
  },
  stepTitle: {
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    marginBottom: '0.5rem',
  },
  stepDesc: {
    color: 'var(--muted-foreground)',
    maxWidth: '26ch',
    fontSize: '0.875rem',
    lineHeight: 1.625,
    marginBottom: 'auto',
  },
  statusWrap: {
    marginTop: '1.5rem',
  },
  statusPrimary: {
    height: '0.375rem',
    width: '0.375rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--primary)',
    color: 'var(--primary)',
    boxShadow: '0 0 8px currentColor',
    animationName: { default: 'none', [motionOK]: pulse },
    animationDuration: '2s',
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    animationIterationCount: 'infinite',
  },
  statusSecondary: {
    height: '0.375rem',
    width: '0.375rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--secondary)',
    color: 'var(--secondary)',
    boxShadow: '0 0 8px currentColor',
    animationName: { default: 'none', [motionOK]: pulse },
    animationDuration: '2s',
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    animationIterationCount: 'infinite',
  },
  statusAccent: {
    height: '0.375rem',
    width: '0.375rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--accent)',
    color: 'var(--accent)',
    boxShadow: '0 0 8px currentColor',
    animationName: { default: 'none', [motionOK]: pulse },
    animationDuration: '2s',
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    animationIterationCount: 'infinite',
  },
  caretRow: {
    display: { default: 'flex', [md]: 'none' },
    justifyContent: 'center',
    color: 'color-mix(in oklab, var(--primary) 40%, transparent)',
    marginTop: '0.5rem',
  },
  caret: {
    height: '1.25rem',
    width: '1.25rem',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4rem',
  },
  footerCluster: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  lineLeft: {
    height: 1,
    width: {
      default: '3rem',
      [hover]: { default: '3rem', [stylex.when.ancestor(':hover')]: '6rem' },
    },
    backgroundImage: {
      default:
        'linear-gradient(to right in oklab, transparent, color-mix(in oklab, var(--primary) 50%, transparent))',
      [hover]: {
        default:
          'linear-gradient(to right in oklab, transparent, color-mix(in oklab, var(--primary) 50%, transparent))',
        [stylex.when.ancestor(':hover')]:
          'linear-gradient(to right in oklab, transparent, var(--primary))',
      },
    },
    transitionProperty: 'all',
    transitionDuration: '500ms',
    transitionTimingFunction: timing,
  },
  lineRight: {
    height: 1,
    width: {
      default: '3rem',
      [hover]: { default: '3rem', [stylex.when.ancestor(':hover')]: '6rem' },
    },
    backgroundImage: {
      default:
        'linear-gradient(to left in oklab, transparent, color-mix(in oklab, var(--primary) 50%, transparent))',
      [hover]: {
        default:
          'linear-gradient(to left in oklab, transparent, color-mix(in oklab, var(--primary) 50%, transparent))',
        [stylex.when.ancestor(':hover')]:
          'linear-gradient(to left in oklab, transparent, var(--primary))',
      },
    },
    transitionProperty: 'all',
    transitionDuration: '500ms',
    transitionTimingFunction: timing,
  },
  footerLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  pingWrap: {
    position: 'relative',
    display: 'flex',
    height: '0.625rem',
    width: '0.625rem',
  },
  pingWave: {
    position: 'absolute',
    display: 'inline-flex',
    height: '100%',
    width: '100%',
    borderRadius: '9999px',
    backgroundColor: 'var(--primary)',
    opacity: 0.75,
    animationName: { default: 'none', [motionOK]: ping },
    animationDuration: '1s',
    animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
    animationIterationCount: 'infinite',
  },
  pingCore: {
    position: 'relative',
    display: 'inline-flex',
    height: '0.625rem',
    width: '0.625rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--primary)',
  },
  footerArrow: {
    height: '1.25rem',
    width: '1.25rem',
    color: 'var(--primary)',
    transform: {
      default: 'translateX(0)',
      [hover]: {
        default: 'translateX(0)',
        [stylex.when.ancestor(':hover')]: 'translateX(0.5rem)',
      },
    },
    transitionProperty: 'transform',
    transitionDuration: '300ms',
    transitionTimingFunction: timing,
  },
});

interface Props {
  copy: Pick<
    import('@bdkinc/content').PageData<'service-ibm-power'>['roadmap'],
    'steps' | 'flowLabel'
  >;
  className?: string;
  xstyle?: StyleXStyles;
}

export function ModernizationRoadmap({ copy, className, xstyle }: Props) {
  const steps = [
    {
      ...copy.steps.legacyFoundation,
      id: 'legacy',
      icon: PiDesktop,
      color: 'primary',
    },
    {
      ...copy.steps.hybridIntegration,
      id: 'hybrid',
      icon: PiStack,
      color: 'secondary',
    },
    {
      ...copy.steps.futureState,
      id: 'future',
      icon: PiDeviceMobile,
      color: 'accent',
    },
  ] as const;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopShimmerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileShimmerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { ref: observerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  useGSAP(
    () => {
      if (!isIntersecting) return;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.2,
            ease: 'power2.out',
          }
        );
      });

      iconRefs.current.forEach((icon, index) => {
        if (!icon) return;
        gsap.fromTo(
          icon,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.2 + 0.3,
            ease: 'back.out(1.7)',
          }
        );
      });

      numberRefs.current.forEach((numberBadge, index) => {
        if (!numberBadge) return;
        gsap.fromTo(
          numberBadge,
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: index * 0.2 + 0.1,
            ease: 'power2.out',
          }
        );
      });

      desktopShimmerRefs.current.forEach((shimmer, index) => {
        if (!shimmer) return;
        gsap.set(shimmer, { x: '-100%' });
        gsap.to(shimmer, {
          x: '300%',
          duration: 2,
          repeat: -1,
          ease: 'linear',
          delay: index * 0.5 + 0.6,
        });
      });

      mobileShimmerRefs.current.forEach((shimmer, index) => {
        if (!shimmer) return;
        gsap.set(shimmer, { y: '-100%' });
        gsap.to(shimmer, {
          y: '300%',
          duration: 2,
          repeat: -1,
          ease: 'linear',
          delay: index * 0.5 + 0.6,
        });
      });
    },
    { scope: containerRef, dependencies: [isIntersecting] }
  );

  const root = stylex.props(styles.root, xstyle);
  const cardTexture = stylex.props(styles.cardTexture);
  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        observerRef.current = el;
      }}
      {...root}
      className={cn(root.className, className)}
    >
      <div {...stylex.props(styles.gridLayer)} />

      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.grid, styles.gridCols)}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            const isSecondary = step.color === 'secondary';
            const isAccent = step.color === 'accent';

            return (
              <div
                key={step.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                {...stylex.props(styles.step)}
                style={{ opacity: 0 }}
              >
                {!isLast && (
                  <div {...stylex.props(styles.linkDesktop)}>
                    <div
                      ref={(el) => {
                        desktopShimmerRefs.current[index] = el;
                      }}
                      {...stylex.props(styles.shimmerX)}
                    />
                  </div>
                )}

                {!isLast && (
                  <div {...stylex.props(styles.linkMobile)}>
                    <div
                      ref={(el) => {
                        mobileShimmerRefs.current[index] = el;
                      }}
                      {...stylex.props(styles.shimmerY)}
                    />
                  </div>
                )}

                <div {...stylex.props(styles.card)}>
                  {/* Scanline texture */}
                  <div
                    {...cardTexture}
                    className={cn(cardTexture.className, 'scanlines')}
                  />

                  {/* Icon */}
                  <div
                    ref={(el) => {
                      iconRefs.current[index] = el;
                    }}
                    {...stylex.props(
                      styles.iconBadge,
                      isAccent
                        ? styles.iconBadgeAccent
                        : isSecondary
                          ? styles.iconBadgeSecondary
                          : styles.iconBadgePrimary
                    )}
                    style={{ opacity: 0 }}
                  >
                    <Icon {...stylex.props(styles.iconGlyph)} />
                  </div>

                  {/* Title */}
                  <h4 {...stylex.props(styles.stepTitle)}>{step.title}</h4>

                  {/* Description */}
                  <p {...stylex.props(styles.stepDesc)}>{step.description}</p>

                  {/* Status indicator */}
                  <div {...stylex.props(styles.statusWrap)}>
                    <div
                      {...stylex.props(
                        isAccent
                          ? styles.statusAccent
                          : isSecondary
                            ? styles.statusSecondary
                            : styles.statusPrimary
                      )}
                    />
                  </div>
                </div>

                {!isLast && (
                  <div {...stylex.props(styles.caretRow)}>
                    <PiCaretDown {...stylex.props(styles.caret)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div {...stylex.props(styles.footer)}>
          <div {...stylex.props(styles.footerCluster)}>
            <div {...stylex.props(styles.lineLeft)} />
            <h3 {...stylex.props(styles.footerLabel)}>
              <span {...stylex.props(styles.pingWrap)}>
                <span {...stylex.props(styles.pingWave)}></span>
                <span {...stylex.props(styles.pingCore)}></span>
              </span>
              {copy.flowLabel}
              <PiArrowRight {...stylex.props(styles.footerArrow)} />
            </h3>
            <div {...stylex.props(styles.lineRight)} />
          </div>
        </div>
      </div>
    </div>
  );
}
