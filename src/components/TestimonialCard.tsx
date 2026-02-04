import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { PiQuotesFill } from 'react-icons/pi';

export interface Testimonial {
  quote: string;
  author: string;
  company: string;
  industry?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <Card
      className={cn(
        'group border-border/40 bg-card/30 relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 shadow-[0_20px_45px_rgba(4,12,25,0.45)] backdrop-blur-xl transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300 md:p-8',
        className
      )}
    >
      <div className="border-border/40 relative mb-6 flex items-center justify-between border-b pb-4 md:mb-8">
        <div className="text-muted-foreground/90 flex items-center font-mono text-xs">
          <PiQuotesFill className="text-primary" />
        </div>
      </div>

      <PiQuotesFill className="text-primary/10 pointer-events-none absolute top-24 right-6 -z-10 text-[4rem] md:text-[5rem]" />

      <blockquote className="relative z-10 grow">
        <p className="text-foreground/90 mb-6 font-sans text-base leading-relaxed italic md:mb-8 md:text-lg">
          &quot;{testimonial.quote}&quot;
        </p>
      </blockquote>

      <div className="border-border/40 relative z-10 mt-auto border-t pt-6">
        <div className="text-foreground font-display text-sm font-bold tracking-wide">
          {testimonial.author}
        </div>
        <div className="text-muted-foreground mt-1 font-sans text-xs">
          {testimonial.company}
          {testimonial.industry && (
            <span className="text-muted-foreground/70">
              {' '}
              · {testimonial.industry}
            </span>
          )}
        </div>

        <div className="mt-6 flex w-full items-center justify-start gap-2">
          <div className="bg-secondary/20 group-hover:bg-secondary/50 h-2 w-2 rounded-full transition-colors duration-500" />
          <div className="bg-secondary/20 group-hover:bg-secondary/50 h-1 w-12 rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-500 group-hover:w-20" />
        </div>
      </div>
    </Card>
  );
}
