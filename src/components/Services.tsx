import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { iconMap } from "@/lib/icons";
import { useIntersectionObserver } from "@/components/hooks/useIntersectionObserver";

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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePositions, setMousePositions] = useState<{ [key: number]: MousePosition }>({});

  // Viewport detection for section header
  const { ref: headerRef, isIntersecting: headerInView } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true
  });

  // Viewport detection for grid container
  const { ref: gridRef, isIntersecting: gridInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
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
        title.style.setProperty('view-transition-name', `service-title-${slug}`);
      }
    });

    descriptionRefs.current.forEach((description, index) => {
      const slug = services[index]?.slug;
      if (description && slug) {
        description.style.setProperty('view-transition-name', `service-description-${slug}`);
      }
    });
  }, [services]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div 
          ref={headerRef as any}
          className={cn(
            "text-center mb-16",
            "opacity-0 translate-y-8 transition-[opacity,transform] duration-700 ease-out",
            headerInView && "opacity-100 translate-y-0"
          )}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Our </span>
            <span className="bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive IT solutions tailored for businesses of any size
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={gridRef as any}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 auto-rows-fr"
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
                  "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "opacity-0 translate-y-6 transition-[opacity,transform] duration-600 ease-out",
                  "group h-full",
                  gridInView && "opacity-100 translate-y-0"
                )}
                style={{
                  transitionDelay: gridInView ? `${delayMs}ms` : '0ms'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setMousePositions(prev => ({ ...prev, [index]: { x, y } }));
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card className={cn(
                  "h-full flex flex-col justify-center relative overflow-hidden",
                  "backdrop-blur-xl bg-card/60 border-border/50"
                )}>
                  {/* Mouse-tracking spotlight */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(0, 212, 255, 0.15), rgba(124, 58, 237, 0.1) 40%, transparent 60%)`,
                    }}
                  />

                  <CardHeader className="text-center flex flex-col items-center justify-center flex-1 relative z-20">
                    <div
                      ref={(el) => {
                        iconRefs.current[index] = el;
                      }}
                      className={cn(
                        "mb-6 p-4 rounded-xl bg-linear-to-br from-primary/10 to-accent/10 to-secondary/10 w-fit mx-auto",
                        "flex items-center justify-center"
                      )}
                    >
                      {Icon && <Icon className="w-8 h-8 text-primary" />}
                    </div>
                    <CardTitle
                      ref={(el) => {
                        titleRefs.current[index] = el;
                      }}
                      className="text-lg mb-2 text-center"
                    >
                      {service.title}
                    </CardTitle>
                    <CardDescription
                      ref={(el) => {
                        descriptionRefs.current[index] = el;
                      }}
                      className="text-sm text-center"
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
