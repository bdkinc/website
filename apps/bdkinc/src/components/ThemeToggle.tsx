import { PiMoon, PiSun } from 'react-icons/pi';
import { useEffect, useState } from 'react';
import { Button } from '@bdkinc/design-system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  const toggleButtonClassName =
    'group relative flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-border bg-transparent text-foreground shadow-[0_3px_12px_-6px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.05] hover:bg-accent/10 hover:text-foreground hover:shadow-[0_6px_20px_-8px_rgba(0,0,0,0.5)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-border dark:hover:shadow-[0_6px_20px_-8px_rgba(255,255,255,0.15)]';

  // Load theme from localStorage and set initial state
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Render identical structure for both mounted and unmounted states
  // to avoid hydration mismatch, relying on CSS `dark:` for immediate styling.
  const content = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 z-0 rounded-full bg-gradient-to-tr from-amber-300/20 to-orange-400/20 opacity-0 blur-[6px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.5] group-hover:opacity-100 dark:from-blue-400/20 dark:to-indigo-500/20"
      />
      <div
        aria-hidden="true"
        className="relative z-10 flex h-5 w-5 items-center justify-center"
      >
        <PiSun className="absolute h-5 w-5 scale-100 rotate-0 opacity-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[20deg] dark:scale-0 dark:-rotate-90 dark:opacity-0" />
        <PiMoon className="absolute h-5 w-5 scale-0 rotate-90 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:scale-100 dark:rotate-0 dark:opacity-100 dark:group-hover:-rotate-[15deg]" />
      </div>
    </>
  );

  if (!mounted) {
    return (
      <Button
        type="button"
        aria-label="Switch color theme"
        title="Switch color theme"
        variant={'ghost'}
        size={'icon'}
        className={toggleButtonClassName}
      >
        {content}
      </Button>
    );
  }

  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      variant={'ghost'}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === 'dark'}
      className={toggleButtonClassName}
      size={'icon'}
    >
      {content}
    </Button>
  );
}
