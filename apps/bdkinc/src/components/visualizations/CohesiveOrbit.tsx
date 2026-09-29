import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { motion } from 'motion/react';

const styles = stylex.create({
  root: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  glowPrimary: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: 400,
    width: '80vw',
    maxWidth: 600,
    transform: 'translate(-50%, -50%)',
    borderRadius: '9999px',
    backgroundColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    filter: 'blur(100px)',
  },
  glowSecondary: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: 300,
    width: '40vw',
    maxWidth: 400,
    transform: 'translate(-50%, -50%)',
    borderRadius: '9999px',
    backgroundColor: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
    filter: 'blur(80px)',
  },
  // Rings rotate via motion `animate`; no transform here so the animation wins.
  ringPrimary: {
    position: 'absolute',
    display: 'flex',
    aspectRatio: '1 / 1',
    width: '70vw',
    maxWidth: 700,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
  },
  ringSecondary: {
    position: 'absolute',
    display: 'flex',
    aspectRatio: '1 / 1',
    width: '110vw',
    maxWidth: 1100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'color-mix(in oklab, var(--secondary) 20%, transparent)',
  },
  ringOuter: {
    position: 'absolute',
    display: 'flex',
    aspectRatio: '1 / 1',
    width: '150vw',
    maxWidth: 1500,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'var(--orbit-ring-outer)',
  },
  nodeTop: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  nodeRight: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translate(50%, -50%)',
  },
  nodeLeft: {
    position: 'absolute',
    top: '50%',
    left: 0,
    transform: 'translate(-50%, -50%)',
  },
  nodeBottom: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translate(-50%, 50%)',
  },
  dotPrimary: {
    height: '0.5rem',
    width: '0.5rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--primary)',
    // Kept verbatim: --color-primary resolves to an oklch var, so this
    // shadow never rendered; preserved as-is per migration policy.
    boxShadow: '0 0 15px 4px rgba(var(--color-primary),0.5)',
  },
  dotPrimarySmall: {
    height: '0.375rem',
    width: '0.375rem',
    borderRadius: '9999px',
    backgroundColor: 'color-mix(in oklab, var(--primary) 50%, transparent)',
    boxShadow: '0 0 10px 2px rgba(var(--color-primary),0.3)',
  },
  dotSecondary: {
    height: '0.625rem',
    width: '0.625rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--secondary)',
    boxShadow: '0 0 20px 5px rgba(var(--color-secondary),0.6)',
  },
  dotAccent: {
    height: '0.75rem',
    width: '0.75rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--accent)',
    boxShadow: '0 0 20px 5px rgba(var(--color-accent),0.4)',
  },
  dotWhite: {
    height: '0.375rem',
    width: '0.375rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    boxShadow: '0 0 10px 2px rgba(255,255,255,0.2)',
  },
});

interface CohesiveOrbitProps {
  xstyle?: StyleXStyles;
}

export default function CohesiveOrbit({ xstyle }: CohesiveOrbitProps) {
  const root = stylex.props(styles.root, xstyle);
  return (
    <div {...root}>
      {/* Central Core Glows (Behind text) */}
      <div {...stylex.props(styles.glowPrimary)} />
      <div {...stylex.props(styles.glowSecondary)} />

      {/* Ring 1 (Inner) - Primary */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        {...stylex.props(styles.ringPrimary)}
      >
        <div {...stylex.props(styles.nodeTop)}>
          {/* Glowing node */}
          <div {...stylex.props(styles.dotPrimary)} />
        </div>
        {/* Secondary node on same ring */}
        <div {...stylex.props(styles.nodeRight)}>
          <div {...stylex.props(styles.dotPrimarySmall)} />
        </div>
      </motion.div>

      {/* Ring 2 (Middle) - Secondary */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        {...stylex.props(styles.ringSecondary)}
      >
        <div {...stylex.props(styles.nodeLeft)}>
          <div {...stylex.props(styles.dotSecondary)} />
        </div>
      </motion.div>

      {/* Ring 3 (Outer) - Accent / Subtle */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        {...stylex.props(styles.ringOuter)}
      >
        <div {...stylex.props(styles.nodeBottom)}>
          <div {...stylex.props(styles.dotAccent)} />
        </div>
        <div {...stylex.props(styles.nodeRight)}>
          <div {...stylex.props(styles.dotWhite)} />
        </div>
      </motion.div>
    </div>
  );
}
