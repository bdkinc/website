import { motion } from 'motion/react';
import { PiScan, PiBrain, PiRocket, PiArrowRight, PiLightning } from 'react-icons/pi';

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
      color: 'text-[--brand-accent]',
      bg: 'bg-[--brand-accent]/10',
      border: 'border-[--brand-accent]/20',
    },
  ];

  return (
    <div className="relative w-full py-12">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative z-10 grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.id} className="relative group">
            {/* Connection Line (Desktop) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 left-full w-full h-[2px] -translate-y-1/2 z-0">
                <div className="absolute inset-0 bg-muted overflow-hidden">
                   <motion.div
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: index * 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Connection Line (Mobile) */}
            {index < steps.length - 1 && (
              <div className="md:hidden absolute left-1/2 top-full w-[2px] h-8 -translate-x-1/2 z-0">
                 <div className="absolute inset-0 bg-muted overflow-hidden">
                   <motion.div
                    className="w-full h-1/2 bg-gradient-to-b from-transparent via-primary to-transparent"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: index * 0.5 }}
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
              className={`
                relative z-10 flex flex-col items-center text-center p-6 h-full
                rounded-xl border ${step.border} bg-card/80 backdrop-blur-md
                hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-shadow duration-500
              `}
            >
              {/* Scanline Overlay */}
              <div className="scanlines absolute inset-0 opacity-[0.03] pointer-events-none rounded-xl overflow-hidden" />
              
              {/* Animated Corner Accents */}
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <div className="w-2 h-2 border-t-2 border-r-2 border-primary"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <div className="w-2 h-2 border-b-2 border-l-2 border-primary"></div>
              </div>

              {/* Icon */}
              <div className={`
                mb-6 p-4 rounded-2xl ${step.bg} ${step.color}
                ring-1 ring-inset ring-white/10 shadow-[0_0_15px_rgba(0,0,0,0.1)]
              `}>
                <step.icon className="w-10 h-10" strokeWidth={1.5} />
              </div>

              <h4 className="text-xl font-bold font-display mb-3 text-foreground">
                {step.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Processing Pulse */}
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-primary/20 group-hover:ring-primary/50 transition-colors duration-500"></div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
