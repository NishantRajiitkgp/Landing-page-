"use client";

import { useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { CmsTrack } from "@/components/contact/CmsTrack";
import type { ContactCms } from "@/lib/contact/cms";
import type { ContactCopy } from "@/lib/copy/contact";
import { parseContactTab, writeContactTab, type ContactTab } from "@/lib/contact/tab";

export function ContactTabs({
  locale,
  tabs,
  track,
  honest,
  initial,
  children,
}: {
  locale: string;
  tabs: ContactCopy["tabs"];
  track: ContactCms["track"];
  honest: ContactCopy["track"];
  initial: ContactTab;
  children: ReactNode;
}) {
  const [tab, setTab] = useState<ContactTab>(initial);

  function go(next: ContactTab) {
    setTab(next);
    writeContactTab(next);
  }

  return (
    <div>
      <div className="ct-tabs" role="tablist" aria-label={tabs.aria}>
        <button type="button" role="tab" aria-selected={tab === "enquiry"} className={`seg${tab === "enquiry" ? " on" : ""}`} onClick={() => go("enquiry")}>
          {tabs.enquiry}
        </button>
        <button type="button" role="tab" aria-selected={tab === "track"} className={`seg${tab === "track" ? " on" : ""}`} onClick={() => go("track")}>
          {tabs.track}
        </button>
      </div>
      <div hidden={tab !== "enquiry"}>{children}</div>
      <div hidden={tab !== "track"}>
        <CmsTrack locale={locale} track={track} honest={honest} onEnquiry={() => go("enquiry")} />
      </div>
    </div>
  );
}

export function ContactTabsBound(props: Omit<React.ComponentProps<typeof ContactTabs>, "initial">) {
  const tab = useSearchParams().get("tab");
  return <ContactTabs {...props} initial={parseContactTab(tab)} />;
}
