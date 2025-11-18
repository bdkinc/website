import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Zap, ShieldCheck, Users } from 'lucide-react';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';

export default function WhyChooseUs() {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Viewport detection for section header
  const { ref: headerRef, isIntersecting: headerInView } =
    useIntersectionObserver({
      threshold: 0.2,
      rootMargin: '0px',
      triggerOnce: true,
    });

  // Viewport detection for features grid
  const { ref: gridRef, isIntersecting: gridInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });

  useEffect(() => {
    // Animate icon circles on hover with smooth scale and rotation
    const listeners: Array<{
      iconWrapper: HTMLDivElement;
      handleMouseEnter: () => void;
      handleMouseLeave: () => void;
    }> = [];

    iconRefs.current.forEach((iconWrapper) => {
      if (!iconWrapper) return;

      const handleMouseEnter = () => {
        iconWrapper.style.transform = 'scale(1.15) rotate(8deg)';
      };

      const handleMouseLeave = () => {
        iconWrapper.style.transform = 'scale(1) rotate(0deg)';
      };

      iconWrapper.addEventListener('mouseenter', handleMouseEnter);
      iconWrapper.addEventListener('mouseleave', handleMouseLeave);

      listeners.push({ iconWrapper, handleMouseEnter, handleMouseLeave });
    });

    return () => {
      listeners.forEach(
        ({ iconWrapper, handleMouseEnter, handleMouseLeave }) => {
          iconWrapper.removeEventListener('mouseenter', handleMouseEnter);
          iconWrapper.removeEventListener('mouseleave', handleMouseLeave);
        }
      );
    };
  }, []);

  const getCardStyle = (delay: number) =>
    gridInView
      ? {
          transitionDelay: `${delay}ms`,
          opacity: 1,
          transform: 'translateY(0)',
        }
      : {
          transitionDelay: '0ms',
          opacity: 0,
          transform: 'translateY(24px)',
        };

  return (
    <section className="gradient-mesh relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="from-primary/50 via-secondary/50 absolute top-0 right-0 left-0 h-1 bg-linear-to-r to-[--brand-accent]/50" />

      <div className="mx-auto max-w-7xl">
        <div
          ref={headerRef as any}
          className={cn(
            'mb-16 text-center',
            'translate-y-8 opacity-0 transition-[opacity,transform] duration-700 ease-out',
            headerInView && 'translate-y-0 opacity-100'
          )}
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-foreground">Why Choose </span>
            <span className="font-display from-primary to-secondary bg-linear-to-br bg-clip-text font-extrabold text-transparent">
              BDK
            </span>
            <span>?</span>
          </h2>
        </div>

        <div
          ref={gridRef as any}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          <div
            className={cn(
              'flex h-full flex-col items-center justify-center space-y-4 text-center',
              'translate-y-6 opacity-0 transition-[opacity,transform] duration-600 ease-out'
            )}
            style={getCardStyle(0)}
          >
            <div
              ref={(el) => {
                iconRefs.current[0] = el;
              }}
              className={cn(
                'text-foreground flex h-16 w-16 items-center justify-center rounded-full',
                'transition-all duration-300',
                'from-primary/10 to-secondary/10 bg-linear-to-br',
                'hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]'
              )}
            >
              <Zap className="icon-md text-primary" aria-hidden />
            </div>
            <h3
              className={cn(
                'text-foreground text-center text-2xl font-semibold',
                'transition-colors duration-300'
              )}
            >
              Fast Response
            </h3>
            <p className="text-muted-foreground mx-auto max-w-sm text-center">
              Quick turnaround times with dedicated{' '}
              <span className="text-accent">support</span> staff available 24/7.
            </p>
          </div>

          <div
            className={cn(
              'flex h-full flex-col items-center justify-center space-y-4 text-center',
              'translate-y-6 opacity-0 transition-[opacity,transform] duration-600 ease-out'
            )}
            style={getCardStyle(120)}
          >
            <div
              ref={(el) => {
                iconRefs.current[1] = el;
              }}
              className={cn(
                'text-foreground flex h-16 w-16 items-center justify-center rounded-full',
                'transition-all duration-300',
                'from-primary/10 to-secondary/10 bg-linear-to-br',
                'hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]'
              )}
            >
              <ShieldCheck className="icon-md text-primary" aria-hidden />
            </div>
            <h3
              className={cn(
                'text-foreground text-center text-2xl font-semibold',
                'transition-colors duration-300'
              )}
            >
              Proven Expertise
            </h3>
            <p className="text-muted-foreground mx-auto max-w-sm text-center">
              Over 25 years of <span className="text-accent">experience</span>{' '}
              delivering reliable IT solutions.
            </p>
          </div>

          <div
            className={cn(
              'flex h-full flex-col items-center justify-center space-y-4 text-center',
              'translate-y-6 opacity-0 transition-[opacity,transform] duration-600 ease-out'
            )}
            style={getCardStyle(240)}
          >
            <div
              ref={(el) => {
                iconRefs.current[2] = el;
              }}
              className={cn(
                'text-foreground flex h-16 w-16 items-center justify-center rounded-full',
                'transition-all duration-300',
                'from-primary/10 to-secondary/10 bg-linear-to-br',
                'hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]'
              )}
            >
              <Users className="icon-md text-primary" aria-hidden />
            </div>
            <h3
              className={cn(
                'text-foreground text-center text-2xl font-semibold',
                'transition-colors duration-300'
              )}
            >
              Personalized Service
            </h3>
            <p className="text-muted-foreground mx-auto max-w-sm text-center">
              Dedicated team that understands your unique{' '}
              <span className="text-accent">business</span> needs.
            </p>
          </div>
        </div>
      </div>

      <div className="from-primary/50 via-secondary/50 absolute right-0 bottom-0 left-0 h-1 bg-linear-to-r to-[--brand-accent]/50" />
    </section>
  );
}
