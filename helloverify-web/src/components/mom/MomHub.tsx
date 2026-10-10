"use client";

import { Children, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Tab = { id: string; label: string };

export function MomHub({
  tabs,
  initial,
  hero,
  children,
  className = "mom3",
}: {
  tabs: readonly Tab[];
  initial: string | null;
  hero: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const start = Math.max(0, tabs.findIndex((tab) => tab.id === initial));
  const [on, setOn] = useState(start);
  const panels = Children.toArray(children);
  const anchor = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  /** The tab bar is sticky, so a tab picked from deep inside a long panel
   *  would otherwise open the next one at the old scroll depth. */
  function select(index: number) {
    setOn(index);
    const top = anchor.current?.getBoundingClientRect().top;
    if (top !== undefined && top < 0) window.scrollTo({ top: window.scrollY + top });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[event.key];
    const index =
      event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : step ? (on + step + tabs.length) % tabs.length : -1;
    if (index < 0) return;
    event.preventDefault();
    select(index);
    list.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[index]?.focus();
  }

  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor) return;
    const url = new URL(anchor.href, window.location.origin);
    if (url.origin !== window.location.origin) return;
    const id = url.searchParams.get("momTab");
    const index = tabs.findIndex((tab) => tab.id === id);
    if (index < 0) return;
    event.preventDefault();
    setOn(index);
    const hash = url.hash.slice(1);
    if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }));
  }

  return (
    <div className={className} onClick={onClick}>
      {hero}
      <div ref={anchor} aria-hidden="true" />
      <div className="wrap mom3-tabbar">
        <div className="mom3-tabs" role="tablist" ref={list} onKeyDown={onKeyDown}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={index === on}
              tabIndex={index === on ? 0 : -1}
              onClick={() => select(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {panels.map((panel, index) => (
        <div key={index} className="mom3-panel" hidden={index !== on}>
          {panel}
        </div>
      ))}
    </div>
  );
}

export function MomHubBound(props: Omit<React.ComponentProps<typeof MomHub>, "initial">) {
  const tab = useSearchParams().get("momTab");
  return <MomHub {...props} initial={tab} />;
}
