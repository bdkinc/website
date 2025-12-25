import React from 'react';
import { PiCode, PiCloud, PiArrowRight, PiArrowsClockwise, PiShieldCheck, PiLightning, PiLock } from 'react-icons/pi';
import { motion } from 'motion/react';
import { ServiceCard } from '@/components/ServiceCard';

export default function LifecycleVisualization() {
  return (
    <div className="w-full max-w-6xl mx-auto my-24 relative">
      <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl -z-10"></div>
      
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold font-display text-foreground mb-4 uppercase tracking-tight">
          Complete Lifecycle Ownership
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We don't just write code; we own the outcome. BDKinc bridges the gap between development and operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Phase 1: Build */}
        <ServiceCard variant="technical" interactive metadata="ARCH_BUILD_V1.0">
          <div className="relative p-8 h-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
              <PiCode className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3 font-display uppercase tracking-tight">Build</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Custom architecture, clean code, and modern frameworks designed for your specific business logic.
            </p>
            <ul className="text-left w-full space-y-3 mt-auto">
              <li className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <PiLightning className="w-3 h-3 text-primary" /> Performance_First
              </li>
              <li className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <PiLock className="w-3 h-3 text-primary" /> Secure_by_Design
              </li>
            </ul>
          </div>
        </ServiceCard>

        {/* Connection / Animation */}
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-0 relative">
          {/* Forward Flow */}
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-full h-px bg-gradient-to-r from-primary to-secondary rounded-none"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "100px", opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            />
            <PiArrowRight className="text-secondary w-6 h-6" />
          </div>
          
          <div className="px-4 py-2 rounded-none bg-secondary/10 border border-secondary/30 text-[10px] font-mono text-secondary uppercase tracking-[0.2em] font-bold">
            CI/CD Pipeline
          </div>

          {/* Feedback Loop */}
           <div className="flex items-center gap-2 rotate-180 opacity-50">
            <motion.div 
              className="w-full h-px bg-gradient-to-r from-secondary to-primary rounded-none"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "100px", opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 1 }}
            />
            <PiArrowsClockwise className="text-primary w-4 h-4" />
          </div>
        </div>

        {/* Phase 2: Host */}
        <ServiceCard variant="technical" interactive metadata="ARCH_RUN_V1.0">
          <div className="relative p-8 h-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20 group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-500 shadow-[0_0_15px_rgba(124,58,237,0.1)]">
              <PiCloud className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3 font-display uppercase tracking-tight">Run</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Enterprise-grade hosting, 24/7 monitoring, and proactive optimization on our secure infrastructure.
            </p>
            <ul className="text-left w-full space-y-3 mt-auto">
              <li className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <PiShieldCheck className="w-3 h-3 text-secondary" /> 99.99%_Uptime
              </li>
              <li className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <PiArrowsClockwise className="w-3 h-3 text-secondary" /> Auto_Scaling
              </li>
            </ul>
          </div>
        </ServiceCard>

      </div>

      {/* Unified Benefit */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-none border border-primary/20 bg-primary/5 text-foreground font-mono text-xs uppercase tracking-widest font-bold">
          <PiShieldCheck className="w-5 h-5 text-primary" />
          <span>Single Point of Accountability // No Finger Pointing</span>
        </div>
      </div>
    </div>
  );
}
