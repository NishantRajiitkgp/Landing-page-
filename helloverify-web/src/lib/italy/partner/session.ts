/** httpOnly cookies for the Italy partner. Scoped to `/api/italy`, so pages
 *  stay static and only the API sees them. */
import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { seal, unseal } from "@/lib/mom/account/seal";

import type { DemoAccount } from "./backend";
import type { Partner } from "./types";

export const SESSION_COOKIE = "hv_it_partner_session";
export const DEMO_COOKIE = "hv_it_partner_demo";
const PATH = "/api/italy";
const SESSION_TTL = 12 * 60 * 60;
const DEMO_TTL = 30 * 24 * 60 * 60;

export type SessionData = { partner: Partner };

function options(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: PATH,
    maxAge,
  };
}

export function readSession(req: NextRequest, key: Buffer): SessionData | null {
  return unseal<SessionData>(key, "session", req.cookies.get(SESSION_COOKIE)?.value);
}

export function writeSession(res: NextResponse, key: Buffer, data: SessionData, ttl = SESSION_TTL) {
  res.cookies.set(SESSION_COOKIE, seal(key, "session", data, ttl), options(ttl));
}

export function clearSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", options(0));
}

export function readDemo(req: NextRequest, key: Buffer): DemoAccount[] {
  return unseal<DemoAccount[]>(key, "demo", req.cookies.get(DEMO_COOKIE)?.value) ?? [];
}

export function writeDemo(res: NextResponse, key: Buffer, accounts: DemoAccount[]) {
  res.cookies.set(DEMO_COOKIE, seal(key, "demo", accounts, DEMO_TTL), options(DEMO_TTL));
}
