"use client";

import { useEffect, useState } from "react";
import { Moon, Shield, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "landing" | "app";
}

const ThemeToggle = ({ className, variant = "landing" }: ThemeToggleProps) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const themeOrder = ["light", "dark", "stealth"] as const;
  type ThemeName = (typeof themeOrder)[number];

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme: ThemeName = mounted
    ? theme === "system"
      ? (resolvedTheme as ThemeName) ?? "light"
      : (theme as ThemeName)
    : "light";
  const currentIndex = themeOrder.indexOf(activeTheme);
  const nextTheme: ThemeName =
    themeOrder[((currentIndex >= 0 ? currentIndex : 0) + 1) % themeOrder.length] ?? "light";

  return (
    <button
      type="button"
      className={cn(
        variant === "landing"
          ? "cursor-pointer text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-link)]"
          : "cursor-pointer text-[var(--app-muted)] transition-colors hover:text-[var(--app-text)]",
        className,
      )}
      onClick={() => setTheme(nextTheme)}
      aria-label={mounted ? `Switch to ${nextTheme} mode` : "Toggle theme"}
    >
      {mounted ? (
        nextTheme === "light" ? (
          <Sun className="h-4 w-4" />
        ) : nextTheme === "dark" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Shield className="h-4 w-4" />
        )
      ) : (
        <span className="block h-4 w-4" />
      )}
    </button>
  );
};

export default ThemeToggle;
