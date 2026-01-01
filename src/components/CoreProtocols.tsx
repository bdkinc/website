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
  { x: 50, y: 15 }, // Top
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
  const infoCardRef = useRef<HTMLDivElement>(null);

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

  // Set initial centering transform for desktop layout nodes
  useEffect(() => {
    if (!isDesktopLayout) return;
    // Small delay to ensure refs are populated after render
    const timer = setTimeout(() => {
      nodesRef.current.forEach((node) => {
        if (node) {
          gsap.set(node, { xPercent: -50, yPercent: -50 });
        }
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [isDesktopLayout, displayValues.length]);

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

  // GSAP Animations
  useGSAP(() => {
    if (!isIntersecting || !isDesktopLayout) return;

    // 1. Animate Nodes Entry
    // Set initial state with centering transform maintained
    nodesRef.current.forEach((node, index) => {
      if (!node) return;
      // Use GSAP set to establish the base transform with centering
      gsap.set(node, { xPercent: -50, yPercent: -50 });
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
    });

    // 2. Animate Info Card Entry
    if (infoCardRef.current) {
      gsap.fromTo(
        infoCardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power2.out' }
      );
    }

    // 3. Pulse Animation for Lines
    // We'll store tweens to control them based on interaction
    pulseLinesRef.current.forEach((line, index) => {
      if (!line) return;

      const length = connectionPaths[index]?.length || 200;

      // Target connection connects Node 0 to Node (index + 1)
      const targetNodeIndex = index + 1;

      // Determine if this line should be active based on hover state
      // Active if:
      // 1. Hub is hovered (index 0) - all lines active
      // 2. Specific satellite is hovered - only its line is active
      const isActive = activeIndex === 0 || activeIndex === targetNodeIndex;

      // Kill existing animations on this element to prevent conflicts
      gsap.killTweensOf(line);

      if (isActive) {
        gsap.fromTo(
          line,
          { strokeDasharray: length, strokeDashoffset: length, opacity: 0.2 },
          {
            strokeDashoffset: -length,
            opacity: 1,
            duration: 2,
            repeat: -1,
            ease: 'power1.inOut',
            delay: index * 0.1, // Slight stagger for visual interest
          }
        );
      } else {
        // Dim inactive lines
        gsap.to(line, {
          opacity: 0.1,
          duration: 0.5,
          overwrite: true,
        });
      }
    });
  }, [isIntersecting, isDesktopLayout, connectionPaths, activeIndex]); // Added activeIndex dependency

  const currentDescription =
    displayValues[activeIndex]?.description ??
    displayValues[0]?.description ??
    '';
  const currentTitle =
    displayValues[activeIndex]?.title ??
    displayValues[0]?.title ??
    'Core Protocols';

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
                  y2="0%"
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
                  className={cn(
                    'group cursor-default transition-all duration-300 ease-out focus-visible:ring',
                    isDesktopLayout
                      ? 'border-border bg-card hover:border-primary/60 absolute z-20 flex items-center justify-center rounded-full border hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(var(--color-primary),0.3)]'
                      : 'border-border bg-card relative flex w-full flex-col items-center gap-4 rounded-2xl border py-6',

                    // Desktop Size Logic
                    isDesktopLayout &&
                      index === 0 &&
                      'border-primary/50 bg-background z-30 h-24 w-24 shadow-[0_0_20px_-5px_rgba(var(--color-primary),0.2)]', // Hub
                    isDesktopLayout && index !== 0 && 'h-16 w-16' // Satellite
                  )}
                  style={
                    isDesktopLayout
                      ? {
                          top: `${nodeLayout[index].y}%`,
                          left: `${nodeLayout[index].x}%`,
                        }
                      : undefined
                  }
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'text-primary transition-transform duration-300 group-hover:scale-110'
                    )}
                  >
                    <IconComponent
                      className={cn(
                        isDesktopLayout
                          ? index === 0
                            ? 'h-10 w-10'
                            : 'h-7 w-7'
                          : 'h-8 w-8'
                      )}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={cn(
                      'font-display text-foreground text-center leading-tight font-bold',
                      isDesktopLayout
                        ? 'pointer-events-none absolute top-full mt-4 w-40 text-sm'
                        : 'text-xs'
                    )}
                  >
                    {value.title}
                  </h3>

                  <p
                    className={cn(
                      isDesktopLayout
                        ? 'sr-only'
                        : 'text-muted-foreground px-4 text-center text-sm'
                    )}
                  >
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Card - Desktop Only */}
        <div
          ref={infoCardRef}
          className={cn(
            'glass border-border mt-10 rounded-2xl border px-6 py-5 transition duration-500',
            isDesktopLayout ? 'opacity-0' : 'hidden' // Handle GSAP opacity for desktop, hidden for mobile
          )}
        >
          <p className="text-foreground font-display text-base font-bold">
            {currentTitle}
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {currentDescription}
          </p>
        </div>
      </div>
    </section>
  );
}
