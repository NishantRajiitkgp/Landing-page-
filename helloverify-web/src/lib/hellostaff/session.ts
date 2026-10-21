/** The signed-in Hello Staff case, in an httpOnly cookie scoped to
 *  `/api/hellostaff`. The browser never holds the case id it could swap for
 *  someone else's: every upstream call takes it from here. */
import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { seal, unseal } from "@/lib/mom/account/seal";

import type { HsSlug } from "./catalog";

const COOKIE = "hv_hellostaff";
const PATH = "/api/hellostaff";
const TTL = 24 * 60 * 60;

export type HsSession = {
  caseId: string;
  userId: string;
  name: string;
  mobile: string;
  slug: HsSlug;
};

function options(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: PATH,
    maxAge,
  };
}

export function readHsSession(req: NextRequest, key: Buffer): HsSession | null {
  return unseal<HsSession>(key, "hellostaff", req.cookies.get(COOKIE)?.value);
}

export function writeHsSession(res: NextResponse, key: Buffer, data: HsSession) {
  res.cookies.set(COOKIE, seal(key, "hellostaff", data, TTL), options(TTL));
}

export function clearHsSession(res: NextResponse) {
  res.cookies.set(COOKIE, "", options(0));
}
