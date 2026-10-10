"use client";

import { useState } from "react";

import type { MomErrors } from "@/lib/copy/momApply";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { blankQual, MAX_QUALS, qualIssues } from "@/lib/mom/apply/policy";
import type { Draft, Qual } from "@/lib/mom/apply/types";

import { PlusIcon } from "../icons";
import type { UpdateDraft } from "./draft";
import { QualCard } from "./QualCard";
import { fieldId } from "./steps";

/** One card per qualification, one open at a time. After a failed Continue
 *  every card with something left opens, so nothing is hidden. */
export function QualStep({
  draft,
  update,
  s,
  errors,
  locale,
  now,
  tried,
}: {
  draft: Draft;
  update: UpdateDraft;
  s: MomStepsCopy;
  errors: MomErrors;
  locale: string;
  now: string;
  tried: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(() => {
    const first = draft.quals.find((q) => Object.keys(qualIssues(q, draft.docs, now)).length);
    return (first ?? draft.quals[0])?.id ?? null;
  });

  const patch = (id: string, change: Partial<Qual>) =>
    update((d) => ({ ...d, quals: d.quals.map((q) => (q.id === id ? { ...q, ...change } : q)) }));

  function add() {
    const q = blankQual();
    update((d) => ({ ...d, quals: [...d.quals, q] }));
    setOpenId(q.id);
    window.requestAnimationFrame(() => document.getElementById(fieldId("level", q.id))?.focus());
  }

  function remove(id: string) {
    update((d) => ({
      ...d,
      quals: d.quals.filter((q) => q.id !== id),
      docs: Object.fromEntries(Object.entries(d.docs).filter(([slot]) => !slot.startsWith(`${id}:`))),
    }));
  }

  return (
    <div className="mf-quals">
      {draft.quals.map((q, i) => {
        const pending = tried && Object.keys(qualIssues(q, draft.docs, now)).length > 0;
        return (
          <QualCard
            key={q.id}
            q={q}
            n={i + 1}
            docs={draft.docs}
            open={openId === q.id || pending}
            onOpen={() => setOpenId(q.id)}
            onClose={() => setOpenId(null)}
            onChange={(change) => patch(q.id, change)}
            onDoc={(slot, doc) =>
              update((d) => {
                const docs = { ...d.docs };
                if (doc) docs[slot] = doc;
                else delete docs[slot];
                return { ...d, docs };
              })
            }
            onRemove={draft.quals.length > 1 ? () => remove(q.id) : null}
            s={s}
            errors={errors}
            locale={locale}
            now={now}
            tried={tried}
          />
        );
      })}
      {draft.quals.length < MAX_QUALS ? (
        <button type="button" className="mf-add" onClick={add}>
          <PlusIcon />
          {s.quals.add}
        </button>
      ) : null}
    </div>
  );
}
