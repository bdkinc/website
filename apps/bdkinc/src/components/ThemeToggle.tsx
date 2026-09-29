import { PiMoon, PiSun } from 'react-icons/pi';
import { useSyncExternalStore } from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  getTheme,
  getServerTheme,
  subscribeTheme,
  toggleTheme,
} from '@/lib/theme';

const ease = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const styles = stylex.create({
  button: {
    position: 'relative',
    display: 'flex',
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderRadius: '50%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    backgroundColor: {
      default: 'transparent',
      ':hover': 'color-mix(in oklab, var(--accent) 10%, transparent)',
    },
    color: 'var(--foreground)',
    boxShadow: {
      default: '0 3px 12px -6px rgba(0,0,0,.35)',
      ':hover': 'var(--toggle-hover-shadow)',
    },
    transform: {
      default: 'scale(1)',
      ':hover': {
        default: null,
        '@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)':
          'scale(1.05)',
      },
      ':active': {
        default: null,
        '@media (prefers-reduced-motion: no-preference)': 'scale(.95)',
      },
    },
    transitionProperty:
      'background-color, box-shadow, transform, outline-color',
    transitionDuration: {
      default: '0ms',
      '@media (prefers-reduced-motion: no-preference)': '500ms',
    },
    transitionTimingFunction: ease,
    cursor: 'pointer',
    outline: { default: 'none', ':focus-visible': '2px solid var(--ring)' },
    outlineOffset: { default: 0, ':focus-visible': '2px' },
    '--toggle-hover': {
      default: '0',
      ':hover': {
        default: null,
        '@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)':
          '1',
      },
    },
  },
  glow: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    borderRadius: '50%',
    backgroundImage: 'var(--toggle-glow)',
    opacity: 'var(--toggle-hover)',
    filter: 'blur(6px)',
    transform: {
      default: 'scale(1)',
      '@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)':
        'scale(calc(1 + .5 * var(--toggle-hover)))',
    },
    transitionProperty: 'opacity, transform',
    transitionDuration: {
      default: '0ms',
      '@media (prefers-reduced-motion: no-preference)': '500ms',
    },
    transitionTimingFunction: ease,
    pointerEvents: 'none',
  },
  iconFrame: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    width: 20,
    height: 20,
    fontSize: 20,
    transitionProperty: 'opacity, transform',
    transitionDuration: {
      default: '0ms',
      '@media (prefers-reduced-motion: no-preference)': '500ms',
    },
    transitionTimingFunction: ease,
  },
  sun: {
    opacity: 'var(--toggle-sun-opacity)',
    transform: 'var(--toggle-sun-transform)',
  },
  moon: {
    opacity: 'var(--toggle-moon-opacity)',
    transform: 'var(--toggle-moon-transform)',
  },
});

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const mounted = theme !== null;
  const isDark = theme === 'dark';
  const label = mounted
    ? `Switch to ${isDark ? 'light' : 'dark'} mode`
    : 'Switch color theme';

  return (
    <button
      {...stylex.props(styles.button)}
      type="button"
      onClick={mounted ? toggleTheme : undefined}
      aria-label={label}
      title={label}
      aria-pressed={mounted ? isDark : undefined}
    >
      <span aria-hidden="true" {...stylex.props(styles.glow)} />
      <span aria-hidden="true" {...stylex.props(styles.iconFrame)}>
        <span {...stylex.props(styles.icon, styles.sun)}>
          <PiSun />
        </span>
        <span {...stylex.props(styles.icon, styles.moon)}>
          <PiMoon />
        </span>
      </span>
    </button>
  );
}
