/** Who is submitting, for rate-limiting purposes.
 *
 *  A pure function over `Headers` so it can be tested without a request. The
 *  Server Action passes `await headers()`.
 *
 *  `X-Forwarded-For` is a list the client can start and every hop appends to,
 *  so the only entries worth trusting are the ones OUR infrastructure added,
 *  counted from the right. Behind a GCP external Application Load Balancer the
 *  header ends `…, <client ip>, <forwarding rule ip>` — the load balancer
 *  appends both, which is why the client address is second from the right and
 *  `LEADS_TRUSTED_PROXY_HOPS` defaults to 2.
 *
 *  Getting the hop count wrong is a real bug in both directions. Too low and
 *  you rate-limit on a value the caller chose, which is no limit at all. Too
 *  high and every visitor collapses into one bucket, which locks out real
 *  users after five submissions site-wide.
 */
import "server-only";

import { logOnce } from "./log";

export interface Identity {
  /** The rate-limit bucket key. */
  key: string;
  /** Whether the key came from the position our proxy configuration predicts.
   *  An untrusted key is still used — it is usually the right address — but it
   *  says the deployment does not match `LEADS_TRUSTED_PROXY_HOPS`. */
  trusted: boolean;
}

const UNIDENTIFIED = "unidentified";

/** Strips a `[…]` IPv6 wrapper and an `ip:port` suffix. A bare IPv6 address
 *  has several colons and no port, so only a single colon is treated as one. */
function normalise(entry: string): string {
  let value = entry.trim();

  if (value.startsWith("[")) {
    const close = value.indexOf("]");
    if (close > 0) return value.slice(1, close);
  }

  const colons = value.split(":").length - 1;
  if (colons === 1) value = value.slice(0, value.indexOf(":"));

  return value;
}

export function identifyClient(headers: Headers, trustedProxyHops: number): Identity {
  const forwarded = headers.get("x-forwarded-for");

  if (!forwarded) {
    // Normal in local development, where nothing sits in front of the server.
    if (process.env.NODE_ENV === "production") {
      logOnce("WARNING", "leads.identity.no-forwarded-for", {
        detail: "No X-Forwarded-For in production. Rate limiting cannot partition by client.",
      });
    }
    return { key: UNIDENTIFIED, trusted: false };
  }

  const parts = forwarded.split(",").map(normalise).filter(Boolean);
  if (parts.length === 0) return { key: UNIDENTIFIED, trusted: false };

  const index = parts.length - trustedProxyHops;
  if (index >= 0) return { key: parts[index], trusted: true };

  // Fewer entries than the configured infrastructure should have added, so the
  // deployment is not shaped the way the config says. The rightmost entry is
  // the nearest hop's own observation and the least caller-influenced value
  // available, so it is the safest of the bad options.
  logOnce("WARNING", "leads.identity.unexpected-hop-count", {
    entries: parts.length,
    trustedProxyHops,
    detail: "X-Forwarded-For is shorter than LEADS_TRUSTED_PROXY_HOPS implies.",
  });
  return { key: parts[parts.length - 1], trusted: false };
}
