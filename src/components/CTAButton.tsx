import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Mail,
  Phone,
  Sparkles,
  ArrowRight,
  Home,
  ArrowLeftCircle,
  MousePointerClick,
  Calendar,
  Pointer
} from 'lucide-react'

type CTAVariant = 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link'
type CTASize = 'default' | 'sm' | 'lg' | 'cta' | 'icon' | 'icon-sm' | 'icon-lg'

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CTAVariant
  size?: CTASize
  href?: string
  icon?: 'mail' | 'phone' | 'sparkles' | 'arrow' | 'home' | 'back' | 'click' | 'calendar' | 'pointer' | 'none'
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

/**
 * CTA Button Component
 * Extends the base Button component with convenient icon support for common CTA actions.
 * Icons are automatically selected based on button text patterns or explicitly specified.
 */
export const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'cta',
      icon,
      className,
      ...props
    },
    ref
  ) => {
    // Auto-detect icon based on button text if not explicitly provided
    const getIconFromText = (): 'mail' | 'phone' | 'sparkles' | 'arrow' | 'home' | 'back' | 'click' | 'calendar' | 'pointer' | 'none' => {
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
      none: null
    }

    const buttonIcon = iconComponents[selectedIcon] || null

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={className}
        {...props}
      >
        {children}
        {buttonIcon}
      </Button>
    )
  }
)

CTAButton.displayName = 'CTAButton'

export default CTAButton
