
import { PiDatabase, PiShieldCheck, PiCpu, PiCheckCircle, PiBrain } from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

export default function WatsonxSpotlight() {
  return (
    <section className="relative my-24 overflow-hidden rounded-none border border-primary/20 bg-background/50 p-8 md:p-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,102,255,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.08),transparent_40%)]" />
      <div className="scanlines absolute inset-0 opacity-[0.03]" />
      <div className="circuit-overlay absolute inset-0 opacity-[0.02] pointer-events-none" />

      <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Content Side */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase font-mono">
            <PiCpu className="h-3.5 w-3.5" />
            Elite Toolkit // watsonx
          </div>
          
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl uppercase">
            Powered by <span className="text-primary">IBM watsonx</span>
          </h2>
          
          <p className="text-lg leading-relaxed text-muted-foreground">
            We don&apos;t just use AI APIs; we engineer enterprise-grade AI platforms. 
            Leveraging the watsonx stack, we deliver models that are transparent, 
            governable, and trained on your proprietary data—not the public internet.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "watsonx.ai for Generative Models",
              "watsonx.data for Lakehouse Scale",
              "watsonx.governance for Compliance",
              "OpenShift Containerization"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <PiCheckCircle className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm font-medium text-foreground uppercase tracking-wide font-display">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Side - "Module" Look */}
        <div className="relative">
          <ServiceCard
            variant="technical"
            interactive={false}
            metadata="WATSONX_CORE_V3.2"
            className="shadow-2xl"
          >
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between border-b border-primary/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500/50 animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500/50 animate-pulse delay-75" />
                  <div className="h-2 w-2 rounded-full bg-green-500/50 animate-pulse delay-150" />
                </div>
                <div className="font-mono text-[10px] text-primary/60 tracking-widest uppercase">NODE_STATUS: OPTIMIZED</div>
              </div>

              {/* Modules Grid */}
              <div className="grid gap-4">
                <div className="group flex items-center gap-4 border border-primary/10 bg-background/50 p-4 transition-all hover:border-primary/40 hover:bg-primary/5">
                  <div className="rounded-md bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all">
                    <PiBrain className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-foreground font-display uppercase tracking-tight text-sm">Foundation Models</div>
                    <div className="text-[10px] text-muted-foreground font-mono">GRANITE-13B, LLAMA-3, FALCON-180B</div>
                  </div>
                  <div className="ml-auto">
                     <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  </div>
                </div>

                <div className="group flex items-center gap-4 border border-primary/10 bg-background/50 p-4 transition-all hover:border-purple/40 hover:bg-purple-500/5">
                  <div className="rounded-md bg-purple-500/10 p-3 text-purple-400 border border-purple-500/20 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all">
                    <PiDatabase className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-foreground font-display uppercase tracking-tight text-sm">Vector Store</div>
                    <div className="text-[10px] text-muted-foreground font-mono">RAG_KNOWLEDGE_BASE // SCALE_READY</div>
                  </div>
                  <div className="ml-auto font-mono text-[10px] text-primary/80 tracking-tighter">SYNCED</div>
                </div>

                <div className="group flex items-center gap-4 border border-primary/10 bg-background/50 p-4 transition-all hover:border-emerald/40 hover:bg-emerald-500/5">
                  <div className="rounded-md bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all">
                    <PiShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-foreground font-display uppercase tracking-tight text-sm">Governance Layer</div>
                    <div className="text-[10px] text-muted-foreground font-mono">DRIFT_DETECTION_ACTIVE // COMPLIANT</div>
                  </div>
                  <div className="ml-auto font-mono text-[10px] text-emerald-500 tracking-tighter">ACTIVE</div>
                </div>
              </div>
            </div>
          </ServiceCard>
          
          {/* Background Glow */}
          <div className="absolute -inset-4 z-[-1] rounded-none bg-gradient-to-br from-primary/20 via-secondary/20 to-transparent blur-3xl opacity-50" />
        </div>
      </div>
    </section>
  );
}
