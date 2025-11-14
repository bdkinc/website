import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import CTAButton from "@/components/CTAButton";
import {
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
  const iconsRef = useRef<SVGSVGElement[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Array<HTMLButtonElement | HTMLAnchorElement>>([]);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Animate floating icons with GSAP for continuous animation
    const icons = iconsRef.current.filter((icon) => icon !== null);
    const buttons = buttonsRef.current;
    const buttonCleanup: Array<() => void> = [];

    const ctx = gsap.context(() => {
      icons.forEach((icon) => {
        // Random entrance animation
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
            immediateRender: true,
          }
        );

        // Add continuous floating animation with enhanced motion
        gsap.to(icon, {
          y: gsap.utils.random(-25, 25),
          x: gsap.utils.random(-10, 10),
          rotation: gsap.utils.random(-10, 10),
          duration: gsap.utils.random(4, 6),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 2),
        });

        // Add subtle glow effect
        gsap.to(icon, {
          opacity: gsap.utils.random(0.15, 0.35),
          duration: gsap.utils.random(2, 3),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 1),
        });
      });

      // Add hover animations to buttons (icon scaling only)
      buttons.forEach((button) => {
        const icon = button.querySelector('svg');
        if (!icon) return;

        gsap.set(icon, { transformOrigin: "center", scale: 1 });

        const handleMouseEnter = () => {
          gsap.to(icon, {
            scale: 1.2,
            duration: 0.25,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(icon, {
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
          });
        };

        button.addEventListener("mouseenter", handleMouseEnter);
        button.addEventListener("mouseleave", handleMouseLeave);

        buttonCleanup.push(() => {
          button.removeEventListener("mouseenter", handleMouseEnter);
          button.removeEventListener("mouseleave", handleMouseLeave);
        });
      });
    }, contentRef);

    return () => {
      buttonCleanup.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  const addIconRef = (el: SVGSVGElement | null) => {
    if (el && !iconsRef.current.includes(el)) {
      el.setAttribute("aria-hidden", "true");
      iconsRef.current.push(el);
    }
  };

  const addButtonRef = (el: HTMLButtonElement | HTMLAnchorElement | null) => {
    if (el && !buttonsRef.current.includes(el)) {
      buttonsRef.current.push(el);
    }
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16 pt-16">
      {/* Aurora background - extends to top */}
      <div className="absolute inset-0 -top-16 opacity-30 dark:opacity-60">
        <Aurora
          colorStops={["#00d4ff", "#7c3aed", "#00d4ff"]}
          amplitude={1.8}
          blend={0.5}
          speed={0.8}
        />
      </div>

      {/* Animated background - extends to top */}
      <div className="absolute inset-0 -top-16 gradient-mesh"></div>

      {/* Circuit board pattern overlay - extends to top */}
      <div className="absolute inset-0 -top-16 opacity-40 circuit-overlay"></div>

      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top row */}
        <Server
          ref={addIconRef}
          className="absolute top-[8%] left-[5%] text-brand-primary w-8 h-8 opacity-0"
        />
        <Shield
          ref={addIconRef}
          className="absolute top-[12%] left-[18%] text-brand-secondary w-16 h-16 opacity-0"
        />
        <Wifi
          ref={addIconRef}
          className="absolute top-[6%] left-[32%] text-brand-primary w-7 h-7 opacity-0"
        />
        <Code
          ref={addIconRef}
          className="absolute top-[15%] left-[45%] text-brand-secondary w-10 h-10 opacity-0"
        />
        <Zap
          ref={addIconRef}
          className="absolute top-[10%] left-[60%] text-brand-primary w-14 h-14 opacity-0"
        />
        <Globe
          ref={addIconRef}
          className="absolute top-[18%] left-[75%] text-brand-primary w-11 h-11 opacity-0"
        />
        <Network
          ref={addIconRef}
          className="absolute top-[8%] right-[12%] text-brand-secondary w-9 h-9 opacity-0"
        />
        <Monitor
          ref={addIconRef}
          className="absolute top-[20%] right-[5%] text-brand-secondary w-12 h-12 opacity-0"
        />
        <LineChart
          ref={addIconRef}
          className="absolute top-[14%] right-[25%] text-brand-primary w-8 h-8 opacity-0"
        />

        {/* Middle row */}
        <Lock
          ref={addIconRef}
          className="absolute top-[35%] left-[3%] text-brand-secondary w-10 h-10 opacity-0"
        />
        <Laptop
          ref={addIconRef}
          className="absolute top-[42%] left-[15%] text-brand-secondary w-15 h-15 opacity-0"
        />
        <Settings
          ref={addIconRef}
          className="absolute top-[38%] left-[30%] text-brand-primary w-7 h-7 opacity-0"
        />
        <Database
          ref={addIconRef}
          className="absolute top-[45%] left-[43%] text-brand-secondary w-13 h-13 opacity-0"
        />
        <Layers
          ref={addIconRef}
          className="absolute top-[40%] left-[58%] text-brand-secondary w-9 h-9 opacity-0"
        />
        <CloudCog
          ref={addIconRef}
          className="absolute top-[48%] left-[72%] text-brand-secondary w-16 h-16 opacity-0"
        />
        <Cpu
          ref={addIconRef}
          className="absolute top-[36%] right-[18%] text-brand-primary w-11 h-11 opacity-0"
        />
        <Smartphone
          ref={addIconRef}
          className="absolute top-[50%] right-[8%] text-brand-primary w-6 h-6 opacity-0"
        />
        <Terminal
          ref={addIconRef}
          className="absolute top-[44%] right-[32%] text-brand-secondary w-8 h-8 opacity-0"
        />

        {/* Bottom row */}
        <Network
          ref={addIconRef}
          className="absolute bottom-[8%] left-[6%] text-brand-primary w-9 h-9 opacity-0"
        />
        <HardDrive
          ref={addIconRef}
          className="absolute bottom-[15%] left-[20%] text-brand-primary w-17 h-17 opacity-0"
        />
        <Shield
          ref={addIconRef}
          className="absolute bottom-[12%] left-[35%] text-brand-secondary w-10 h-10 opacity-0"
        />
        <Monitor
          ref={addIconRef}
          className="absolute bottom-[18%] left-[50%] text-brand-primary w-7 h-7 opacity-0"
        />
        <GitBranch
          ref={addIconRef}
          className="absolute bottom-[10%] left-[65%] text-brand-secondary w-11 h-11 opacity-0"
        />
        <Cloud
          ref={addIconRef}
          className="absolute bottom-[20%] left-[78%] text-brand-primary w-14 h-14 opacity-0"
        />
        <Cpu
          ref={addIconRef}
          className="absolute bottom-[6%] right-[20%] text-brand-primary w-8 h-8 opacity-0"
        />
        <Headphones
          ref={addIconRef}
          className="absolute bottom-[14%] right-[12%] text-brand-primary w-13 h-13 opacity-0"
        />
        <Lock
          ref={addIconRef}
          className="absolute bottom-[22%] right-[5%] text-brand-secondary w-6 h-6 opacity-0"
        />
        <Server
          ref={addIconRef}
          className="absolute bottom-[16%] right-[35%] text-brand-primary w-12 h-12 opacity-0"
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="space-y-8">
          {/* Badge - fade in + slide from top */}
          <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-input animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both">
            <span className="text-sm ">
              {new Date().getFullYear() - 2000}+ Years of <span className="text-orange-500 dark:text-orange-300 font-medium">IT Excellence</span>
            </span>
          </div>

          {/* Main heading - fade in + slide from bottom with stagger */}
          <h1 className="text-6xl md:text-8xl lg:text-10xl font-bold tracking-tight animate-in fill-mode-both fade-in slide-in-from-bottom-8 duration-700 delay-100 text-shadow">
            <span>IT Made</span>{" "}
            <span className="bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
              Simple
            </span>
          </h1>

          {/* Subheading - fade in + slide from bottom */}
          <p className="max-w-2xl mx-auto text-xl md:text-2xl fill-mode-both animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Transform your business with comprehensive managed IT services,
            cloud solutions, artificial intelligence, and enterprise-grade
            cybersecurity.
          </p>

          {/* CTAs - fade in + slide from bottom with stagger */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-30">
            <div className="fill-mode-both animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <CTAButton
                size="lg"
                className="shadow-lg"
                ref={addButtonRef}
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
                className="shadow-lg"
                ref={addButtonRef}
                href="/services"
                icon="search"
              >
                Explore Services
              </CTAButton>
            </div>
          </div>

          {/* Stats - fade in + zoom in with stagger */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
            <div className="space-y-2 fill-mode-both animate-in fade-in zoom-in duration-600 delay-500">
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
            <div className="space-y-2 fill-mode-both animate-in fade-in zoom-in duration-600 delay-600">
              <div className="text-3xl md:text-4xl font-bold text-brand-primary">
                <CountUp from={0} to={500} duration={1.25} />+
              </div>
              <div className="text-sm text-muted-foreground">
                Clients Served
              </div>
            </div>
            <div className="space-y-2 fill-mode-both animate-in fade-in zoom-in duration-600 delay-700">
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
