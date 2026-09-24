"use client";

/** The auto-advancing card deck of the v2 "Why governments" band
 *  (`./Why.tsx`). The cards themselves are server-rendered and arrive as
 *  `cards`; this island owns only which card is in front and whether the
 *  deck is moving.
 *
 *  THE PROGRESS BAR IS THE CLOCK. The deck advances on the current bar's
 *  `animationend`, not on a `setInterval`. The board ran a 3.6s interval
 *  beside a 3.6s bar and skipped a tick while hovered, so after a hover the
 *  bar and the card drifted apart by up to a whole period. With the bar as
 *  the clock, every reason to hold — pointer over the deck, keyboard focus
 *  inside it, the pause button, the deck scrolled out of view — is one
 *  `animation-play-state: paused`, and the bar resumes exactly where it
 *  stopped. Under `prefers-reduced-motion` the bar does not animate, so the
 *  deck does not advance on its own; the bars still pick a card.
 *
 *  HYDRATION. The server renders card one in front with its bar empty and
 *  still; the bar starts (`wy-run`) only after mount, so nothing about the
 *  first paint depends on time.
 *
 *  WCAG 2.2.2: it moves for longer than five seconds, so it has a pause
 *  button, the hero's pattern and labels. Cards behind the front one are
 *  `inert` — out of the tab order and the accessibility tree — rather than
 *  `aria-hidden`, which would leave their links focusable. The deck is a
 *  polite live region only while it is not rotating on its own, so a screen
 *  reader hears a card the user chose and is not interrupted every 3.6s.
 *
 *  TOUCH. A sideways swipe on the deck turns it — toward the inline start
 *  for the next card, so it mirrors under `dir="rtl"` — and a tap on the
 *  front card's drawing turns it forward. The deck is `touch-action: pan-y`
 *  (`why.css`), so a vertical drag still scrolls the page and cancels the
 *  gesture. The eight progress bars remain the keyboard and screen-reader
 *  route; the swipe and the tap are shortcuts, not the only way. Mouse drags
 *  are ignored: they would fight text selection on desktop. */

import { useEffect, useRef, useState, type ReactNode } from "react";

export function WhyDeck({
  cards,
  tints,
  label,
  cardOf,
  pauseLabel,
  playLabel,
}: {
  cards: ReactNode[];
  tints: string[];
  label: string;
  cardOf: string;
  pauseLabel: string;
  playLabel: string;
}) {
  const n = cards.length;
  const ref = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(0);
  const [run, setRun] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Deferred a frame so the bar's first paint is the empty one the server
    // sent, then the animation starts from it.
    const raf = requestAnimationFrame(() => setRun(!reduce));
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return () => cancelAnimationFrame(raf);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const hold = hover || focus || paused || !inView;
  const rotating = run && !hold;

  const turn = (by: number) => setNow((i) => (i + by + n) % n);

  const pos = (k: number) => {
    const rel = (k - now + n) % n;
    return rel === 0 ? "wy-p0" : rel === 1 ? "wy-p1" : rel === 2 ? "wy-p2" : rel === n - 1 ? "wy-px" : "wy-ph";
  };

  return (
    <div
      ref={ref}
      className={["wy-deck-w", run && "wy-run", hold && "wy-hold", paused && "wy-paused"].filter(Boolean).join(" ")}
    >
      <div
        className="wy-deck"
        role="region"
        aria-label={label}
        aria-live={rotating ? "off" : "polite"}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onPointerDown={(e) => {
          swipe.current = e.pointerType === "mouse" ? null : { x: e.clientX, y: e.clientY };
        }}
        onPointerCancel={() => {
          swipe.current = null;
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          // 40px, and more sideways than down: a swipe, not a wobbly scroll.
          if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(e.clientY - s.y)) return;
          const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
          turn((dx < 0) !== rtl ? 1 : -1);
        }}
        onClick={(e) => {
          if ((e.target as Element).closest(".wy-p0 .wy-vis")) turn(1);
        }}
        onFocus={() => setFocus(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false);
        }}
      >
        {cards.map((card, k) => (
          <div key={k} className={`wy-card wy-${tints[k]} ${pos(k)}`} inert={k !== now}>
            {card}
          </div>
        ))}
      </div>
      <div className="wy-nav">
        <span className="wy-k">{label}</span>
        <div className="wy-ctl">
          <button
            type="button"
            className="wy-motion"
            aria-pressed={paused}
            aria-label={paused ? playLabel : pauseLabel}
            onClick={() => setPaused((p) => !p)}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              {paused ? (
                <path d="M2.5 1.5v7l6-3.5z" fill="currentColor" />
              ) : (
                <path d="M2.5 1.5v7M7.5 1.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
          <div className="wy-bars-n">
            {cards.map((_, k) => (
              <button
                key={k}
                type="button"
                className={`wy-b${k === now ? " wy-now" : k < now ? " wy-done" : ""}`}
                aria-label={cardOf.replace("{k}", String(k + 1)).replace("{n}", String(n))}
                aria-current={k === now ? "true" : undefined}
                onClick={() => setNow(k)}
                onAnimationEnd={k === now ? () => setNow((i) => (i + 1) % n) : undefined}
              >
                <i />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
