import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface TechnicalFAQProps {
  faqs: FAQItem[];
}

export default function TechnicalFAQ({ faqs }: TechnicalFAQProps) {
  return (
    <Accordion type="multiple" className="mx-auto max-w-3xl space-y-4">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`faq-${index + 1}`}
          className="group border-border bg-card/40 hover:border-primary/30 hover:bg-card/60 data-[state=open]:border-primary/40 data-[state=open]:bg-card/60 relative overflow-hidden rounded-lg border backdrop-blur-md transition-colors duration-200 last:border-b"
        >
          {/* Scanline overlay */}
          <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.03] transition-opacity duration-200 group-hover:opacity-[0.05]" />
          <div className="circuit-overlay pointer-events-none absolute inset-0 opacity-[0.02]" />

          <AccordionTrigger className="text-foreground focus-visible:ring-ring focus-visible:ring-offset-background relative z-10 items-center px-6 py-5 text-base font-semibold hover:no-underline focus-visible:ring-2 focus-visible:ring-offset-2">
            {faq.question}
          </AccordionTrigger>

          <AccordionContent className="text-muted-foreground border-border/60 relative z-10 border-t px-6 pt-4 pb-6 text-sm leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
