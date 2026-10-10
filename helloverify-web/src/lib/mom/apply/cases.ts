/** Paid applications, one per applicant, in a sealed cookie. Demo storage:
 *  the live track API does not exist yet, and the cookie keeps a receipt the
 *  browser cannot forge or edit. */
import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { seal, unseal } from "../account/seal";
import type { CaseFile } from "./types";

export const CASE_COOKIE = "hv_mom_case";
const PATH = "/api/mom";
const TTL = 30 * 24 * 60 * 60;
const KEEP = 4;

type Stored = { applicantId: string; file: CaseFile };

function options(maxAge: number) {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: PATH, maxAge };
}

export function readCases(req: NextRequest, key: Buffer): Stored[] {
  const all = unseal<Stored[]>(key, "case", req.cookies.get(CASE_COOKIE)?.value);
  return Array.isArray(all) ? all.filter((c) => c && typeof c.applicantId === "string" && c.file?.currency === "SGD") : [];
}

export function writeCases(res: NextResponse, key: Buffer, cases: Stored[]) {
  res.cookies.set(CASE_COOKIE, seal(key, "case", cases.slice(-KEEP), TTL), options(TTL));
}
