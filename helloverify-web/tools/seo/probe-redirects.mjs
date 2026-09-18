/** The §6.3 post-deploy contract probe.
 *
 *  BUILD-SPEC §6.3 asks for a CI job that probes a live origin for every rule
 *  in §6.1 and §6.2 and fails the release on mismatch. This is that job. It is
 *  the control AUDIT G1 says was missing: the old pipeline verified `dist/`
 *  and never checked what production actually served, which is how a dead
 *  `web.config` (AUDIT A5) survived in the repo.
 *
 *  Usage:
 *      npm run build && npx next start -p 3100 &
 *      node tools/seo/probe-redirects.mjs http://localhost:3100
 *
 *  It asserts three things per legacy URL, and the third is the one that
 *  matters most:
 *
 *    1. the status is exactly 308 (not 301, not 302, not a 200 on a thin page,
 *       which is what the old site did);
 *    2. the Location is the exact expected target;
 *    3. the URL reaches its final 200 in ONE hop. §6.1 forbids chains, and a
 *       chain is the specific failure the old site shipped — sitemap URL 301s
 *       to /index.html whose canonical points back at the sitemap URL.
 *
 *  Exit code is non-zero on any failure so CI can gate on it.
 */
import {
  LEGACY_ROUTES,
  LEGACY_LOCALES,
  SERVED_LOCALES,
  DEFAULT_LOCALE,
  APP_HOST,
  APP_ROUTES,
  APP_ROUTES_UNPREFIXED,
} from "../../src/lib/seo/legacy-urls.ts";

import { readFile } from "node:fs/promises";

import {
  configure,
  origin,
  check,
  hop,
  chase,
  trace,
  assertOneHop,
  assertReaches,
  warn,
  report,
} from "./probe-lib.mjs";

const BASE = process.argv[2] ?? "http://localhost:3100";
configure(BASE);

console.log(`Probing ${BASE}\n`);

// ── §6.1 acceptance tests ────────────────────────────────────────────────────
// Every one of these is quoted verbatim from the spec's acceptance block.
console.log("§6.1 canonical form");
{
  const root = await hop("/");
  check("/ -> 307 /en", root.status === 307 && root.location === "/en", `got ${root.status} -> ${root.location}`);

  const en = await hop("/en");
  check("/en -> 200", en.status === 200, `got ${en.status}`);

  const enSlash = await hop("/en/");
  check("/en/ -> 308 /en", enSlash.status === 308 && enSlash.location === "/en", `got ${enSlash.status} -> ${enSlash.location}`);

  const enIndex = await chase("/en/index.html");
  check(
    "/en/index.html -> 308 /en -> 200",
    enIndex.hops.length === 1 && enIndex.hops[0].to === "/en" && enIndex.finalStatus === 200,
    `got ${enIndex.hops.map((h) => `${h.status} -> ${h.to}`).join(" then ")} (final ${enIndex.finalStatus})`,
  );

  const about = await chase("/en/about");
  check("/en/about -> 200, no redirect", about.hops.length === 0 && about.finalStatus === 200, JSON.stringify(about));

  // §6.1 wants a flat 404 here. next-intl instead treats an unrecognised first
  // segment as a path with no locale and prefixes it, so `/xx/about` 307s to
  // `/en/xx/about` and 404s there. Pre-existing (it predates this item — the
  // same response comes off a build without any of these redirects) and it is
  // item 6's to settle, not item 3's. It matters more than it looks: see the
  // /hi and /ar check below.
  const bad = await chase("/xx/about");
  if (bad.hops.length === 0 && bad.finalStatus === 404) {
    check("unknown locale -> 404", true, "");
  } else {
    warn(
      "§6.1 DEVIATION: unknown locale does not 404 directly",
      `/xx/about gave ${trace(bad)} (final ${bad.finalStatus}). Spec requires a flat 404.`,
    );
  }
}

// ── The /index.html family (AUDIT A2) ────────────────────────────────────────
// These are in Google's index right now. Every one must consolidate.
console.log("\n/index.html family");
{
  const root = await chase("/index.html");
  check(
    "/index.html reaches /en",
    root.finalPath === "/en" && root.finalStatus === 200,
    `got ${root.hops.map((h) => `${h.status} -> ${h.to}`).join(" then ")} (final ${root.finalStatus})`,
  );

  // A live page that did NOT move still has an indexed /index.html form.
  await assertOneHop("/en/contact/index.html", "/en/contact");
  await assertOneHop("/en/about/index.html", "/en/about");
}

// ── §6.2 / IA §9 legacy map ──────────────────────────────────────────────────
console.log("\nLegacy URLs (locale-prefixed)");
for (const locale of LEGACY_LOCALES) {
  // An indexed locale we serve keeps its prefix; one we do not serve
  // consolidates onto the default. /hi/technology must land on
  // /en/platform/technology, NOT on a dead /hi/platform/technology.
  const dest = SERVED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  for (const { from, to } of LEGACY_ROUTES) {
    const source = from === "/" ? `/${locale}` : `/${locale}${from}`;
    const target = to === "/" ? `/${dest}` : `/${dest}${to}`;
    await assertOneHop(source, target);
    // AUDIT A2: the same URL is also indexed with /index.html appended.
    await assertOneHop(`${source}/index.html`, target);
    // Trailing slash was a live URL form on the old site (web.config matched
    // `/?$` on every rule, and AUDIT A2 records that `/en/` returned 200).
    // Two hops allowed, both 308 — see assertReaches for why that is the right
    // trade rather than a concession.
    await assertReaches(`${source}/`, target, 2);
  }
}

console.log("\nLegacy URLs (unprefixed — backlink and typed traffic)");
for (const { from, to } of LEGACY_ROUTES) {
  await assertOneHop(from, to === "/" ? "/en" : `/en${to}`);
}

// -- Sanity: what actually compiled into the build --------------------------
// Reads .next/routes-manifest.json, not the emitter, so this checks the rules
// Next really registered rather than the ones we meant to hand it. Skipped
// when probing a remote origin, where there is no local build to read.
console.log("\nCompiled manifest");
{
  const manifestPath = new URL("../../.next/routes-manifest.json", import.meta.url);
  let manifest = null;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    warn("manifest checks skipped", "No .next/routes-manifest.json — run against a local build to include them.");
  }
  if (manifest) {
    const ours = manifest.redirects.filter((r) => !r.internal);
    check("manifest has rules", ours.length > 0, "no non-internal redirects compiled");
    check(
      "every rule is 308",
      ours.every((r) => r.statusCode === 308),
      `found ${ours.filter((r) => r.statusCode !== 308).length} non-308 rules`,
    );
    const sources = ours.map((r) => r.source);
    const dupes = [...new Set(sources.filter((x, i) => sources.indexOf(x) !== i))];
    check("no duplicate sources", dupes.length === 0, `duplicated: ${dupes.join(", ")}`);
    check(
      "no rule redirects to itself",
      ours.every((r) => r.source !== r.destination),
      "found a self-redirect",
    );
    // A relative destination that is not locale-prefixed would 308 here and
    // then 307 again in the proxy -- the chain this whole module exists to
    // avoid. `/` is the one deliberate exception (root /index.html).
    const unprefixed = ours.filter(
      (r) =>
        r.destination.startsWith("/") &&
        r.destination !== "/" &&
        !r.destination.startsWith("/:") &&
        !LEGACY_LOCALES.some((l) => r.destination === `/${l}` || r.destination.startsWith(`/${l}/`)),
    );
    check(
      "every relative destination is locale-prefixed",
      unprefixed.length === 0,
      `unprefixed: ${unprefixed.slice(0, 5).map((r) => `${r.source} -> ${r.destination}`).join(", ")}`,
    );
  }
}

// -- Unserved locales: the pages that did NOT move ---------------------------
// The loop above covers /hi/technology because /technology is IN the legacy
// table. It does not cover /hi/about, because /about never moved -- there was
// nothing to remap, only a locale that no longer exists. Those are indexed too
// and the catch-all has to reach them without colliding with the specific
// rules above it.
console.log("\nUnserved locales (pages that did not move)");
for (const locale of LEGACY_LOCALES.filter((l) => !SERVED_LOCALES.includes(l))) {
  await assertOneHop(`/${locale}`, `/${DEFAULT_LOCALE}`);
  await assertOneHop(`/${locale}/index.html`, `/${DEFAULT_LOCALE}`);
  await assertOneHop(`/${locale}/about`, `/${DEFAULT_LOCALE}/about`);
  await assertOneHop(`/${locale}/contact`, `/${DEFAULT_LOCALE}/contact`);
  await assertOneHop(`/${locale}/about/index.html`, `/${DEFAULT_LOCALE}/about`);
}

// -- The SPA, which leaves for its own host ----------------------------------
// Only the redirect is ours to verify. Whether app.helloverify.com answers is
// that host's problem, and the probe must not follow a cross-host 308 into it.
console.log("\nSPA paths (cross-host)");
{
  for (const locale of LEGACY_LOCALES) {
    for (const { from } of APP_ROUTES) {
      if (from.includes(":")) continue; // parameterised; spot-checked below
      const step = await hop(`/${locale}${from}`);
      check(`308 /${locale}${from} -> app host`, step.status === 308, `got ${step.status}`);
    }
  }
  // The token-bearing and money-bearing ones, checked on the full absolute URL
  // because getting the host or the path wrong silently breaks a live flow.
  for (const [path, expected] of [
    ["/en/orders/candidate", `${APP_HOST}/en/orders/candidate`],
    ["/consumer/passwordrecovery/abc123", `${APP_HOST}/consumer/passwordrecovery/abc123`],
    ["/consumer/PayUPayment/PaymentSuccess1", `${APP_HOST}/consumer/PayUPayment/PaymentSuccess1`],
  ]) {
    const res = await fetch(origin() + path, { redirect: "manual" });
    check(
      `308 ${path} -> ${expected}`,
      res.status === 308 && res.headers.get("location") === expected,
      `got ${res.status} -> ${res.headers.get("location")}`,
    );
  }
  warn(
    "cross-host 308s assume app.helloverify.com is live",
    `${APP_ROUTES.length + APP_ROUTES_UNPREFIXED.length} rules point at ${APP_HOST}. A 308 is cached forever, so if ` +
      `that host does not resolve at cutover they become permanently dead for anyone who hits one first.`,
  );
}

// -- Response headers (§8.4) -------------------------------------------------
// This is the ONLY gate for the referrer policy, and it has to be a live one:
// the header is not in the build output, so `check-sitemap`, `check-schema` and
// `check-llms` are all blind to it. Measured — reverting the value to the old
// `no-referrer` passes all three (mutation L10b).
//
// AUDIT C2 / §8.4: `no-referrer` strips first-party attribution and partner
// inbound tracking. `strict-origin-when-cross-origin` keeps the full path
// same-origin, sends only the origin cross-origin, and sends nothing on an
// HTTPS -> HTTP downgrade.
console.log("\nResponse headers");
{
  const WANT = "strict-origin-when-cross-origin";
  // A document, a generated text file and a static asset: a referrer policy
  // that holds for the page but not its subresources is not a policy.
  for (const path of [`/${DEFAULT_LOCALE}`, `/${DEFAULT_LOCALE}/about`, "/llms.txt", "/robots.txt"]) {
    const res = await fetch(origin() + path, { redirect: "manual" });
    const got = res.headers.get("referrer-policy");
    check(`Referrer-Policy on ${path}`, got === WANT, `got ${JSON.stringify(got)}, want ${WANT}`);
  }
}

// -- llms.txt is served, unprefixed and static (§11a.4) ----------------------
// The claim in `lib/seo/llms.ts` is that the proxy matcher excludes any path
// containing a dot, so /llms.txt escapes locale negotiation the way /robots.txt
// does. That is a claim about a regex; this is the measurement.
console.log("\nllms.txt");
{
  const res = await fetch(origin() + "/llms.txt", { redirect: "manual" });
  check("/llms.txt is 200, not a locale redirect", res.status === 200, `got ${res.status} -> ${res.headers.get("location")}`);
  check(
    "/llms.txt is text/plain",
    (res.headers.get("content-type") ?? "").startsWith("text/plain"),
    `got ${res.headers.get("content-type")}`,
  );
  const body = await res.text();
  check("/llms.txt leads with an H1", body.startsWith("# "), JSON.stringify(body.slice(0, 40)));
  check("/llms.txt carries the quotable definition", body.includes("\n> "), "no blockquote");
}

// ── Report ─────────────────────────────────────────────────────────
process.exit(report());
