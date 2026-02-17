import { useRef, useState, type MouseEvent } from 'react';
import { PiArrowRight } from 'react-icons/pi';
import { navigate } from 'astro:transitions/client';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { iconMap } from '@/lib/icons';

function shouldClientNavigate(e: MouseEvent<HTMLAnchorElement>) {
  return !(
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.altKey ||
    e.ctrlKey ||
    e.shiftKey
  );
}

function cleanupViewTransitionProxies() {
  document
    .querySelectorAll<HTMLElement>('[data-view-transition-proxy="true"]')
    .forEach((el) => el.remove());
}

function hasInlineViewTransitionName(name: string) {
  return document.querySelector(
    `[style*="view-transition-name: ${name}"]`
  ) as HTMLElement | null;
}

function createViewTransitionProxy(source: HTMLElement, name: string) {
  if (hasInlineViewTransitionName(name)) return;

  const rect = source.getBoundingClientRect();
  const proxy = source.cloneNode(true) as HTMLElement;

  proxy.dataset.viewTransitionProxy = 'true';

  proxy.style.position = 'fixed';
  proxy.style.left = `${rect.left}px`;
  proxy.style.top = `${rect.top}px`;
  proxy.style.width = `${rect.width}px`;
  proxy.style.height = `${rect.height}px`;
  proxy.style.margin = '0';
  proxy.style.pointerEvents = 'none';
  proxy.style.zIndex = '2147483647';
  proxy.style.viewTransitionName = name;

  document.body.appendChild(proxy);
}

function prepareServiceViewTransition(
  sources: {
    icon?: HTMLElement | null;
    title?: HTMLElement | null;
    description?: HTMLElement | null;
  },
  slug: string
) {
  cleanupViewTransitionProxies();

  if (sources.icon) {
    createViewTransitionProxy(sources.icon, `service-icon-${slug}`);
  }
  if (sources.title) {
    createViewTransitionProxy(sources.title, `service-title-${slug}`);
  }
  if (sources.description) {
    createViewTransitionProxy(
      sources.description,
      `service-description-${slug}`
    );
  }

  const cleanup = () => cleanupViewTransitionProxies();
  document.addEventListener('astro:before-swap', cleanup, {
    once: true,
  } as AddEventListenerOptions);
  document.addEventListener('astro:after-swap', cleanup, {
    once: true,
  } as AddEventListenerOptions);
  window.setTimeout(cleanup, 2500);
}

function navOnClick(
  href: string,
  prepare?: (anchor: HTMLAnchorElement) => void
) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (!shouldClientNavigate(e)) return;
    prepare?.(e.currentTarget);
    e.preventDefault();
    navigate(href);
  };
}

interface ServiceDropdownItemProps {
  service: { slug: string; title: string; description: string };
  icon: any;
  index: number;
}

// Service Dropdown Item with mouse-tracking spotlight
function ServiceDropdownItem({
  service,
  icon: Icon,
  index,
}: ServiceDropdownItemProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  return (
    <li
      className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <NavigationMenuLink asChild>
        <a
          href={`/services/${service.slug}`}
          className="group border-border/30 bg-card/40 hover:border-primary/30 hover:shadow-primary/5 focus-visible:ring-primary/40 focus-visible:ring-offset-background relative flex h-full flex-col overflow-hidden rounded-lg border p-5 no-underline backdrop-blur-sm transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300 outline-none select-none hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={navOnClick(`/services/${service.slug}`, () =>
            prepareServiceViewTransition(
              {
                icon: iconRef.current,
                title: titleRef.current,
                description: descriptionRef.current,
              },
              service.slug
            )
          )}
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
                ref={iconRef}
                className="flex justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              >
                <div className="bg-primary/10 rounded-lg p-2.5">
                  <Icon className="text-primary h-10 w-10" />
                </div>
              </div>
            )}

            {/* Title */}
            <div
              ref={titleRef}
              className="text-foreground group-hover:text-primary text-base leading-tight font-bold transition-colors duration-300"
            >
              {service.title}
            </div>

            {/* Description */}
            <p
              ref={descriptionRef}
              className="text-muted-foreground text-xs leading-relaxed"
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
}

export function ServicesDropdown({ services }: ServicesDropdownProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          'hover:text-primary bg-transparent! transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!'
        )}
      >
        Services
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-background/95 border-border/50 border backdrop-blur-xl">
        <ul className="grid w-[680px] gap-4 p-6 md:w-[780px] md:grid-cols-3 lg:w-[900px]">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <ServiceDropdownItem
                key={service.slug}
                service={service}
                icon={Icon}
                index={index}
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
                className="group text-foreground hover:text-primary focus-visible:ring-primary/40 focus-visible:ring-offset-background flex flex-row items-center gap-2 rounded-lg p-3 text-base font-semibold tracking-wide no-underline transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300 outline-none select-none hover:gap-3 focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={navOnClick('/services')}
              >
                <span>View All Services</span>
                <span>
                  <PiArrowRight className="text-current transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
