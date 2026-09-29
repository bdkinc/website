import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { PiCheckCircle, PiHeadphones, PiMonitor } from 'react-icons/pi';
import { cn } from '@bdkinc/design-system';
import { TechCard } from '@/components/TechCard';

const styles = stylex.create({
  grid: {
    display: 'grid',
    gap: '2rem',
    marginBottom: '5rem',
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      '@media (min-width: 48rem)': 'repeat(2, minmax(0, 1fr))',
    },
  },
  body: { padding: '2rem' },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
  },
  iconBox: {
    padding: '0.5rem',
    borderRadius: 'calc(var(--radius) - 2px)',
    backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
  },
  icon: { height: '1.5rem', width: '1.5rem', color: 'var(--primary)' },
  title: {
    fontFamily: 'var(--font-display)',
    color: 'var(--foreground)',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: 700,
    letterSpacing: '0.025em',
  },
  // `space-y-4` becomes a flex column gap (no sibling selectors in StyleX).
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontFamily: 'var(--font-sans)',
    color: 'var(--muted-foreground)',
  },
  check: {
    height: '1.25rem',
    width: '1.25rem',
    flexShrink: 0,
    marginTop: '0.125rem',
    color: 'var(--primary)',
  },
});

const detailColumns = [
  {
    title: 'Support Tiers',
    icon: PiHeadphones,
    items: [
      'Unlimited help desk covers remote and onsite incidents',
      'Dedicated account managers align roadmaps with leadership goals',
      'Lifecycle management tracks assets, warranties, and renewals',
    ],
  },
  {
    title: 'Technology Operations',
    icon: PiMonitor,
    items: [
      'Proactive monitoring prevents outages with automated remediation',
      'Quarterly reviews surface optimization and security priorities',
      'Documented runbooks keep every response consistent and auditable',
    ],
  },
];
export default function TechSpecs({ xstyle }: { xstyle?: StyleXStyles }) {
  const applied = stylex.props(styles.grid, xstyle);
  return (
    // `not-prose` opts this grid out of an ancestor typography plugin's descendants.
    <div {...applied} className={cn(applied.className, 'not-prose')}>
      {detailColumns.map((column, index) => (
        <TechCard key={index} variant="technical" interactive={false}>
          <div {...stylex.props(styles.body)}>
            <div {...stylex.props(styles.header)}>
              <div {...stylex.props(styles.iconBox)}>
                <column.icon
                  {...stylex.props(styles.icon)}
                  aria-hidden="true"
                />
              </div>
              <h4 {...stylex.props(styles.title)}>{column.title}</h4>
            </div>
            <ul {...stylex.props(styles.list)}>
              {column.items.map((item, idx) => (
                <li key={idx} {...stylex.props(styles.item)}>
                  <PiCheckCircle
                    {...stylex.props(styles.check)}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </TechCard>
      ))}
    </div>
  );
}
