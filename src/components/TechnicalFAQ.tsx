import { PiCaretDown } from 'react-icons/pi';

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
        <details key={index} className="group relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 open:bg-card/80 open:border-primary/30 open:shadow-[0_0_15px_rgba(0,212,255,0.1)]">
          {/* Scanline overlay */}
          <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-300" />
          
          <summary className="flex cursor-pointer items-center justify-between p-6 font-display font-bold text-foreground text-lg transition-colors group-hover:text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary selection:bg-none">
            <span className="relative z-10">{faq.question}</span>
            <span className="relative z-10 transition-transform duration-300 group-open:rotate-180">
              <PiCaretDown className="h-5 w-5 text-primary" />
            </span>
          </summary>
          
          <div className="relative z-10 px-6 pb-6 text-muted-foreground font-sans leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            {faq.answer}
          </div>
          
          {/* Active indicator line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 transition-transform duration-300 origin-top group-open:scale-y-100" />
        </details>
      ))}
    </div>
  );
}
