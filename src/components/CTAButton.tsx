import React from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Mail,
  Phone,
  Sparkles,
  ArrowRight,
  Home,
  ArrowLeftCircle,
  MousePointerClick,
  Calendar,
  Pointer,
  Search
} from 'lucide-react'

type CTAVariant = 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link'
type CTASize = 'default' | 'sm' | 'lg' | 'cta' | 'icon' | 'icon-sm' | 'icon-lg'

interface CTAButtonBaseProps {
  variant?: CTAVariant
  size?: CTASize
  icon?: 'mail' | 'phone' | 'sparkles' | 'arrow' | 'home' | 'back' | 'click' | 'calendar' | 'pointer' | 'search' | 'none'
  children: React.ReactNode
  className?: string
}

type CTAButtonProps =
  | (CTAButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (CTAButtonBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })

/**
 * CTA Button Component
 * Extends the base Button component with convenient icon support for common CTA actions.
 * Icons are automatically selected based on button text patterns or explicitly specified.
 */
export const CTAButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, CTAButtonProps>(
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
    const getIconFromText = (): 'mail' | 'phone' | 'sparkles' | 'arrow' | 'home' | 'back' | 'click' | 'calendar' | 'pointer' | 'search' | 'none' => {
      if (icon && icon !== 'none') return icon

      const text = typeof children === 'string' ? children.toLowerCase() : ''

      if (text.includes('touch')) {
        return 'pointer'
      }
      if (
        text.includes('contact') ||
        text.includes('message')
      ) {
        return 'mail'
      }
      if (
        text.includes('schedule') ||
        text.includes('book') ||
        text.includes('appointment')
      ) {
        return 'calendar'
      }
      if (
        text.includes('call') ||
        text.includes('phone') ||
        text.includes('conversation')
      ) {
        return 'phone'
      }
      if (text.includes('get started') || text.includes('try')) {
        return 'sparkles'
      }
      if (
        text.includes('learn more') ||
        text.includes('explore') ||
        text.includes('next')
      ) {
        return 'arrow'
      }
      if (
        text.includes('search') ||
        text.includes('find') ||
        text.includes('discover')
      ) {
        return 'search'
      }
      if (text.includes('home') || text.includes('homepage')) {
        return 'home'
      }
      if (text.includes('back') || text.includes('previous')) {
        return 'back'
      }
      if (text.includes('click') || text.includes('action')) {
        return 'click'
      }

      return 'none'
    }

    const selectedIcon = getIconFromText()

    // Icon components mapping
    const iconComponents: Record<string, React.ReactNode> = {
      mail: <Mail className="h-4 w-4" aria-hidden="true" />,
      phone: <Phone className="h-4 w-4" aria-hidden="true" />,
      sparkles: <Sparkles className="h-4 w-4" aria-hidden="true" />,
      arrow: <ArrowRight className="h-4 w-4" aria-hidden="true" />,
      home: <Home className="h-4 w-4" aria-hidden="true" />,
      back: <ArrowLeftCircle className="h-4 w-4" aria-hidden="true" />,
      click: <MousePointerClick className="h-4 w-4" aria-hidden="true" />,
      calendar: <Calendar className="h-4 w-4" aria-hidden="true" />,
      pointer: <Pointer className="h-4 w-4" aria-hidden="true" />,
      search: <Search className="h-4 w-4" aria-hidden="true" />,
      none: null
    }

    const buttonIcon = iconComponents[selectedIcon] || null

    const content = (
      <>
        {children}
        {buttonIcon}
      </>
    )

    if (href) {
      const { target, rel, ...anchorProps } = props as React.AnchorHTMLAttributes<HTMLAnchorElement>

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
          className={cn(buttonVariants({ variant, size }), className)}
          {...anchorProps}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(buttonVariants({ variant, size }), className)}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    )
  }
)

CTAButton.displayName = 'CTAButton'

export default CTAButton
