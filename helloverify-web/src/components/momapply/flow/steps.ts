"use client";

import { useSyncExternalStore } from "react";

import { aboutIssues, isCompany, isFullName, qualIssues, qualSlots, signIssues } from "@/lib/mom/apply/policy";
import type { ApplyStepName, Draft } from "@/lib/mom/apply/types";

/** Index 0 is the account, done before `/apply` opens. The hash is the step,
 *  so the browser's back button walks the steps. */
export const STEP_IDS = ["account", "about", "qualifications", "checks", "review", "pay"] as const;

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

export function useStepHash(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash.slice(1), () => "");
}

export function setStepHash(index: number) {
  const id = STEP_IDS[index];
  if (window.location.hash.slice(1) !== id) window.location.hash = id;
}

const ABOUT_ORDER = ["fullName", "dob", "nationality", "passportNo", "passportExpiry", "passType", "passport"] as const;
const QUAL_ORDER = ["level", "course", "institution", "country", "studentId", "start", "end"] as const;

export const fieldId = (field: string, qualId?: string) => (qualId ? `mf-${qualId}-${field}` : `mf-${field}`);
export const docId = (slot: string) => `mf-doc-${slot}`;

/** DOM ids of everything still to do on a step, in reading order. */
export function openItems(step: number, draft: Draft, now: string): string[] {
  if (step === 1) {
    const issues = aboutIssues(draft.about, draft.docs, now);
    return ABOUT_ORDER.filter((f) => issues[f]).map((f) => (f === "passport" ? docId("passport") : fieldId(f)));
  }
  if (step === 2) {
    return draft.quals.flatMap((q) => {
      const issues = qualIssues(q, draft.docs, now);
      return [
        ...QUAL_ORDER.filter((f) => issues[f]).map((f) => fieldId(f, q.id)),
        ...qualSlots(q)
          .filter((s) => issues[s.key])
          .map((s) => docId(s.key)),
      ];
    });
  }
  if (step === 4) {
    const issues = signIssues(draft);
    return (["sign", "agree"] as const).filter((f) => issues[f]).map((f) => fieldId(f));
  }
  if (step === 5) {
    const name = draft.billing.name ?? draft.about.fullName;
    const ids: string[] = [];
    if (!isFullName(name)) ids.push(fieldId("billingName"));
    if (draft.billing.company.trim() && !isCompany(draft.billing.company)) ids.push(fieldId("billingCompany"));
    return ids;
  }
  return [];
}

export const STEP_OF: Record<ApplyStepName, number> = { about: 1, qualifications: 2, review: 4, pay: 5 };

/** The furthest step the applicant may open: the first earlier step that is no
 *  longer complete (say, after an edit) holds back the ones after it. */
export function reachable(draft: Draft, now: string): number {
  for (let step = 1; step < draft.reached; step++) if (openItems(step, draft, now).length) return step;
  return draft.reached;
}
