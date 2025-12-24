import { motion } from 'motion/react';
import { Database, Server, ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function WatsonxSpotlight() {
  return (
    <section className="relative my-24 overflow-hidden rounded-2xl border border-primary/20 bg-background/50 p-8 md:p-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,102,255,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.08),transparent_40%)]" />
      <div className="scanlines absolute inset-0 opacity-[0.02]" />

      <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Content Side */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            <Cpu className="h-3.5 w-3.5" />
            Elite Toolkit
          </div>
          
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Powered by <span className="text-primary">IBM watsonx</span>
          </h2>
          
          <p className="text-lg leading-relaxed text-muted-foreground">
            We don't just use AI APIs; we engineer enterprise-grade AI platforms. 
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
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm font-medium text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Side - "Module" Look */}
        <div className="relative">
          <div className="relative rounded-xl border border-border bg-card/80 p-6 backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
              </div>
              <div className="font-mono text-xs text-muted-foreground">SYSTEM_READY</div>
            </div>

            {/* Modules Grid */}
            <div className="grid gap-4">
              <div className="group flex items-center gap-4 rounded-lg border border-border bg-background/50 p-4 transition-colors hover:border-primary/50">
                <div className="rounded-md bg-blue-500/10 p-3 text-blue-400">
                  <BrainCircuitIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Foundation Models</div>
                  <div className="text-xs text-muted-foreground">Granite-13b, Llama-2, Falcon</div>
                </div>
                <div className="ml-auto">
                   <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>

              <div className="group flex items-center gap-4 rounded-lg border border-border bg-background/50 p-4 transition-colors hover:border-purple/50">
                <div className="rounded-md bg-purple-500/10 p-3 text-purple-400">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Vector Store</div>
                  <div className="text-xs text-muted-foreground">RAG Knowledge Base</div>
                </div>
                <div className="ml-auto font-mono text-xs text-primary">SYNCED</div>
              </div>

              <div className="group flex items-center gap-4 rounded-lg border border-border bg-background/50 p-4 transition-colors hover:border-emerald/50">
                <div className="rounded-md bg-emerald-500/10 p-3 text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Governance Layer</div>
                  <div className="text-xs text-muted-foreground">Drift Detection & Bias Checks</div>
                </div>
                <div className="ml-auto font-mono text-xs text-emerald-500">ACTIVE</div>
              </div>
            </div>

            {/* Tech Decoration */}
            <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-primary" />
            <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-primary" />
          </div>
          
          {/* Background Glow */}
          <div className="absolute -inset-4 z-[-1] rounded-[2rem] bg-gradient-to-br from-primary/20 via-secondary/20 to-transparent blur-2xl" />
        </div>
      </div>
    </section>
  );
}

function BrainCircuitIcon(props: any) {
    return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          <path d="M15 13a4.5 4.5 0 0 1-3-1.4 4.5 4.5 0 0 1-3 1.4" />
          <path d="M5.5 13a2 2 0 0 1 4 0" />
          <path d="M14.5 13a2 2 0 0 1 4 0" />
        </svg>
      )
}
