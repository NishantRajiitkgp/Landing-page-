"use client";

import type { PaidBatch } from "@/lib/mom/org/checkout";

import { deviceStore } from "./deviceStore";

/** Paid batches, newest first. `receipt` is the server's sealed copy, shown
 *  back to it for anything done on the batch later. */
export type Held = { batch: PaidBatch; receipt: string };

const KEEP = 20;
const NONE: Held[] = [];

function parse(raw: string | null): Held[] {
  if (!raw) return NONE;
  try {
    const list = JSON.parse(raw) as Held[];
    if (!Array.isArray(list)) return NONE;
    return list
      .filter(
        (h) =>
          typeof h?.receipt === "string" &&
          typeof h.batch?.id === "string" &&
          Array.isArray(h.batch.lines) &&
          Array.isArray(h.batch.cases) &&
          h.batch.cases.every((c) => Array.isArray(c?.quals)),
      )
      .slice(0, KEEP);
  } catch {
    return NONE;
  }
}

const useStored = deviceStore("hv-mom-paid:", parse, NONE);

export function forgetPaid(orgUserId: string) {
  useStored.forget(orgUserId);
}

export function usePaid(orgUserId: string) {
  const [held, update] = useStored(orgUserId);
  const add = (h: Held) => update((list) => [h, ...list.filter((x) => x.batch.id !== h.batch.id)].slice(0, KEEP));
  return { held, add };
}
