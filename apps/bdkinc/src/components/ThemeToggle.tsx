import { PiMoon, PiSun } from 'react-icons/pi';
import { useEffect, useState } from 'react';
import { Button } from '@bdkinc/design-system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  const toggleButtonClassName =
    'group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-300/60 bg-transparent text-neutral-800 shadow-[0_3px_12px_-6px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.05] hover:bg-neutral-100 hover:text-neutral-950 hover:shadow-[0_6px_20px_-8px_rgba(0,0,0,0.5)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:border-neutral-700/80 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white dark:hover:shadow-[0_6px_20px_-8px_rgba(255,255,255,0.15)] dark:focus-visible:ring-neutral-400';

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
      <span className="absolute inset-0 z-0 rounded-full bg-gradient-to-tr from-amber-300/20 to-orange-400/20 opacity-0 blur-[6px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.5] group-hover:opacity-100 dark:from-blue-400/20 dark:to-indigo-500/20" />
      <div className="relative z-10 flex h-5 w-5 items-center justify-center">
        <PiSun className="absolute h-5 w-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0 group-hover:rotate-[20deg]" />
        <PiMoon className="absolute h-5 w-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100 dark:group-hover:-rotate-[15deg]" />
      </div>
    </>
  );

  if (!mounted) {
    return (
      <Button
        aria-label="Toggle theme"
        variant={'ghost'}
        size={'icon'}
        className={toggleButtonClassName}
      >
        {content}
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      variant={'ghost'}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={toggleButtonClassName}
      size={'icon'}
    >
      {content}
    </Button>
  );
}
