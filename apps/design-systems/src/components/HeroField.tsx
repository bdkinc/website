import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'motion/react';
import * as stylex from '@stylexjs/stylex';

const tiles = Array.from({ length: 576 }, (_, index) => index);
const flip = stylex.keyframes({
  '0%': { opacity: 0.2, transform: 'rotateY(0deg) rotateX(12deg)' },
  '15%': { opacity: 0.8, transform: 'rotateY(0deg) rotateX(12deg)' },
  '35%': { opacity: 0.4, transform: 'rotateY(180deg) rotateX(-12deg)' },
  '55%': { opacity: 0.13, transform: 'rotateY(180deg) rotateX(-12deg)' },
  '75%': { opacity: 0.8, transform: 'rotateY(360deg) rotateX(12deg)' },
  '100%': { opacity: 0.2, transform: 'rotateY(360deg) rotateX(12deg)' },
});
const mobile = '@media (max-width: 650px)';
const tablet = '@media (max-width: 1000px)';
const reduced = '@media (prefers-reduced-motion: reduce)';
const styles = stylex.create({
  root: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  clip: { position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 },
  field: {
    position: 'absolute',
    top: '50%',
    left: { default: '-6%', [mobile]: '-10%' },
    right: { default: '-6%', [mobile]: '-10%' },
    width: 'auto',
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(32, minmax(0, 1fr))',
      [tablet]: 'repeat(24, minmax(0, 1fr))',
      [mobile]: 'repeat(12, minmax(0, 1fr))',
    },
    gap: { default: 8, [tablet]: 7, [mobile]: 6 },
    opacity: { default: 0.55, [mobile]: 0.35 },
    perspective: 700,
    transform: 'translateY(-50%) rotate(-10deg)',
  },
  tile: {
    '--tile-color': 'var(--cyan)',
    display: 'block',
    aspectRatio: '1',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--tile-color)',
    opacity: { default: 0.3, [reduced]: 0.25 },
    transform: { default: 'rotateX(12deg)', [reduced]: 'none' },
    animationName: { default: flip, [reduced]: 'none' },
    animationDuration: '24s',
    animationTimingFunction: 'var(--ease-in-out)',
    animationIterationCount: 'infinite',
    animationPlayState: 'paused',
    position: 'relative',
    backgroundColor: 'color-mix(in srgb, var(--tile-color) 16%, transparent)',
  },
  corner: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 4,
    height: 4,
    backgroundColor: 'var(--tile-color)',
  },
  bright: {
    backgroundColor: 'color-mix(in srgb, var(--tile-color) 40%, transparent)',
  },
  purple: { '--tile-color': 'var(--purple)' },
  amber: { '--tile-color': 'var(--amber)' },
  beyondMobile: { display: { default: 'block', [mobile]: 'none' } },
  running: { animationPlayState: 'running' },
  delay: (value: string) => ({ animationDelay: value }),
  toggle: {
    position: 'absolute',
    top: { default: 16, [mobile]: 4 },
    right: { default: 16, [mobile]: 4 },
    zIndex: 2,
    minHeight: 44,
    paddingBlock: 8,
    paddingInline: 12,
    display: { default: 'inline-flex', [reduced]: 'none' },
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'var(--rule)',
      '@media (hover: hover) and (pointer: fine)': {
        default: 'var(--rule)',
        ':hover': 'var(--cyan)',
      },
    },
    backgroundColor: 'color-mix(in srgb, var(--bg) 90%, transparent)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-sans)',
    fontSize: 11,
    cursor: 'pointer',
    pointerEvents: 'auto',
    outline: { default: 'none', ':focus-visible': '2px solid var(--cyan)' },
    outlineOffset: { default: 0, ':focus-visible': 3 },
  },
  icon: { display: 'inline-flex' },
});

const paths = {
  pause:
    'M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z',
  play: 'M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z',
};

export default function HeroField() {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduce, setReduce] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const syncPointerRef = useRef<() => void>(() => {});
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { type: 'spring' as const, duration: 0.5, bounce: 0.2 };
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);
  const fieldTransform = useMotionTemplate`translateY(-50%) rotate(-10deg) translate3d(${springX}px, ${springY}px, 0)`;
  const running = ready && !paused && !reduce && inView && visible;

  useEffect(() => {
    const hero = root.current?.closest<HTMLElement>('.hero-home');
    if (!hero) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateReduced = () => setReduce(media.matches);
    const inViewRef = { current: false };
    const reset = () => {
      x.set(0);
      y.set(0);
    };
    const updateVisibility = () => {
      setVisible(!document.hidden);
      syncPointer();
    };
    const move = (event: PointerEvent) => {
      if (
        pausedRef.current ||
        document.hidden ||
        media.matches ||
        !inViewRef.current
      )
        return;
      const bounds = hero.getBoundingClientRect();
      x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 10);
      y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 10);
    };
    const syncPointer = () => {
      hero.removeEventListener('pointermove', move);
      if (
        fine.matches &&
        !media.matches &&
        !pausedRef.current &&
        !document.hidden &&
        inViewRef.current
      )
        hero.addEventListener('pointermove', move, { passive: true });
      else reset();
    };
    syncPointerRef.current = syncPointer;
    const onMedia = () => {
      updateReduced();
      syncPointer();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      setInView(entry.isIntersecting);
      syncPointer();
    });
    observer.observe(hero);
    hero.addEventListener('pointerleave', reset);
    media.addEventListener('change', onMedia);
    fine.addEventListener('change', syncPointer);
    document.addEventListener('visibilitychange', updateVisibility);
    updateReduced();
    updateVisibility();
    syncPointer();
    setReady(true);
    return () => {
      observer.disconnect();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
      media.removeEventListener('change', onMedia);
      fine.removeEventListener('change', syncPointer);
      document.removeEventListener('visibilitychange', updateVisibility);
      syncPointerRef.current = () => {};
    };
  }, [x, y]);

  const togglePause = () => {
    pausedRef.current = !paused;
    if (pausedRef.current) {
      x.set(0);
      y.set(0);
      springX.jump(0);
      springY.jump(0);
    }
    syncPointerRef.current();
    setPaused(!paused);
  };

  return (
    <div ref={root} {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.clip)} aria-hidden="true">
        <motion.div
          {...stylex.props(styles.field)}
          style={{ transform: fieldTransform }}
        >
          {tiles.map((index) => (
            <span
              key={index}
              {...stylex.props(
                styles.tile,
                index % 5 === 4 && styles.bright,
                index % 7 === 6 && styles.purple,
                index % 11 === 10 && styles.amber,
                index >= 240 && styles.beyondMobile,
                running && styles.running,
                styles.delay(`${-(index / tiles.length) * 24}s`)
              )}
            >
              <span {...stylex.props(styles.corner)} />
            </span>
          ))}
        </motion.div>
      </div>
      {ready && !reduce && (
        <button
          type="button"
          {...stylex.props(styles.toggle)}
          aria-label={paused ? 'Resume animation' : 'Pause animation'}
          aria-pressed={paused}
          onClick={togglePause}
        >
          <span {...stylex.props(styles.icon)}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d={paths[paused ? 'play' : 'pause']} />
            </svg>
          </span>
          <span>{paused ? 'Resume animation' : 'Pause animation'}</span>
        </button>
      )}
    </div>
  );
}
