import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { iconMap } from '@/lib/icons';

interface ServiceDropdownItemProps {
  service: { slug: string; title: string; description: string };
  icon: any;
  index: number;
  showTransitions: boolean;
}

// Service Dropdown Item with mouse-tracking spotlight
function ServiceDropdownItem({
  service,
  icon: Icon,
  index,
  showTransitions,
}: ServiceDropdownItemProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <NavigationMenuLink asChild>
        <a
          href={`/services/${service.slug}`}
          className="group relative block overflow-hidden rounded-lg border border-border/30 bg-card/40 p-5 backdrop-blur-sm no-underline transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 outline-none select-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setMousePosition({ x, y });
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Mouse-tracking spotlight effect */}
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(400px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 212, 255, 0.12), rgba(124, 58, 237, 0.08) 40%, transparent 60%)`,
            }}
          />

          <div className="relative z-10 flex flex-col items-center space-y-3 text-center">
            {/* Icon */}
            {Icon && (
              <div
                className="flex justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                {...(showTransitions && {
                  style: {
                    viewTransitionName: `service-icon-${service.slug}`,
                  } as any,
                })}
              >
                <div className="bg-primary/10 rounded-lg p-2.5">
                  <Icon className="text-primary h-10 w-10" />
                </div>
              </div>
            )}

            {/* Title */}
            <div
              className="text-foreground group-hover:text-primary text-base font-bold leading-tight transition-colors duration-300"
              {...(showTransitions && {
                style: {
                  viewTransitionName: `service-title-${service.slug}`,
                } as any,
              })}
            >
              {service.title}
            </div>

            {/* Description */}
            <p
              className="text-muted-foreground text-xs leading-relaxed"
              {...(showTransitions && {
                style: {
                  viewTransitionName: `service-description-${service.slug}`,
                } as any,
              })}
            >
              {service.description}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

interface ServicesDropdownProps {
  services: Array<{
    slug: string;
    title: string;
    description: string;
    icon: string;
  }>;
  showTransitions: boolean;
}

export function ServicesDropdown({ services, showTransitions }: ServicesDropdownProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          'hover:text-primary bg-transparent! transition-all hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!'
        )}
      >
        Services
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-background/95 backdrop-blur-xl border border-border/50">
        <ul className="grid w-[680px] gap-4 p-6 md:w-[780px] md:grid-cols-3 lg:w-[900px]">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <ServiceDropdownItem
                key={service.slug}
                service={service}
                icon={Icon}
                index={index}
                showTransitions={showTransitions}
              />
            );
          })}
          {/* View All Link */}
          <li
            className="border-border/30 animate-in fade-in slide-in-from-bottom-4 fill-mode-both col-span-3 mt-2 border-t pt-4 duration-500"
            style={{ animationDelay: `${services.length * 50}ms` }}
          >
            <NavigationMenuLink asChild>
              <a
                href="/services"
                className="group flex flex-row items-center gap-2 rounded-lg p-3 text-base font-semibold tracking-wide text-foreground no-underline transition-all duration-300 hover:gap-3 hover:text-primary outline-none select-none"
              >
                <span>View All Services</span>
                <span>
                  <ArrowRight className="text-current transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
