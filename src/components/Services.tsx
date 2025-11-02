import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { iconMap } from "@/lib/icons";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServicesProps {
  services: Array<{
    slug: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

export default function Services({ services }: ServicesProps) {
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Filter out null refs
    const cards = cardsRef.current.filter((card) => card !== null);

    if (cards.length === 0) return;

    if (prefersReducedMotion) {
      // Skip animations, set final state immediately
      cards.forEach((card) => {
        (card as HTMLElement).style.opacity = '1';
        (card as HTMLElement).style.transform = 'translateY(0)';
      });
      return;
    }

    // Set initial state (invisible and below viewport)
    gsap.set(cards, {
      opacity: 0,
      y: 50,
    });

    // Animate cards in with stagger effect
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: cards[0],
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Our </span>
            <span className="bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive IT solutions tailored for businesses of any size
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <a
                key={service.slug}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                href={`/services/${service.slug}`}
                className="block group"
              >
                <Card className="h-full cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-[--shadow-glow-sm]">
                  <CardHeader className="text-center">
                    <div className="mb-6 p-4 rounded-xl bg-linear-to-brr from-primary/10 to-secondary/10 w-fit mx-auto group-hover:scale-110 transition-transform">
                      {Icon && <Icon className="w-8 h-8 text-primary" />}
                    </div>
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
