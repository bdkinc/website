import { motion } from 'motion/react';
import { PiScan, PiBrain, PiRocket } from 'react-icons/pi';

export default function NeuralPipeline() {
  const steps = [
    {
      id: 'discovery',
      title: 'Discovery & Feasibility',
      description: 'Data readiness assessment & ROI modeling',
      icon: PiScan,
      color: 'text-[--color-primary]',
      bg: 'bg-[--color-primary]/10',
      border: 'border-[--color-primary]/20',
    },
    {
      id: 'engineering',
      title: 'Model Engineering',
      description: 'Custom training & fine-tuning with watsonx',
      icon: PiBrain,
      color: 'text-[--color-secondary]',
      bg: 'bg-[--color-secondary]/10',
      border: 'border-[--color-secondary]/20',
    },
    {
      id: 'production',
      title: 'Production Deployment',
      description: 'Scalable inference on OpenShift / Power Systems',
      icon: PiRocket,
      color: 'text-[--accent]',
      bg: 'bg-[--accent]/10',
      border: 'border-[--accent]/20',
    },
  ];

  return (
    <div className="relative w-full py-12">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="relative z-10 grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.id} className="group relative">
            {/* Connection Line (Desktop) */}
            {index < steps.length - 1 && (
              <div className="absolute top-1/2 left-full z-0 hidden h-[2px] w-full -translate-y-1/2 md:block">
                <div className="bg-muted absolute inset-0 overflow-hidden">
                  <motion.div
                    className="via-primary h-full w-1/2 bg-gradient-to-r from-transparent to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: index * 0.5,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Connection Line (Mobile) */}
            {index < steps.length - 1 && (
              <div className="absolute top-full left-1/2 z-0 h-8 w-[2px] -translate-x-1/2 md:hidden">
                <div className="bg-muted absolute inset-0 overflow-hidden">
                  <motion.div
                    className="via-primary h-1/2 w-full bg-gradient-to-b from-transparent to-transparent"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: index * 0.5,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative z-10 flex h-full flex-col items-center rounded-xl border p-6 text-center ${step.border} bg-card/80 backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]`}
            >
              {/* Scanline Overlay */}
              <div className="scanlines pointer-events-none absolute inset-0 overflow-hidden rounded-xl opacity-[0.03]" />

              {/* Animated Corner Accents */}
              <div className="absolute top-0 right-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="border-primary h-2 w-2 border-t-2 border-r-2"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="border-primary h-2 w-2 border-b-2 border-l-2"></div>
              </div>

              {/* Icon */}
              <div
                className={`mb-6 rounded-2xl p-4 ${step.bg} ${step.color} shadow-[0_0_15px_rgba(0,0,0,0.1)] ring-1 ring-white/10 ring-inset`}
              >
                <step.icon className="h-10 w-10" strokeWidth={1.5} />
              </div>

              <h4 className="font-display text-foreground mb-3 text-xl font-bold">
                {step.title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Processing Pulse */}
              <div className="ring-primary/20 group-hover:ring-primary/50 absolute inset-0 rounded-xl ring-1 transition-colors duration-500 ring-inset"></div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
