import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Zap, ShieldCheck, Users } from "lucide-react";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

const features = [
  {
    icon: <Zap className="icon-md text-primary" />,
    title: "Fast Response",
    description:
      "Quick turnaround times with dedicated support staff available 24/7.",
  },
  {
    icon: <ShieldCheck className="icon-md text-primary" />,
    title: "Proven Expertise",
    description:
      "Over 25 years of experience delivering reliable IT solutions.",
  },
  {
    icon: <Users className="icon-md text-primary" />,
    title: "Personalized Service",
    description: "Dedicated team that understands your unique business needs.",
  },
];

export default function WhyChooseUs() {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Viewport detection for section header
  const { ref: headerRef, isIntersecting: headerInView } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true
  });

  // Viewport detection for features grid
  const { ref: gridRef, isIntersecting: gridInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });

  useEffect(() => {
    // Animate icon circles on hover with smooth scale and rotation
    const listeners: Array<{
      iconWrapper: HTMLDivElement;
      handleMouseEnter: () => void;
      handleMouseLeave: () => void;
    }> = [];

    iconRefs.current.forEach((iconWrapper) => {
      if (!iconWrapper) return;

      const handleMouseEnter = () => {
        iconWrapper.style.transform = "scale(1.15) rotate(8deg)";
      };

      const handleMouseLeave = () => {
        iconWrapper.style.transform = "scale(1) rotate(0deg)";
      };

      iconWrapper.addEventListener("mouseenter", handleMouseEnter);
      iconWrapper.addEventListener("mouseleave", handleMouseLeave);

      listeners.push({ iconWrapper, handleMouseEnter, handleMouseLeave });
    });

    return () => {
      listeners.forEach(({ iconWrapper, handleMouseEnter, handleMouseLeave }) => {
        iconWrapper.removeEventListener("mouseenter", handleMouseEnter);
        iconWrapper.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 gradient-mesh relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

      <div className="max-w-7xl mx-auto">
        <div 
          ref={headerRef as any}
          className={cn(
            "text-center mb-16",
            "opacity-0 translate-y-8 transition-[opacity,transform] duration-700 ease-out",
            headerInView && "opacity-100 translate-y-0"
          )}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Why Choose </span>
            <span className="text-primary font-display font-extrabold">
              BDK
            </span>
            <span>?</span>
          </h2>
        </div>

        <div 
          ref={gridRef as any}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            // Stagger: 120ms between features
            const delayMs = index * 120;
            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center justify-center text-center space-y-4 h-full",
                  "opacity-0 translate-y-6 transition-[opacity,transform] duration-600 ease-out"
                )}
                style={{ 
                  transitionDelay: gridInView ? `${delayMs}ms` : '0ms',
                  opacity: gridInView ? 1 : 0,
                  transform: gridInView ? 'translateY(0)' : 'translateY(24px)'
                }}
              >
                <div
                  ref={(el) => {
                    iconRefs.current[index] = el;
                  }}
                  className={cn(
                    "w-16 h-16 rounded-full text-foreground flex items-center justify-center",
                    "transition-transform duration-300"
                  )}
                >
                  {feature.icon}
                </div>
                <h3 className={cn(
                  "text-2xl font-semibold text-foreground text-center",
                  "transition-colors duration-300"
                )}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center max-w-sm mx-auto">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
    </section>
  );
}
