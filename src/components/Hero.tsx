import { useEffect, useRef } from 'react';
import CTAButton from '@/components/CTAButton';
import Aurora from './Aurora';
import CountUp from './CountUp';

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const container = particlesRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.className = 'absolute inset-0 w-full h-full pointer-events-none';
    container.appendChild(canvas);

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particleCount = 60;
    const connectionDistance = 150;
    const mouseInfluenceDistance = 250; // Increased for more noticeable effect
    const colors = [
      '0, 212, 255', // cyan (primary)
      '124, 58, 237', // purple (secondary)
      '255, 153, 51', // orange (accent)
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      baseX: number;
      baseY: number;
    }

    const particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: colors[i % colors.length],
        baseX: x,
        baseY: y,
      });
    }

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Gentle drift
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mouse interaction - particles move away from cursor
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluenceDistance) {
          const force = (1 - distance / mouseInfluenceDistance) * 8; // Increased from 2 to 8 for stronger repulsion
          particle.x += (dx / distance) * force;
          particle.y += (dy / distance) * force;
        }

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3;

            // Boost opacity if either particle is near mouse
            const particle1ToMouse = Math.sqrt(
              Math.pow(particle.x - mouse.x, 2) +
                Math.pow(particle.y - mouse.y, 2)
            );
            const particle2ToMouse = Math.sqrt(
              Math.pow(otherParticle.x - mouse.x, 2) +
                Math.pow(otherParticle.y - mouse.y, 2)
            );
            const nearMouse =
              Math.min(particle1ToMouse, particle2ToMouse) <
              mouseInfluenceDistance;
            const finalOpacity = nearMouse ? opacity * 2 : opacity;

            ctx.strokeStyle = `rgba(${particle.color}, ${finalOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });

        // Draw particle
        const distanceToMouse = Math.sqrt(
          Math.pow(particle.x - mouse.x, 2) + Math.pow(particle.y - mouse.y, 2)
        );
        const nearMouse = distanceToMouse < mouseInfluenceDistance;
        const glowIntensity = nearMouse
          ? (1 - distanceToMouse / mouseInfluenceDistance) * 0.8
          : 0.4;

        ctx.shadowBlur = nearMouse ? 15 : 8;
        ctx.shadowColor = `rgb(${particle.color})`;
        ctx.fillStyle = `rgba(${particle.color}, ${glowIntensity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, nearMouse ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      canvas.remove();
    };
  }, []);

  return (
    <section className="relative -mt-16 flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Clean gradient background */}
      <div className="absolute inset-0 -top-16 opacity-40 dark:opacity-60">
        <Aurora
          colorStops={['#00d4ff', '#7c3aed', '#00d4ff']}
          amplitude={1.5}
          blend={0.6}
          speed={0.6}
        />
      </div>

      {/* Circuit board overlay */}
      <div className="circuit-overlay absolute inset-0 -top-16 opacity-30"></div>

      {/* Subtle gradient overlay */}
      <div className="via-background/50 to-background absolute inset-0 -top-16 bg-linear-to-b from-transparent"></div>

      {/* Particle field */}
      <div
        ref={particlesRef}
        className="pointer-events-none absolute inset-0 -top-16"
        aria-hidden="true"
      />

      {/* Radial gradient spotlight */}
      <div className="bg-radial-gradient from-primary/5 absolute inset-0 -top-16 via-transparent to-transparent opacity-50"></div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-20 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"
      >
        <div className="space-y-8">
          {/* Badge */}
          <div className="glass border-border animate-in fade-in slide-in-from-top-4 fill-mode-both inline-flex items-center rounded-full border px-4 py-2 backdrop-blur-xl duration-500">
            <span className="text-sm">
              {new Date().getFullYear() - 2000}+ Years of{' '}
              <span className="text-accent font-semibold">IT Excellence</span>
            </span>
          </div>

          {/* Main heading - clean and bold */}
          <h1 className="lg:text-10xl animate-in fill-mode-both fade-in slide-in-from-bottom-8 text-6xl font-bold tracking-tight delay-100 duration-700 md:text-8xl">
            <span className="text-foreground">IT Made </span>
            <span className="from-primary via-primary to-secondary bg-linear-to-br bg-clip-text text-transparent">
              Simple
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-muted-foreground fill-mode-both animate-in fade-in slide-in-from-bottom-6 mx-auto max-w-2xl text-xl delay-200 duration-700 md:text-2xl">
            Transform your business with comprehensive managed IT services,
            cloud solutions, artificial intelligence, and enterprise-grade
            cybersecurity.
          </p>

          {/* CTAs - clean with subtle animations */}
          <div className="relative z-30 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="fill-mode-both animate-in fade-in slide-in-from-bottom-4 delay-300 duration-500">
              <CTAButton
                size="lg"
                className="pulse-ring transition-all duration-300 hover:scale-105"
                href="/contact"
                icon="click"
              >
                Get Started
              </CTAButton>
            </div>
            <div className="fill-mode-both animate-in fade-in slide-in-from-bottom-4 delay-400 duration-500">
              <CTAButton
                size="lg"
                variant="outline"
                className="hover:border-primary/50 hover:bg-primary/5 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                href="/services"
                icon="search"
              >
                Explore Services
              </CTAButton>
            </div>
          </div>

          {/* Stats - clean cards with subtle depth */}
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-8 pt-12">
            <div className="fill-mode-both animate-in fade-in zoom-in glass border-primary/10 hover:border-primary/30 space-y-2 rounded-xl border p-6 backdrop-blur-xl transition-all delay-500 duration-600 hover:scale-105">
              <div className="text-primary text-3xl font-bold md:text-4xl">
                <CountUp
                  from={0}
                  to={new Date().getFullYear() - 2000}
                  duration={1.25}
                />
                +
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Years in Business
              </div>
            </div>
            <div className="fill-mode-both animate-in fade-in zoom-in glass border-primary/10 hover:border-primary/30 space-y-2 rounded-xl border p-6 backdrop-blur-xl transition-all delay-600 duration-600 hover:scale-105">
              <div className="text-primary text-3xl font-bold md:text-4xl">
                <CountUp from={0} to={500} duration={1.25} />+
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Clients Served
              </div>
            </div>
            <div className="fill-mode-both animate-in fade-in zoom-in glass border-primary/10 space-y-2 rounded-xl border p-6 backdrop-blur-xl transition-all delay-700 duration-600 hover:scale-105 hover:border-[--brand-accent]/30">
              <div className="text-accent text-3xl font-bold md:text-4xl">
                <CountUp from={0} to={24} duration={1.25} />x
                <CountUp from={0} to={7} duration={1.25} />
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent bar - clean gradient */}
      <div className="from-primary/50 via-secondary/50 absolute right-0 bottom-0 left-0 h-1 bg-linear-to-r to-[--brand-accent]/50"></div>
    </section>
  );
}
