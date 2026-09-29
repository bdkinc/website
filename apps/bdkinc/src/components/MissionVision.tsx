import * as stylex from '@stylexjs/stylex';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { PiRocket, PiEye } from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';
import type { PageData } from '@bdkinc/content';

type MissionCopy = PageData<'about'>['mission'];
type VisionCopy = PageData<'about'>['vision'];

const styles = stylex.create({
  body: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: { default: '2rem', '@media (min-width: 40rem)': '3rem' },
    textAlign: 'center',
  },
  badge: {
    marginBottom: '1.5rem',
    borderRadius: '9999px',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: '1rem',
    transitionProperty:
      'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing',
    transitionDuration: '500ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  badgePrimary: {
    backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
  },
  badgeSecondary: {
    backgroundColor: 'color-mix(in oklab, var(--secondary) 10%, transparent)',
    borderColor: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
  },
  icon: { height: '2.5rem', width: '2.5rem' },
  iconPrimary: { color: 'var(--primary)' },
  iconSecondary: { color: 'var(--secondary)' },
  heading: {
    marginBottom: '1rem',
    color: 'var(--foreground)',
    fontFamily: 'var(--font-display)',
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  text: {
    marginInline: 'auto',
    maxWidth: '28rem',
    color: 'var(--muted-foreground)',
    fontSize: '1.125rem',
    lineHeight: 1.625,
  },
});

function useCardReveal() {
  return useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });
}

// Separate islands so the preview maps Mission and Vision to their own field
// groups. Rendered markup is unchanged: the grid lives in about.astro, each
// card root keeps h-full, and the reveal stagger (delay 0 / 200) is kept.
export function MissionCard({ copy }: { copy: MissionCopy }) {
  const { ref, isIntersecting } = useCardReveal();
  return (
    <TechCard
      variant="technical"
      interactive
      delay={0}
      animated={isIntersecting}
    >
      <div ref={ref} {...stylex.props(styles.body)}>
        <div {...stylex.props(styles.badge, styles.badgePrimary)}>
          <PiRocket {...stylex.props(styles.icon, styles.iconPrimary)} />
        </div>
        <h2 {...stylex.props(styles.heading)}>{copy.heading}</h2>
        <p {...stylex.props(styles.text)}>{copy.body}</p>
      </div>
    </TechCard>
  );
}

export function VisionCard({ copy }: { copy: VisionCopy }) {
  const { ref, isIntersecting } = useCardReveal();
  return (
    <TechCard
      variant="technical"
      interactive
      delay={200}
      animated={isIntersecting}
    >
      <div ref={ref} {...stylex.props(styles.body)}>
        <div {...stylex.props(styles.badge, styles.badgeSecondary)}>
          <PiEye {...stylex.props(styles.icon, styles.iconSecondary)} />
        </div>
        <h2 {...stylex.props(styles.heading)}>{copy.heading}</h2>
        <p {...stylex.props(styles.text)}>{copy.body}</p>
      </div>
    </TechCard>
  );
}
