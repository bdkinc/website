import React from 'react';
import { cn } from '@/lib/utils';
import { Code2, Cloud, ArrowRight, RefreshCw, ShieldCheck, Zap, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function LifecycleVisualization() {
  return (
    <div className="w-full max-w-6xl mx-auto my-24 relative">
      <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl -z-10"></div>
      
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold font-display text-foreground mb-4">
          Complete Lifecycle Ownership
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We don't just write code; we own the outcome. BDKinc bridges the gap between development and operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Phase 1: Build */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          <div className="relative border border-primary/30 bg-card/80 backdrop-blur-md p-8 rounded-xl h-full flex flex-col items-center text-center z-10 hover:-translate-y-1 transition-transform duration-300 shadow-lg shadow-primary/5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/30 group-hover:ring-primary transition-all">
              <Code2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Build</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Custom architecture, clean code, and modern frameworks designed for your specific business logic.
            </p>
            <ul className="text-left w-full space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" /> Performance First
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4 text-primary" /> Secure by Design
              </li>
            </ul>
          </div>
        </div>

        {/* Connection / Animation */}
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-0 relative">
          {/* Forward Flow */}
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "100px", opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            />
            <ArrowRight className="text-secondary w-6 h-6" />
          </div>
          
          <div className="px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 text-xs font-mono text-secondary uppercase tracking-widest">
            CI/CD Pipeline
          </div>

          {/* Feedback Loop */}
           <div className="flex items-center gap-2 rotate-180 opacity-50">
            <motion.div 
              className="w-full h-1 bg-gradient-to-r from-secondary to-primary rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "100px", opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 1 }}
            />
            <RefreshCw className="text-primary w-4 h-4" />
          </div>
        </div>

        {/* Phase 2: Host */}
        <div className="relative group">
          <div className="absolute inset-0 bg-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          <div className="relative border border-secondary/30 bg-card/80 backdrop-blur-md p-8 rounded-xl h-full flex flex-col items-center text-center z-10 hover:-translate-y-1 transition-transform duration-300 shadow-lg shadow-secondary/5">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 ring-1 ring-secondary/30 group-hover:ring-secondary transition-all">
              <Cloud className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Run</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Enterprise-grade hosting, 24/7 monitoring, and proactive optimization on our secure infrastructure.
            </p>
            <ul className="text-left w-full space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-secondary" /> 99.99% Uptime
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="w-4 h-4 text-secondary" /> Auto-Scaling
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Unified Benefit */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/20 bg-primary/5 text-foreground font-medium">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span>Single Point of Accountability = No Finger Pointing</span>
        </div>
      </div>
    </div>
  );
}
