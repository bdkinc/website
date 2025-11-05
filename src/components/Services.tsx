import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { iconMap } from "@/lib/icons";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

interface ServicesProps {
  services: Array<{
    slug: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

export default function Services({ services }: ServicesProps) {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  
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
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) {
      return;
    }

    const listeners = [];

    iconRefs.current.forEach((icon, index) => {
      if (!icon) return;

      // Apply view-transition-name
      const slug = services[index]?.slug;
      if (slug) {
        icon.style.setProperty('view-transition-name', `service-icon-${slug}`);
      }

      const handleMouseEnter = () => {
        icon.style.transform = "scale(1.15) rotate(5deg)";
      };

      const handleMouseLeave = () => {
        icon.style.transform = "scale(1) rotate(0deg)";
      };

      icon.addEventListener("mouseenter", handleMouseEnter);
      icon.addEventListener("mouseleave", handleMouseLeave);

      listeners.push({ icon, handleMouseEnter, handleMouseLeave });
    });

    // Apply view-transition names to titles and descriptions
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

    return () => {
      listeners.forEach(({ icon, handleMouseEnter, handleMouseLeave }) => {
        icon.removeEventListener("mouseenter", handleMouseEnter);
        icon.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
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
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            // Stagger: 100ms between cards
            const delayMs = index * 100;
            return (
              <a
                key={service.slug}
                href={`/services/${service.slug}`}
                className={cn(
                  "block group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "opacity-0 translate-y-6 transition-[opacity,transform] duration-600 ease-out",
                  gridInView && "opacity-100 translate-y-0"
                )}
                style={{ 
                  transitionDelay: gridInView ? `${delayMs}ms` : '0ms'
                }}
              >
                <Card interactive={true} className={cn(
                  "h-full cursor-pointer transition-all duration-300 flex flex-col justify-center"
                )}>
                  <CardHeader className="text-center flex flex-col items-center justify-center flex-1">
                    <div
                      ref={(el) => {
                        iconRefs.current[index] = el;
                      }}
                      className={cn(
                        "mb-6 p-4 rounded-xl bg-linear-to-brr from-primary/10 to-secondary/10 w-fit mx-auto",
                        "flex items-center justify-center",
                        "transition-transform duration-300"
                      )}
                    >
                      {Icon && <Icon className="w-8 h-8 text-primary" />}
                    </div>
                    <CardTitle 
                      ref={(el) => {
                        titleRefs.current[index] = el;
                      }}
                      className={cn(
                        "text-lg mb-2 text-center",
                        "transition-colors duration-300 group-hover:text-primary"
                      )}
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
