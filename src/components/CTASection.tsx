import { useEffect, useRef } from 'react';
import type { HTMLAttributeAnchorTarget } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import CTAButton from '@/components/CTAButton.tsx';

type CTAIcon =
  | 'mail'
  | 'phone'
  | 'sparkles'
  | 'arrow'
  | 'home'
  | 'back'
  | 'click'
  | 'search'
  | 'none';

interface CTAAction {
  text: string;
  href: string;
  icon?: CTAIcon;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
}

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  icon?: CTAIcon;
  primaryAction?: CTAAction;
  /**
   * When true, skip the intersection observer and show immediately.
   * Useful for pages where the component is server-rendered without a client directive.
   */
  disableObserver?: boolean;
}

export default function CTASection({
  title = 'Ready to Transform Your IT Infrastructure?',
  description = "Let's discuss how we can help your business grow with reliable IT solutions.",
  buttonText = 'Get in Touch',
  buttonHref = '/contact',
  icon,
  primaryAction,
  disableObserver = false,
}: CTASectionProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const resolvedPrimaryAction: CTAAction = {
    text: primaryAction?.text ?? buttonText,
    href: primaryAction?.href ?? buttonHref,
    icon: primaryAction?.icon ?? icon,
    target: primaryAction?.target,
    rel: primaryAction?.rel,
  };

  // Viewport detection for CTA section
  const { ref: sectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true,
  });

  const sectionInView = disableObserver ? true : isIntersecting;

  useEffect(() => {
    if (!buttonRef.current) return;

    // Skip hover animation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const button = buttonRef.current;

    // Button hover effect enhancement with GSAP
    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div
        ref={sectionRef as any}
        className={cn(
          'mx-auto max-w-4xl text-center',
          'scale-95 opacity-0 transition-[opacity,transform] duration-500 ease-out',
          sectionInView && 'scale-100 opacity-100'
        )}
      >
        <Card size="xl" className="opacity-100">
          <h2
            className={cn(
              'text-foreground mb-4 text-3xl font-bold md:text-4xl',
              'translate-y-4 opacity-0 transition-[opacity,transform] duration-600 ease-out',
              sectionInView && 'translate-y-0 opacity-100'
            )}
            style={{ transitionDelay: sectionInView ? '150ms' : '0ms' }}
          >
            {title}
          </h2>
          <p
            className={cn(
              'text-muted-foreground mb-8 text-xl',
              'translate-y-4 opacity-0 transition-[opacity,transform] duration-600 ease-out',
              sectionInView && 'translate-y-0 opacity-100'
            )}
            style={{ transitionDelay: sectionInView ? '300ms' : '0ms' }}
          >
            {description}
          </p>
          <div
            className={cn(
              'translate-y-2 opacity-0 transition-[opacity,transform] duration-400 ease-out',
              sectionInView && 'translate-y-0 opacity-100'
            )}
            style={{ transitionDelay: sectionInView ? '450ms' : '0ms' }}
          >
            <div className="relative inline-block">
              <CTAButton
                ref={buttonRef}
                className="relative z-10 cursor-pointer shadow-lg pulse-ring"
                icon={resolvedPrimaryAction.icon}
                href={resolvedPrimaryAction.href}
                target={resolvedPrimaryAction.target}
                rel={resolvedPrimaryAction.rel}
              >
                {resolvedPrimaryAction.text}
              </CTAButton>
              <div className="from-primary via-secondary to-primary group-hover:animate-shimmer absolute inset-0 -z-10 rounded-lg bg-linear-to-r bg-size-[200%_100%] opacity-20" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
