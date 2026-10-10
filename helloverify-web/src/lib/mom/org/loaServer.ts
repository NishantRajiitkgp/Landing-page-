/** Letters of Authorisation, server side.
 *
 *  Each paid case gets a signing link: a sealed ticket naming the employer,
 *  batch and candidate, so the signing page needs no account. The candidate
 *  confirms an emailed code, checks their details and types their passport
 *  name. Live, the links, codes and signatures go to api.helloverify.sg (null
 *  until the backend team supplies them). Demo keeps signatures in a sealed
 *  cookie on `/api/mom`, which both the candidate and employer routes read. */
import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { authorityPost } from "@/lib/authority/upstream";
import { absoluteUrl } from "@/lib/seo/site";

import { AccountError } from "../account/backend";
import { DEMO_CODE } from "../account/demo";
import { seal, unseal } from "../account/seal";
import { LOA_VERSION } from "../apply/policy";
import { MOM_LOA_PATH } from "../paths";
import type { PaidBatch, PaidCase } from "./checkout";
import { orgLive } from "./env";
import type { LoaMark, LoaStatus } from "./loa";

/** A link outlives a slow candidate; the employer can always send another. */
const LINK_TTL = 30 * 24 * 60 * 60;
export const LOA_PROOF_TTL = 30 * 60;
export const LOA_CODE_SECONDS = 10 * 60;

export const LOA_COOKIE = "hv_mom_loa";
const DEMO_TTL = 30 * 24 * 60 * 60;
/** Keeps the demo cookie under the browser's 4 KB limit. */
const DEMO_KEEP = 60;

/** Sealed into the link. `o` is the employer account that paid. */
export type LoaTicket = { o: string; org: string; b: string; paidAt: string; c: PaidCase };

/** Who signed, from where: kept with the signature as its audit trail. */
export type SignMeta = { ip: string; agent: string };

const LOA_ENDPOINTS: Record<"links" | "sendCode" | "verifyCode" | "sign" | "upload" | "status", string | null> = {
  links: null,
  sendCode: null,
  verifyCode: null,
  sign: null,
  upload: null,
  status: null,
};

function endpoint(name: keyof typeof LOA_ENDPOINTS): string {
  const path = LOA_ENDPOINTS[name];
  if (!path) throw new AccountError("not_connected");
  return path;
}

type Upstream = Record<string, unknown>;
const succeeded = (res: Upstream) => res.is_success === true || res.status === true;

async function call(name: keyof typeof LOA_ENDPOINTS, body: unknown): Promise<Upstream> {
  const path = endpoint(name);
  let res: Upstream;
  try {
    res = await authorityPost("mom", path, body);
  } catch {
    throw new AccountError("upstream");
  }
  if (!succeeded(res)) throw new AccountError(name === "verifyCode" ? "invalid_code" : "upstream", name === "verifyCode" ? "code" : undefined);
  return res;
}

export function loaToken(key: Buffer, ticket: LoaTicket): string {
  return seal(key, "loa", ticket, LINK_TTL);
}

export function openLoaToken(key: Buffer, token: unknown): LoaTicket | null {
  return typeof token === "string" ? unseal<LoaTicket>(key, "loa", token) : null;
}

export const loaLink = (token: string, locale = "en") => `${absoluteUrl(`/${locale}${MOM_LOA_PATH}`)}#${token}`;

export function ticketsFor(batch: PaidBatch, owner: string, cases: PaidCase[]): LoaTicket[] {
  return cases.map((c) => ({ o: owner, org: batch.billing.org, b: batch.id, paidAt: batch.paidAt, c }));
}

/** The demo's signatures, read from and written back to its cookie. */
export type DemoJar = { status: LoaStatus; changed: boolean };

export function readLoaJar(req: NextRequest, key: Buffer): DemoJar {
  const packed = unseal<[string, 0 | 1, number][]>(key, "loa-signed", req.cookies.get(LOA_COOKIE)?.value) ?? [];
  const status: LoaStatus = {};
  for (const [id, by, at] of packed) status[id] = { by: by ? "upload" : "esign", at: new Date(at * 1000).toISOString() };
  return { status, changed: false };
}

export function writeLoaJar(res: NextResponse, key: Buffer, jar: DemoJar) {
  if (!jar.changed) return;
  const packed = Object.entries(jar.status)
    .sort((a, b) => b[1].at.localeCompare(a[1].at))
    .slice(0, DEMO_KEEP)
    .map(([id, m]) => [id, m.by === "upload" ? 1 : 0, Math.round(Date.parse(m.at) / 1000)]);
  res.cookies.set(LOA_COOKIE, seal(key, "loa-signed", packed, DEMO_TTL), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/mom",
    maxAge: DEMO_TTL,
  });
}

export interface LoaBackend {
  readonly demo: boolean;
  /** Emails each candidate their link. */
  sendLinks(tickets: LoaTicket[], tokens: string[]): Promise<void>;
  sendCode(ticket: LoaTicket): Promise<void>;
  verifyCode(ticket: LoaTicket, code: string): Promise<void>;
  sign(ticket: LoaTicket, name: string, meta: SignMeta): Promise<LoaMark>;
  /** A signed scan the employer uploaded, already stored as `ref`. */
  upload(owner: string, batch: string, caseId: string, ref: string): Promise<LoaMark>;
  status(caseIds: string[]): Promise<LoaStatus>;
}

const mark = (by: LoaMark["by"]): LoaMark => ({ by, at: new Date().toISOString() });

function demoLoa(jar: DemoJar): LoaBackend {
  const record = (id: string, by: LoaMark["by"]) => {
    jar.status[id] = jar.status[id] ?? mark(by);
    jar.changed = true;
    return jar.status[id];
  };
  return {
    demo: true,
    async sendLinks() {},
    async sendCode() {},
    async verifyCode(_ticket, code) {
      if (code !== DEMO_CODE) throw new AccountError("invalid_code", "code");
    },
    async sign(ticket) {
      return record(ticket.c.id, "esign");
    },
    async upload(_owner, _batch, caseId) {
      return record(caseId, "upload");
    },
    async status(ids) {
      return Object.fromEntries(ids.flatMap((id) => (jar.status[id] ? [[id, jar.status[id]]] : [])));
    },
  };
}

function parseStatus(res: Upstream): LoaStatus {
  const rows = (res.data as { cases?: unknown } | undefined)?.cases;
  const out: LoaStatus = {};
  if (!Array.isArray(rows)) return out;
  for (const r of rows as Record<string, unknown>[]) {
    const at = typeof r.signed_at === "string" && !Number.isNaN(Date.parse(r.signed_at)) ? r.signed_at : null;
    if (typeof r.case_id === "string" && at) out[r.case_id] = { by: r.method === "upload" ? "upload" : "esign", at };
  }
  return out;
}

const liveLoa: LoaBackend = {
  demo: false,
  async sendLinks(tickets, tokens) {
    await call("links", {
      batch_id: tickets[0]?.b,
      organisation: tickets[0]?.org,
      cases: tickets.map((t, i) => ({ case_id: t.c.id, name: t.c.name, email: t.c.email, link: loaLink(tokens[i]) })),
    });
  },
  async sendCode(t) {
    await call("sendCode", { case_id: t.c.id, email: t.c.email, candidate_name: t.c.name });
  },
  async verifyCode(t, code) {
    await call("verifyCode", { case_id: t.c.id, email: t.c.email, otp: code });
  },
  async sign(t, name, meta) {
    const signed = mark("esign");
    await call("sign", { case_id: t.c.id, batch_id: t.b, signed_name: name, signed_at: signed.at, loa_version: LOA_VERSION, ip: meta.ip, user_agent: meta.agent });
    return signed;
  },
  async upload(owner, batch, caseId, ref) {
    const signed = mark("upload");
    await call("upload", { case_id: caseId, batch_id: batch, organisation_id: owner, document: ref, uploaded_at: signed.at, loa_version: LOA_VERSION });
    return signed;
  },
  async status(ids) {
    return parseStatus(await call("status", { case_ids: ids }));
  },
};

export const loaBackend = (jar: DemoJar): LoaBackend => (orgLive() ? liveLoa : demoLoa(jar));
