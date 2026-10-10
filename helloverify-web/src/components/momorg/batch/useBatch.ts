"use client";

import { BATCH_MAX, type Batch, type Candidate } from "@/lib/mom/org/batch";
import { BILLING_FIELDS, type BatchBilling } from "@/lib/mom/org/checkout";

import { deviceStore } from "./deviceStore";

/** The batch lives on the employer's device, one per account, and is posted
 *  at checkout, where the server validates it again. */
const EMPTY: Batch = { v: 1, candidates: [], reached: 1, savedAt: 0 };

const isText = (v: unknown) => typeof v === "string";

function sane(c: unknown): c is Candidate {
  if (!c || typeof c !== "object") return false;
  const x = c as Record<string, unknown>;
  return (
    isText(x.id) &&
    ["fullName", "email", "dob", "nationality", "passportNo", "passportExpiry", "passType"].every((f) => isText(x[f])) &&
    Array.isArray(x.quals) &&
    x.quals.length > 0 &&
    typeof x.acc === "boolean" &&
    typeof x.express === "boolean"
  );
}

/** Batches saved before documents existed have none. */
function docsOf(raw: unknown): Candidate["docs"] {
  if (!raw || typeof raw !== "object") return {};
  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).filter(([, d]) => {
      const x = d as Record<string, unknown> | null;
      return !!x && isText(x.id) && isText(x.name) && isText(x.type) && typeof x.size === "number";
    }),
  ) as Candidate["docs"];
}

function billingOf(raw: unknown): BatchBilling | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const x = raw as Record<string, unknown>;
  return BILLING_FIELDS.every((f) => isText(x[f])) ? (x as BatchBilling) : undefined;
}

function parse(raw: string | null): Batch {
  if (!raw) return EMPTY;
  try {
    const b = JSON.parse(raw) as Batch;
    if (b?.v !== 1 || !Array.isArray(b.candidates)) return EMPTY;
    return {
      v: 1,
      candidates: b.candidates
        .filter(sane)
        .slice(0, BATCH_MAX)
        .map((c) => ({ ...c, docs: docsOf(c.docs) })),
      reached: typeof b.reached === "number" ? b.reached : 1,
      savedAt: typeof b.savedAt === "number" ? b.savedAt : 0,
      billing: billingOf(b.billing),
    };
  } catch {
    return EMPTY;
  }
}

const useStored = deviceStore("hv-mom-batch:", parse, EMPTY);
const stamp = (b: Batch): Batch => ({ ...b, savedAt: Date.now() });

export type UpdateBatch = (change: (batch: Batch) => Batch) => void;

export function useBatch(orgUserId: string): { batch: Batch; update: UpdateBatch } {
  const [batch, update] = useStored(orgUserId, stamp);
  return { batch, update };
}

export const emptyBatch = (): Batch => ({ ...EMPTY, savedAt: Date.now() });

/** Replace one candidate by id. */
export const withCandidate = (b: Batch, id: string, change: (c: Candidate) => Candidate): Batch => ({
  ...b,
  candidates: b.candidates.map((c) => (c.id === id ? change(c) : c)),
});
