import type { HTMLAttributeAnchorTarget } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import CTAButton from '@/components/CTAButton.tsx';

export type CTAIcon =
  | 'mail'
  | 'phone'
  | 'sparkles'
  | 'arrow'
  | 'home'
  | 'back'
  | 'click'
  | 'search'
  | 'chat'
  | 'none';

export interface CTAAction {
  text: string;
  href: string;
  icon?: CTAIcon;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
}

export interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  icon?: CTAIcon;
  primaryAction?: CTAAction;
  secondaryAction?: CTAAction;
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
  secondaryAction,
  disableObserver = false,
}: CTASectionProps) {
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

  return (
    <section className="px-4 py-28 sm:px-6 lg:px-8">
      <div
        ref={sectionRef as any}
        className={cn(
          'mx-auto max-w-4xl text-center',
          'translate-y-4 opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform',
          sectionInView && 'translate-y-0 opacity-100'
        )}
      >
        <Card
          size="xl"
          interactive={false}
          className="bg-card/80 dark:bg-card/60 opacity-100 shadow-sm backdrop-blur-xl"
        >
          <h2
            className={cn(
              'text-foreground mb-4 text-3xl font-bold md:text-4xl',
              'translate-y-5 opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              sectionInView && 'translate-y-0 opacity-100'
            )}
            style={{ transitionDelay: sectionInView ? '150ms' : '0ms' }}
          >
            {title}
          </h2>
          <p
            className={cn(
              'text-muted-foreground mb-8 text-xl',
              'translate-y-5 opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              sectionInView && 'translate-y-0 opacity-100'
            )}
            style={{ transitionDelay: sectionInView ? '300ms' : '0ms' }}
          >
            {description}
          </p>
          <div
            className={cn(
              'translate-y-3 opacity-0 transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]',
              sectionInView && 'translate-y-0 opacity-100'
            )}
            style={{ transitionDelay: sectionInView ? '450ms' : '0ms' }}
          >
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="relative inline-block">
                <CTAButton
                  className="relative z-10 cursor-pointer shadow-lg transition-transform duration-200 ease-out hover:scale-[1.02]"
                  icon={resolvedPrimaryAction.icon}
                  href={resolvedPrimaryAction.href}
                  target={resolvedPrimaryAction.target}
                  rel={resolvedPrimaryAction.rel}
                >
                  {resolvedPrimaryAction.text}
                </CTAButton>
              </div>
              {secondaryAction && (
                <div className="inline-block">
                  <CTAButton
                    variant="outline"
                    className="hover:border-primary/50 hover:bg-primary/5 transition-transform duration-200 ease-out hover:scale-[1.02]"
                    icon={secondaryAction.icon}
                    href={secondaryAction.href}
                    target={secondaryAction.target}
                    rel={secondaryAction.rel}
                  >
                    {secondaryAction.text}
                  </CTAButton>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
