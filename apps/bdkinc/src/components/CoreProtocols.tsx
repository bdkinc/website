import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  PiTarget,
  PiLightbulb,
  PiShield,
  PiUsers,
  PiMedal,
  PiClock,
  PiPackage,
} from 'react-icons/pi';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { cn } from '@bdkinc/design-system';

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface CoreProtocolsProps {
  values: ValueItem[];
  xstyle?: StyleXStyles;
}

const hover = '@media (hover: hover)';
const colorTransition =
  'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke';
const motionTransition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const easeOut = 'cubic-bezier(0, 0, 0.2, 1)';
const nodeGlow = '0 0 30px -10px rgba(var(--color-primary),0.25)';
const hubGlow = '0 0 20px -5px rgba(var(--color-primary),0.2)';
const focusRing =
  '0 0 0 1px color-mix(in oklab, var(--primary) 30%, transparent)';

const styles = stylex.create({
  section: {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'visible',
  },
  container: {
    position: 'relative',
    zIndex: 10,
    marginInline: 'auto',
    maxWidth: '72rem',
    paddingBlock: '2.5rem',
    paddingInline: {
      default: '1.5rem',
      '@media (min-width: 48rem)': '2.5rem',
    },
  },
  layout: {
    position: 'relative',
    minHeight: { default: 420, '@media (min-width: 48rem)': 480 },
  },
  svg: { position: 'absolute', inset: 0, height: '100%', width: '100%' },
  basePath: { color: 'var(--border)' },
  list: { zIndex: 10 },
  listDesktop: { position: 'static', height: '100%', width: '100%' },
  listMobile: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  nodeWrap: { position: 'absolute' },
  node: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    cursor: 'default',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'var(--border)',
      [hover]: { default: null, ':hover': 'var(--primary)' },
    },
    backgroundColor: 'var(--card)',
    boxShadow: {
      default: nodeGlow,
      ':focus-visible': `${focusRing}, ${nodeGlow}`,
    },
    outlineStyle: { default: 'none', ':focus-visible': 'none' },
    '--cp-hover': { default: '0', [hover]: { default: '0', ':hover': '1' } },
    transitionProperty: colorTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  nodeHub: {
    borderColor: {
      default: 'color-mix(in oklab, var(--primary) 50%, transparent)',
      [hover]: {
        default: null,
        ':hover': 'color-mix(in oklab, var(--primary) 60%, transparent)',
      },
    },
    backgroundColor: 'var(--background)',
    boxShadow: {
      default: hubGlow,
      ':focus-visible': `${focusRing}, ${hubGlow}`,
    },
  },
  nodeInner: { display: 'flex', alignItems: 'center', gap: '1rem' },
  nodeIcon: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary)',
    scale: 'calc(1 + 0.1 * var(--cp-hover, 0))',
    transitionProperty: 'transform, scale',
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  glyphHub: { height: '2.5rem', width: '2.5rem' },
  glyphSatellite: { height: '1.75rem', width: '1.75rem' },
  nodeContent: { flexGrow: 1, flexBasis: 0, minWidth: 0 },
  nodeTitle: {
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 700,
  },
  nodeDesc: {
    marginTop: '0.375rem',
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    lineHeight: 1.625,
  },
  // `node-label` is queried by the GSAP interaction animation; keep the marker.
  nodeLabel: {
    position: 'absolute',
    left: 0,
    width: '9rem',
    pointerEvents: 'none',
    textAlign: 'center',
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
    fontWeight: 600,
  },
  mobileCard: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'default',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    borderRadius: '1rem',
    backgroundColor: 'var(--card)',
    paddingBlock: '1.5rem',
    boxShadow: { default: 'none', ':focus-visible': focusRing },
    outlineStyle: { default: 'none', ':focus-visible': 'none' },
    '--cp-hover': { default: '0', [hover]: { default: '0', ':hover': '1' } },
    transitionProperty: motionTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  mobileIcon: {
    color: 'var(--primary)',
    scale: 'calc(1 + 0.1 * var(--cp-hover, 0))',
    transitionProperty: 'transform, scale',
    transitionDuration: '300ms',
    transitionTimingFunction: easeOut,
  },
  mobileGlyph: { height: '2rem', width: '2rem' },
  mobileTitle: {
    textAlign: 'center',
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
    fontWeight: 700,
  },
  mobileDesc: {
    paddingInline: '1rem',
    textAlign: 'center',
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
});

const iconMap: Record<string, React.ElementType> = {
  Target: PiTarget,
  Lightbulb: PiLightbulb,
  Shield: PiShield,
  Users: PiUsers,
  Award: PiMedal,
  Clock: PiClock,
};

const nodeLayout = [
  // Center (Hub) - Client Focused
  { x: 50, y: 50 },
  // Satellites (Pentagon)
  { x: 50.01, y: 15 }, // Top - slight offset to ensure vertical line gradient renders
  { x: 85, y: 38 }, // Top Right
  { x: 73, y: 82 }, // Bottom Right
  { x: 27, y: 82 }, // Bottom Left
  { x: 15, y: 38 }, // Top Left
];

const connections: Array<[number, number]> = [
  // Hub Connections Only (Radial)
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
];

export default function CoreProtocols({ values, xstyle }: CoreProtocolsProps) {
  const { ref: containerRef, isIntersecting } =
    useIntersectionObserver<HTMLElement>({
      threshold: 0.1,
      triggerOnce: true,
    });

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const layoutRef = useRef<HTMLDivElement>(null);
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 });
  const pulseLinesRef = useRef<(SVGPathElement | null)[]>([]);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimatedEntry = useRef(false);

  // Handle responsive layout switch
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktopLayout(event.matches);
    };

    setIsDesktopLayout(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Handle layout sizing
  useEffect(() => {
    if (typeof window === 'undefined' || !layoutRef.current) return;

    const updateDimensions = () => {
      const rect = layoutRef.current?.getBoundingClientRect();
      if (rect) {
        setLayoutSize({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updateDimensions)
        : null;

    if (resizeObserver) {
      resizeObserver.observe(layoutRef.current);
    }
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const displayValues = values.slice(0, nodeLayout.length);

  // Calculate paths
  const connectionPaths = useMemo(() => {
    const width = Math.max(layoutSize.width, 1);
    const height = Math.max(layoutSize.height, 1);

    return connections
      .filter(([, end]) => end < displayValues.length)
      .filter(([start]) => start < displayValues.length)
      .map(([start, end]) => {
        const anchor = {
          x: (nodeLayout[start].x / 100) * width,
          y: (nodeLayout[start].y / 100) * height,
        };
        const target = {
          x: (nodeLayout[end].x / 100) * width,
          y: (nodeLayout[end].y / 100) * height,
        };

        // Center-to-center connection for perfect alignment
        // The nodes have z-index higher than lines, so lines will visually disappear behind them
        // This avoids any gap or misalignment issues with manual edge calculations
        const length = Math.hypot(target.x - anchor.x, target.y - anchor.y);

        return {
          id: `${start}-${end}`,
          d: `M ${anchor.x} ${anchor.y} L ${target.x} ${target.y}`,
          length,
        };
      });
  }, [displayValues.length, layoutSize.height, layoutSize.width]);

  // GSAP Entry Animation (runs once when component becomes visible)
  useGSAP(() => {
    if (!isIntersecting || !isDesktopLayout || hasAnimatedEntry.current) return;

    hasAnimatedEntry.current = true;

    // Animate Nodes Entry - runs only once
    nodesRef.current.forEach((node, index) => {
      if (!node) return;
      const isHub = index === 0;
      const wrapper = node.parentElement;

      // Set initial size for collapsed state - centered within the wrapper
      // Use explicit border radius (half height) instead of 9999 to ensure smooth interpolation to 16px
      gsap.set(node, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        width: isHub ? 96 : 64,
        height: isHub ? 96 : 64,
        paddingLeft: isHub ? 28 : 18,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: isHub ? 48 : 32, // Half of height/width for perfect circle
        zIndex: isHub ? 30 : 20,
      });

      if (!prefersReducedMotion) {
        // Entry animation
        gsap.fromTo(
          node,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'back.out(1.7)',
          }
        );
      } else {
        gsap.set(node, { opacity: 1, scale: 1 });
      }

      // Ensure content is hidden initially
      const content = node.querySelector<HTMLElement>('.node-content');
      if (content) {
        gsap.set(content, { opacity: 0, x: -10, display: 'none' });
      }

      // Label is a sibling, query from wrapper
      const label = wrapper?.querySelector<HTMLElement>('.node-label');
      if (label) {
        gsap.set(label, { opacity: 1, y: 0 });
      }
    });
  }, [isIntersecting, isDesktopLayout]); // Only depends on intersection and layout, NOT activeIndex

  // GSAP Interaction Animation (runs when activeIndex changes)
  useGSAP(() => {
    if (!isIntersecting || !isDesktopLayout || !hasAnimatedEntry.current)
      return;

    // Expanding Atom node interaction (circle -> pill)
    nodesRef.current.forEach((node, index) => {
      if (!node) return;

      const wantsActive = activeIndex === index;
      const isHub = index === 0;
      const wrapper = node.parentElement;

      const collapsed = {
        width: isHub ? 96 : 64,
        height: isHub ? 96 : 64,
        minHeight: isHub ? 96 : 64, // Keep minHeight same as height for circle
        paddingLeft: isHub ? 28 : 18,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: isHub ? 48 : 32, // Half height for smooth interpolation
        zIndex: isHub ? 30 : 20,
      };

      const expanded = {
        width: isHub ? 360 : 340,
        height: isHub ? 140 : 120, // Fixed height instead of auto to prevent layout thrashing
        minHeight: isHub ? 140 : 120,
        paddingLeft: isHub ? 24 : 20,
        paddingRight: isHub ? 24 : 24,
        paddingTop: isHub ? 16 : 12,
        paddingBottom: isHub ? 16 : 12,
        borderRadius: 16, // Rounded corners (not full pill)
        zIndex: 50,
      };

      const content = node.querySelector<HTMLElement>('.node-content');
      // Label is a sibling of node, query from wrapper
      const label = wrapper?.querySelector<HTMLElement>('.node-label');

      if (wantsActive) {
        if (!prefersReducedMotion) {
          // Expansion animation - smooth and coordinated
          gsap.to(node, {
            ...expanded,
            duration: 0.4,
            ease: 'back.out(0.6)', // Slight overshoot for organic feel
            overwrite: 'auto',
          });
          // Fade out external label quickly at the start
          if (label) {
            gsap.to(label, {
              opacity: 0,
              y: -8,
              scale: 0.95,
              duration: 0.2,
              ease: 'power2.in',
              overwrite: 'auto',
            });
          }
          // Fade in internal content after node starts expanding
          if (content) {
            content.style.display = 'block';
            gsap.fromTo(
              content,
              { opacity: 0, x: -15 },
              {
                opacity: 1,
                x: 0,
                duration: 0.3,
                delay: 0.1,
                ease: 'power2.out',
                overwrite: 'auto',
              }
            );
          }
        } else {
          // Reduced motion: instant expand, no transitions
          gsap.set(node, { ...expanded });
          if (label) gsap.set(label, { opacity: 0 });
          if (content) {
            content.style.display = 'block';
            gsap.set(content, { opacity: 1, x: 0 });
          }
        }
      } else {
        // Collapse animation - coordinated reverse
        if (!prefersReducedMotion) {
          // Fade out content first
          if (content) {
            gsap.to(content, {
              opacity: 0,
              x: -10,
              duration: 0.15,
              ease: 'power2.in',
              overwrite: 'auto',
              onComplete: () => {
                if (content) content.style.display = 'none';
              },
            });
          }
          // Collapse node
          gsap.to(node, {
            ...collapsed,
            duration: 0.35,
            delay: 0.05,
            ease: 'power2.inOut',
            overwrite: 'auto',
          });
          // Fade in external label as node finishes collapsing
          if (label) {
            gsap.to(label, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.25,
              delay: 0.2,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        } else {
          // Reduced motion: instant collapse
          if (content) {
            content.style.display = 'none';
            gsap.set(content, { opacity: 0 });
          }
          gsap.set(node, { ...collapsed });
          if (label) gsap.set(label, { opacity: 1, y: 0, scale: 1 });
        }
      }
    });

    // Pulse Animation for Lines
    pulseLinesRef.current.forEach((line, index) => {
      if (!line) return;

      const length = connectionPaths[index]?.length || 200;
      const targetNodeIndex = index + 1;
      const isActive = activeIndex === 0 || activeIndex === targetNodeIndex;

      if (prefersReducedMotion) {
        // Reduced motion: show lines as static, no pulsing
        gsap.set(line, {
          strokeDasharray: 'none',
          strokeDashoffset: 0,
          opacity: isActive ? 0.5 : 0.1,
        });
        return;
      }

      if (isActive) {
        gsap.to(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0.2,
          duration: 0, // Set initial state instantly
          overwrite: 'auto',
        });

        gsap.fromTo(
          line,
          { strokeDasharray: length, strokeDashoffset: length, opacity: 0.2 },
          {
            strokeDashoffset: -length,
            opacity: 1,
            duration: 2,
            repeat: -1,
            ease: 'power1.inOut',
            delay: index * 0.15 + 0.1,
            overwrite: true,
          }
        );
      } else {
        gsap.to(line, {
          opacity: 0.1,
          duration: 0.5,
          overwrite: true,
        });
      }
    });
  }, [isIntersecting, isDesktopLayout, connectionPaths, activeIndex]);

  const svgWidth = Math.max(layoutSize.width, 1);
  const svgHeight = Math.max(layoutSize.height, 1);

  const section = stylex.props(styles.section, xstyle);

  return (
    <section ref={containerRef} {...section} className={section.className}>
      <div {...stylex.props(styles.container)}>
        <div ref={layoutRef} {...stylex.props(styles.layout)}>
          {isDesktopLayout && (
            <svg
              {...stylex.props(styles.svg)}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="core-protocols-flow"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity="1"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-secondary)"
                    stopOpacity="1"
                  />
                </linearGradient>
              </defs>

              {/* Layer 1: Solid Static Lines */}
              {connectionPaths.map((path) => (
                <path
                  key={`base-${path.id}`}
                  d={path.d}
                  stroke="currentColor"
                  {...stylex.props(styles.basePath)}
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                />
              ))}

              {/* Layer 2: Animated Pulse Lines */}
              {connectionPaths.map((path, index) => (
                <path
                  key={`pulse-${path.id}`}
                  ref={(el) => {
                    pulseLinesRef.current[index] = el;
                  }}
                  d={path.d}
                  stroke="url(#core-protocols-flow)"
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                  style={{ opacity: 0 }} // Hidden initially, handled by GSAP
                />
              ))}
            </svg>
          )}

          <div
            {...stylex.props(
              styles.list,
              isDesktopLayout ? styles.listDesktop : styles.listMobile
            )}
          >
            {displayValues.map((value, index) => {
              const IconComponent = iconMap[value.icon] ?? PiPackage;

              if (isDesktopLayout) {
                // Desktop: Use wrapper div for positioning, inner div for the animated node
                const content = stylex.props(styles.nodeContent);
                const label = stylex.props(styles.nodeLabel);
                return (
                  <div
                    key={value.title}
                    {...stylex.props(styles.nodeWrap)}
                    style={{
                      top: `${nodeLayout[index].y}%`,
                      left: `${nodeLayout[index].x}%`,
                    }}
                  >
                    {/* The animated node (circle -> pill) */}
                    <div
                      ref={(el) => {
                        nodesRef.current[index] = el;
                      }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={activeIndex === index}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(0)}
                      onBlur={() => setActiveIndex(0)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveIndex(activeIndex === index ? 0 : index);
                        }
                      }}
                      {...stylex.props(
                        styles.node,
                        index === 0 && styles.nodeHub
                      )}
                    >
                      <div {...stylex.props(styles.nodeInner)}>
                        <div {...stylex.props(styles.nodeIcon)}>
                          <IconComponent
                            aria-hidden="true"
                            {...stylex.props(
                              index === 0
                                ? styles.glyphHub
                                : styles.glyphSatellite
                            )}
                          />
                        </div>

                        {/* Expanded content (title + description) - inside the pill */}
                        <div
                          {...content}
                          className={cn(content.className, 'node-content')}
                          style={{ display: 'none', opacity: 0 }}
                        >
                          <h3 {...stylex.props(styles.nodeTitle)}>
                            {value.title}
                          </h3>
                          <p {...stylex.props(styles.nodeDesc)}>
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Title label below node - OUTSIDE overflow-hidden container */}
                    <h3
                      {...label}
                      className={cn(label.className, 'node-label')}
                      style={{
                        top: index === 0 ? '60px' : '44px', // half node height + gap (48+12 or 32+12)
                        left: '0',
                        transform: 'translateX(-50%)', // Center on the wrapper's origin point
                      }}
                    >
                      {value.title}
                    </h3>
                  </div>
                );
              }

              // Mobile layout
              return (
                <div
                  key={value.title}
                  ref={(el) => {
                    nodesRef.current[index] = el;
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={activeIndex === index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(0)}
                  onBlur={() => setActiveIndex(0)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveIndex(activeIndex === index ? 0 : index);
                    }
                  }}
                  {...stylex.props(styles.mobileCard)}
                >
                  <div {...stylex.props(styles.mobileIcon)}>
                    <IconComponent
                      aria-hidden="true"
                      {...stylex.props(styles.mobileGlyph)}
                    />
                  </div>

                  <h3 {...stylex.props(styles.mobileTitle)}>{value.title}</h3>

                  <p {...stylex.props(styles.mobileDesc)}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
