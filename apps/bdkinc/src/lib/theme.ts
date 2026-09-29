export type Theme = 'light' | 'dark';

interface ThemePreference {
  getTheme: () => Theme;
  toggle: () => void;
  subscribe: (listener: () => void) => () => void;
}

declare global {
  interface Window {
    bdkTheme: ThemePreference;
  }
}

// Authored JavaScript, not a serialized function: Astro emits this verbatim in
// the head so preference ownership and document styling precede hydration.
// Keep this static and free of interpolated content or closing script tags.
export const themeBootstrap = `(() => {
  if (window.bdkTheme) return;

  let preference = null;
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {
    // Storage may be unavailable; the in-memory preference still works.
  }

  let theme;
  const listeners = new Set();

  function applyTheme() {
    const next = preference ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next === 'dark');
    if (theme !== next) {
      theme = next;
      listeners.forEach((listener) => listener());
    }
  }

  window.bdkTheme = {
    getTheme: () => theme,
    toggle: () => {
      preference = theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', preference);
      } catch {
        // Retain the choice for this page session even when storage is blocked.
      }
      applyTheme();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };

  applyTheme();
  document.addEventListener('astro:after-swap', applyTheme);
})();`;

// These are clients of the pre-paint owner, not a second initialization path.
export const getTheme = (): Theme => window.bdkTheme.getTheme();
export const toggleTheme = (): void => window.bdkTheme.toggle();
export const subscribeTheme = (listener: () => void): (() => void) =>
  window.bdkTheme.subscribe(listener);

// Static HTML and the hydration pass use the same neutral accessible label.
export const getServerTheme = (): null => null;
