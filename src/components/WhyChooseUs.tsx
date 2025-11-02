import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, ShieldCheck, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Fast Response",
    description:
      "Quick turnaround times with dedicated support staff available 24/7.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Proven Expertise",
    description:
      "Over 25 years of experience delivering reliable IT solutions.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Personalized Service",
    description: "Dedicated team that understands your unique business needs.",
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current) return;

    const ctx = gsap.context(() => {
      // Animate heading
      gsap.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Animate cards with stagger
      gsap.from(cardsRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // Animate icon circles on hover
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const iconWrapper = card.querySelector(".icon-wrapper");

        card.addEventListener("mouseenter", () => {
          gsap.to(iconWrapper, {
            scale: 1.1,
            rotate: 5,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(iconWrapper, {
            scale: 1,
            rotate: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 gradient-mesh relative"
    >
      <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-br from-brand-primary to-brand-secondary" />

      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Why Choose </span>
            <span className="bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent font-display font-extrabold">
              BDK
            </span>
            <span>?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="text-center space-y-4"
            >
              <div className="icon-wrapper w-16 h-16 mx-auto rounded-full text-foreground flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-br from-brand-primary to-brand-secondary" />
    </section>
  );
}
