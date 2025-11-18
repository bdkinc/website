import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { iconMap } from '@/lib/icons';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';

interface ServicesProps {
  services: Array<{
    slug: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

interface MousePosition {
  x: number;
  y: number;
}

export default function Services({ services }: ServicesProps) {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePositions, setMousePositions] = useState<{
    [key: number]: MousePosition;
  }>({});

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
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div
          ref={headerRef as any}
          className={cn(
            'mb-16 text-center',
            'translate-y-8 opacity-0 transition-[opacity,transform] duration-700 ease-out',
            headerInView && 'translate-y-0 opacity-100'
          )}
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-foreground">Our </span>
            <span className="from-primary to-secondary bg-linear-to-br bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Comprehensive <span className="text-accent">IT solutions</span>{' '}
            tailored for businesses of any size
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={gridRef as any}
          className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            // Stagger: 100ms between cards
            const delayMs = index * 100;
            const isHovered = hoveredCard === index;
            const mousePos = mousePositions[index] || { x: 50, y: 50 };

            return (
              <a
                key={service.slug}
                href={`/services/${service.slug}`}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={cn(
                  'focus-visible:ring-primary block focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  'translate-y-6 opacity-0 transition-[opacity,transform] duration-600 ease-out',
                  'group h-full',
                  gridInView && 'translate-y-0 opacity-100'
                )}
                style={{
                  transitionDelay: gridInView ? `${delayMs}ms` : '0ms',
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setMousePositions((prev) => ({ ...prev, [index]: { x, y } }));
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card
                  className={cn(
                    'relative flex h-full flex-col justify-center overflow-hidden',
                    'bg-card/60 border-border/50 backdrop-blur-xl'
                  )}
                >
                  {/* Mouse-tracking spotlight */}
                  <div
                    className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(0, 212, 255, 0.15), rgba(124, 58, 237, 0.1) 40%, transparent 60%)`,
                    }}
                  />

                  <CardHeader className="relative z-20 flex flex-1 flex-col items-center justify-center text-center">
                    <div
                      ref={(el) => {
                        iconRefs.current[index] = el;
                      }}
                      className={cn(
                        'from-primary/10 to-accent/10 to-secondary/10 mx-auto mb-6 w-fit rounded-xl bg-linear-to-br p-4',
                        'flex items-center justify-center'
                      )}
                    >
                      {Icon && <Icon className="text-primary h-8 w-8" />}
                    </div>
                    <CardTitle
                      ref={(el) => {
                        titleRefs.current[index] = el;
                      }}
                      className="mb-2 text-center text-lg"
                    >
                      {service.title}
                    </CardTitle>
                    <CardDescription
                      ref={(el) => {
                        descriptionRefs.current[index] = el;
                      }}
                      className="text-center text-sm"
                    >
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
