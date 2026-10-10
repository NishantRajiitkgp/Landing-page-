/** Italy partner account behind `/api/italy/partner/*`.
 *
 *  Demo keeps accounts in a sealed cookie. Live endpoints are not connected
 *  yet and answer `not_connected`. */
import "server-only";

import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

import { DEMO_CODE, DEMO_DUPLICATE_EMAIL, DEMO_SEED } from "./demo";
import type { AccountErrorCode, Partner } from "./types";

export class PartnerError extends Error {
  readonly code: AccountErrorCode;
  readonly field?: string;
  constructor(code: AccountErrorCode, field?: string) {
    super(code);
    this.name = "PartnerError";
    this.code = code;
    this.field = field;
  }
}

export type CodeTarget =
  | { channel: "email"; email: string }
  | { channel: "phone"; dial: string; phone: string };

export type NewAccount = Omit<Partner, "id"> & { password: string };

export type SignInTicket = { email: string; partner?: Partner };

export interface PartnerBackend {
  readonly demo: boolean;
  sendCode(target: CodeTarget, name: string): Promise<void>;
  verifyCode(target: CodeTarget, code: string): Promise<void>;
  register(account: NewAccount): Promise<Partner>;
  signIn(email: string, password: string): Promise<SignInTicket>;
  signInVerify(ticket: SignInTicket, code: string): Promise<Partner>;
  forgotPassword(email: string): Promise<void>;
}

export type DemoAccount = Partner & { salt: string; hash: string };

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
  return (seed ??= demoAccount({ ...DEMO_SEED }, "demo-partner"));
}

function publicPartner({ id, first, last, email, dial, phone }: Partner): Partner {
  return { id, first, last, email, dial, phone };
}

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

export function demoBackend(directory: DemoDirectory): PartnerBackend {
  const taken = (email: string) => email === DEMO_DUPLICATE_EMAIL || Boolean(directory.find(email));
  const checkCode = (code: string) => {
    if (code !== DEMO_CODE) throw new PartnerError("invalid_code", "code");
  };

  return {
    demo: true,
    async sendCode(target) {
      if (target.channel === "email" && taken(target.email)) throw new PartnerError("duplicate", "email");
    },
    async verifyCode(_target, code) {
      checkCode(code);
    },
    async register(account) {
      if (taken(account.email)) throw new PartnerError("duplicate", "email");
      const created = demoAccount(account, randomUUID());
      directory.add(created);
      return publicPartner(created);
    },
    async signIn(email, password) {
      const account = directory.find(email);
      if (!account || !passwordMatches(account, password)) throw new PartnerError("wrong_credentials");
      return { email, partner: publicPartner(account) };
    },
    async signInVerify(ticket, code) {
      checkCode(code);
      if (!ticket.partner) throw new PartnerError("code_expired");
      return ticket.partner;
    },
    async forgotPassword() {},
  };
}

/** Live partner upstream is not connected. Every call answers `not_connected`. */
export function liveBackend(): PartnerBackend {
  const closed = async () => {
    throw new PartnerError("not_connected");
  };
  return {
    demo: false,
    sendCode: closed,
    verifyCode: closed,
    register: closed,
    signIn: closed,
    signInVerify: closed,
    forgotPassword: closed,
  };
}
