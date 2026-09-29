import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { iconMap } from '@/lib/icons';
import { PiPackage } from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';

const colorTransition =
  'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to';
const transition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

// TechCard sets --tech-hover-opacity to 1 while hovered (the old `group-hover:`).
const styles = stylex.create({
  link: {
    position: 'relative',
    zIndex: 20,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  iconWrapper: { marginBottom: '1.5rem' },
  iconBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius)',
    padding: '0.75rem',
    backgroundColor:
      'color-mix(in oklab, var(--primary) calc(5% + 5% * var(--tech-hover-opacity, 0)), transparent)',
    // group-hover:scale-110 sets the individual `scale` property, which is not in the transition list.
    scale: 'calc(1 + 0.1 * var(--tech-hover-opacity, 0))',
    boxShadow:
      '0 0 15px rgba(0, 212, 255, calc(0.3 * var(--tech-hover-opacity, 0)))',
    transitionProperty: transition,
    transitionDuration: '500ms',
    transitionTimingFunction: easing,
  },
  glyph: { height: '2rem', width: '2rem', color: 'var(--primary)' },
  title: {
    marginBottom: '0.75rem',
    color: 'var(--tech-title-color, var(--foreground))',
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    lineHeight: 'calc(2 / 1.5)',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    transitionProperty: colorTransition,
    transitionDuration: '300ms',
    transitionTimingFunction: easing,
  },
  description: {
    marginBottom: '1.5rem',
    flexGrow: 1,
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    lineHeight: 1.625,
  },
});

interface InteractiveServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  index: number;
  xstyle?: StyleXStyles;
}
export default function InteractiveServiceCard({
  id,
  title,
  description,
  icon,
  index,
  xstyle,
}: InteractiveServiceCardProps) {
  const Icon = iconMap[icon] || PiPackage;
  return (
    <TechCard
      asChild
      interactive
      variant="technical"
      delay={index * 100}
      xstyle={[styles.link, xstyle]}
    >
      <a href={`/services/${id}`}>
        {/* Icon */}
        <div {...stylex.props(styles.iconWrapper)}>
          <div
            {...stylex.props(styles.iconBox)}
            style={{
              viewTransitionName: `service-icon-${id}`,
            }}
          >
            <Icon {...stylex.props(styles.glyph)} />
          </div>
        </div>
        {/* Title */}
        <h2
          {...stylex.props(styles.title)}
          style={{
            viewTransitionName: `service-title-${id}`,
          }}
        >
          {title}
        </h2>
        {/* Description */}
        <p
          {...stylex.props(styles.description)}
          style={{
            viewTransitionName: `service-description-${id}`,
          }}
        >
          {description}
        </p>
      </a>
    </TechCard>
  );
}
