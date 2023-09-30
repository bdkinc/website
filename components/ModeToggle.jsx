"use client";

import * as Switch from "@radix-ui/react-switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center">
      <span
        className={`mr-2 ${
          theme === "dark" ? "text-bdk-blue" : "text-orange-400"
        }`}
      >
        {theme === "dark" ? <FaMoon size="1.4em" /> : <FaSun size="1.8em" />}
      </span>
      <Switch.Root
        checked={theme === "dark"}
        onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`${theme === "dark" ? "bg-bdk-blue-darker" : "bg-orange-400"}
          relative inline-flex flex-shrink-0 h-[24px] w-[56px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use Dark Mode</span>
        <Switch.Thumb
          aria-hidden="true"
          className={`${theme === "dark" ? "translate-x-8" : "translate-x-0"}
            pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch.Root>
    </div>
  );
};

export default ModeToggle;
