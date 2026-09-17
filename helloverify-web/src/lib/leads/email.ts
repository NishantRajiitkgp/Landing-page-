/** Email quality checks (BUILD-SPEC §10 defence layer 4).
 *
 *  Two separate questions, deliberately not conflated:
 *    - is the domain a throwaway inbox?  (a policy judgement, a list)
 *    - can the domain receive mail at all? (a fact, DNS answers it)
 *
 *  Neither asks whether the domain is *corporate*. The Individual segment
 *  legitimately arrives on free mail, and the form's "Business email" label is
 *  a nudge, not a rule.
 */
import "server-only";

import { Resolver } from "node:dns/promises";

import { leadsConfig } from "./env";
import { logEvent } from "./log";

export type EmailVerdict =
  /** Usable. */
  | "ok"
  /** A known throwaway-inbox provider. */
  | "disposable"
  /** DNS is authoritative that this domain cannot receive mail. */
  | "undeliverable"
  /** We could not find out. Always treated as acceptable — see `assessEmail`. */
  | "unknown";

/** A starter list of well-known throwaway-inbox providers, not a comprehensive
 *  one — comprehensive lists run to several thousand domains and go stale, so
 *  they belong in a maintained data dependency rather than in source.
 *
 *  Alias forwarders (AnonAddy, SimpleLogin, Burner Mail, Spamgourmet) are
 *  deliberately absent. They relay to a real, monitored inbox, and a
 *  privacy-conscious buyer using one is a lead, not spam. */
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "1secmail.com",
  "discard.email",
  "dispostable.com",
  "emailfake.com",
  "emailondeck.com",
  "fakeinbox.com",
  "fakemailgenerator.com",
  "getnada.com",
  "grr.la",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "inboxkitten.com",
  "jetable.org",
  "luxusmail.org",
  "mailcatch.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mailsac.com",
  "mintemail.com",
  "moakt.com",
  "mohmal.com",
  "mytemp.email",
  "nowmymail.com",
  "pokemail.net",
  "sharklasers.com",
  "spam4.me",
  "spambog.com",
  "temp-mail.org",
  "tempinbox.com",
  "tempmail.com",
  "tempmailo.com",
  "tempr.email",
  "throwawaymail.com",
  "trashmail.com",
  "vomoto.com",
  "yopmail.com",
]);

interface CacheEntry {
  verdict: EmailVerdict;
  expiresAt: number;
}

const DNS_CACHE_TTL_MS = 60 * 60 * 1000;
const DNS_CACHE_MAX = 2_000;
const DNS_TIMEOUT_MS = 3_000;

const globalRef = globalThis as typeof globalThis & { __hvDomainCache?: Map<string, CacheEntry> };
const domainCache = (globalRef.__hvDomainCache ??= new Map<string, CacheEntry>());

function domainOf(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 0 || at === email.length - 1) return null;
  return email.slice(at + 1).toLowerCase();
}

/** Resolves whether a domain can receive mail.
 *
 *  A domain with no MX record is not automatically undeliverable: RFC 5321
 *  falls back to the address record, and plenty of small real domains rely on
 *  that. Rejecting on "no MX" alone would turn away genuine enquiries, so the
 *  A/AAAA fallback is checked before concluding anything. */
async function resolveDeliverability(domain: string): Promise<EmailVerdict> {
  const resolver = new Resolver({ timeout: DNS_TIMEOUT_MS, tries: 1 });

  try {
    const mx = await resolver.resolveMx(domain);
    if (mx.some((record) => record.exchange)) return "ok";
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    // ENODATA / ENOTFOUND are answers, not failures: fall through to A/AAAA.
    if (code !== "ENODATA" && code !== "ENOTFOUND") {
      logEvent("INFO", "leads.email.dns-inconclusive", { domain, code });
      return "unknown";
    }
  }

  for (const lookup of ["resolve4", "resolve6"] as const) {
    try {
      const records = await resolver[lookup](domain);
      if (records.length > 0) return "ok";
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENODATA" && code !== "ENOTFOUND") return "unknown";
    }
  }

  return "undeliverable";
}

/** Fails OPEN on anything inconclusive. A DNS timeout is our problem, and
 *  losing a real enquiry to it costs far more than accepting a bad address. */
export async function assessEmail(
  email: string,
  opts: { mxCheck?: boolean } = {},
): Promise<EmailVerdict> {
  const domain = domainOf(email);
  if (!domain) return "unknown";

  if (DISPOSABLE_DOMAINS.has(domain)) return "disposable";

  const mxCheck = opts.mxCheck ?? leadsConfig().mxCheck;
  if (!mxCheck) return "ok";

  const now = Date.now();
  const cached = domainCache.get(domain);
  if (cached && cached.expiresAt > now) return cached.verdict;

  const verdict = await resolveDeliverability(domain);

  domainCache.set(domain, { verdict, expiresAt: now + DNS_CACHE_TTL_MS });
  while (domainCache.size > DNS_CACHE_MAX) {
    const oldest = domainCache.keys().next();
    if (oldest.done) break;
    domainCache.delete(oldest.value);
  }

  return verdict;
}
