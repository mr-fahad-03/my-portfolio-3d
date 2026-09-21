"use client";

import { useEffect, useState } from "react";

type State = "idle" | "copied" | "failed";

/** Legacy path for browsers/contexts that refuse the async clipboard API. */
function legacyCopy(text: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

/** The email as a mailto link, with a copy button that confirms — or reports failure — in place. */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 1800);
    return () => window.clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState(legacyCopy(email) ? "copied" : "failed");
    }
  }

  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-3">
      <a href={`mailto:${email}`} className="link-inline font-mono text-sm font-medium">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="inline-flex min-h-9 items-center rounded-sm border border-border px-2.5 font-mono text-label font-medium text-text-muted transition-[color,border-color,background-color] hover:border-accent hover:text-accent"
      >
        {state === "copied" ? "Copied ✓" : state === "failed" ? "Couldn't copy" : "Copy"}
      </button>
    </span>
  );
}
