import {
  PiDatabase,
  PiShieldCheck,
  PiCpu,
  PiCheckCircle,
  PiBrain,
} from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';

export default function WatsonxSpotlight() {
  return (
    <section className="border-primary/20 bg-background/50 relative my-24 overflow-hidden rounded-none border p-8 md:p-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,102,255,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.08),transparent_40%)]" />
      <div className="scanlines absolute inset-0 opacity-[0.03]" />
      <div className="circuit-overlay pointer-events-none absolute inset-0 opacity-[0.02]" />

      <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Content Side */}
        <div className="space-y-6">
          <div className="border-primary/30 bg-primary/5 text-primary inline-flex items-center gap-2 border px-4 py-1.5 font-mono text-xs font-semibold tracking-wider">
            <PiCpu className="h-3.5 w-3.5" />
            Premier Toolkit // watsonx
          </div>

          <h2 className="font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Powered by <span className="text-primary">IBM watsonx</span>
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed">
            We don&apos;t just use AI APIs; we engineer enterprise-grade AI
            platforms. Leveraging the watsonx stack, we deliver models that are
            transparent, governable, and trained on your proprietary data—not
            the public internet.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'watsonx.ai for Generative Models',
              'watsonx.data for Lakehouse Scale',
              'watsonx.governance for Compliance',
              'OpenShift Containerization',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <PiCheckCircle className="text-primary h-5 w-5 shrink-0" />
                <span className="text-foreground font-display text-sm font-medium tracking-wide">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Side - "Module" Look */}
        <div className="relative">
          <TechCard
            variant="technical"
            interactive={false}
            metadata="WATSONX_CORE_V3.2"
            className="shadow-2xl"
          >
            <div className="p-6">
              {/* Header */}
              <div className="border-primary/20 mb-6 flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted-foreground/50 h-2 w-2 rounded-full" />
                  <div className="bg-muted-foreground/50 h-2 w-2 rounded-full" />
                  <div className="bg-primary/50 h-2 w-2 rounded-full" />
                </div>
                <div className="text-primary/60 font-mono text-[10px] tracking-widest">
                  Node Status: Optimized
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid gap-4">
                <div className="group border-primary/10 bg-background/50 hover:border-primary/40 hover:bg-primary/5 flex items-center gap-4 border p-4 transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing]">
                  <div className="border-primary/20 bg-primary/10 text-primary group-hover:border-primary/40 rounded-md border p-3 transition-colors">
                    <PiBrain className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-foreground font-display text-sm font-bold tracking-tight">
                      Foundation Models
                    </div>
                    <div className="text-muted-foreground font-mono text-[10px]">
                      GRANITE-13B, LLAMA-3, FALCON-180B
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="bg-primary/70 h-1.5 w-1.5 rounded-full" />
                  </div>
                </div>

                <div className="group border-border/60 bg-background/50 hover:border-primary/40 hover:bg-primary/5 flex items-center gap-4 border p-4 transition-colors">
                  <div className="border-secondary/20 bg-secondary/10 text-secondary group-hover:border-secondary/40 rounded-md border p-3 transition-colors">
                    <PiDatabase className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-foreground font-display text-sm font-bold tracking-tight">
                      Vector Store
                    </div>
                    <div className="text-muted-foreground font-mono text-[10px]">
                      RAG Knowledge Base // Scale Ready
                    </div>
                  </div>
                  <div className="text-primary/80 ml-auto font-mono text-[10px] tracking-tighter">
                    Synced
                  </div>
                </div>

                <div className="group border-border/60 bg-background/50 hover:border-primary/40 hover:bg-primary/5 flex items-center gap-4 border p-4 transition-colors">
                  <div className="border-primary/20 bg-primary/10 text-primary group-hover:border-primary/40 rounded-md border p-3 transition-colors">
                    <PiShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-foreground font-display text-sm font-bold tracking-tight">
                      Governance Layer
                    </div>
                    <div className="text-muted-foreground font-mono text-[10px]">
                      Drift Detection Active // Compliant
                    </div>
                  </div>
                  <div className="text-primary/80 ml-auto font-mono text-[10px] tracking-tighter">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </TechCard>

          {/* Background */}
          <div className="from-primary/10 via-secondary/10 absolute -inset-4 z-[-1] rounded-none bg-gradient-to-br to-transparent opacity-40 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
