/** Rate limiting per identity (BUILD-SPEC §10 defence layer 2).
 *
 *  The interface is the point. The in-process implementation below is correct
 *  for a single container and is what ships today; a Redis or Firestore
 *  implementation satisfies the same interface without any caller changing.
 *
 *  KNOWN LIMIT — this counts per instance, not per service. Cloud Run is
 *  configured with min-instances 1 and concurrency 80 (BUILD-SPEC §3.6), so a
 *  single instance absorbs normal traffic and the limit behaves as written.
 *  Under scale-out the effective ceiling multiplies by the instance count.
 *  That is a deliberate trade — a shared store is a network round trip and a
 *  dependency on every submission — and it is the first thing to revisit if
 *  form spam ever gets past this.
 */
import "server-only";

export interface RateLimitDecision {
  allowed: boolean;
  /** Submissions left in the current window, after this one. */
  remaining: number;
  /** Seconds until the next submission would be allowed. 0 when allowed. */
  retryAfterSeconds: number;
}

export interface RateLimiter {
  readonly name: string;
  consume(key: string, max: number, windowMs: number): Promise<RateLimitDecision>;
}

/** Bounded, so a stream of unique keys cannot grow the heap without limit.
 *  At 5 timestamps per key this is a few hundred KB at full occupancy. */
const MAX_KEYS = 10_000;

/** A sliding window log: the timestamps of recent submissions per key. More
 *  accurate than a fixed window, which lets through a double burst across the
 *  boundary, and at five entries per key the cost is irrelevant. */
class InProcessRateLimiter implements RateLimiter {
  readonly name = "in-process";
  private readonly hits = new Map<string, number[]>();

  async consume(key: string, max: number, windowMs: number): Promise<RateLimitDecision> {
    const now = Date.now();
    const cutoff = now - windowMs;

    const recent = (this.hits.get(key) ?? []).filter((t) => t > cutoff);

    if (recent.length >= max) {
      // Deliberately does NOT record the rejected attempt. Recording it would
      // let a caller who keeps retrying hold their own window open forever,
      // which punishes a confused human more than it inconveniences a bot.
      this.touch(key, recent);
      const oldest = recent[0];
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
      };
    }

    recent.push(now);
    this.touch(key, recent);

    return { allowed: true, remaining: max - recent.length, retryAfterSeconds: 0 };
  }

  /** Re-inserting moves the key to the end of the Map's insertion order, which
   *  makes the first key the least recently used. */
  private touch(key: string, timestamps: number[]) {
    this.hits.delete(key);
    this.hits.set(key, timestamps);

    while (this.hits.size > MAX_KEYS) {
      const oldest = this.hits.keys().next();
      if (oldest.done) break;
      this.hits.delete(oldest.value);
    }
  }
}

/** Held on globalThis so the window survives a dev-server hot reload. Without
 *  this, editing any file resets every counter and the limiter is untestable
 *  locally. */
const globalRef = globalThis as typeof globalThis & { __hvLeadRateLimiter?: RateLimiter };

export const rateLimiter: RateLimiter = (globalRef.__hvLeadRateLimiter ??= new InProcessRateLimiter());
