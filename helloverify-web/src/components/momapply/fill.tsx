import { Fragment, type ReactNode } from "react";

import type { MomErrors } from "@/lib/copy/momApply";
import type { AccountFailure } from "@/lib/mom/account/types";

/** `"Resend in {s}s"`, `{ s: 12 }` → `"Resend in 12s"`. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

/** Same, with nodes, for a sentence that carries links. */
export function fillNodes(template: string, nodes: Record<string, ReactNode>): ReactNode {
  return template.split(/(\{\w+\})/).map((part, i) => {
    const name = /^\{(\w+)\}$/.exec(part)?.[1];
    return <Fragment key={i}>{name && name in nodes ? nodes[name] : part}</Fragment>;
  });
}

export function failureText(errors: MomErrors, failure: AccountFailure): string {
  if (failure.code === "rate_limited") return fill(errors.rate_limited, { s: failure.retryAfter ?? 30 });
  return errors[failure.code];
}

export function clock(seconds: number): string {
  const s = Math.max(0, seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
