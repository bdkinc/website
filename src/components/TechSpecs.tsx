import { PiCheckCircle, PiHeadphones, PiMonitor } from 'react-icons/pi';

const detailColumns = [
  {
    title: 'Support Tiers',
    icon: PiHeadphones,
    items: [
      'Unlimited help desk covers remote and onsite incidents',
      'Dedicated account managers align roadmaps with leadership goals',
      'Lifecycle management tracks assets, warranties, and renewals',
    ],
  },
  {
    title: 'Technology Operations',
    icon: PiMonitor,
    items: [
      'Proactive monitoring prevents outages with automated remediation',
      'Quarterly reviews surface optimization and security priorities',
      'Documented runbooks keep every response consistent and auditable',
    ],
  },
];

export default function TechSpecs() {
  return (
    <div className="grid gap-8 md:grid-cols-2 mb-20 not-prose">
      {detailColumns.map((column, index) => (
        <div key={index} className="relative group overflow-hidden">
           {/* Tech border frame */}
           <div className="absolute inset-0 border border-primary/20 bg-card/40 backdrop-blur-md" />
           
           {/* Scanline overlay */}
           <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.02]" />

           {/* Corner brackets */}
           <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary transition-all duration-300 group-hover:w-6 group-hover:h-6" />
           <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary transition-all duration-300 group-hover:w-6 group-hover:h-6" />
           <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary transition-all duration-300 group-hover:w-6 group-hover:h-6" />
           <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary transition-all duration-300 group-hover:w-6 group-hover:h-6" />

           <div className="relative p-8">
             <div className="flex items-center gap-4 mb-6 border-b border-primary/20 pb-4">
                <div className="p-2 bg-primary/10 rounded-md">
                    <column.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h4 className="font-display font-bold text-xl uppercase tracking-wide text-foreground">{column.title}</h4>
             </div>
             
             <ul className="space-y-4">
               {column.items.map((item, idx) => (
                 <li key={idx} className="flex items-start gap-3 text-muted-foreground font-sans">
                   <PiCheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                   <span>{item}</span>
                 </li>
               ))}
             </ul>
             
             {/* Tech deco at bottom */}
             <div className="mt-8 flex justify-between items-end">
                <div className="text-[10px] font-mono tracking-widest text-primary/40">SPEC_0{index + 1} // REVISION_A</div>
                <div className="h-1 w-16 bg-primary/20 group-hover:bg-primary/50 transition-colors" />
             </div>
           </div>
        </div>
      ))}
    </div>
  )
}
