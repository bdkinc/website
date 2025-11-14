import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver'
import CTAButton from '@/components/CTAButton'

interface CTASectionProps {
  title?: string
  description?: string
  buttonText?: string
  buttonHref?: string
  icon?: 'mail' | 'phone' | 'sparkles' | 'arrow' | 'home' | 'back' | 'click' | 'none'
}

export default function CTASection({
  title = "Ready to Transform Your IT Infrastructure?",
  description = "Let's discuss how we can help your business grow with reliable IT solutions.",
  buttonText = "Get in Touch",
  buttonHref = "/contact",
  icon
}: CTASectionProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  // Viewport detection for CTA section
  const { ref: sectionRef, isIntersecting: sectionInView } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true
  })

  useEffect(() => {
    if (!buttonRef.current) return

    // Skip hover animation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const button = buttonRef.current

    // Button hover effect enhancement with GSAP
    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    button.addEventListener('mouseenter', handleMouseEnter)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div 
        ref={sectionRef as any}
        className={cn(
          "max-w-4xl mx-auto text-center",
          "opacity-0 scale-95 transition-[opacity,transform] duration-500 ease-out",
          sectionInView && "opacity-100 scale-100"
        )}
      >
      <Card 
        size="xl"
        className="opacity-100"
      >
        <h2 
          className={cn(
            "text-3xl md:text-4xl font-bold mb-4 text-foreground",
            "opacity-0 translate-y-4 transition-[opacity,transform] duration-600 ease-out",
            sectionInView && "opacity-100 translate-y-0"
          )}
          style={{ transitionDelay: sectionInView ? '150ms' : '0ms' }}
        >
          {title}
        </h2>
        <p 
          className={cn(
            "text-xl text-muted-foreground mb-8",
            "opacity-0 translate-y-4 transition-[opacity,transform] duration-600 ease-out",
            sectionInView && "opacity-100 translate-y-0"
          )}
          style={{ transitionDelay: sectionInView ? '300ms' : '0ms' }}
        >
          {description}
        </p>
        <div
          className={cn(
            "opacity-0 translate-y-2 transition-[opacity,transform] duration-400 ease-out",
            sectionInView && "opacity-100 translate-y-0"
          )}
          style={{ transitionDelay: sectionInView ? '450ms' : '0ms' }}
        >
          <CTAButton
            ref={buttonRef}
            className="shadow-sm cursor-pointer"
            icon={icon}
            onClick={(e) => {
              e.preventDefault()
              window.location.href = buttonHref
            }}
          >
            {buttonText}
          </CTAButton>
        </div>
        </Card>
      </div>
    </section>
  )
}
