import { useRef, useState, type MouseEvent } from 'react';
import * as stylex from '@stylexjs/stylex';
import { PiArrowRight } from 'react-icons/pi';
import { navigate } from 'astro:transitions/client';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@bdkinc/design-system';
import { iconMap } from '@/lib/icons';

const enter = stylex.keyframes({
  from: { opacity: 0, transform: 'translate3d(0, 1rem, 0)' },
});
const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';
const transition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const colorTransition =
  'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke';
const focusRing = '0 0 0 2px var(--background), 0 0 0 4px var(--ring)';

const styles = stylex.create({
  // The trigger's transparent background is forced in every state; hover only
  // changes text color and blur. Focus/open keep the inherited color: the legacy
  // primitive's focus/open text utilities were never generated for this app.
  trigger: {
    backgroundColor: 'transparent',
    color: {
      default: 'inherit',
      ':hover': { default: null, '@media (hover: hover)': 'var(--primary)' },
      '[aria-current="page"]': 'var(--primary)',
    },
    backdropFilter: {
      default: null,
      ':hover': { default: null, '@media (hover: hover)': 'blur(24px)' },
    },
    transitionProperty: transition,
    transitionTimingFunction: ease,
    transitionDuration: '150ms',
  },
  content: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--border) 50%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--background) 95%, transparent)',
    backdropFilter: 'blur(24px)',
  },
  grid: {
    display: 'grid',
    width: {
      default: 680,
      '@media (min-width: 768px)': 780,
      '@media (min-width: 1024px)': 900,
    },
    gridTemplateColumns: {
      default: null,
      '@media (min-width: 768px)': 'repeat(3, minmax(0, 1fr))',
    },
    gap: 16,
    padding: 24,
  },
  enter: {
    animationName: enter,
    animationDuration: '500ms',
    animationTimingFunction: 'ease',
    animationFillMode: 'both',
  },
  card: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 'var(--radius)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'color-mix(in oklab, var(--border) 50%, transparent)',
      ':hover': {
        default: null,
        '@media (hover: hover)':
          'color-mix(in oklab, var(--primary) 35%, transparent)',
      },
    },
    backgroundColor: {
      default: 'color-mix(in oklab, var(--card) 70%, transparent)',
      ':hover': {
        default: null,
        '@media (hover: hover)':
          'color-mix(in oklab, var(--card) 80%, transparent)',
      },
      ':focus': 'color-mix(in oklab, var(--card) 80%, transparent)',
    },
    color: {
      default: 'inherit',
      ':hover': { default: null, '@media (hover: hover)': 'var(--foreground)' },
      ':focus': 'var(--foreground)',
    },
    padding: 20,
    textDecoration: 'none',
    backdropFilter: 'blur(24px)',
    // The legacy hover:shadow-[--shadow-glow-sm] compiled to an invalid value, so
    // hover intentionally adds no glow here.
    boxShadow: { default: 'none', ':focus-visible': focusRing },
    outline: 'none',
    userSelect: 'none',
    transitionProperty: transition,
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
    '--service-hover': {
      default: '0',
      ':hover': { default: null, '@media (hover: hover)': '1' },
    },
  },
  wash: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    pointerEvents: 'none',
    opacity: 'var(--service-hover)',
    backgroundImage:
      'linear-gradient(to bottom right, color-mix(in oklab, var(--primary) 10%, transparent), color-mix(in oklab, var(--secondary) 10%, transparent), transparent)',
    transitionProperty: 'opacity',
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
  },
  spotlight: {
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    pointerEvents: 'none',
    transitionProperty: 'opacity',
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
  },
  body: {
    position: 'relative',
    zIndex: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    textAlign: 'center',
  },
  iconFrame: {
    display: 'flex',
    justifyContent: 'center',
    transform: 'scale(calc(1 + 0.1 * var(--service-hover)))',
    transitionProperty: 'transform',
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
  },
  iconWash: {
    borderRadius: 'var(--radius)',
    padding: 10,
    backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
  },
  icon: { width: 40, height: 40, color: 'var(--primary)' },
  title: {
    color: 'var(--foreground)',
    fontSize: '1rem',
    lineHeight: 1.25,
    fontWeight: 700,
    transitionProperty: colorTransition,
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
  },
  description: {
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    lineHeight: 1.625,
  },
  allItem: {
    gridColumn: 'span 3 / span 3',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'color-mix(in oklab, var(--border) 30%, transparent)',
    paddingTop: 16,
  },
  allLink: {
    display: 'flex',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: {
      default: 8,
      ':hover': { default: null, '@media (hover: hover)': 12 },
    },
    borderRadius: 'var(--radius)',
    padding: 12,
    color: {
      default: 'var(--foreground)',
      ':hover': { default: null, '@media (hover: hover)': 'var(--primary)' },
    },
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: 600,
    letterSpacing: '0.025em',
    textDecoration: 'none',
    boxShadow: { default: 'none', ':focus-visible': focusRing },
    outline: 'none',
    userSelect: 'none',
    transitionProperty: transition,
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
    '--service-arrow-shift': {
      default: '0px',
      ':hover': { default: null, '@media (hover: hover)': '0.25rem' },
    },
  },
  arrow: {
    color: 'currentColor',
    transform: 'translateX(var(--service-arrow-shift))',
    transitionProperty: 'transform',
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
  },
});

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
      {...stylex.props(styles.enter)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <NavigationMenuLink asChild xstyle={styles.card}>
        <a
          href={`/services/${service.slug}`}
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
          {/* Background gradient wash (hover) */}
          <div {...stylex.props(styles.wash)} />

          {/* Mouse-tracking spotlight effect */}
          <div
            {...stylex.props(styles.spotlight)}
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 212, 255, 0.12), rgba(124, 58, 237, 0.08) 40%, transparent 60%)`,
            }}
          />

          <div {...stylex.props(styles.body)}>
            {/* Icon */}
            {Icon && (
              <div ref={iconRef} {...stylex.props(styles.iconFrame)}>
                <div {...stylex.props(styles.iconWash)}>
                  <Icon {...stylex.props(styles.icon)} aria-hidden="true" />
                </div>
              </div>
            )}

            {/* Title */}
            <div ref={titleRef} {...stylex.props(styles.title)}>
              {service.title}
            </div>

            {/* Description */}
            <p ref={descriptionRef} {...stylex.props(styles.description)}>
              {service.description}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

import type { SiteSettings } from '@bdkinc/content';
interface ServicesDropdownProps {
  copy: Pick<SiteSettings['navigation'], 'services' | 'allServices'>;
  services: Array<{
    slug: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

export function ServicesDropdown({ services, copy }: ServicesDropdownProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger xstyle={styles.trigger}>
        {copy.services}
      </NavigationMenuTrigger>
      <NavigationMenuContent xstyle={styles.content}>
        <ul {...stylex.props(styles.grid)}>
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
            {...stylex.props(styles.enter, styles.allItem)}
            style={{ animationDelay: `${services.length * 50}ms` }}
          >
            <NavigationMenuLink asChild xstyle={styles.allLink}>
              <a href="/services" onClick={navOnClick('/services')}>
                <span>{copy.allServices}</span>
                <span aria-hidden="true">
                  <PiArrowRight {...stylex.props(styles.arrow)} />
                </span>
              </a>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
