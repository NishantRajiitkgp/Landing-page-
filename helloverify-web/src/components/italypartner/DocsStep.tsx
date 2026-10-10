"use client";

import { useState } from "react";

import { TickIcon } from "@/components/momapply/icons";
import type { ItalyPartnerCopy } from "@/lib/copy/italyPartner";

import { DOC_SLOTS, REQUIRED_DOCS, docsReady, markSent, saveDoc, useAgency, type DocSlot } from "./agency";
import { PartnerDoc } from "./PartnerDoc";

export function DocsStep({
  t,
  locale,
  partnerId,
  demo,
  onBack,
  onContinue,
}: {
  t: ItalyPartnerCopy;
  locale: string;
  partnerId: string;
  demo: boolean;
  onBack: () => void;
  onContinue: () => void;
}) {
  const draft = useAgency(partnerId);
  const [tried, setTried] = useState(false);
  const docs = draft?.docs;
  const sent = draft?.sent === true;
  const waiting = sent && !draft?.cleared;

  function go() {
    setTried(true);
    if (!docs || !docsReady(docs)) {
      const missing = REQUIRED_DOCS.find((slot) => !docs?.[slot]);
      if (missing) document.getElementById(`ip-doc-${missing}`)?.focus();
      return;
    }
    markSent(partnerId, demo);
    if (demo) onContinue();
  }

  return (
    <section className="mf-step" aria-labelledby="ip-docs-t">
      <h2 className="mf-step-t" id="ip-docs-t" tabIndex={-1}>
        {t.docs.title}
      </h2>
      <p className="mf-step-b ma-lede">{t.docs.lede}</p>
      <div className="mf-docs">
        {DOC_SLOTS.map((slot) => (
          <PartnerDoc
            key={slot}
            slot={slot}
            doc={docs?.[slot] ?? null}
            label={t.docs[slot]}
            hint={t.docs.hints[slot]}
            optional={slot === "gst" ? t.docs.optional : undefined}
            error={tried && (REQUIRED_DOCS as readonly DocSlot[]).includes(slot) && !docs?.[slot] ? t.docs.missing : null}
            locale={locale}
            t={t}
            onChange={(doc) => saveDoc(partnerId, slot, doc)}
          />
        ))}
      </div>
      {waiting ? (
        <p className="ip-hold">
          <TickIcon />
          {t.docs.hold}
        </p>
      ) : null}
      <div className="mf-nav">
        <button type="button" className="btn btn-line" onClick={onBack}>
          {t.nav.back}
        </button>
        <span className="mf-saved" />
        {!sent || (demo && waiting) ? (
          <button type="button" className="btn btn-ink mf-next" onClick={go}>
            {t.nav.next}
          </button>
        ) : null}
      </div>
    </section>
  );
}
