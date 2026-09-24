"use client";

/** The giant engraved wordmark at the foot of every page (homepage v2,
    desktop), and the UV lamp that follows the pointer over it.

    The same mechanism as the hero's lamp (`sections/HeroStage.tsx`): pointer
    position goes to `--mx`/`--my` and visibility to `--uv` through
    `style.setProperty`, so a mouse move is CSSOM, not a React render. The
    artwork itself is server markup passed in as children. Decorative
    throughout, so the whole mark is `aria-hidden` at the call site. */

import { useCallback, useRef, type MouseEvent, type ReactNode } from "react";

export function FooterMark({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
    el.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
    el.style.setProperty("--uv", "1");
  }, []);

  const onLeave = useCallback(() => {
    ref.current?.style.setProperty("--uv", "0");
  }, []);

  return (
    <div ref={ref} className="fz-mark" aria-hidden="true" onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
