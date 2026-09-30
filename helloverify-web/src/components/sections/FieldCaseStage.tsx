"use client";

/** The field case's scroll stage (`./FieldCase` renders the heading and the
    outro round it, and the pinned frame's markup as `./FieldCaseScene`,
    passed in as children). One address check in Foumban, told in six acts
    while the section is pinned: from orbit, the request lands and the camera
    dives to the town; the AI finds what does not fit; a local verifier walks
    to both doors; the evidence is sealed in-country; the report rises off
    the map; and the camera pulls back out to the planet.

    - **Scroll is the timeline.** The engine (`./fieldLoop`, fetched when the
      section comes near, with the map, globe and region painters) reads the
      tall `.fc-scroll` into `p`, 0-6, once a frame; everything reads `p`, so
      scrubbing back rewinds it all. It reports the act on screen, and this
      island marks the act text and the step rail to match.
    - **This island is small on purpose**: the markup is server-rendered, so
      the script here is the wiring — the act, the pause, the rail's clicks
      (one delegated handler).
    - **Motion that loops** (scan rings, halos, the spinning globe) has a
      pause (WCAG 2.2.2). Under `prefers-reduced-motion` it does not run and
      the camera does not glide; scroll still steps through the acts, since
      that motion is the reader's own.
    - **Without JS** the acts are plain text, one after another; the stage
      only takes over once `fc-live` is set.
    - The stage is `aria-hidden`: everything it shows is said in the acts. */

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

import { whenNear } from "@/lib/whenNear";

import type { LoopLabels } from "./fieldLoop";

const N = 6;

export function FieldCaseStage({ labels, children }: { labels: LoopLabels; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [act, setAct] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return whenNear(el, () => import("./fieldLoop"), (L) => L.run(el, setAct, setLive, pausedRef, labels));
  }, [labels]);

  // Mark the act on screen and the rail to match; the others leave the
  // accessibility tree while the stage is live.
  useEffect(() => {
    const el = root.current;
    if (!el || !live) return;
    el.querySelectorAll<HTMLElement>(".fc-act").forEach((n, i) => {
      n.classList.toggle("is-on", i === act);
      if (i === act) n.removeAttribute("aria-hidden");
      else n.setAttribute("aria-hidden", "true");
    });
    el.querySelectorAll<HTMLElement>(".fc-rail-b").forEach((n, i) => {
      n.classList.toggle("is-on", i === act);
      n.classList.toggle("is-done", i < act);
      if (i === act) n.setAttribute("aria-current", "step");
      else n.removeAttribute("aria-current");
    });
  }, [act, live]);

  useEffect(() => {
    pausedRef.current = paused;
    root.current?.querySelector("[data-pause]")?.setAttribute("aria-pressed", String(paused));
  }, [paused]);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-pause]")) { setPaused((v) => !v); return; }
    const go = t.closest<HTMLElement>("[data-go]");
    const sc = root.current?.querySelector<HTMLElement>(".fc-scroll");
    if (!go || !sc) return;
    const r = sc.getBoundingClientRect();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: window.scrollY + r.top + ((Number(go.dataset.go) + 0.35) / N) * (r.height - window.innerHeight), behavior: still ? "auto" : "smooth" });
  };

  return (
    // The handler only delegates clicks from the real buttons inside.
    <div ref={root} className={`fc-live-root${live ? " fc-live" : ""}${paused ? " fc-paused" : ""}`} data-act={act} onClick={onClick}>
      {children}
    </div>
  );
}
