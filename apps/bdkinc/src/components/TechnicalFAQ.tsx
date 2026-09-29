import * as stylex from '@stylexjs/stylex';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
} from '@bdkinc/design-system';

interface FAQItem {
  question: string;
  answer: string;
}

interface TechnicalFAQProps {
  faqs: FAQItem[];
}

const hover = '@media (hover: hover)';
const colorTransition =
  'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to';
const open = '[data-state="open"]';
const styles = stylex.create({
  list: { marginInline: 'auto', maxWidth: '48rem' },
  gap: { marginBottom: '1rem' },
  // Restates the item's bottom border because a shorthand cannot override the primitive's longhands.
  item: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 'var(--radius)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: {
      default: 'var(--border)',
      [hover]: {
        default: 'var(--border)',
        ':hover': 'color-mix(in oklab, var(--primary) 30%, transparent)',
      },
      [open]: 'color-mix(in oklab, var(--primary) 40%, transparent)',
    },
    borderBottomColor: {
      default: 'var(--border)',
      [hover]: {
        default: 'var(--border)',
        ':hover': 'color-mix(in oklab, var(--primary) 30%, transparent)',
      },
      [open]: 'color-mix(in oklab, var(--primary) 40%, transparent)',
    },
    backgroundColor: {
      default: 'color-mix(in oklab, var(--card) 40%, transparent)',
      [hover]: {
        default: 'color-mix(in oklab, var(--card) 40%, transparent)',
        ':hover': 'color-mix(in oklab, var(--card) 60%, transparent)',
      },
      [open]: 'color-mix(in oklab, var(--card) 60%, transparent)',
    },
    '--faq-scanlines-opacity': {
      default: 0.03,
      [hover]: { default: 0.03, ':hover': 0.05 },
    },
    backdropFilter: 'blur(12px)',
    transitionProperty: colorTransition,
    transitionDuration: '200ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  scanlines: {
    opacity: 'var(--faq-scanlines-opacity)',
    transitionProperty: 'opacity',
    transitionDuration: '200ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  circuit: { opacity: 0.02 },
  trigger: {
    position: 'relative',
    zIndex: 10,
    alignItems: 'center',
    paddingBlock: '1.25rem',
    paddingInline: '1.5rem',
    color: 'var(--foreground)',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: 600,
    boxShadow: {
      default: 'none',
      ':focus-visible': '0 0 0 2px var(--background), 0 0 0 4px var(--ring)',
    },
  },
  content: {
    position: 'relative',
    zIndex: 10,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'color-mix(in oklab, var(--border) 60%, transparent)',
    paddingTop: '1rem',
    paddingBottom: '1.5rem',
    paddingInline: '1.5rem',
    color: 'var(--muted-foreground)',
    lineHeight: 1.625,
  },
});

export default function TechnicalFAQ({ faqs }: TechnicalFAQProps) {
  return (
    <Accordion type="multiple" {...stylex.props(styles.list)}>
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`faq-${index + 1}`}
          xstyle={[styles.item, index < faqs.length - 1 && styles.gap]}
        >
          {/* Scanline overlay */}
          {/* Markers: `scanlines` and `circuit-overlay` supply their CSS rules. */}
          <div
            className={cn(
              stylex.props(styles.overlay, styles.scanlines).className,
              'scanlines'
            )}
          />
          <div
            className={cn(
              stylex.props(styles.overlay, styles.circuit).className,
              'circuit-overlay'
            )}
          />

          <AccordionTrigger xstyle={styles.trigger}>
            {faq.question}
          </AccordionTrigger>

          <AccordionContent xstyle={styles.content}>
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
