/** BUILD-SPEC §14.3 — the post-deploy production contract.
 *
 *  "This job runs against the live origin after every release and rolls back on
 *  failure. Each assertion maps to an audit finding."
 *
 *  And the reason it exists, in the spec's own words: *"The old pipeline claimed
 *  to fix the `/index.html` redirect and the immutable cache headers. Neither
 *  landed, and nothing noticed for months."* Every other gate in this repo reads
 *  the BUILD. This one reads what a visitor actually receives, which is the only
 *  artefact that can tell you a deploy went out wrong.
 *
 *  PLAIN FETCH, NOT PLAYWRIGHT, and that is a deliberate reading of §14.1's
 *  table. Every assertion §14.3 lists is an HTTP request and a header or status
 *  check — `request.get`, no page, no DOM, no browser. Playwright earns its
 *  place for the E2E and page-a11y rows of that table (locale switching, RTL
 *  rendering, form submission), which is §12's work. Adding a 200 MB browser
 *  download to a header check would make this suite slower to run and more
 *  likely to be skipped, which is how the old one came to be `trigger: none`.
 *
 *  Usage — against a preview, a staging origin, or production:
 *      npm run build && npx next start -p 3100 &
 *      node tools/ci/production-contract.mjs http://localhost:3100
 *      node tools/ci/production-contract.mjs https://www.helloverify.com
 *
 *  Exit code is non-zero on any failure so CI can gate a release on it.
 *
 *  Assertions that cannot hold against a local `next start` (the apex redirect
 *  needs DNS; immutable caching is a CDN concern) DEGRADE TO WARNINGS there and
 *  are enforced against a real origin. The distinction is made on the URL, not
 *  on a flag, so nobody can quietly pass CI by passing localhost.
 */
import {
  configure,
  origin,
  check,
  hop,
  warn,
  report,
} from "../seo/probe-lib.mjs";

const BASE = process.argv[2] ?? "http://localhost:3100";
configure(BASE);

/** A local `next start` is not a deployment: no CDN, no DNS, no TLS. Some of
 *  §14.3's assertions are about infrastructure rather than about the app, and
 *  asserting them against localhost would either always fail or teach everyone
 *  to ignore the output. */
const LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(BASE);
if (LOCAL) {
  console.log(`${BASE} is local — CDN and DNS assertions will warn, not fail.\n`);
}

// ── AUDIT A1: compression ────────────────────────────────────
// The audit found the old origin serving uncompressed HTML, CSS and JS. §11a.5
// calls this the single highest-leverage GEO action available, because an
// engine that times out does not cite you.
console.log("Compression (AUDIT A1)");
{
  const html = await fetch(`${origin()}/en`, {
    headers: { "accept-encoding": "br, gzip" },
  });
  const enc = html.headers.get("content-encoding");
  if (LOCAL && !enc) {
    warn(
      "HTML is not compressed by `next start`",
      "`next start` does not compress by default; Cloud Run + Cloud CDN does. Enforced against a real origin.",
    );
  } else {
    check("HTML is br- or gzip-encoded", /br|gzip/.test(enc ?? ""), `content-encoding: ${enc}`);
  }

  // Find a real hashed asset from the homepage rather than guessing a path.
  const body = await (await fetch(`${origin()}/en`)).text();
  const asset = body.match(/\/_next\/static\/[^"]+\.js/)?.[0];
  check("homepage references at least one hashed asset", Boolean(asset), asset);

  if (asset) {
    const res = await fetch(origin() + asset, { headers: { "accept-encoding": "br, gzip" } });
    const jsEnc = res.headers.get("content-encoding");
    if (LOCAL && !jsEnc) {
      warn("JS is not compressed by `next start`", "same as above — a CDN concern");
    } else {
      check("JS is br- or gzip-encoded", /br|gzip/.test(jsEnc ?? ""), `content-encoding: ${jsEnc}`);
    }

    // ── AUDIT A4: immutable caching ──────────────────────────
    // Hashed filenames are safe to cache forever; the old site re-fetched them.
    const cc = res.headers.get("cache-control") ?? "";
    if (LOCAL && !cc.includes("immutable")) {
      warn("hashed asset is not marked immutable locally", `cache-control: ${cc}`);
    } else {
      check("hashed assets are immutable (AUDIT A4)", cc.includes("immutable"), `cache-control: ${cc}`);
    }
  }
}

// ── AUDIT A2: every sitemap URL is a 200, with no hop ─────────
// The failure this replaces: all 84 sitemap URLs 301'd to /index.html.
console.log("\nSitemap URLs answer 200 directly (AUDIT A2)");
{
  const xml = await (await fetch(`${origin()}/sitemap.xml`)).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  check("sitemap is served and non-empty", locs.length > 0, `${locs.length} <loc> entries`);

  let bad = 0;
  for (const loc of locs) {
    const path = new URL(loc).pathname;
    const step = await hop(path);
    if (step.status !== 200) {
      bad++;
      check(`200 ${path}`, false, `got ${step.status} -> ${step.location ?? ""}`);
    }
    if (/index\.html/.test(step.location ?? "")) {
      check(`${path} does not redirect into index.html`, false, step.location);
    }
  }
  check(`all ${locs.length} sitemap URLs answer 200 in one hop`, bad === 0, `${bad} did not`);
}

// ── AUDIT C2: canonical matches the sitemap, byte for byte ────
console.log("\nCanonical agrees with the sitemap (AUDIT C2)");
{
  const xml = await (await fetch(`${origin()}/sitemap.xml`)).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  // A sample, not all 56: this is the assertion `check-sitemap.mjs` already
  // proves exhaustively on the build. Here it is confirming the deploy serves
  // that build, so a spread of pages is enough.
  const sample = [locs[0], locs[Math.floor(locs.length / 2)], locs[locs.length - 1]].filter(Boolean);
  for (const loc of sample) {
    const path = new URL(loc).pathname;
    const html = await (await fetch(origin() + path)).text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    // Against a local origin the canonical names the production host, which is
    // correct — SITE_URL is the canonical origin regardless of where it runs.
    const want = LOCAL ? loc : loc;
    check(`canonical on ${path} equals its <loc>`, canonical === want, `${canonical} != ${want}`);
  }
}

// ── AUDIT A3: apex redirects to www ──────────────────────────
console.log("\nApex redirects to www (AUDIT A3)");
{
  if (LOCAL) {
    warn("apex redirect not checkable against localhost", "needs DNS; enforced against a real origin");
  } else {
    const res = await fetch("https://helloverify.com/", { redirect: "manual" });
    check(
      "apex 308s to www",
      res.status === 308 && (res.headers.get("location") ?? "").startsWith("https://www.helloverify.com"),
      `got ${res.status} -> ${res.headers.get("location")}`,
    );
  }
}

// ── AUDIT E1: no secrets in shipped JS ───────────────────────
// `check-secrets.mjs` greps the build; this greps what is actually served,
// which also covers a CDN serving a stale bundle from before a leak was fixed.
console.log("\nNo secrets in shipped JS (AUDIT E1)");
{
  const body = await (await fetch(`${origin()}/en`)).text();
  const assets = [...new Set([...body.matchAll(/\/_next\/static\/[^"]+\.js/g)].map((m) => m[0]))];
  const shapes = [
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key"],
    [/1000\.[0-9a-f]{32}\.[0-9a-f]{32}/, "Zoho OAuth token"],
    [/\bZOHO_(CLIENT_SECRET|REFRESH_TOKEN)\b/, "Zoho env name"],
  ];
  let hits = 0;
  for (const a of assets) {
    const js = await (await fetch(origin() + a)).text();
    for (const [re, label] of shapes) {
      if (re.test(js)) {
        hits++;
        check(`${a} has no ${label}`, false, "(match not printed)");
      }
    }
  }
  check(`no secret shapes across ${assets.length} served JS files`, hits === 0, `${hits} hit(s)`);
}

// ── AUDIT E2: CSP ────────────────────────────────────────────
console.log("\nSecurity headers (AUDIT E2, §13)");
{
  const res = await fetch(`${origin()}/en`);
  const ref = res.headers.get("referrer-policy");
  check(
    "Referrer-Policy is strict-origin-when-cross-origin (§8.4)",
    ref === "strict-origin-when-cross-origin",
    `got ${ref}`,
  );

  const csp = res.headers.get("content-security-policy") ?? "";
  check("a Content-Security-Policy is sent (\u00a713)", csp.length > 0, csp.slice(0, 60));

  // The directives that are strict, and must stay strict.
  for (const directive of [
    "default-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "connect-src 'self'",
  ]) {
    check(`CSP has ${directive}`, csp.includes(directive), csp);
  }

  // style-src is hash-pinned rather than 'unsafe-inline' - see check-csp.mjs.
  const styleSrc = csp.match(/style-src ([^;]*)/)?.[1] ?? "";
  check("CSP style-src has no 'unsafe-inline'", !styleSrc.includes("unsafe-inline"), styleSrc.trim());

  // script-src is the one \u00a717 box NOT met, and it is reported as a deviation
  // rather than asserted away. Next cannot inject a nonce into a statically
  // prerendered page (its own docs, content-security-policy.md:181), and this
  // site is 56 static pages by design (\u00a75, \u00a717). See next.config.ts.
  const scriptSrc = csp.match(/script-src ([^;]*)/)?.[1] ?? "";
  if (scriptSrc.includes("unsafe-inline")) {
    warn(
      "CSP script-src still allows 'unsafe-inline' (\u00a717 box open)",
      "A nonce requires per-request rendering, which would make all 56 static pages " +
        "dynamic and blind every build-output gate. Closing it needs a post-build " +
        "hash-injection step - see README known gaps.",
    );
  } else {
    check("CSP script-src has no 'unsafe-inline'", true, scriptSrc.trim());
  }

  for (const [header, want] of [
    ["strict-transport-security", "max-age=31536000"],
    ["x-content-type-options", "nosniff"],
    ["x-frame-options", "DENY"],
    ["cross-origin-opener-policy", "same-origin"],
    ["cross-origin-resource-policy", "same-origin"],
  ]) {
    const got = res.headers.get(header);
    check(`${header} is ${want} (\u00a713)`, (got ?? "").includes(want), `got ${got}`);
  }
}

// ── §11a.4 / §8.3: the generated files are actually served ────
console.log("\nGenerated SEO files (§8.3, §11a.4)");
for (const [path, type] of [
  ["/robots.txt", "text/plain"],
  ["/sitemap.xml", "xml"],
  ["/llms.txt", "text/plain"],
]) {
  const res = await fetch(origin() + path, { redirect: "manual" });
  check(
    `${path} is 200 ${type}`,
    res.status === 200 && (res.headers.get("content-type") ?? "").includes(type),
    `got ${res.status} ${res.headers.get("content-type")}`,
  );
}

process.exit(report());
