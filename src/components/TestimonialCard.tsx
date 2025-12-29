import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { PiQuotesFill, PiCheckCircle } from 'react-icons/pi';

export interface Testimonial {
  quote: string;
  author: string;
  company: string;
  industry: string;
  metadata: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  inView: boolean;
}

export function TestimonialCard({
  testimonial,
  index,
  inView,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'group relative h-full transition-all duration-700 ease-out',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Card className="bg-card/30 border-primary/10 relative flex h-full flex-col overflow-hidden p-8 shadow backdrop-blur-sm transition-all duration-300">
        {/* Technical Header */}
        <div className="border-border/40 relative z-10 mb-8 flex items-center justify-between border-b pb-4">
          <div className="text-muted-foreground/80 flex items-center gap-2 font-mono text-xs">
            <PiQuotesFill className="text-primary" />
          </div>
          <div className="text-primary bg-primary/10 border-primary/20 flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] tracking-wider">
            <PiCheckCircle />
            <span>Verified</span>
          </div>
        </div>

        <PiQuotesFill className="text-primary/10 absolute top-24 right-6 z-0 rotate-12 transform text-6xl" />

        <blockquote className="relative z-10 grow">
          <p className="text-foreground/90 mb-8 font-sans text-lg leading-relaxed italic">
            &quot;{testimonial.quote}&quot;
          </p>
        </blockquote>

        <div className="border-border/40 relative z-10 mt-auto border-t pt-6">
          <div className="text-foreground font-display text-sm font-bold tracking-wide">
            {testimonial.author}
          </div>
          <div className="text-muted-foreground mt-1 font-sans text-xs">
            {testimonial.company}
          </div>
          <div className="text-primary/80 mt-2 font-mono text-[10px] tracking-widest">
            <span aria-hidden="true" className="mr-1">
              {'//'}
            </span>
            {testimonial.industry}
          </div>
        </div>
      </Card>
    </div>
  );
}
