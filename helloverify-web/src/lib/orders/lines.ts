/** How the old Orders page split travel vs SMB and listed people. */

import type { OrderCartItem, OrderRow } from "./types";

export function getOrderDisplayLines(order: OrderRow): OrderCartItem[] {
  const seen = new Set<string>();
  const out: OrderCartItem[] = [];
  for (const line of [...(order.user_card ?? []), ...(order.cart_items ?? [])]) {
    const key = line.uuid ?? `${line.check_code ?? ""}-${line.package ?? ""}-${out.length}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out;
}

export function isTravelLine(line: OrderCartItem): boolean {
  const type = String(line.package_type ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  return type === "aitravelassistance";
}

export function linePersonCount(line: OrderCartItem): number {
  return Number(line.persons ?? line.unit_count ?? line.quantity ?? 1) || 1;
}

export function isSmbInviteSuccess(res: {
  status?: boolean | number;
  message?: string;
  ci_response?: { status?: number };
} | undefined): boolean {
  if (!res) return false;
  if (res.ci_response?.status === 200) return true;
  return res.status === true || res.status === 200;
}
