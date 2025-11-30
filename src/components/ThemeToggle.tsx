import { PiMoon, PiSun } from 'react-icons/pi';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

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

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <Button
        aria-label="Toggle theme"
        variant={'ghost'}
        size={'icon'}
        className="cursor-pointer"
      >
        <PiSun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      variant={'ghost'}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="cursor-pointer"
      size={'icon'}
    >
      {theme === 'light' ? (
        <PiMoon className="h-5 w-5" />
      ) : (
        <PiSun className="h-5 w-5" />
      )}
    </Button>
  );
}
