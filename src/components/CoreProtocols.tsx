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

        // Calculate length for stroke-dasharray animation
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
    gsap.fromTo(
      nodesRef.current,
      { opacity: 0, scale: 0, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0, // Using percentage in CSS for position, so 0 here clears the transform offset
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        clearProps: 'transform', // Important to allow hover transforms later
      }
    );

    // 2. Animate Info Card Entry
    if (infoCardRef.current) {
      gsap.fromTo(
        infoCardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power2.out' }
      );
    }

    // 3. Pulse Animation for Lines
    pulseLinesRef.current.forEach((line, index) => {
      if (!line) return;

      const length = connectionPaths[index]?.length || 200;

      gsap.fromTo(
        line,
        { strokeDasharray: length, strokeDashoffset: length, opacity: 0 },
        {
          strokeDashoffset: -length, // Travel full distance
          opacity: 1,
          duration: 2,
          repeat: -1,
          ease: 'power1.inOut',
          delay: index * 0.2,
          yoyo: false,
          onRepeat: () => {
            // Reset slightly to avoid glitch at loop end if needed,
            // but strokeDashoffset loop usually works well
          },
        }
      );
    });
  }, [isIntersecting, isDesktopLayout, connectionPaths]);

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
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.08), transparent 35%), radial-gradient(circle at 80% 0%, rgba(129, 140, 248, 0.08), transparent 40%)',
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
                    'group bg-card hover:border-primary/60 border-border cursor-default rounded-full border px-2 py-8 text-center transition-all duration-300 ease-out hover:shadow-[0_0_30px_-5px_rgba(var(--color-primary),0.3)] focus-visible:ring md:absolute md:flex md:flex-col md:items-center md:justify-center md:gap-2 md:py-0',
                    isDesktopLayout
                      ? 'z-20 md:h-32 md:w-32'
                      : 'w-full rounded-2xl py-6',
                    // Special styling for center node (Index 0)
                    index === 0 &&
                      isDesktopLayout &&
                      'border-primary/50 bg-background z-30 shadow-[0_0_40px_-10px_rgba(var(--color-primary),0.2)] md:h-40 md:w-40',
                    // Hover scaling using Tailwind
                    'hover:scale-105'
                  )}
                  style={
                    isDesktopLayout
                      ? {
                          top: `${nodeLayout[index].y}%`,
                          left: `${nodeLayout[index].x}%`,
                          transform: 'translate(-50%, -50%)', // Always center on coordinate
                        }
                      : undefined
                  }
                >
                  <div
                    className={cn(
                      'text-primary transition-transform duration-300 group-hover:scale-110'
                    )}
                  >
                    <IconComponent
                      className={cn(index === 0 ? 'h-10 w-10' : 'h-8 w-8')}
                    />
                  </div>

                  <h3
                    className={cn(
                      'font-display text-foreground leading-tight font-bold',
                      index === 0 ? 'text-sm' : 'text-xs'
                    )}
                  >
                    {value.title}
                  </h3>
                  <p className="sr-only">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          ref={infoCardRef}
          className="border-border bg-card/70 mt-10 rounded-3xl border px-6 py-5 opacity-0 transition duration-500"
        >
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.2em] uppercase">
            {currentTitle}
          </p>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            {currentDescription}
          </p>
        </div>
      </div>
    </section>
  );
}
