import { motion } from 'motion/react';

export default function CohesiveOrbit() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full items-center justify-center overflow-hidden">
      {/* Central Core Glows (Behind text) */}
      <div className="bg-primary/20 absolute top-1/2 left-1/2 h-[400px] w-[80vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />
      <div className="bg-secondary/20 absolute top-1/2 left-1/2 h-[300px] w-[40vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />

      {/* Ring 1 (Inner) - Primary */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="border-primary/20 absolute flex aspect-square w-[70vw] max-w-[700px] items-center justify-center rounded-full border border-dashed"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Glowing node */}
          <div className="bg-primary h-2 w-2 rounded-full shadow-[0_0_15px_4px_rgba(var(--color-primary),0.5)]" />
        </div>
        {/* Secondary node on same ring */}
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
          <div className="bg-primary/50 h-1.5 w-1.5 rounded-full shadow-[0_0_10px_2px_rgba(var(--color-primary),0.3)]" />
        </div>
      </motion.div>

      {/* Ring 2 (Middle) - Secondary */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        className="border-secondary/20 absolute flex aspect-square w-[110vw] max-w-[1100px] items-center justify-center rounded-full border border-dashed"
      >
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-secondary h-2.5 w-2.5 rounded-full shadow-[0_0_20px_5px_rgba(var(--color-secondary),0.6)]" />
        </div>
      </motion.div>

      {/* Ring 3 (Outer) - Accent / Subtle */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="absolute flex aspect-square w-[150vw] max-w-[1500px] items-center justify-center rounded-full border border-dashed border-white/10 dark:border-white/[0.05]"
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="bg-accent h-3 w-3 rounded-full shadow-[0_0_20px_5px_rgba(var(--color-accent),0.4)]" />
        </div>
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
          <div className="h-1.5 w-1.5 rounded-full bg-white/50 shadow-[0_0_10px_2px_rgba(255,255,255,0.2)]" />
        </div>
      </motion.div>
    </div>
  );
}
