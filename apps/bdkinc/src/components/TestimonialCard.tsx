import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { Card } from '@bdkinc/design-system';
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
  xstyle?: StyleXStyles;
  /** Autoplay progress bar. Only rendered on the active card. */
  autoplay?: { durationMs: number; paused: boolean; onEnd: () => void };
}

const transition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const styles = stylex.create({
  card: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '1.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--border) 40%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--card) 30%, transparent)',
    padding: { default: 24, '@media (min-width: 48rem)': 32 },
    boxShadow: '0 20px 45px rgba(4,12,25,0.45)',
    backdropFilter: 'blur(24px)',
    transitionProperty: transition,
    transitionDuration: '300ms',
    '--testimonial-decoration-alpha': {
      default: '20%',
      '@media (hover: hover)': { default: '20%', ':hover': '50%' },
    },
    '--testimonial-bar-width': {
      default: '3rem',
      '@media (hover: hover)': { default: '3rem', ':hover': '5rem' },
    },
  },
  progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    width: '100%',
    transformOrigin: 'left',
    backgroundImage:
      'linear-gradient(to right, var(--primary), var(--secondary))',
  },
  header: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: { default: 24, '@media (min-width: 48rem)': 32 },
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'color-mix(in oklab, var(--border) 40%, transparent)',
  },
  quoteLabel: {
    display: 'flex',
    alignItems: 'center',
    color: 'color-mix(in oklab, var(--muted-foreground) 90%, transparent)',
    fontFamily: 'monospace',
    fontSize: '.75rem',
    lineHeight: '1rem',
  },
  quoteIcon: { color: 'var(--primary)' },
  giantQuote: {
    position: 'absolute',
    top: 96,
    right: 24,
    zIndex: -10,
    pointerEvents: 'none',
    color: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    fontSize: { default: '4rem', '@media (min-width: 48rem)': '5rem' },
    lineHeight: 1,
  },
  quotation: { position: 'relative', zIndex: 10, flexGrow: 1 },
  text: {
    marginBottom: { default: 24, '@media (min-width: 48rem)': 32 },
    color: 'color-mix(in oklab, var(--foreground) 90%, transparent)',
    fontFamily: 'var(--font-sans)',
    fontSize: { default: '1rem', '@media (min-width: 48rem)': '1.125rem' },
    lineHeight: 1.625,
    fontStyle: 'italic',
  },
  footer: {
    position: 'relative',
    zIndex: 10,
    marginTop: 'auto',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'color-mix(in oklab, var(--border) 40%, transparent)',
  },
  author: {
    color: 'var(--foreground)',
    fontFamily: 'var(--font-display)',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    fontWeight: 700,
    letterSpacing: '.025em',
  },
  company: {
    marginTop: 4,
    color: 'var(--muted-foreground)',
    fontFamily: 'var(--font-sans)',
    fontSize: '.75rem',
    lineHeight: '1rem',
  },
  industry: {
    color: 'color-mix(in oklab, var(--muted-foreground) 70%, transparent)',
  },
  decoration: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 24,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: '9999px',
    backgroundColor:
      'color-mix(in oklab, var(--secondary) var(--testimonial-decoration-alpha), transparent)',
    transitionProperty: 'color, background-color',
    transitionDuration: '500ms',
  },
  line: {
    height: 4,
    width: 'var(--testimonial-bar-width)',
    borderRadius: '9999px',
    backgroundColor:
      'color-mix(in oklab, var(--secondary) var(--testimonial-decoration-alpha), transparent)',
    transitionProperty: transition,
    transitionDuration: '500ms',
  },
});

export function TestimonialCard({
  testimonial,
  className,
  xstyle,
  autoplay,
}: TestimonialCardProps) {
  return (
    <Card xstyle={[styles.card, xstyle]} className={className}>
      {autoplay && (
        <div
          {...stylex.props(styles.progress)}
          style={{
            animationName: 'autoplay-progress',
            animationDuration: `${autoplay.durationMs}ms`,
            animationTimingFunction: 'linear',
            animationFillMode: 'both',
            animationPlayState: autoplay.paused ? 'paused' : 'running',
          }}
          onAnimationEnd={autoplay.onEnd}
          aria-hidden
        />
      )}
      <div {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.quoteLabel)}>
          <PiQuotesFill {...stylex.props(styles.quoteIcon)} />
        </div>
      </div>
      <PiQuotesFill {...stylex.props(styles.giantQuote)} />
      <blockquote {...stylex.props(styles.quotation)}>
        <p {...stylex.props(styles.text)}>&quot;{testimonial.quote}&quot;</p>
      </blockquote>
      <div {...stylex.props(styles.footer)}>
        <div {...stylex.props(styles.author)}>{testimonial.author}</div>
        <div {...stylex.props(styles.company)}>
          {testimonial.company}
          {testimonial.industry && (
            <span {...stylex.props(styles.industry)}>
              {' '}
              · {testimonial.industry}
            </span>
          )}
        </div>
        <div {...stylex.props(styles.decoration)}>
          <div {...stylex.props(styles.dot)} />
          <div {...stylex.props(styles.line)} />
        </div>
      </div>
    </Card>
  );
}
