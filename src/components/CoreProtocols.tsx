import React, { useRef, useMemo, useState, useEffect } from 'react';
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
import { cn } from '@/lib/utils';

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface CoreProtocolsProps {
  values: ValueItem[];
}

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

export default function CoreProtocols({ values }: CoreProtocolsProps) {
  const { ref: containerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

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
              delay: 0.1, // Reduced delay for snappier feel
              ease: 'power2.out',
              overwrite: 'auto',
            }
          );
        }
      } else {
        // Collapse animation - coordinated reverse
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
          ease: 'power2.inOut', // Keep standard smooth ease for collapse
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
      }
    });

    // Pulse Animation for Lines
    pulseLinesRef.current.forEach((line, index) => {
      if (!line) return;

      const length = connectionPaths[index]?.length || 200;
      const targetNodeIndex = index + 1;
      const isActive = activeIndex === 0 || activeIndex === targetNodeIndex;

      // Ensure we don't kill the animation if it's already running for the correct state
      // But since we use fromTo, we might need to be careful.
      // Let's just always animate but use overwrite to handle conflicts.

      if (isActive) {
        // Only trigger pulse if not already pulsing or if we need to restart?
        // Actually, let's let GSAP handle the overwrite.
        // Adding a small random delay to avoid synchronization artifacts?
        // Or maybe just ensure line 0 works.

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
            delay: index * 0.15 + 0.1, // Adjusted delay to ensure first line works
            overwrite: true, // Explicit overwrite
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

  return (
    <section
      ref={containerRef as any}
      className="relative isolate overflow-visible"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, oklch(0.65 0.22 280 / 0.15), transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 md:px-10">
        <div
          ref={layoutRef}
          className="relative min-h-[420px] md:min-h-[480px]"
        >
          {isDesktopLayout && (
            <svg
              className="absolute inset-0 h-full w-full"
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
                  className="text-border"
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
            className={cn(
              'z-10',
              isDesktopLayout
                ? 'static h-full w-full'
                : 'relative flex flex-col gap-6'
            )}
          >
            {displayValues.map((value, index) => {
              const IconComponent = iconMap[value.icon] ?? PiPackage;

              if (isDesktopLayout) {
                // Desktop: Use wrapper div for positioning, inner div for the animated node
                return (
                  <div
                    key={value.title}
                    className="absolute"
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
                      className={cn(
                        'group focus-visible:ring-primary/30 cursor-default transition-colors duration-300 ease-out focus-visible:ring',
                        'border-border bg-card hover:border-primary/60 flex items-center overflow-hidden border shadow-[0_0_30px_-10px_rgba(var(--color-primary),0.25)]',
                        index === 0 &&
                          'border-primary/50 bg-background shadow-[0_0_20px_-5px_rgba(var(--color-primary),0.2)]'
                      )}
                    >
                      <div className="node-inner flex items-center gap-4">
                        <div className="node-icon text-primary flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                          <IconComponent
                            className={cn(
                              index === 0 ? 'h-10 w-10' : 'h-7 w-7'
                            )}
                          />
                        </div>

                        {/* Expanded content (title + description) - inside the pill */}
                        <div
                          className="node-content min-w-0 flex-1"
                          style={{ display: 'none', opacity: 0 }}
                        >
                          <h3 className="font-display text-foreground text-sm leading-tight font-bold">
                            {value.title}
                          </h3>
                          <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Title label below node - OUTSIDE overflow-hidden container */}
                    <h3
                      className="node-label font-display text-foreground pointer-events-none absolute w-36 text-center text-xs leading-tight font-semibold"
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
                  className="border-border bg-card group focus-visible:ring-primary/30 relative flex w-full cursor-default flex-col items-center gap-4 rounded-2xl border py-6 transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300 ease-out focus-visible:ring"
                >
                  <div className="text-primary transition-transform duration-300 group-hover:scale-110">
                    <IconComponent className="h-8 w-8" />
                  </div>

                  <h3 className="font-display text-foreground text-center text-xs leading-tight font-bold">
                    {value.title}
                  </h3>

                  <p className="text-muted-foreground px-4 text-center text-sm">
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
