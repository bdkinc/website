import * as stylex from '@stylexjs/stylex';
import { cn } from '@bdkinc/design-system';
import Aurora from '@/components/Aurora';
import CircuitBoard from '@/components/CircuitBoard';

interface PageHeroEffectsProps {
  auroraClassName?: string;
  circuitClassName?: string;
}

const styles = stylex.create({
  aurora: {
    position: 'absolute',
    inset: 0,
    opacity: 'var(--page-hero-aurora-opacity)',
  },
  mesh: {
    position: 'absolute',
    inset: 0,
    opacity: 'var(--page-hero-mesh-opacity)',
  },
  circuit: { pointerEvents: 'none' },
  fade: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(to bottom, transparent, var(--page-hero-fade-mid), var(--background))',
  },
  radial: {
    position: 'absolute',
    inset: 0,
    opacity: 'var(--page-hero-radial-opacity)',
    backgroundImage:
      'radial-gradient(ellipse at center, var(--page-hero-radial-start), transparent 70%)',
  },
});

export default function PageHeroEffects({
  auroraClassName,
  circuitClassName,
}: PageHeroEffectsProps) {
  const aurora = stylex.props(styles.aurora);
  const mesh = stylex.props(styles.mesh);
  return (
    <>
      <div {...aurora} className={cn(aurora.className, auroraClassName)}>
        <Aurora
          colorStops={['#00d4ff', '#7c3aed', '#00d4ff']}
          amplitude={1.5}
          blend={0.6}
          speed={0.6}
        />
      </div>
      {/* Existing gradient-mesh is the site's shared multi-stop artwork. */}
      <div {...mesh} className={cn(mesh.className, 'gradient-mesh')} />
      <CircuitBoard xstyle={styles.circuit} className={circuitClassName} />
      <div {...stylex.props(styles.fade)} />
      <div {...stylex.props(styles.radial)} />
    </>
  );
}
