"use client";

import { Children, useState } from "react";
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
      <div className="wrap mom3-tabbar">
        <div className="mom3-tabs" role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={index === on}
              onClick={() => setOn(index)}
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
