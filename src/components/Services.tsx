import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { iconMap } from '@/lib/icons';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { TechCard } from '@/components/TechCard';
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
          <h2 className="font-display mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            <span className="text-foreground">Expert </span>
            <span className="from-primary to-secondary bg-linear-to-br bg-clip-text text-transparent">
              Solutions
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl font-sans text-xl">
            Enterprise-grade{' '}
            <span className="text-accent font-semibold">
              technical expertise
            </span>{' '}
            tailored for high-growth organizations.
          </p>
        </div>
        {/* Services Grid */}
        <div
          ref={gridRef as any}
          className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            const delayMs = index * 100;
            return (
              <TechCard
                key={service.slug}
                asChild
                interactive
                variant="technical"
                delay={delayMs}
                animated={gridInView}
              >
                <a
                  href={`/services/${service.slug}`}
                  className="relative z-20 flex h-full flex-col items-center justify-center p-8 text-center"
                >
                  <div
                    ref={(el) => {
                      iconRefs.current[index] = el;
                    }}
                    className={cn(
                      'from-primary/10 to-secondary/10 mx-auto mb-6 w-fit rounded-xl bg-linear-to-br p-4',
                      'border-primary/20 group-hover:border-primary/50 flex items-center justify-center border transition-colors'
                    )}
                  >
                    {Icon && <Icon className="text-primary h-8 w-8" />}
                  </div>
                  <CardTitle
                    ref={(el) => {
                      titleRefs.current[index] = el;
                    }}
                    className="font-display group-hover:text-primary mb-2 text-center text-lg tracking-wider transition-colors"
                  >
                    {service.title}
                  </CardTitle>
                  <CardDescription
                    ref={(el) => {
                      descriptionRefs.current[index] = el;
                    }}
                    className="text-center text-sm leading-relaxed"
                  >
                    {service.description}
                  </CardDescription>
                </a>
              </TechCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
