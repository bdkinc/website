import { motion } from 'motion/react';
import {
  PiDatabase,
  PiCpu,
  PiLightbulb,
  PiLightning,
  PiChecks,
  PiStackSimple,
} from 'react-icons/pi';
import { cn } from '@bdkinc/design-system';
import React, { useState, useEffect } from 'react';

interface Step {
  id: string;
  title: string;
  icon: any;
  description: string;
  details: string[];
  color: string;
  bg: string;
  border: string;
  ring: string; // Add ring property
  glow: string;
}

const steps: Step[] = [
  {
    id: '01',
    title: 'Ingestion',
    icon: PiDatabase,
    description: 'Multi-source aggregation & validation',
    details: ['API Connectors', 'Stream Processing', 'Schema Validation'],
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    ring: 'ring-primary/20',
    glow: 'shadow-primary/20',
  },
  {
    id: '02',
    title: 'Processing',
    icon: PiCpu,
    description: 'Scalable transformation & warehousing',
    details: ['ETL / ELT Pipelines', 'Data Lake Storage', 'Sanitization Logic'],
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary/20',
    ring: 'ring-secondary/20',
    glow: 'shadow-secondary/20',
  },
  {
    id: '03',
    title: 'Insight',
    icon: PiLightbulb,
    description: 'Predictive analytics & visualization',
    details: ['ML Models', 'BI Dashboards', 'Decision Engines'],
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    ring: 'ring-accent/20',
    glow: 'shadow-accent/20',
  },
];

export default function AnalyticsLifecycle() {
  const [activeStep, setActiveStep] = useState(0);

  // Cycle through steps for the "pipeline" effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000); // 3 seconds per step focus
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-12">
      <div className="relative z-10 grid gap-12 lg:grid-cols-3 lg:gap-8">
        {steps.map((step, index) => {
          const isActive = index === activeStep;

          return (
            <div
              key={step.id}
              className="group relative flex flex-col items-center lg:block"
            >
              {/* Desktop Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 left-1/2 z-0 hidden h-full w-full -translate-y-1/2 overflow-visible lg:block">
                  {/* Central Static track */}
                  <div className="bg-border/20 absolute top-1/2 left-0 h-px w-full -translate-y-1/2" />

                  {/* Multiple Active Flows */}
                  {isActive && (
                    <>
                      {/* Main central flow */}
                      <motion.div
                        className={cn(
                          'absolute top-1/2 left-0 h-0.5 w-full origin-left -translate-y-1/2 bg-linear-to-r from-transparent via-current to-transparent opacity-100',
                          steps[index].color
                        )}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: [0, 1],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />

                      {/* Upper flow (faster, thinner) */}
                      <motion.div
                        className={cn(
                          'absolute top-[20%] left-0 h-px w-full origin-left bg-linear-to-r from-transparent via-current to-transparent opacity-40',
                          steps[index].color
                        )}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: [0, 1],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'circOut',
                          delay: 0.2,
                        }}
                      />

                      {/* Lower flow (slower, thinner) */}
                      <motion.div
                        className={cn(
                          'absolute top-[80%] left-0 h-px w-full origin-left bg-linear-to-r from-transparent via-current to-transparent opacity-40 blur-[1px]',
                          steps[index].color
                        )}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: [0, 1],
                          opacity: [0, 0.4, 0],
                        }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.5,
                        }}
                      />

                      {/* Top Edge flow */}
                      <motion.div
                        className={cn(
                          'absolute top-[10%] left-0 h-px w-full origin-left bg-linear-to-r from-transparent via-current to-transparent opacity-20',
                          steps[index].color
                        )}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: [0, 1],
                          opacity: [0, 0.3, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: 0.8,
                        }}
                      />

                      {/* Bottom Edge flow */}
                      <motion.div
                        className={cn(
                          'absolute top-[90%] left-0 h-px w-full origin-left bg-linear-to-r from-transparent via-current to-transparent opacity-20',
                          steps[index].color
                        )}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: [0, 1],
                          opacity: [0, 0.3, 0],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: 1,
                        }}
                      />
                    </>
                  )}

                  {/* Particles */}
                  {isActive && (
                    <>
                      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                          key={i}
                          className={cn(
                            'absolute z-10 w-1 rounded-full shadow-[0_0_8px_currentColor]',
                            i % 2 === 0 ? 'h-1.5 w-1.5' : 'h-1 w-1 opacity-70',
                            i === 0 ? 'top-1/2 -translate-y-1/2' : '', // Center main particle
                            i === 1 ? 'top-[20%]' : '', // Upper
                            i === 2 ? 'top-[80%]' : '', // Lower
                            i === 3 ? 'top-[35%] text-white' : '', // Random scatter
                            i === 4 ? 'top-[65%] blur-[1px]' : '', // Random scatter
                            i === 5 ? 'top-[10%]' : '', // Top Edge
                            i === 6 ? 'top-[90%]' : '', // Bottom Edge
                            steps[index].bg.replace('/10', ''), // Solid color
                            steps[index].color
                          )}
                          initial={{ left: '0%', opacity: 0 }}
                          animate={{
                            left: '100%',
                            opacity: [0, 1, 1, 0],
                          }}
                          transition={{
                            duration: i % 2 === 0 ? 1.5 : 2.2, // vary speeds
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: 'linear',
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Mobile Connector */}
              {index < steps.length - 1 && (
                <div className="bg-border/20 absolute -bottom-12 left-1/2 z-0 -ml-px h-12 w-0.5 overflow-hidden lg:hidden">
                  <motion.div
                    className={cn(
                      'absolute inset-0 h-1/3 w-full bg-linear-to-b from-transparent via-current to-transparent opacity-50',
                      steps[index].color
                    )}
                    animate={{
                      y: ['-100%', '300%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>
              )}

              <StepCard step={step} index={index} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepCard({
  step,
  index,
  isActive,
}: {
  step: Step;
  index: number;
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative h-full w-full"
    >
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-2xl border p-8 backdrop-blur-md transition-all duration-700',
          isActive
            ? cn(step.bg, step.border, step.glow, 'ring-1', step.ring)
            : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.07]'
        )}
      >
        {/* Active Gradient Overlay - Removed */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Header: Icon + Number */}
          <div className="mb-6 flex items-start justify-between">
            <div
              className={cn(
                'relative flex items-center justify-center rounded-xl border p-3 transition-all duration-500',
                isActive
                  ? cn(step.bg, step.border, step.color, 'scale-110 shadow-lg')
                  : 'text-muted-foreground border-white/10 bg-white/5'
              )}
            >
              <step.icon
                className={cn('relative z-10 mb-0 h-8 w-8 transition')}
              />
              {/* Pulse Ring when active */}
              {isActive && (
                <span className="absolute inset-0 -z-10 animate-ping rounded-xl bg-current opacity-20"></span>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="grow space-y-4">
            <div>
              <h4
                className={cn(
                  'mb-3 text-xl font-bold transition-colors',
                  isActive
                    ? cn('text-white', step.color.replace('text-', 'text-'))
                    : 'text-foreground' // Note: This logic seems redundant but ensures correct override if specific overrides needed
                )}
              >
                {step.title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                {step.description}
              </p>
            </div>

            {/* Technical Details List */}
            <div
              className={cn(
                'mt-auto border-t pt-5 transition-colors',
                isActive ? step.border : 'border-white/5'
              )}
            >
              <ul className="space-y-2.5">
                {step.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      'flex items-center font-mono text-xs tracking-wide transition-colors',
                      isActive
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground/60'
                    )}
                  >
                    {isActive ? (
                      <PiStackSimple
                        className={cn('mr-2 h-3 w-3', step.color)}
                      />
                    ) : (
                      <PiLightning className="text-muted-foreground/30 mr-2 h-3 w-3" />
                    )}
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar Activity Indicator */}
        <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-2xl">
          {isActive && (
            <motion.div
              className={cn('h-full w-full', step.bg.replace('/10', ''))}
              layoutId="active-step-bar"
              transition={{
                layout: { type: 'spring', stiffness: 300, damping: 30 },
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
