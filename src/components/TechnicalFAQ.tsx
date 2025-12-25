import { PiCaretDown } from 'react-icons/pi';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

interface TechnicalFAQProps {
  faqs: FAQItem[];
}

export default function TechnicalFAQ({ faqs }: TechnicalFAQProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {faqs.map((faq, index) => (
        <details key={index} className="group relative overflow-hidden rounded-none border border-primary/20 bg-card/40 backdrop-blur-md transition-all duration-300 open:bg-card/60 open:border-primary/40 open:shadow-[0_0_20px_rgba(0,212,255,0.1)]">
          {/* Scanline overlay */}
          <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-300" />
          <div className="circuit-overlay absolute inset-0 opacity-[0.02] pointer-events-none" />
          
          <summary className="flex cursor-pointer items-center justify-between p-6 font-display font-bold text-foreground text-lg transition-colors group-hover:text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary selection:bg-none uppercase tracking-tight">
            <span className="relative z-10">{faq.question}</span>
            <span className="relative z-10 transition-transform duration-300 group-open:rotate-180">
              <PiCaretDown className="h-5 w-5 text-primary" />
            </span>
          </summary>
          
          <div className="relative z-10 px-6 pb-6 text-muted-foreground font-sans leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="pt-4 border-t border-primary/10">
              {faq.answer}
            </div>
          </div>
          
          {/* Technical Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/40 opacity-0 group-open:opacity-100 transition-opacity" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/40 opacity-0 group-open:opacity-100 transition-opacity" />
          
          {/* Metadata */}
          <div className="absolute bottom-1 right-2 text-[8px] font-mono text-primary/20 tracking-widest uppercase pointer-events-none">
            FAQ_BLOCK_0{index + 1}
          </div>
        </details>
      ))}
    </div>
  );
}
