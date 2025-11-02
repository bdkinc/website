import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CTASectionProps {
  title?: string
  description?: string
  buttonText?: string
  buttonHref?: string
}

export default function CTASection({
  title = "Ready to Transform Your IT Infrastructure?",
  description = "Let's discuss how we can help your business grow with reliable IT solutions.",
  buttonText = "Get in Touch",
  buttonHref = "/contact"
}: CTASectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Animate the glass container
      gsap.from(containerRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      })

      // Stagger animation for content
      gsap.from([titleRef.current, descriptionRef.current, buttonRef.current], {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      })

      // Button hover effect enhancement
      if (buttonRef.current) {
        const button = buttonRef.current

        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
          })
        })

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div
        ref={containerRef}
        className="max-w-4xl mx-auto text-center glass rounded-2xl p-12"
      >
        <h2
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
        >
          {title}
        </h2>
        <p
          ref={descriptionRef}
          className="text-xl text-muted-foreground mb-8"
        >
          {description}
        </p>
        <a
          ref={buttonRef}
          href={buttonHref}
          className="inline-flex items-center justify-center px-8 py-3 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          {buttonText}
        </a>
      </div>
    </section>
  )
}
