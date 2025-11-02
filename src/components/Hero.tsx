import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Server,
  Shield,
  Cloud,
  Database,
  Lock,
  Cpu,
  Network,
  HardDrive,
  Terminal,
  Wifi,
  Code,
  Smartphone,
  Globe,
  Laptop,
  Zap,
  Layers,
  GitBranch,
  Settings,
  Monitor,
  CloudCog,
  Headphones,
  LineChart,
} from "lucide-react";
import Aurora from "./Aurora";
import CountUp from "./CountUp";

export default function Hero() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<SVGSVGElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate main content elements with stagger
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(
          badgeRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          subheadingRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          ctasRef.current?.children || [],
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.15 },
          "-=0.4"
        )
        .fromTo(
          statsRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.3"
        );

      // Animate floating icons with random delays and movements
      const icons = iconsRef.current.filter((icon) => icon !== null);
      icons.forEach((icon) => {
        gsap.fromTo(
          icon,
          {
            opacity: 0,
            y: gsap.utils.random(-30, 30),
            x: gsap.utils.random(-30, 30),
          },
          {
            opacity: 0.2,
            y: 0,
            x: 0,
            duration: gsap.utils.random(1, 2),
            delay: gsap.utils.random(0, 1.5),
            ease: "power2.out",
          }
        );

        // Add continuous floating animation
        gsap.to(icon, {
          y: gsap.utils.random(-15, 15),
          duration: gsap.utils.random(3, 5),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 2),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const addIconRef = (el: SVGSVGElement | null) => {
    if (el && !iconsRef.current.includes(el)) {
      iconsRef.current.push(el);
    }
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16 pt-16">
      {/* Aurora background - extends to top */}
      <div className="absolute inset-0 -top-16 opacity-30 dark:opacity-60">
        <Aurora
          colorStops={["#00d4ff", "#7c3aed", "#00d4ff"]}
          amplitude={1.5}
          blend={0.4}
          speed={0.8}
        />
      </div>

      {/* Animated background - extends to top */}
      <div className="absolute inset-0 -top-16 gradient-mesh"></div>

      {/* Circuit board pattern overlay - extends to top */}
      <div className="absolute inset-0 -top-16 opacity-40 circuit-overlay"></div>

      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none [&>svg]:opacity-0">
        {/* Top row */}
        <Server
          ref={addIconRef}
          className="absolute top-[8%] left-[5%] text-brand-primary w-8 h-8"
        />
        <Shield
          ref={addIconRef}
          className="absolute top-[12%] left-[18%] text-brand-secondary w-16 h-16"
        />
        <Wifi
          ref={addIconRef}
          className="absolute top-[6%] left-[32%] text-brand-primary w-7 h-7"
        />
        <Code
          ref={addIconRef}
          className="absolute top-[15%] left-[45%] text-brand-secondary w-10 h-10"
        />
        <Zap
          ref={addIconRef}
          className="absolute top-[10%] left-[60%] text-brand-primary w-14 h-14"
        />
        <Globe
          ref={addIconRef}
          className="absolute top-[18%] left-[75%] text-brand-primary w-11 h-11"
        />
        <Network
          ref={addIconRef}
          className="absolute top-[8%] right-[12%] text-brand-secondary w-9 h-9"
        />
        <Monitor
          ref={addIconRef}
          className="absolute top-[20%] right-[5%] text-brand-secondary w-12 h-12"
        />
        <LineChart
          ref={addIconRef}
          className="absolute top-[14%] right-[25%] text-brand-primary w-8 h-8"
        />

        {/* Middle row */}
        <Lock
          ref={addIconRef}
          className="absolute top-[35%] left-[3%] text-brand-secondary w-10 h-10"
        />
        <Laptop
          ref={addIconRef}
          className="absolute top-[42%] left-[15%] text-brand-secondary w-15 h-15"
        />
        <Settings
          ref={addIconRef}
          className="absolute top-[38%] left-[30%] text-brand-primary w-7 h-7"
        />
        <Database
          ref={addIconRef}
          className="absolute top-[45%] left-[43%] text-brand-secondary w-13 h-13"
        />
        <Layers
          ref={addIconRef}
          className="absolute top-[40%] left-[58%] text-brand-secondary w-9 h-9"
        />
        <CloudCog
          ref={addIconRef}
          className="absolute top-[48%] left-[72%] text-brand-secondary w-16 h-16"
        />
        <Cpu
          ref={addIconRef}
          className="absolute top-[36%] right-[18%] text-brand-primary w-11 h-11"
        />
        <Smartphone
          ref={addIconRef}
          className="absolute top-[50%] right-[8%] text-brand-primary w-6 h-6"
        />
        <Terminal
          ref={addIconRef}
          className="absolute top-[44%] right-[32%] text-brand-secondary w-8 h-8"
        />

        {/* Bottom row */}
        <Network
          ref={addIconRef}
          className="absolute bottom-[8%] left-[6%] text-brand-primary w-9 h-9"
        />
        <HardDrive
          ref={addIconRef}
          className="absolute bottom-[15%] left-[20%] text-brand-primary w-17 h-17"
        />
        <Shield
          ref={addIconRef}
          className="absolute bottom-[12%] left-[35%] text-brand-secondary w-10 h-10"
        />
        <Monitor
          ref={addIconRef}
          className="absolute bottom-[18%] left-[50%] text-brand-primary w-7 h-7"
        />
        <GitBranch
          ref={addIconRef}
          className="absolute bottom-[10%] left-[65%] text-brand-secondary w-11 h-11"
        />
        <Cloud
          ref={addIconRef}
          className="absolute bottom-[20%] left-[78%] text-brand-primary w-14 h-14"
        />
        <Cpu
          ref={addIconRef}
          className="absolute bottom-[6%] right-[20%] text-brand-primary w-8 h-8"
        />
        <Headphones
          ref={addIconRef}
          className="absolute bottom-[14%] right-[12%] text-brand-primary w-13 h-13"
        />
        <Lock
          ref={addIconRef}
          className="absolute bottom-[22%] right-[5%] text-brand-secondary w-6 h-6"
        />
        <Server
          ref={addIconRef}
          className="absolute bottom-[16%] right-[35%] text-brand-primary w-12 h-12"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center px-4 py-2 rounded-full glass border border-input opacity-0"
          >
            <span className="text-sm text-brand-primary font-medium">
              {new Date().getFullYear() - 2000}+ Years of IT Excellence
            </span>
          </div>

          {/* Main heading */}
          <h1
            ref={headingRef}
            className="text-5xl md:text-7xl font-bold tracking-tight opacity-0"
          >
            <span>IT Made</span>{" "}
            <span className="bg-linear-to-br from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              Simple
            </span>
          </h1>

          {/* Subheading */}
          <p
            ref={subheadingRef}
            className="max-w-2xl mx-auto text-xl md:text-2xl opacity-0"
          >
            Transform your business with comprehensive managed IT services,
            cloud solutions, artificial intelligence, and enterprise-grade
            cybersecurity.
          </p>

          {/* CTAs */}
          <div
            ref={ctasRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-30 *:opacity-0"
          >
            <Button size="lg" className="group bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg" asChild>
              <a href="/contact">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white shadow-lg" asChild>
              <a href="/services">
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12 *:opacity-0"
          >
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-brand-primary">
                <CountUp
                  from={0}
                  to={new Date().getFullYear() - 2000}
                  duration={1.25}
                />
                +
              </div>
              <div className="text-sm text-muted-foreground">
                Years in Business
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-brand-primary">
                <CountUp from={0} to={500} duration={1.25} />+
              </div>
              <div className="text-sm text-muted-foreground">
                Clients Served
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-brand-primary">
                <CountUp from={0} to={24} duration={1.25} />x
                <CountUp from={0} to={7} duration={1.25} />
              </div>
              <div className="text-sm text-muted-foreground">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-br from-brand-primary to-brand-secondary"></div>
    </section>
  );
}
