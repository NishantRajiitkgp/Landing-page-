/** httpOnly cookies for the employer account. Scoped to `/api/mom/org`, so
 *  the applicant routes never see them and pages stay static. */
import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { seal, unseal } from "@/lib/mom/account/seal";

import type { DemoOrg } from "./backend";
import type { OrgUser } from "./types";

export const ORG_SESSION_COOKIE = "hv_mom_org_session";
export const ORG_DEMO_COOKIE = "hv_mom_org_demo";
const PATH = "/api/mom/org";
const SESSION_TTL = 12 * 60 * 60;
const DEMO_TTL = 30 * 24 * 60 * 60;

export type OrgSession = { user: OrgUser };

function options(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: PATH,
    maxAge,
  };
}

export function readOrgSession(req: NextRequest, key: Buffer): OrgSession | null {
  return unseal<OrgSession>(key, "session", req.cookies.get(ORG_SESSION_COOKIE)?.value);
}

export function writeOrgSession(res: NextResponse, key: Buffer, data: OrgSession, ttl = SESSION_TTL) {
  res.cookies.set(ORG_SESSION_COOKIE, seal(key, "session", data, ttl), options(ttl));
}

export function clearOrgSession(res: NextResponse) {
  res.cookies.set(ORG_SESSION_COOKIE, "", options(0));
}

export function readOrgDemo(req: NextRequest, key: Buffer): DemoOrg[] {
  return unseal<DemoOrg[]>(key, "demo", req.cookies.get(ORG_DEMO_COOKIE)?.value) ?? [];
}

export function writeOrgDemo(res: NextResponse, key: Buffer, accounts: DemoOrg[]) {
  res.cookies.set(ORG_DEMO_COOKIE, seal(key, "demo", accounts, DEMO_TTL), options(DEMO_TTL));
}
