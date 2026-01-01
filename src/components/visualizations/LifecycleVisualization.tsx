import {
  PiCode,
  PiCloud,
  PiArrowRight,
  PiArrowsClockwise,
  PiShieldCheck,
  PiLightning,
  PiLock,
} from 'react-icons/pi';
import { motion } from 'motion/react';
import { ServiceCard } from '@/components/ServiceCard';

export default function LifecycleVisualization() {
  return (
    <div className="relative mx-auto my-24 w-full max-w-6xl">
      <div className="bg-primary/5 absolute inset-0 -z-10 rounded-3xl blur-3xl"></div>

      <div className="mb-16 text-center">
        <h2 className="font-display text-foreground mb-4 text-3xl font-bold tracking-tight uppercase">
          Complete Lifecycle Ownership
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          We don&apos;t just write code; we own the outcome. BDKinc bridges the
          gap between development and operations.
        </p>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
        {/* Phase 1: Build */}
        <ServiceCard variant="technical" interactive metadata="ARCH_BUILD_V1.0">
          <div className="relative flex h-full flex-col items-center p-8 text-center">
            <div className="bg-primary/10 border-primary/20 group-hover:bg-primary/20 mb-6 flex h-16 w-16 items-center justify-center rounded-xl border shadow-sm transition-all duration-500 group-hover:scale-110">
              <PiCode className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-foreground font-display mb-3 text-xl font-bold tracking-tight uppercase">
              Build
            </h3>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Custom architecture, clean code, and modern frameworks designed
              for your specific business logic.
            </p>
            <ul className="mt-auto w-full space-y-3 text-left">
              <li className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
                <PiLightning className="text-primary h-3 w-3" />{' '}
                Performance_First
              </li>
              <li className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
                <PiLock className="text-primary h-3 w-3" /> Secure_by_Design
              </li>
            </ul>
          </div>
        </ServiceCard>

        {/* Connection / Animation */}
        <div className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-0">
          {/* Forward Flow */}
          <div className="flex items-center gap-2">
            <motion.div
              className="from-primary to-secondary h-px w-full rounded-none bg-gradient-to-r"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: '100px', opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            />
            <PiArrowRight className="text-secondary h-6 w-6" />
          </div>

          <div className="bg-secondary/10 border-secondary/30 text-secondary rounded-none border px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
            CI/CD Pipeline
          </div>

          {/* Feedback Loop */}
          <div className="flex rotate-180 items-center gap-2 opacity-50">
            <motion.div
              className="from-secondary to-primary h-px w-full rounded-none bg-gradient-to-r"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: '100px', opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            <PiArrowsClockwise className="text-primary h-4 w-4" />
          </div>
        </div>

        {/* Phase 2: Host */}
        <ServiceCard variant="technical" interactive metadata="ARCH_RUN_V1.0">
          <div className="relative flex h-full flex-col items-center p-8 text-center">
            <div className="bg-secondary/10 border-secondary/20 group-hover:bg-secondary/20 mb-6 flex h-16 w-16 items-center justify-center rounded-xl border shadow-sm transition-all duration-500 group-hover:scale-110">
              <PiCloud className="text-secondary h-8 w-8" />
            </div>
            <h3 className="text-foreground font-display mb-3 text-xl font-bold tracking-tight uppercase">
              Run
            </h3>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Enterprise-grade hosting, 24/7 monitoring, and proactive
              optimization on our secure infrastructure.
            </p>
            <ul className="mt-auto w-full space-y-3 text-left">
              <li className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
                <PiShieldCheck className="text-secondary h-3 w-3" />{' '}
                99.99%_Uptime
              </li>
              <li className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
                <PiArrowsClockwise className="text-secondary h-3 w-3" />{' '}
                Auto_Scaling
              </li>
            </ul>
          </div>
        </ServiceCard>
      </div>

      {/* Unified Benefit */}
      <div className="mt-12 text-center">
        <div className="border-primary/20 bg-primary/5 text-foreground inline-flex items-center gap-3 rounded-none border px-6 py-3 font-mono text-xs font-bold tracking-widest uppercase">
          <PiShieldCheck className="text-primary h-5 w-5" />
          <span>Single Point of Accountability // No Finger Pointing</span>
        </div>
      </div>
    </div>
  );
}
