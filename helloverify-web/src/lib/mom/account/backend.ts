/** The MOM applicant account behind `/api/mom/account/*`.
 *
 *  Two implementations of one interface. `demoBackend` keeps accounts in a
 *  sealed cookie on the applicant's browser, so the demo works on any number
 *  of Cloud Run instances with no shared store. `liveBackend` calls
 *  api.helloverify.sg through the existing authority proxy; the endpoints that
 *  do not exist there yet are `null` in `LIVE_ENDPOINTS` and answer
 *  `not_connected` until the backend team supplies them. */
import "server-only";

import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

import { buildInvitePayload, flattenPackages } from "@/lib/authority/invite";
import { authorityPost } from "@/lib/authority/upstream";

import { DEMO_CODE, DEMO_DUPLICATE_EMAIL, DEMO_SEED } from "./demo";
import type { AccountErrorCode, Applicant } from "./types";

export class AccountError extends Error {
  readonly code: AccountErrorCode;
  readonly field?: string;
  constructor(code: AccountErrorCode, field?: string) {
    super(code);
    this.name = "AccountError";
    this.code = code;
    this.field = field;
  }
}

export type CodeTarget =
  | { channel: "email"; email: string }
  | { channel: "phone"; dial: string; phone: string };

export type NewAccount = Omit<Applicant, "id"> & { password: string };

/** What a sign-in carries between the password step and the code step. It is
 *  sealed into the challenge token, so it never reaches the browser readable. */
export type SignInTicket = { email: string; applicant?: Applicant; upstream?: Record<string, string> };

export interface AccountBackend {
  readonly demo: boolean;
  sendCode(target: CodeTarget, name: string): Promise<void>;
  verifyCode(target: CodeTarget, code: string): Promise<void>;
  register(account: NewAccount): Promise<Applicant>;
  signIn(email: string, password: string): Promise<SignInTicket>;
  signInVerify(ticket: SignInTicket, code: string): Promise<Applicant>;
  forgotPassword(email: string): Promise<void>;
}

/* ── Demo ─────────────────────────────────────────────────────────────── */

export type DemoAccount = Applicant & { salt: string; hash: string };

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 32).toString("base64url");
}

function passwordMatches(account: DemoAccount, password: string): boolean {
  const expected = Buffer.from(account.hash, "base64url");
  const actual = Buffer.from(hashPassword(password, account.salt), "base64url");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function demoAccount(account: NewAccount, id: string): DemoAccount {
  const salt = randomBytes(16).toString("base64url");
  const { password, ...profile } = account;
  return { ...profile, id, salt, hash: hashPassword(password, salt) };
}

let seed: DemoAccount | null = null;
function seedAccount(): DemoAccount {
  return (seed ??= demoAccount({ ...DEMO_SEED }, "demo-applicant"));
}

function publicApplicant({ id, first, last, email, dial, phone }: Applicant): Applicant {
  return { id, first, last, email, dial, phone };
}

/** The accounts registered on this browser, plus the seeded demo account. */
export class DemoDirectory {
  changed = false;
  constructor(public accounts: DemoAccount[]) {}

  find(email: string): DemoAccount | undefined {
    if (email === DEMO_SEED.email) return seedAccount();
    return this.accounts.find((a) => a.email === email);
  }

  add(account: DemoAccount) {
    this.accounts = [account, ...this.accounts.filter((a) => a.email !== account.email)].slice(0, 5);
    this.changed = true;
  }
}

export function demoBackend(directory: DemoDirectory): AccountBackend {
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
      const created = demoAccount(account, randomUUID());
      directory.add(created);
      return publicApplicant(created);
    },
    async signIn(email, password) {
      const account = directory.find(email);
      if (!account || !passwordMatches(account, password)) throw new AccountError("wrong_credentials");
      return { email, applicant: publicApplicant(account) };
    },
    async signInVerify(ticket, code) {
      checkCode(code);
      if (!ticket.applicant) throw new AccountError("code_expired");
      return ticket.applicant;
    },
    async forgotPassword() {},
  };
}

/* ── Live ─────────────────────────────────────────────────────────────── */

/** `null` = api.helloverify.sg has no endpoint for this yet. */
export const LIVE_ENDPOINTS = {
  sendEmailCode: "agency_portal/send-email-otp/",
  sendPhoneCode: "agency_portal/send-mobile-otp/",
  verifyCode: "agency_portal/verify-pre-registered-otp/",
  packages: "health_care/api/package_details_registration/",
  register: "health_care/api/candidate_invite_case_registration/",
  forgotPassword: "users/auth/forgot_password/",
  setPassword: null as string | null,
  signIn: null as string | null,
  signInVerify: null as string | null,
};

function endpoint(name: keyof typeof LIVE_ENDPOINTS): string {
  const path = LIVE_ENDPOINTS[name];
  if (!path) throw new AccountError("not_connected");
  return path;
}

type Upstream = Record<string, unknown>;

const succeeded = (res: Upstream) => res.is_success === true || res.status === true;
const mentionsDuplicate = (res: Upstream) =>
  String(res.message ?? "").toLowerCase().includes("duplicate") ||
  Boolean((res.data as { duplicate_found?: boolean } | undefined)?.duplicate_found);

async function call(path: string, body: unknown): Promise<Upstream> {
  try {
    return await authorityPost("mom", path, body);
  } catch {
    throw new AccountError("upstream");
  }
}

export function liveBackend(): AccountBackend {
  return {
    demo: false,
    async sendCode(target, name) {
      const res =
        target.channel === "email"
          ? await call(endpoint("sendEmailCode"), { email: target.email, candidate_name: name })
          : await call(endpoint("sendPhoneCode"), {
              dialing_code: target.dial,
              mobile: target.phone,
              candidate_name: name,
            });
      if (mentionsDuplicate(res)) throw new AccountError("duplicate", target.channel);
      if (!succeeded(res)) throw new AccountError("upstream");
    },
    async verifyCode(target, code) {
      const res = await call(endpoint("verifyCode"), {
        ...(target.channel === "email" ? { email: target.email } : { mobile: target.phone }),
        otp: code,
      });
      if (!succeeded(res)) throw new AccountError("invalid_code", "code");
    },
    async register(account) {
      const setPassword = endpoint("setPassword");
      const packages = flattenPackages(await call(endpoint("packages"), {}));
      const pkg = packages[0];
      if (!pkg) throw new AccountError("upstream");
      const invite = await call(
        endpoint("register"),
        buildInvitePayload("mom", {
          name: account.first,
          last: account.last,
          email: account.email,
          number: account.phone,
          dialCode: account.dial,
          client_package_id: String(pkg.client_package_id),
          program: String(pkg.program),
          sbu: String(pkg.sbu),
          section: String(pkg.section),
        }),
      );
      if (mentionsDuplicate(invite)) throw new AccountError("duplicate", "email");
      if (!succeeded(invite)) throw new AccountError("upstream");
      const set = await call(setPassword, { username: account.email, password: account.password });
      if (!succeeded(set)) throw new AccountError("upstream");
      const id = String((invite.data as { case_id?: unknown } | undefined)?.case_id ?? account.email);
      return { id, first: account.first, last: account.last, email: account.email, dial: account.dial, phone: account.phone };
    },
    async signIn(email, password) {
      const res = await call(endpoint("signIn"), { username: email, password, is_candidate: true });
      if (!succeeded(res)) throw new AccountError("wrong_credentials");
      return { email, upstream: { challenge: String(res.challenge ?? "") } };
    },
    async signInVerify(ticket, code) {
      const res = await call(endpoint("signInVerify"), { username: ticket.email, otp: code, ...ticket.upstream });
      if (!succeeded(res)) throw new AccountError("invalid_code", "code");
      const user = (res.data ?? {}) as Partial<Applicant>;
      return {
        id: String(user.id ?? ticket.email),
        first: String(user.first ?? ""),
        last: String(user.last ?? ""),
        email: ticket.email,
        dial: String(user.dial ?? ""),
        phone: String(user.phone ?? ""),
      };
    },
    async forgotPassword(email) {
      await call(endpoint("forgotPassword"), { username: email, is_candidate: true });
    },
  };
}
