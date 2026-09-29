import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import CountUp from '@/components/CountUp';

interface MetricCountUpProps {
  value: string;
  label: string;
  className?: string;
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  value: {
    color: 'var(--primary)',
    fontSize: { default: '2.25rem', '@media (min-width: 40rem)': '3rem' },
    lineHeight: { default: '2.5rem', '@media (min-width: 40rem)': 1 },
    fontWeight: 700,
    letterSpacing: '-.025em',
  },
  label: {
    color: 'var(--muted-foreground)',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    fontWeight: 600,
    letterSpacing: '.1em',
  },
  inline: { display: 'inline' },
});

/** Animate a numeric metric while retaining its original suffix. */
export default function MetricCountUp({
  value,
  label,
  className,
  xstyle,
}: MetricCountUpProps) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*?)$/);
  const applied = stylex.props(xstyle);

  if (!match) {
    return (
      <div
        {...applied}
        className={[applied.className, className].filter(Boolean).join(' ')}
      >
        <div {...stylex.props(styles.value)}>{value}</div>
        <div {...stylex.props(styles.label)}>{label}</div>
      </div>
    );
  }

  const numericValue = parseFloat(match[1]);
  const suffix = match[2];
  return (
    <div
      {...applied}
      className={[applied.className, className].filter(Boolean).join(' ')}
    >
      <div {...stylex.props(styles.value)}>
        <CountUp
          to={numericValue}
          from={0}
          duration={2}
          delay={0.2}
          separator=","
          xstyle={styles.inline}
        />
        <span {...stylex.props(styles.inline)}>{suffix}</span>
      </div>
      <div {...stylex.props(styles.label)}>{label}</div>
    </div>
  );
}
