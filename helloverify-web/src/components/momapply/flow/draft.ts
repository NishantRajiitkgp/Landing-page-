"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

import type { Applicant } from "@/lib/mom/account/types";
import { blankQual } from "@/lib/mom/apply/policy";
import type { Draft } from "@/lib/mom/apply/types";

/** The draft lives on the applicant's device, one per account, and is posted
 *  whole at submission, where the server validates it again. `memory` covers
 *  browsers that refuse storage (private mode, quota). */
const PREFIX = "hv-mom-draft:";
const memory = new Map<string, string>();
const listeners = new Set<() => void>();
let cache: { key: string; raw: string | null; draft: Draft | null } | null = null;

function parse(raw: string | null): Draft | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Draft;
    if (d?.v !== 1 || !Array.isArray(d.quals) || d.quals.length === 0) return null;
    const billing = d.billing;
    return {
      ...d,
      sign: { name: d.sign?.name ?? "", agreed: d.sign?.agreed === true },
      billing: {
        name: billing && (typeof billing.name === "string" || billing.name === null) ? billing.name : null,
        company: billing && typeof billing.company === "string" ? billing.company : "",
      },
    };
  } catch {
    return null;
  }
}

function readRaw(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function read(id: string): Draft | null {
  const key = PREFIX + id;
  const raw = readRaw(key);
  if (cache?.key === key && cache.raw === raw) return cache.draft;
  cache = { key, raw, draft: parse(raw) };
  return cache.draft;
}

function write(id: string, draft: Draft) {
  const key = PREFIX + id;
  const raw = JSON.stringify(draft);
  memory.set(key, raw);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    /* memory keeps it for this tab */
  }
  cache = { key, raw, draft };
  listeners.forEach((l) => l());
}

export function forgetDraft(id: string) {
  const key = PREFIX + id;
  memory.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* already unreachable */
  }
  if (cache?.key === key) cache = null;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function fresh(applicant: Applicant): Draft {
  return {
    v: 1,
    about: {
      fullName: `${applicant.first} ${applicant.last}`.trim(),
      dob: "",
      nationality: "",
      passportNo: "",
      passportExpiry: "",
      passType: "",
    },
    quals: [blankQual()],
    docs: {},
    express: false,
    sign: { name: "", agreed: false },
    billing: { name: null, company: "" },
    reached: 1,
    savedAt: 0,
  };
}

export type UpdateDraft = (change: (draft: Draft) => Draft) => void;

export function useDraft(applicant: Applicant): { draft: Draft; update: UpdateDraft } {
  const stored = useSyncExternalStore(subscribe, () => read(applicant.id), () => null);
  const [initial] = useState(() => fresh(applicant));
  const update = useCallback<UpdateDraft>(
    (change) => write(applicant.id, { ...change(read(applicant.id) ?? initial), savedAt: Date.now() }),
    [applicant.id, initial],
  );
  return { draft: stored ?? initial, update };
}
