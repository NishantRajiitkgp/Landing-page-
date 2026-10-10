"use client";

/** `/products/certifier` — the old We Verify What Matters Most tabs
 *  (`CertifierVerificationChecksSection`). The old homepage links open a tab
 *  by hash: `#certifier-verification-checks-<tab id>`. Both panels stay in
 *  the DOM (`hidden`). */
import { useEffect, useState } from "react";
import { CertifierIcon, type CertifierIconId } from "@/components/certifier/CertifierIcons";

export const CHECKS_ID = "certifier-verification-checks";

export type CheckTab = { id: string; label: string; cards: readonly { icon: CertifierIconId; t: string; p: string }[] };

export function CertifierChecks({ tabs }: { tabs: readonly CheckTab[] }) {
  const [on, setOn] = useState(tabs[0]?.id);

  useEffect(() => {
    const pick = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      const id = h.startsWith(`${CHECKS_ID}-`) ? h.slice(CHECKS_ID.length + 1) : null;
      if (id && tabs.some((t) => t.id === id)) {
        setOn(id);
        document.getElementById(CHECKS_ID)?.scrollIntoView();
      }
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, [tabs]);

  return (
    <div className="cf4-checks">
      <div className="cf4-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`cert3-tab-${t.id}`}
            aria-selected={on === t.id}
            aria-controls={`cert3-panel-${t.id}`}
            className={on === t.id ? "on" : undefined}
            onClick={() => setOn(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={`cert3-panel-${t.id}`} aria-labelledby={`cert3-tab-${t.id}`} hidden={on !== t.id}>
          <ul className="cf4-grid">
            {t.cards.map((c) => (
              <li key={c.icon}>
                <span className="glyph" aria-hidden="true">
                  <CertifierIcon id={c.icon} />
                </span>
                <h3>{c.t}</h3>
                <p>{c.p}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
