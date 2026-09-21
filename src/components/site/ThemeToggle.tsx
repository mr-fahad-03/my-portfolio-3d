"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function applyTheme(next: Theme) {
  if (next === "light") document.documentElement.setAttribute("data-theme", "light");
  else document.documentElement.removeAttribute("data-theme");
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* private mode: works for this page view only */
  }
}

/** Dark is the default; the choice persists. Renders an empty slot until hydrated. */
export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={() => applyTheme(getTheme() === "light" ? "dark" : "light")}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className="inline-flex size-11 items-center justify-center rounded-sm text-text transition-colors hover:bg-accent-subtle hover:text-accent"
    >
      {theme === null ? (
        <span className="size-5" aria-hidden="true" />
      ) : isLight ? (
        <Moon size={18} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Sun size={18} strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}
