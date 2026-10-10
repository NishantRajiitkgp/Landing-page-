"use client";

import { fill } from "@/components/momapply/fill";
import { DocSlot } from "@/components/momapply/flow/DocSlot";
import { TickIcon } from "@/components/momapply/icons";
import type { MomErrors } from "@/lib/copy/momApply";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { PASSPORT_SLOT, qualSlots, type Slot } from "@/lib/mom/apply/policy";
import type { DocRef, Qual } from "@/lib/mom/apply/types";
import { missingSlots, type Candidate } from "@/lib/mom/org/batch";
import { uploadCandidateDoc } from "@/lib/mom/org/batchClient";

export const slotDomId = (candidate: string, slot: string) => `mo-doc-${candidate}-${slot.replace(":", "-")}`;
export const cardId = (candidate: string) => `mo-dc-${candidate}`;

export function qualName(q: Qual, n: number, s: MomStepsCopy, t: MomOrgCopy): string {
  return [q.level ? s.quals.levels[q.level] : "", q.institution.trim()].filter(Boolean).join(" · ") || fill(t.docs.qual, { n });
}

/** One candidate's documents: the passport, then each qualification's set. */
export function DocCard({
  c,
  n,
  open,
  onToggle,
  onDoc,
  tried,
  t,
  s,
  errors,
  locale,
}: {
  c: Candidate;
  n: number;
  open: boolean;
  onToggle: () => void;
  onDoc: (slot: string, doc: DocRef | null) => void;
  tried: boolean;
  t: MomOrgCopy;
  s: MomStepsCopy;
  errors: MomErrors;
  locale: string;
}) {
  const left = missingSlots(c).length;
  const slot = (x: Slot) => (
    <DocSlot
      key={x.key}
      slot={x}
      doc={c.docs[x.key]}
      fieldId={slotDomId(c.id, x.key)}
      upload={(file, key, progress) => uploadCandidateDoc(c.id, file, key, progress)}
      onChange={(doc) => onDoc(x.key, doc)}
      t={s.docs}
      optional={s.nav.optional}
      issues={s.issues}
      errors={errors}
      error={tried && x.required && !c.docs[x.key] ? s.issues.doc : null}
      locale={locale}
    />
  );

  return (
    <section className={`mf-qual mo-dcard${open ? " is-open" : ""}`} aria-labelledby={`${c.id}-dh`}>
      <header className="mf-qual-h">
        <button type="button" className="mf-qual-tog" id={cardId(c.id)} aria-expanded={open} aria-controls={`${c.id}-db`} onClick={onToggle}>
          <span className="mf-qual-n">{String(n).padStart(2, "0")}</span>
          <span className="mo-dcard-who" id={`${c.id}-dh`}>
            <b>{c.fullName.trim() || t.batch.unnamed}</b>
            {c.passportNo ? <small dir="ltr">{c.passportNo}</small> : null}
          </span>
          <span className={`mf-qual-st${left ? "" : " is-ok"}`}>
            {left ? fill(t.docs.left, { n: left }) : <TickIcon />}
            {left ? null : t.docs.complete}
          </span>
        </button>
      </header>
      <div className="mf-qual-b" id={`${c.id}-db`} hidden={!open}>
        {open ? (
          <>
            {slot(PASSPORT_SLOT)}
            {c.quals.map((q, i) => (
              <div className="mo-dgroup" key={q.id}>
                <p className="mo-dgroup-t">
                  <span className="mf-qual-n">{String(i + 1).padStart(2, "0")}</span>
                  {qualName(q, i + 1, s, t)}
                </p>
                {qualSlots(q).map(slot)}
              </div>
            ))}
          </>
        ) : null}
      </div>
    </section>
  );
}
