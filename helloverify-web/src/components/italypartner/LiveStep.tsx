"use client";

import { useState } from "react";

import { fill } from "@/components/momapply/fill";
import type { ItalyPartnerCopy } from "@/lib/copy/italyPartner";

import { useAgency } from "./agency";

export function LiveStep({
  t,
  partnerId,
  onBack,
}: {
  t: ItalyPartnerCopy;
  partnerId: string;
  onBack: () => void;
}) {
  const draft = useAgency(partnerId);
  const [copied, setCopied] = useState(false);
  const code = draft?.code;

  async function copy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mf-step" aria-labelledby="ip-live-t">
      <h2 className="mf-step-t" id="ip-live-t" tabIndex={-1}>
        {t.live.title}
      </h2>
      <p className="mf-step-b ma-lede">{t.live.lede}</p>
      {draft && code ? (
        <>
          <p className="ip-who">{fill(t.live.who, { agency: draft.name, city: draft.city })}</p>
          <p className="k ip-live-k" id="ip-live-code">
            {t.live.code}
          </p>
          <div className="ip-code-row">
            <p className="ip-code" dir="ltr">
              {code}
            </p>
            <button type="button" className="btn btn-line btn-sm" onClick={() => void copy()}>
              {copied ? t.live.copied : t.live.copy}
            </button>
          </div>
        </>
      ) : null}
      <div className="mf-nav">
        <button type="button" className="btn btn-line" onClick={onBack}>
          {t.nav.back}
        </button>
      </div>
    </section>
  );
}
