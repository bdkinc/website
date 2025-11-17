import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import CTAButton from "@/components/CTAButton";
import Aurora from "./Aurora";
import CountUp from "./CountUp";

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Create subtle floating particles
    const container = particlesRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];
    const particleCount = 40;

    // Color options for particles
    const colors = [
      { bg: "var(--brand-primary)", shadow: "var(--brand-primary)" },
      { bg: "var(--brand-secondary)", shadow: "var(--brand-secondary)" },
      { bg: "var(--brand-accent)", shadow: "var(--brand-accent)" },
    ];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      const color = colors[i % colors.length]; // Cycle through colors
      particle.className = "absolute w-2 h-2 rounded-full";
      particle.style.backgroundColor = color.bg;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.boxShadow = `0 0 6px ${color.shadow}`;

      container.appendChild(particle);
      particles.push(particle);

      // Animate particle
      gsap.to(particle, {
        y: gsap.utils.random(-50, 50),
        x: gsap.utils.random(-30, 30),
        opacity: gsap.utils.random(0.4, 0.7),
        duration: gsap.utils.random(8, 15),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: gsap.utils.random(0, 3),
      });
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16 pt-16">
      {/* Clean gradient background */}
      <div className="absolute inset-0 -top-16 opacity-40 dark:opacity-60">
        <Aurora
          colorStops={["#00d4ff", "#7c3aed", "#00d4ff"]}
          amplitude={1.5}
          blend={0.6}
          speed={0.6}
        />
      </div>

      {/* Circuit board overlay */}
      <div className="absolute inset-0 -top-16 circuit-overlay opacity-30"></div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 -top-16 bg-gradient-to-b from-transparent via-background/50 to-background"></div>

      {/* Particle field */}
      <div ref={particlesRef} className="absolute inset-0 -top-16 pointer-events-none" aria-hidden="true" />

      {/* Radial gradient spotlight */}
      <div className="absolute inset-0 -top-16 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-50"></div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both backdrop-blur-xl">
            <span className="text-sm">
              {new Date().getFullYear() - 2000}+ Years of{" "}
              <span className="text-[--brand-accent] font-semibold">
                IT Excellence
              </span>
            </span>
          </div>

          {/* Main heading - clean and bold */}
          <h1 className="text-6xl md:text-8xl lg:text-10xl font-bold tracking-tight animate-in fill-mode-both fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <span className="text-foreground">IT Made </span>
            <span className="bg-gradient-to-br from-primary via-primary to-secondary bg-clip-text text-transparent">
              Simple
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground fill-mode-both animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Transform your business with comprehensive managed IT services,
            cloud solutions, artificial intelligence, and enterprise-grade
            cybersecurity.
          </p>

          {/* CTAs - clean with subtle animations */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-30">
            <div className="fill-mode-both animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <CTAButton
                size="lg"
                className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                href="/contact"
                icon="click"
              >
                Get Started
              </CTAButton>
            </div>
            <div className="fill-mode-both animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
              <CTAButton
                size="lg"
                variant="outline"
                className="shadow-lg hover:shadow-xl hover:scale-105 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                href="/services"
                icon="search"
              >
                Explore Services
              </CTAButton>
            </div>
          </div>

          {/* Stats - clean cards with subtle depth */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
            <div className="space-y-2 fill-mode-both animate-in fade-in zoom-in duration-600 delay-500 p-6 rounded-xl glass backdrop-blur-xl border border-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                <CountUp
                  from={0}
                  to={new Date().getFullYear() - 2000}
                  duration={1.25}
                />
                +
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Years in Business
              </div>
            </div>
            <div className="space-y-2 fill-mode-both animate-in fade-in zoom-in duration-600 delay-600 p-6 rounded-xl glass backdrop-blur-xl border border-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                <CountUp from={0} to={500} duration={1.25} />+
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Clients Served
              </div>
            </div>
            <div className="space-y-2 fill-mode-both animate-in fade-in zoom-in duration-600 delay-700 p-6 rounded-xl glass backdrop-blur-xl border border-primary/10 hover:border-[--brand-accent]/30 hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-[--brand-accent]">
                <CountUp from={0} to={24} duration={1.25} />x
                <CountUp from={0} to={7} duration={1.25} />
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent bar - clean gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-secondary/50 to-[--brand-accent]/50"></div>
    </section>
  );
}
