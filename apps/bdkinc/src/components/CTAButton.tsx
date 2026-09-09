import React from 'react';
import { buttonVariants, cn } from '@bdkinc/design-system';
import {
  PiEnvelope,
  PiPhone,
  PiSparkle,
  PiArrowRight,
  PiHouse,
  PiArrowCircleLeft,
  PiCursorClick,
  PiCalendar,
  PiCursor,
  PiMagnifyingGlass,
  PiHeadset,
} from 'react-icons/pi';

type CTAVariant =
  'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
type CTASize = 'default' | 'sm' | 'lg' | 'cta' | 'icon' | 'icon-sm' | 'icon-lg';

interface CTAButtonBaseProps {
  variant?: CTAVariant;
  size?: CTASize;
  icon?:
    | 'mail'
    | 'phone'
    | 'sparkles'
    | 'arrow'
    | 'home'
    | 'back'
    | 'click'
    | 'calendar'
    | 'pointer'
    | 'search'
    | 'chat'
    | 'none';
  children: React.ReactNode;
  className?: string;
}

type CTAButtonProps =
  | (CTAButtonBaseProps &
      React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (CTAButtonBaseProps &
      React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

/**
 * CTA Button Component
 * Extends the base Button component with convenient icon support for common CTA actions.
 * Icons are automatically selected based on button text patterns or explicitly specified.
 */
export const CTAButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  CTAButtonProps
>(
  (
    {
      children,
      variant = 'default',
      size = 'cta',
      icon,
      className,
      href,
      ...props
    },
    ref
  ) => {
    // Auto-detect icon based on button text if not explicitly provided
    const getIconFromText = ():
      | 'mail'
      | 'phone'
      | 'sparkles'
      | 'arrow'
      | 'home'
      | 'back'
      | 'click'
      | 'calendar'
      | 'pointer'
      | 'search'
      | 'chat'
      | 'none' => {
      if (icon && icon !== 'none') return icon;

      const text = typeof children === 'string' ? children.toLowerCase() : '';

      if (text.includes('touch')) {
        return 'pointer';
      }
      if (text.includes('contact') || text.includes('message')) {
        return 'mail';
      }
      if (
        text.includes('schedule') ||
        text.includes('book') ||
        text.includes('appointment')
      ) {
        return 'calendar';
      }
      if (
        text.includes('call') ||
        text.includes('phone') ||
        text.includes('conversation')
      ) {
        return 'phone';
      }
      if (
        text.includes('talk') ||
        text.includes('support') ||
        text.includes('chat')
      ) {
        return 'chat';
      }
      if (text.includes('get started') || text.includes('try')) {
        return 'sparkles';
      }
      if (
        text.includes('learn more') ||
        text.includes('explore') ||
        text.includes('next')
      ) {
        return 'arrow';
      }
      if (
        text.includes('search') ||
        text.includes('find') ||
        text.includes('discover')
      ) {
        return 'search';
      }
      if (text.includes('home') || text.includes('homepage')) {
        return 'home';
      }
      if (text.includes('back') || text.includes('previous')) {
        return 'back';
      }
      if (text.includes('click') || text.includes('action')) {
        return 'click';
      }

      return 'none';
    };

    const selectedIcon = getIconFromText();

    // Icon components mapping
    const iconComponents: Record<string, React.ReactNode> = {
      mail: <PiEnvelope className="h-4 w-4" aria-hidden="true" />,
      phone: <PiPhone className="h-4 w-4" aria-hidden="true" />,
      sparkles: <PiSparkle className="h-4 w-4" aria-hidden="true" />,
      arrow: <PiArrowRight className="h-4 w-4" aria-hidden="true" />,
      home: <PiHouse className="h-4 w-4" aria-hidden="true" />,
      back: <PiArrowCircleLeft className="h-4 w-4" aria-hidden="true" />,
      click: <PiCursorClick className="h-4 w-4" aria-hidden="true" />,
      calendar: <PiCalendar className="h-4 w-4" aria-hidden="true" />,
      pointer: <PiCursor className="h-4 w-4" aria-hidden="true" />,
      search: <PiMagnifyingGlass className="h-4 w-4" aria-hidden="true" />,
      chat: <PiHeadset className="h-4 w-4" aria-hidden="true" />,
      none: null,
    };

    const buttonIcon = iconComponents[selectedIcon] || null;

    const content = (
      <>
        {children}
        {buttonIcon}
      </>
    );

    if (href) {
      const { target, rel, ...anchorProps } =
        props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      const isExternal = target === '_blank';

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
          className={cn(buttonVariants({ variant, size }), className)}
          {...anchorProps}
        >
          {content}
          {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      );
    }

    const { type, ...buttonProps } =
      props as React.ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? 'button'}
        className={cn(buttonVariants({ variant, size }), className)}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);

CTAButton.displayName = 'CTAButton';

export default CTAButton;
