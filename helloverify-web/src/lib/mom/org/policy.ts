/** Organisation fields. Pure, so the browser checks what the server enforces. */
import type { OrgKind } from "./types";

export const ORG_MAX = 120;
export const REG_MAX = 24;
export const ORG_KINDS: readonly OrgKind[] = ["employer", "agency"];

export function tidy(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function isOrgName(value: string): boolean {
  const name = tidy(value);
  return name.length >= 2 && name.length <= ORG_MAX && /\p{L}/u.test(name);
}

/** UEN, CIN, company number: letters, digits and the usual separators. */
export function isRegNo(value: string): boolean {
  const reg = tidy(value);
  return reg === "" || /^[A-Za-z0-9][A-Za-z0-9 ./-]{2,23}$/.test(reg);
}

export function isOrgKind(value: unknown): value is OrgKind {
  return ORG_KINDS.includes(value as OrgKind);
}
