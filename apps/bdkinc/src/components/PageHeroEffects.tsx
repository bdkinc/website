import Aurora from '@/components/Aurora';
import CircuitBoard from '@/components/CircuitBoard';

interface PageHeroEffectsProps {
  auroraClassName?: string;
  circuitClassName?: string;
}

export default function PageHeroEffects({
  auroraClassName,
  circuitClassName,
}: PageHeroEffectsProps) {
  const auroraClasses = [
    'absolute inset-0 opacity-30 dark:opacity-60',
    auroraClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const circuitClasses = ['pointer-events-none', circuitClassName]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className={auroraClasses}>
        <Aurora
          colorStops={['#00d4ff', '#7c3aed', '#00d4ff']}
          amplitude={1.5}
          blend={0.6}
          speed={0.6}
        />
      </div>

      <div className="gradient-mesh absolute inset-0 opacity-40 dark:opacity-0" />

      <CircuitBoard className={circuitClasses} />

      <div className="via-background/30 to-background dark:via-background/50 absolute inset-0 bg-linear-to-b from-transparent"></div>

      <div className="from-primary/8 dark:from-primary/5 absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-from),transparent_70%)] opacity-60 dark:opacity-50"></div>
    </>
  );
}
