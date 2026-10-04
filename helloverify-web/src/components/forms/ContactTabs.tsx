"use client";

import { useEffect, useState, type ReactNode } from "react";

import { ContactTrackForm } from "@/components/forms/ContactTrackForm";
import type { ContactCopy } from "@/lib/copy/contact";
import { parseContactTab, writeContactTab, type ContactTab } from "@/lib/contact/tab";

/** Old `?tab=enquiry` / `?tab=track`. The page stays statically prerendered:
 *  the query is read after mount, the same way `ContactForm` reads `?interest=`. */
export function ContactTabs({
  locale,
  tabs,
  track,
  children,
}: {
  locale: string;
  tabs: ContactCopy["tabs"];
  track: ContactCopy["track"];
  children: ReactNode;
}) {
  const [tab, setTab] = useState<ContactTab>("enquiry");

  useEffect(() => {
    setTab(parseContactTab(new URLSearchParams(window.location.search).get("tab")));
  }, []);

  function go(next: ContactTab) {
    setTab(next);
    writeContactTab(next);
  }

  return (
    <div>
      <div className="ct-tabs" role="tablist" aria-label={tabs.aria}>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "enquiry"}
          className={`seg${tab === "enquiry" ? " on" : ""}`}
          onClick={() => go("enquiry")}
        >
          {tabs.enquiry}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "track"}
          className={`seg${tab === "track" ? " on" : ""}`}
          onClick={() => go("track")}
        >
          {tabs.track}
        </button>
      </div>
      {tab === "track" ? (
        <ContactTrackForm locale={locale} t={track} onEnquiry={() => go("enquiry")} />
      ) : (
        children
      )}
    </div>
  );
}
