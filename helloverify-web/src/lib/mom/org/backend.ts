/** Employer account behind `/api/mom/org/*`.
 *
 *  Demo keeps organisations in a sealed cookie. Live sends and checks codes
 *  through the same api.helloverify.sg endpoints as the applicant flow; the
 *  organisation endpoints are `null` in `ORG_ENDPOINTS` and answer
 *  `not_connected` until the backend team supplies them. */
import "server-only";

import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

import { AccountError, liveBackend as applicantLive, type CodeTarget } from "@/lib/mom/account/backend";

import { DEMO_CODE, DEMO_DUPLICATE_EMAIL, ORG_DEMO_SEED } from "./demo";
import type { OrgUser } from "./types";

export { AccountError, type CodeTarget };

export type NewOrg = Omit<OrgUser, "id"> & { password: string };

export type OrgTicket = { email: string; user?: OrgUser };

export interface OrgBackend {
  readonly demo: boolean;
  sendCode(target: CodeTarget, name: string): Promise<void>;
  verifyCode(target: CodeTarget, code: string): Promise<void>;
  register(account: NewOrg): Promise<OrgUser>;
  signIn(email: string, password: string): Promise<OrgTicket>;
  signInVerify(ticket: OrgTicket, code: string): Promise<OrgUser>;
  forgotPassword(email: string): Promise<void>;
}

/* ── Demo ─────────────────────────────────────────────────────────────── */

export type DemoOrg = OrgUser & { salt: string; hash: string };

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 32).toString("base64url");
}

function passwordMatches(account: DemoOrg, password: string): boolean {
  const expected = Buffer.from(account.hash, "base64url");
  const actual = Buffer.from(hashPassword(password, account.salt), "base64url");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function demoOrg(account: NewOrg, id: string): DemoOrg {
  const salt = randomBytes(16).toString("base64url");
  const { password, ...profile } = account;
  return { ...profile, id, salt, hash: hashPassword(password, salt) };
}

let seed: DemoOrg | null = null;
function seedOrg(): DemoOrg {
  return (seed ??= demoOrg({ ...ORG_DEMO_SEED }, "demo-org"));
}

function publicUser({ id, org, reg, kind, first, last, email, dial, phone }: OrgUser): OrgUser {
  return { id, org, reg, kind, first, last, email, dial, phone };
}

export class OrgDirectory {
  changed = false;
  constructor(public accounts: DemoOrg[]) {}

  find(email: string): DemoOrg | undefined {
    if (email === ORG_DEMO_SEED.email) return seedOrg();
    return this.accounts.find((a) => a.email === email);
  }

  add(account: DemoOrg) {
    this.accounts = [account, ...this.accounts.filter((a) => a.email !== account.email)].slice(0, 5);
    this.changed = true;
  }
}

export function demoOrgBackend(directory: OrgDirectory): OrgBackend {
  const taken = (email: string) => email === DEMO_DUPLICATE_EMAIL || Boolean(directory.find(email));
  const checkCode = (code: string) => {
    if (code !== DEMO_CODE) throw new AccountError("invalid_code", "code");
  };

  return {
    demo: true,
    async sendCode(target) {
      if (target.channel === "email" && taken(target.email)) throw new AccountError("duplicate", "email");
    },
    async verifyCode(_target, code) {
      checkCode(code);
    },
    async register(account) {
      if (taken(account.email)) throw new AccountError("duplicate", "email");
      const created = demoOrg(account, randomUUID());
      directory.add(created);
      return publicUser(created);
    },
    async signIn(email, password) {
      const account = directory.find(email);
      if (!account || !passwordMatches(account, password)) throw new AccountError("wrong_credentials");
      return { email, user: publicUser(account) };
    },
    async signInVerify(ticket, code) {
      checkCode(code);
      if (!ticket.user) throw new AccountError("code_expired");
      return ticket.user;
    },
    async forgotPassword() {},
  };
}

/* ── Live ─────────────────────────────────────────────────────────────── */

/** `null` = api.helloverify.sg has no organisation endpoint for this yet. */
export const ORG_ENDPOINTS = {
  register: null as string | null,
  signIn: null as string | null,
  signInVerify: null as string | null,
  forgotPassword: null as string | null,
};

export function liveOrgBackend(): OrgBackend {
  const codes = applicantLive();
  const closed = async (): Promise<never> => {
    throw new AccountError("not_connected");
  };
  return {
    demo: false,
    sendCode: (target, name) => codes.sendCode(target, name),
    verifyCode: (target, code) => codes.verifyCode(target, code),
    register: closed,
    signIn: closed,
    signInVerify: closed,
    forgotPassword: closed,
  };
}
