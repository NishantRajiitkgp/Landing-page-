"use client";

import { useRef, useState } from "react";

import { Select } from "@/components/momapply/flow/Fields";
import { formatDate, localDay } from "@/components/momapply/flow/format";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";

import { Invoice } from "./Invoice";
import { LoaCases } from "./LoaCases";
import { printOnly } from "./printOnly";
import type { Held } from "./usePaid";

/** A paid batch: its id, who has signed their letter, and the invoice. */
export function BatchPaid({ held, onNew, t, s, locale }: { held: Held[]; onNew: () => void; t: MomOrgCopy; s: MomStepsCopy; locale: string }) {
  const p = t.paid;
  const [pick, setPick] = useState(held[0].batch.id);
  const shown = held.find((h) => h.batch.id === pick) ?? held[0];
  const { batch, receipt } = shown;
  const invoice = useRef<HTMLDivElement>(null);

  return (
    <section className="mf-done mo-paid" aria-labelledby="mo-paid-id">
      <div className="mo-paid-top">
        <p className="k">{p.k}</p>
        {held.length > 1 ? (
          <Select id="mo-paid-pick" label={p.batches} value={batch.id} onChange={setPick} placeholder={p.batches}>
            {held.map((h) => (
              <option key={h.batch.id} value={h.batch.id}>
                {`${h.batch.id} · ${formatDate(localDay(h.batch.paidAt), locale)}`}
              </option>
            ))}
          </Select>
        ) : null}
      </div>
      <h2 className="mf-id" id="mo-paid-id" tabIndex={-1}>
        <bdi dir="ltr">{batch.id}</bdi>
      </h2>
      <p className="ma-lede">{p.lede}</p>
      <LoaCases key={batch.id} batch={batch} receipt={receipt} t={t} s={s} locale={locale} />
      <div className="mo-paid-a">
        <button type="button" className="btn btn-ink btn-sm" onClick={() => printOnly(invoice.current)}>
          {p.print}
        </button>
        <button type="button" className="btn btn-line btn-sm" onClick={onNew}>
          {p.again}
        </button>
      </div>
      <div ref={invoice} className="mo-paid-inv">
        <Invoice batch={batch} t={t} s={s} locale={locale} />
      </div>
    </section>
  );
}
