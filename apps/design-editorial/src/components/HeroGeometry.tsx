import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import * as stylex from '@stylexjs/stylex';

const ringsIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(.92)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const squareIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 0.94, transform: 'translateY(0)' },
});
const pointIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(.96)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const orbitTurn = stylex.keyframes({
  from: { transform: 'rotate(200deg)' },
  to: { transform: 'rotate(560deg)' },
});
const squareTurn = stylex.keyframes({ to: { rotate: '360deg' } });
const desktop = '@media (max-width: 1000px)';
const mobile = '@media (max-width: 680px)';
const animated = '@media (prefers-reduced-motion: no-preference)';

const styles = stylex.create({
  geometry: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  ringsDepth: { position: 'absolute', inset: 0 },
  rings: {
    position: 'absolute',
    top: { default: -230, [desktop]: -180, [mobile]: -130 },
    right: { default: -200, [desktop]: -170, [mobile]: -140 },
    width: { default: 620, [desktop]: 480, [mobile]: 330 },
    height: { default: 620, [desktop]: 480, [mobile]: 330 },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--cyan) 45%, transparent)',
    borderRadius: '50%',
    animationName: { default: 'none', [animated]: ringsIn },
    animationDuration: '900ms',
    animationTimingFunction: 'var(--ease-out)',
    animationDelay: '200ms',
    animationFillMode: 'both',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--cyan) 45%, transparent)',
    borderRadius: '50%',
  },
  innerRing: { inset: { default: 56, [desktop]: 44, [mobile]: 30 } },
  outerRing: { inset: { default: 118, [desktop]: 92, [mobile]: 64 } },
  orbit: {
    position: 'absolute',
    inset: { default: 118, [desktop]: 92, [mobile]: 64 },
    transform: 'rotate(200deg)',
    animationName: { default: 'none', [animated]: orbitTurn, [mobile]: 'none' },
    animationDuration: '48s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  point: {
    position: 'absolute',
    top: { default: -18, [desktop]: -15, [mobile]: -12 },
    left: {
      default: 'calc(50% - 18px)',
      [desktop]: 'calc(50% - 15px)',
      [mobile]: 'calc(50% - 12px)',
    },
    width: { default: 36, [desktop]: 30, [mobile]: 24 },
    height: { default: 36, [desktop]: 30, [mobile]: 24 },
    backgroundColor: 'var(--amber)',
    borderRadius: '50%',
    animationName: { default: 'none', [animated]: pointIn },
    animationDuration: '600ms',
    animationTimingFunction: 'var(--ease-out)',
    animationDelay: '460ms',
    animationFillMode: 'both',
  },
  squareDepth: { position: 'absolute', inset: 0 },
  square: {
    position: 'absolute',
    top: { default: -70, [desktop]: -50, [mobile]: -30 },
    right: { default: -50, [desktop]: -40, [mobile]: -26 },
    width: { default: 210, [desktop]: 160, [mobile]: 104 },
    height: { default: 210, [desktop]: 160, [mobile]: 104 },
    backgroundColor: 'var(--purple)',
    opacity: 0.94,
    animationName: {
      default: 'none',
      [animated]: `${squareIn}, ${squareTurn}`,
    },
    animationDuration: '800ms, 96s',
    animationTimingFunction: 'var(--ease-out), linear',
    animationDelay: '320ms, 0ms',
    animationFillMode: 'both',
    animationIterationCount: '1, infinite',
  },
});

export default function HeroGeometry() {
  const root = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { type: 'spring' as const, duration: 0.5, bounce: 0.2 };
  const ringX = useSpring(x, spring);
  const ringY = useSpring(y, spring);
  // The nearer square travels in the opposite direction, giving the two planes depth.
  const squareX = useSpring(
    useTransform(x, (value) => value * -0.65),
    spring
  );
  const squareY = useSpring(
    useTransform(y, (value) => value * -0.65),
    spring
  );
  const ringTransform = useMotionTemplate`translate3d(${ringX}px, ${ringY}px, 0)`;
  const squareTransform = useMotionTemplate`translate3d(${squareX}px, ${squareY}px, 0)`;

  useEffect(() => {
    const hero = root.current?.closest<HTMLElement>('.home-hero');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!hero) return;
    const reset = () => {
      x.set(0);
      y.set(0);
    };
    const move = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
      y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 12);
    };
    const sync = () => {
      hero.removeEventListener('pointermove', move);
      if (fine.matches && !reduced.matches)
        hero.addEventListener('pointermove', move, { passive: true });
      else reset();
    };
    hero.addEventListener('pointerleave', reset);
    fine.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    sync();
    return () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
      fine.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, [x, y]);

  return (
    <div ref={root} {...stylex.props(styles.geometry)}>
      <motion.span
        {...stylex.props(styles.ringsDepth)}
        style={{ transform: ringTransform }}
      >
        <span {...stylex.props(styles.rings)}>
          <span {...stylex.props(styles.ring, styles.innerRing)} />
          <span {...stylex.props(styles.ring, styles.outerRing)} />
          <span {...stylex.props(styles.orbit)}>
            <span {...stylex.props(styles.point)} />
          </span>
        </span>
      </motion.span>
      <motion.span
        {...stylex.props(styles.squareDepth)}
        style={{ transform: squareTransform }}
      >
        <span {...stylex.props(styles.square)} />
      </motion.span>
    </div>
  );
}
