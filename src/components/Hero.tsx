import { useRef } from 'react';
import CTAButton from '@/components/CTAButton';
import Aurora from './Aurora';
import CountUp from './CountUp';
import CircuitBoard from './CircuitBoard';

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative -mt-16 flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Clean gradient background */}
      <div className="absolute inset-0 -top-16 opacity-10 dark:opacity-60">
        <Aurora
          colorStops={['#00d4ff', '#7c3aed', '#00d4ff']}
          amplitude={1.5}
          blend={0.6}
          speed={0.6}
        />
      </div>

      {/* Circuit board effect */}
      <CircuitBoard className="pointer-events-none -top-16" />

      {/* Subtle gradient overlay */}
      <div className="via-background/50 to-background absolute inset-0 -top-16 bg-linear-to-b from-transparent"></div>

      {/* Radial gradient spotlight */}
      <div className="bg-radial-gradient from-primary/5 absolute inset-0 -top-16 via-transparent to-transparent opacity-50"></div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-20 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"
      >
        <div className="flex flex-col items-center space-y-8">
          {/* Badge */}
          <div className="glass border-border animate-in fade-in slide-in-from-top-4 fill-mode-both inline-flex items-center rounded-full border px-4 py-2 backdrop-blur-xl duration-500">
            <span className="text-sm">
              {new Date().getFullYear() - 2000}+ Years of{' '}
              <span className="text-accent font-semibold">Enterprise Innovation</span>
            </span>
          </div>

          {/* Main heading - clean and bold */}
          <div className="relative inline-block">
            <h1 className="lg:text-10xl animate-in fill-mode-both fade-in slide-in-from-bottom-8 text-6xl font-bold tracking-tight delay-100 duration-700 md:text-8xl">
              <span className="text-foreground">IT Made </span>
              <span className="from-primary via-primary to-secondary bg-linear-to-br bg-clip-text text-transparent">
                Simple.
              </span>
            </h1>
            {/* Subtle technical markers */}
            <div className="absolute -top-4 -left-4 h-2 w-2 border-t border-l border-primary/40" />
            <div className="absolute -top-4 -right-4 h-2 w-2 border-t border-r border-primary/40" />
            <div className="absolute -bottom-4 -left-4 h-2 w-2 border-b border-l border-primary/40" />
            <div className="absolute -bottom-4 -right-4 h-2 w-2 border-b border-r border-primary/40" />
          </div>

          {/* Subheading */}
          <p className="text-muted-foreground fill-mode-both animate-in fade-in slide-in-from-bottom-6 mx-auto max-w-2xl text-xl font-sans delay-200 duration-700 md:text-2xl">
            The elite technology partner for growth-focused organizations. We deliver Managed IT, Cloud Solutions, and Custom Software with enterprise-grade expertise.
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
                Partner with Us
              </CTAButton>
            </div>
            <div className="fill-mode-both animate-in fade-in slide-in-from-bottom-4 delay-400 duration-500">
              <CTAButton
                size="lg"
                variant="outline"
                className="hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
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
