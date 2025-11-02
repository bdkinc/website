import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Aurora from "./Aurora";

export default function ContactHero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 }
        )
        .fromTo(
          descriptionRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden -mt-16 pt-16">
      {/* Aurora background */}
      <div className="absolute inset-0 -top-16 opacity-30 dark:opacity-60">
        <Aurora
          colorStops={["#00d4ff", "#7c3aed", "#00d4ff"]}
          amplitude={1.5}
          blend={0.4}
          speed={0.8}
        />
      </div>

      {/* Animated background */}
      <div className="absolute inset-0 -top-16 gradient-mesh"></div>

      {/* Circuit board pattern overlay */}
      <div className="absolute inset-0 -top-16 opacity-40 circuit-overlay"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
        <div className="space-y-8">
          <h1
            ref={titleRef}
            className="text-5xl md:text-6xl font-bold tracking-tight"
          >
            <span className="text-foreground">Let's </span>
            <span className="bg-linear-to-br from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              Connect
            </span>
          </h1>

          <p
            ref={descriptionRef}
            className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground"
          >
            Ready to transform your IT infrastructure? Our team is here to help
            24/7.
          </p>
        </div>
      </div>
    </section>
  );
}
