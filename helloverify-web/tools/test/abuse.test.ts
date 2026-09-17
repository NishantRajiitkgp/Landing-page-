// Config is read lazily on first use, so setting these before any import that
// calls leadsConfig() is enough.
process.env.LEADS_MX_CHECK = "0";
process.env.LEADS_MIN_FILL_MS = "2500";
process.env.LEADS_RATE_LIMIT_MAX = "5";
process.env.LEADS_RATE_LIMIT_WINDOW_MS = "600000";
process.env.LEADS_TRUSTED_PROXY_HOPS = "2";

const BASE = "../../src/lib/leads/";

const { identifyClient } = await import(BASE + "identity.ts");
const { rateLimiter } = await import(BASE + "ratelimit.ts");
const { assessEmail } = await import(BASE + "email.ts");
const { screenSubmission } = await import(BASE + "abuse.ts");

let pass = 0;
let fail = 0;

function check(label: string, cond: boolean, got?: unknown) {
  if (cond) {
    pass++;
    console.log("  ok   " + label);
  } else {
    fail++;
    console.log("  FAIL " + label + "   got=" + JSON.stringify(got));
  }
}

const H = (xff?: string) => new Headers(xff === undefined ? {} : { "x-forwarded-for": xff });

console.log("1. identity — X-Forwarded-For, counted from the right");
{
  const a = identifyClient(H(), 2);
  check("no header -> unidentified, untrusted", a.key === "unidentified" && !a.trusted, a);

  const b = identifyClient(H("203.0.113.7, 35.191.0.1"), 2);
  check("GCP LB shape -> client ip, trusted", b.key === "203.0.113.7" && b.trusted, b);

  const c = identifyClient(H("9.9.9.9, 203.0.113.7, 35.191.0.1"), 2);
  check("caller-supplied prefix is ignored", c.key === "203.0.113.7" && c.trusted, c);

  const d = identifyClient(H("198.51.100.4"), 2);
  check("too few hops -> rightmost, untrusted", d.key === "198.51.100.4" && !d.trusted, d);

  const e = identifyClient(H("203.0.113.7:51234, 35.191.0.1"), 2);
  check("ipv4 port stripped", e.key === "203.0.113.7", e);

  const f = identifyClient(H("[2001:db8::1]:443, 35.191.0.1"), 2);
  check("bracketed ipv6 + port unwrapped", f.key === "2001:db8::1", f);

  const g = identifyClient(H("2001:db8::1, 35.191.0.1"), 2);
  check("bare ipv6 kept whole", g.key === "2001:db8::1", g);

  const h = identifyClient(H("a, b, 203.0.113.7, 10.0.0.1"), 2);
  check("deeper chain still counts from right", h.key === "203.0.113.7", h);
}

console.log("2. rate limiter — sliding window");
{
  const results = [];
  for (let i = 0; i < 6; i++) results.push(await rateLimiter.consume("k-a", 5, 600_000));

  check("first five allowed", results.slice(0, 5).every((r) => r.allowed), results);
  check("sixth denied", results[5].allowed === false, results[5]);
  check("remaining counts down", results[0].remaining === 4 && results[4].remaining === 0, results.map((r) => r.remaining));
  check("retryAfter set on denial", results[5].retryAfterSeconds > 0, results[5]);
  check("retryAfter near window length", results[5].retryAfterSeconds <= 600, results[5]);

  const other = await rateLimiter.consume("k-b", 5, 600_000);
  check("other key unaffected", other.allowed && other.remaining === 4, other);

  const tiny = [];
  for (let i = 0; i < 3; i++) tiny.push(await rateLimiter.consume("k-c", 2, 1_000));
  check("window is honoured (2 max)", tiny[0].allowed && tiny[1].allowed && !tiny[2].allowed, tiny);
  await new Promise((r) => setTimeout(r, 1_100));
  const after = await rateLimiter.consume("k-c", 2, 1_000);
  check("window drains", after.allowed, after);
}

console.log("3. email — list check, no network");
{
  check("mailinator is disposable", (await assessEmail("a@mailinator.com", { mxCheck: false })) === "disposable");
  check("yopmail is disposable", (await assessEmail("a@YOPMAIL.com", { mxCheck: false })) === "disposable");
  check("gmail is not disposable", (await assessEmail("a@gmail.com", { mxCheck: false })) === "ok");
  check("alias forwarder is allowed", (await assessEmail("a@anonaddy.me", { mxCheck: false })) === "ok");
  check("malformed -> unknown", (await assessEmail("nope", { mxCheck: false })) === "unknown");
}

console.log("4. screen — full stack, mx off");
{
  const lead = { segment: "business", name: "Priya Menon", email: "priya@example.com" } as never;

  const clean = await screenSubmission({ headers: H("203.0.113.20, 35.191.0.1"), lead, signals: {} });
  check("clean submission allowed", clean.allowed, clean);

  const pot = await screenSubmission({
    headers: H("203.0.113.21, 35.191.0.1"),
    lead,
    signals: { honeypot: "http://spam.example" },
  });
  check("honeypot rejected", !pot.allowed && pot.kind === "honeypot", pot);

  const fast = await screenSubmission({
    headers: H("203.0.113.22, 35.191.0.1"),
    lead,
    signals: { elapsedMs: 120 },
  });
  check("too fast rejected", !fast.allowed && fast.kind === "too-fast", fast);

  const slow = await screenSubmission({
    headers: H("203.0.113.23, 35.191.0.1"),
    lead,
    signals: { elapsedMs: 9_000 },
  });
  check("human-speed allowed", slow.allowed, slow);

  const noJs = await screenSubmission({
    headers: H("203.0.113.24, 35.191.0.1"),
    lead,
    signals: { elapsedMs: undefined },
  });
  check("absent timing signal allowed (no-JS user)", noJs.allowed, noJs);

  const throwaway = await screenSubmission({
    headers: H("203.0.113.25, 35.191.0.1"),
    lead: { ...(lead as object), email: "x@mailinator.com" } as never,
    signals: {},
  });
  check("disposable rejected", !throwaway.allowed && throwaway.kind === "email-disposable", throwaway);

  let limited: { allowed: boolean; kind?: string; retryAfterSeconds?: number } | null = null;
  for (let i = 0; i < 6; i++) {
    limited = await screenSubmission({ headers: H("203.0.113.30, 35.191.0.1"), lead, signals: {} });
  }
  check("sixth from one ip rate-limited", limited !== null && !limited.allowed && limited.kind === "rate-limited", limited);
  check("rate limit reports retry-after", (limited?.retryAfterSeconds ?? 0) > 0, limited);

  const potBudget = [];
  for (let i = 0; i < 6; i++) {
    potBudget.push(
      await screenSubmission({
        headers: H("203.0.113.31, 35.191.0.1"),
        lead,
        signals: { honeypot: "bot" },
      }),
    );
  }
  check(
    "bot attempts consume their own budget",
    !potBudget[5].allowed && potBudget[5].kind === "rate-limited",
    potBudget.map((p) => (p.allowed ? "ok" : p.kind)),
  );
}

console.log("");
console.log(pass + " passed, " + fail + " failed");
if (fail > 0) process.exit(1);
