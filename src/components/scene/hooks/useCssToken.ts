"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/**
 * Reads a CSS custom property from <html>, re-reading when data-theme
 * changes, so scene colours always come from the token layer.
 */
export function useCssToken(name: string, fallback: string): string {
  const getSnapshot = useCallback(
    () => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback,
    [name, fallback],
  );
  return useSyncExternalStore(subscribeToTheme, getSnapshot, () => fallback);
}
