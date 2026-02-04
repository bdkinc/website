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
        <details
          key={index}
          className="group border-primary/20 bg-card/40 open:bg-card/60 open:border-primary/40 relative overflow-hidden rounded-none border backdrop-blur-md transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300 open:shadow-[0_0_20px_rgba(0,212,255,0.1)]"
        >
          {/* Scanline overlay */}
          <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.05]" />
          <div className="circuit-overlay pointer-events-none absolute inset-0 opacity-[0.02]" />

          <summary className="font-display text-foreground group-hover:text-primary focus-visible:ring-primary flex cursor-pointer items-center justify-between p-6 text-lg font-bold transition-colors selection:bg-none focus:outline-none focus-visible:ring-1">
            <span className="relative z-10">{faq.question}</span>
            <span className="relative z-10 transition-transform duration-300 group-open:rotate-180">
              <PiCaretDown className="text-primary h-5 w-5" />
            </span>
          </summary>

          <div className="text-muted-foreground animate-in fade-in slide-in-from-top-2 relative z-10 px-6 pb-6 font-sans leading-relaxed duration-300">
            <div className="border-primary/10 border-t pt-4">{faq.answer}</div>
          </div>

          {/* Technical Accents */}
          <div className="border-primary/40 absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 opacity-0 transition-opacity group-open:opacity-100" />
          <div className="border-primary/40 absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 opacity-0 transition-opacity group-open:opacity-100" />

          {/* Metadata */}
          <div className="text-primary/20 pointer-events-none absolute right-2 bottom-1 font-mono text-[8px] tracking-widest">
            FAQ_BLOCK_0{index + 1}
          </div>
        </details>
      ))}
    </div>
  );
}
