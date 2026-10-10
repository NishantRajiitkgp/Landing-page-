/** Application and payment references. Ambiguous glyphs (0, O, 1, I) are
 *  left out so an id read off a phone can be typed back. */
import { randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function token(bytes: number): string {
  return [...randomBytes(bytes)].map((b) => ALPHABET[b % ALPHABET.length]).join("");
}

export function newCaseId(now = new Date()): string {
  return `HV-${String(now.getUTCFullYear()).slice(2)}-${token(6)}`;
}

export function newReference(): string {
  return `P-${token(8)}`;
}

/** An employer batch; each candidate in it gets a `newCaseId`. */
export function newBatchId(now = new Date()): string {
  return `HVB-${String(now.getUTCFullYear()).slice(2)}-${token(6)}`;
}
