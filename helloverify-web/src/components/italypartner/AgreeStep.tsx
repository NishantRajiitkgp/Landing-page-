"use client";

import { useState } from "react";

import { fill } from "@/components/momapply/fill";
import { TickIcon } from "@/components/momapply/icons";
import type { ItalyPartnerCopy } from "@/lib/copy/italyPartner";
import { en } from "@/lib/copy/italyPartner.en";
import { agreementPdf, downloadAgreement } from "@/lib/italy/partner/agreement-pdf";

import { markSigned, saveAgreement, useAgency } from "./agency";
import { PartnerDoc } from "./PartnerDoc";

const FILE = "HelloVerify-partner-agreement.pdf";

export function AgreeStep({
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
  const signed = draft?.signed === true;
  const waiting = signed && !draft?.live;
  const letter = t.agree.letter;

  function download() {
    if (!draft) return;
    const source = en.agree.letter;
    downloadAgreement(
      FILE,
      agreementPdf({
        k: source.k,
        parties: fill(source.parties, { agency: draft.name, city: draft.city }),
        with: source.with,
        lines: source.lines,
        sign: source.sign,
        stamp: source.stamp,
      }),
    );
  }

  function go() {
    setTried(true);
    if (!draft?.agreement) {
      document.getElementById("ip-doc-agreement")?.focus();
      return;
    }
    markSigned(partnerId, demo);
    if (demo) onContinue();
  }

  return (
    <section className="mf-step" aria-labelledby="ip-agree-t">
      <h2 className="mf-step-t" id="ip-agree-t" tabIndex={-1}>
        {t.agree.title}
      </h2>
      <p className="mf-step-b ma-lede">{t.agree.lede}</p>
      {draft ? (
        <article className="ip-letter">
          <p className="k">{letter.k}</p>
          <h3>{fill(letter.parties, { agency: draft.name, city: draft.city })}</h3>
          <p className="who">{letter.with}</p>
          <ol>
            {letter.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          <div className="ip-sign">
            <p>
              <i />
              <span>{letter.sign}</span>
            </p>
            <p>
              <i />
              <span>{letter.stamp}</span>
            </p>
          </div>
        </article>
      ) : null}
      <p className="ip-dl">
        <button type="button" className="btn btn-line btn-sm" onClick={download}>
          {t.agree.download}
        </button>
      </p>
      <PartnerDoc
        slot="agreement"
        doc={draft?.agreement ?? null}
        label={t.agree.upload}
        hint={t.agree.hint}
        error={tried && !draft?.agreement ? t.agree.missing : null}
        locale={locale}
        t={t}
        onChange={(doc) => saveAgreement(partnerId, doc)}
      />
      {waiting ? (
        <p className="ip-hold">
          <TickIcon />
          {t.agree.pending}
        </p>
      ) : signed ? (
        <p className="ip-hold">
          <TickIcon />
          {t.agree.received}
        </p>
      ) : null}
      <div className="mf-nav">
        <button type="button" className="btn btn-line" onClick={onBack}>
          {t.nav.back}
        </button>
        <span className="mf-saved" />
        {!signed || (demo && waiting) ? (
          <button type="button" className="btn btn-ink mf-next" onClick={go}>
            {t.nav.next}
          </button>
        ) : null}
      </div>
    </section>
  );
}
