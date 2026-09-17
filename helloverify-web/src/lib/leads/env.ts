/** The lead pipeline's runtime configuration.
 *
 *  Read lazily, not at module load: on Cloud Run the environment exists at
 *  request time, and a module evaluated during `next build` would otherwise
 *  bake in build-time defaults. Every value has a working default, so a missing
 *  variable degrades to the documented behaviour rather than crashing the form
 *  — but a *malformed* one says so, once, because silently falling back to 2
 *  when someone typed "two" is how a rate limiter stops limiting.
 *
 *  Names and rationale are documented in `.env.example`.
 */
import "server-only";

import { logOnce } from "./log";

function readInt(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    logOnce("WARNING", "leads.config.invalid", {
      name,
      value: raw,
      expected: `integer in [${min}, ${max}]`,
      usingFallback: fallback,
    });
    return fallback;
  }
  return parsed;
}

function readBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  if (["1", "true", "yes", "on"].includes(raw.toLowerCase())) return true;
  if (["0", "false", "no", "off"].includes(raw.toLowerCase())) return false;

  logOnce("WARNING", "leads.config.invalid", {
    name,
    value: raw,
    expected: "boolean",
    usingFallback: fallback,
  });
  return fallback;
}

function readString(name: string, fallback: string): string {
  const raw = process.env[name]?.trim();
  return raw ? raw : fallback;
}

export interface LeadsConfig {
  rateLimit: { max: number; windowMs: number };
  minFillMs: number;
  trustedProxyHops: number;
  mxCheck: boolean;
  fallbackEmail: string;
}

let cached: LeadsConfig | null = null;

export function leadsConfig(): LeadsConfig {
  if (cached) return cached;

  cached = {
    rateLimit: {
      max: readInt("LEADS_RATE_LIMIT_MAX", 5, 1, 1000),
      windowMs: readInt("LEADS_RATE_LIMIT_WINDOW_MS", 600_000, 1_000, 86_400_000),
    },
    minFillMs: readInt("LEADS_MIN_FILL_MS", 2_500, 0, 600_000),
    trustedProxyHops: readInt("LEADS_TRUSTED_PROXY_HOPS", 2, 1, 10),
    mxCheck: readBool("LEADS_MX_CHECK", true),
    fallbackEmail: readString("LEADS_FALLBACK_EMAIL", "sales@helloverify.com"),
  };

  return cached;
}
