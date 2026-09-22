/** BUILD-SPEC §8.2's schema table, enforced against the build output.
 *
 *  §8.1 is guarded by `check-sitemap.mjs`, which reads the emitted HTML rather
 *  than trusting the source that produced it. This is the same gate for the
 *  JSON-LD graph, and it exists because every claim §8.2 makes is a claim about
 *  what a crawler receives:
 *
 *    - §11a.3 requires the `Organization` block to be BYTE-IDENTICAL on every
 *      page. `lib/seo/schema/organization.ts` argues that it must be, being two
 *      module constants rendered from the layout. This compares the 56 emitted
 *      strings.
 *    - Google requires `BreadcrumbList` and `FAQPage` markup to match what the
 *      user sees. `PageShell` and `FaqSection` build both from the same arrays
 *      they render. This re-reads the rendered `<nav>` and `<summary>` text out
 *      of the HTML and compares them item for item — the only artefact that
 *      proves the two agree.
 *    - `HowTo` is the same claim about the process strips (§17 condition 18):
 *      `chrome/Steps.tsx` emits the node from the `items` it renders, and this
 *      re-reads the rendered `.t`/`.p` cards and compares them step for step.
 *      It also holds the list of WHICH strips are a HowTo, because four of the
 *      eighteen deliberately are not and "whatever the build emitted" is not a
 *      record of that decision.
 *    - §8.2 names two January 2026 Google deprecations not to implement. An
 *      instruction in a spec is remembered until it is not; `QAPage` or
 *      `SearchAction` appearing anywhere in any graph fails the build.
 *
 *  Reads the build output, so run it after `next build`:
 *      node tools/seo/check-schema.mjs
 */
import { readFile, stat } from "node:fs/promises";

import { POSTS } from "../../src/lib/content/posts.ts";
import { SAME_AS, CONTACT } from "../../src/lib/content/company.ts";
import { htmlPages, visibleText, decodeEntities } from "./build-output.mjs";

const root = new URL("../../", import.meta.url);

const ORG_ID = "https://www.helloverify.com/#organization";
const WEBSITE_ID = "https://www.helloverify.com/#website";

/** The seven node kinds §8.2's table authorises, and nothing else. A new
 *  `@type` appearing here is a deliberate decision, so it should be a
 *  deliberate edit to this list. */
const ALLOWED_TYPES = new Set([
  "Organization",
  "WebSite",
  "Service",
  "BreadcrumbList",
  "BlogPosting",
  "FAQPage",
  "HowTo",
]);

/** Retired by Google in January 2026 (§8.2). Matched as substrings of the raw
 *  JSON so that they are caught wherever they appear — a nested
 *  `potentialAction` is the likely way either would come back. */
const DEPRECATED = ["QAPage", "SearchAction"];

/** Which pages carry a `Service`. This is a decision (see the header of
 *  `lib/seo/schema/service.ts`: verticals yes, hubs no, the Ministry of
 *  Manpower case study no), so it is written down where a diff shows it
 *  changing rather than inferred from whatever the build happened to emit. */
const SERVICE_PAGES = new Set([
  "/en/business/enterprise",
  "/en/business/smb",
  "/en/business/employee-verification",
  "/en/business/customer-kyc",
  "/en/business/certifier",
  "/en/individuals/hellov",
  "/en/governments/health",
  "/en/governments/immigration",
  "/en/governments/manpower-education",
  "/en/governments/trade",
  "/en/individuals/immigration",
  "/en/individuals/home-family",
]);

/** Which process strips are a `HowTo` (§17 condition 18). Same argument as
 *  `SERVICE_PAGES`: this is a decision per band, so it is written where a diff
 *  shows it changing rather than inferred from what the build emitted.
 *
 *  A page renders a strip when `chrome/Steps.tsx` is called, and it emits the
 *  node only when that call was given a `name`. Eighteen pages render one —
 *  twelve call `Steps` directly, six through `templates/VerticalPage.tsx` —
 *  and every one of the eighteen must be in exactly one of these two sets, so
 *  a NEW strip is a failed build until somebody states which it is. */
const HOWTO_PAGES = new Set([
  "/en/business",
  "/en/business/enterprise",
  "/en/business/smb",
  "/en/business/employee-verification",
  "/en/business/certifier",
  "/en/individuals",
  "/en/individuals/hellov",
  "/en/platform/technology",
  // the six built on VerticalPage, from its `stepsHead`
  "/en/governments/health",
  "/en/governments/immigration",
  "/en/governments/manpower-education",
  "/en/governments/trade",
  "/en/individuals/home-family",
  "/en/individuals/immigration",
]);

/** The four strips that are NOT instructions, with the reason on each. A
 *  numbered strip is not automatically a sequence, and three of these four
 *  carry a how-shaped or question-shaped heading, which is what makes them
 *  tempting. Each page's `<Steps>` call carries the same note. */
const HOWTO_NOT_A_SEQUENCE = new Map([
  ["/en/business/customer-kyc", "three mutually exclusive routes (\"02 · Or redirect\"), not steps"],
  ["/en/platform/coverage", "a definition of coverage and its properties, not a process"],
  ["/en/platform/security-compliance", "four controls that apply concurrently, not in order"],
  [
    "/en/governments/manpower-education/ministry-of-manpower",
    "four deliverables — \"four things in the contract\" — not steps",
  ],
]);

const failures = [];
const note = [];

/** Does `public/<path>` exist? `Organization.logo` naming a 404 is worse
 *  than omitting it: Google drops the whole rich result rather than just the
 *  image, and nothing in the HTML would show the difference. Static assets
 *  are served from `public/`, not copied into `.next`, so this is the file
 *  that actually answers the request. */
async function fileInPublic(pathname) {
  try {
    return (await stat(new URL(`public${pathname}`, root))).isFile();
  } catch {
    return false;
  }
}

/** group(map, key).push(value) — one bucket per distinct serialised block. */
function group(map, key) {
  let v = map.get(key);
  if (!v) map.set(key, (v = []));
  return v;
}

function fail(msg, detail) {
  failures.push(`${msg}\n      ${detail}`);
}

// ---------------------------------------------------------------- the inputs
const xml = await readFile(new URL(".next/server/app/sitemap.xml.body", root), "utf8").catch(
  () => null,
);
if (xml === null) {
  console.log("FAIL - no sitemap in the build output. Run `npm run build` first.");
  process.exit(1);
}
const sitemapPaths = new Set(
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname),
);

const pageFiles = await htmlPages(root);

// ------------------------------------------------------------------ parsing
const LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

/** `<nav aria-label="Breadcrumb">` as the reader sees it: the link text and the
 *  href of each rung, in document order, with the current page last. */
function visibleCrumbs(html) {
  const nav = html.match(/<nav class="wrap crumbs"[^>]*>([\s\S]*?)<\/nav>/);
  if (!nav) return null;
  const rungs = [];
  for (const m of nav[1].matchAll(
    /<a href="([^"]*)"[^>]*>([^<]*)<\/a>|<span class="here"[^>]*>([^<]*)<\/span>/g,
  )) {
    rungs.push(
      m[1] !== undefined
        ? { name: decodeEntities(m[2]), href: m[1] }
        : { name: decodeEntities(m[3]) },
    );
  }
  return rungs;
}

/** Every numbered process strip on the page, as the reader sees it: one array
 *  of `{ n, t, p }` cards per strip, in document order.
 *
 *  Matched as the WHOLE card — `<div><div class="n">…</div><div class="t">…
 *  </div><p class="p">…</p></div>` — and required to sit immediately after the
 *  strip's own opening tag, then immediately after the previous card. Two
 *  cheaper shapes were rejected by measurement rather than by taste:
 *  `class="t"` and `class="p"` are NOT unique to this strip (`/business/smb`
 *  alone renders eight `<span class="t">30 min</span>` pills), so harvesting
 *  the classes separately the way `visibleFaqs` can would mix a pill's
 *  turnaround into a step's name; and matching the strip container's closing
 *  `</div>` cannot be done with a regex, because the cards nest divs inside
 *  it. Contiguity gives the same bound without counting tags, and it is exact:
 *  anything rendered between two cards ends the strip and shortens it, which
 *  fails the comparison below rather than passing silently. */
function visibleSteps(html) {
  const CARD =
    /<div><div class="n">([\s\S]*?)<\/div><div class="t">([\s\S]*?)<\/div><p class="p">([\s\S]*?)<\/p><\/div>/g;
  const strips = [];
  for (const open of html.matchAll(/<div class="body3 steps3"[^>]*>/g)) {
    const cards = [];
    let at = open.index + open[0].length;
    CARD.lastIndex = at;
    let m;
    while ((m = CARD.exec(html)) !== null && m.index === at) {
      cards.push({ n: decodeEntities(m[1]), t: decodeEntities(m[2]), p: decodeEntities(m[3]) });
      at = CARD.lastIndex;
      CARD.lastIndex = at;
    }
    strips.push(cards);
  }
  return strips;
}

function visibleFaqs(html) {
  const qs = [...html.matchAll(/<summary>([\s\S]*?)<span class="m">/g)].map((m) =>
    decodeEntities(m[1]),
  );
  const as = [...html.matchAll(/<p class="a">([\s\S]*?)<\/p>/g)].map((m) => decodeEntities(m[1]));
  return { qs, as };
}

const orgBlocks = new Map(); // serialised Organization -> [paths]
const entityProblems = [];
const siteBlocks = new Map();
let pagesWithGraph = 0;
const counts = { Service: 0, FAQPage: 0, BlogPosting: 0, BreadcrumbList: 0, HowTo: 0 };
let stepCards = 0;

const badJson = [];
const badType = [];
const deprecated = [];
const missingOrg = [];
const crumbMismatch = [];
const faqMismatch = [];
const howToProblems = [];
const serviceProblems = [];
const blogProblems = [];
const danglingRefs = [];
const strayGraph = [];

for (const [path, file] of pageFiles) {
  const html = await readFile(new URL(file, root), "utf8");
  const raw = [...html.matchAll(LD)].map((m) => m[1]);

  if (!sitemapPaths.has(path)) {
    // `/_not-found` and `/_global-error` are not pages. They sit under the
    // [locale] layout, so they DO inherit its Organization + WebSite — which is
    // harmless (an error page is not indexed, and the entity is the same one)
    // but must not acquire page-level nodes, which would describe a service or
    // an article that does not exist at that URL.
    for (const block of raw) {
      const t = JSON.parse(block)["@type"];
      if (t !== "Organization" && t !== "WebSite") strayGraph.push(`${path}: ${t}`);
    }
    continue;
  }

  if (raw.length) pagesWithGraph++;

  const nodes = [];
  for (const block of raw) {
    try {
      nodes.push(JSON.parse(block));
    } catch (e) {
      badJson.push(`${path}: ${e.message}`);
    }
    for (const d of DEPRECATED) {
      if (block.includes(d)) deprecated.push(`${path}: ${d}`);
    }
  }

  const byType = new Map();
  for (const n of nodes) {
    if (!ALLOWED_TYPES.has(n["@type"])) {
      badType.push(`${path}: ${n["@type"]}`);
      continue;
    }
    byType.set(n["@type"], n);
    if (n["@type"] in counts) counts[n["@type"]]++;
  }

  // --- Organization / WebSite: EXACTLY ONE of each, and identical everywhere.
  //
  // "Exactly one" rather than "at least one" because the byte-identity check
  // below compares one block per page: with `find()` picking the first, a page
  // that emitted a SECOND, different Organization would have agreed with every
  // other page on its first block and been passed. Two Organization nodes on
  // one page is also the literal form of the inconsistency §11a.3 describes —
  // an engine has no way to choose between them.
  const orgs = raw.filter((b) => b.includes('"@type":"Organization"'));
  const sites = raw.filter((b) => b.includes('"@type":"WebSite"'));
  if (orgs.length !== 1 || sites.length !== 1) {
    missingOrg.push(`${path}: ${orgs.length} Organization, ${sites.length} WebSite (want 1, 1)`);
  } else {
    group(orgBlocks, orgs[0]).push(path);
    group(siteBlocks, sites[0]).push(path);

    // §11a.3's entity-disambiguation fields. These were absent until the old
    // repo turned up with real values, and their absence was invisible — the
    // graph validated fine without them. Asserted now so that losing one is a
    // failed build rather than a slow loss of entity confidence.
    const org = JSON.parse(orgs[0]);
    const problems = [];
    const sameAs = [].concat(org.sameAs ?? []);
    if (!sameAs.length) problems.push("no sameAs");
    for (const u of sameAs) {
      if (!/^https:\/\//.test(u)) problems.push(`sameAs not absolute https: ${u}`);
      // A personal LinkedIn profile is a different entity from the company.
      if (u.includes("linkedin.com/in/")) problems.push(`sameAs points at a personal profile: ${u}`);
    }
    for (const want of SAME_AS) {
      if (!sameAs.includes(want)) problems.push(`sameAs missing ${want}`);
    }
    const points = [].concat(org.contactPoint ?? []);
    if (!points.length) problems.push("no contactPoint");
    if (!points.some((p) => p.email === CONTACT.salesEmail)) {
      problems.push(`no contactPoint with ${CONTACT.salesEmail}`);
    }
    if (!points.some((p) => p.telephone)) problems.push("no contactPoint carries a telephone");
    for (const p of points) {
      // E.164 or nothing: a crawler will not reformat "+91 9289 6276 22".
      if (p.telephone && !/^\+[0-9]{8,15}$/.test(p.telephone)) {
        problems.push(`telephone is not E.164: ${p.telephone}`);
      }
    }
    if (!org.logo) problems.push("no logo");
    else if (!/^https:\/\/.+\.(png|jpg|jpeg)$/.test(org.logo)) {
      problems.push(`logo is not an absolute raster URL: ${org.logo}`);
    } else if (!(await fileInPublic(new URL(org.logo).pathname))) {
      problems.push(`logo 404s — nothing at public${new URL(org.logo).pathname}`);
    }
    if (org.address?.addressLocality !== "Noida") {
      problems.push(`addressLocality is ${JSON.stringify(org.address?.addressLocality)}, want Noida`);
    }
    if (problems.length) entityProblems.push(`${path}: ${problems.join("; ")}`);
  }

  // --- every @id reference resolves to a node this site defines
  for (const ref of JSON.stringify(nodes).matchAll(/\{"@id":"([^"]+)"\}/g)) {
    if (ref[1] !== ORG_ID && ref[1] !== WEBSITE_ID) danglingRefs.push(`${path}: ${ref[1]}`);
  }

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];

  // --- BreadcrumbList vs the visible trail
  const crumbs = visibleCrumbs(html);
  const bc = byType.get("BreadcrumbList");
  if (crumbs === null) {
    if (bc) crumbMismatch.push(`${path}: BreadcrumbList emitted but no visible trail`);
  } else {
    const intermediateWithoutHref = crumbs.slice(0, -1).some((c) => c.href === undefined);
    if (!bc) {
      // Only legal-style trails (a rung that is not a page) may omit it —
      // `lib/seo/schema/breadcrumbs.ts` returns null for exactly that shape.
      if (!intermediateWithoutHref) {
        crumbMismatch.push(`${path}: visible trail but no BreadcrumbList`);
      }
    } else if (intermediateWithoutHref) {
      crumbMismatch.push(`${path}: BreadcrumbList emitted for a trail with an unlinked rung`);
    } else {
      const emitted = bc.itemListElement.map((li) => ({
        name: li.name,
        ...(li.item ? { href: new URL(li.item).pathname } : {}),
      }));
      const want = crumbs.map((c, i) =>
        i === crumbs.length - 1 ? { name: c.name } : { name: c.name, href: c.href },
      );
      if (JSON.stringify(emitted) !== JSON.stringify(want)) {
        crumbMismatch.push(
          `${path}\n        markup:  ${JSON.stringify(want)}\n        json-ld: ${JSON.stringify(emitted)}`,
        );
      }
      const positions = bc.itemListElement.map((li) => li.position).join(",");
      const expected = bc.itemListElement.map((_, i) => i + 1).join(",");
      if (positions !== expected) crumbMismatch.push(`${path}: positions ${positions}`);
    }
  }

  // --- FAQPage vs the visible <details> block
  const hasVisibleFaq = html.includes('<div class="faq3">');
  const faq = byType.get("FAQPage");
  if (hasVisibleFaq !== Boolean(faq)) {
    faqMismatch.push(
      `${path}: visible FAQ ${hasVisibleFaq}, FAQPage node ${Boolean(faq)}`,
    );
  } else if (faq) {
    const { qs, as } = visibleFaqs(html);
    const entities = faq.mainEntity;
    if (entities.length !== qs.length) {
      faqMismatch.push(`${path}: ${entities.length} questions marked up, ${qs.length} rendered`);
    }
    for (const [i, q] of entities.entries()) {
      if (q.name !== qs[i]) {
        faqMismatch.push(`${path} Q${i + 1}\n        markup:  ${qs[i]}\n        json-ld: ${q.name}`);
      }
      if (q.acceptedAnswer.text !== as[i]) {
        faqMismatch.push(
          `${path} A${i + 1}\n        markup:  ${as[i]}\n        json-ld: ${q.acceptedAnswer.text}`,
        );
      }
    }
  }

  // --- HowTo vs the visible process strip
  //
  // Three separate claims, because each fails differently: that the page made
  // a decision at all (it is in one of the two sets), that the decision is
  // what the build emitted, and that the emitted steps are the rendered cards
  // verbatim. Only the third is FAQ's check; the first two exist because a
  // missing node is invisible — `Steps` without a `name` renders exactly the
  // same strip and says nothing.
  const strips = visibleSteps(html);
  stepCards += strips.reduce((n, cards) => n + cards.length, 0);
  const howtoBlocks = raw.filter((b) => b.includes('"@type":"HowTo"'));
  const howto = byType.get("HowTo");
  const expectHowTo = HOWTO_PAGES.has(path);
  const skipped = HOWTO_NOT_A_SEQUENCE.has(path);

  if (expectHowTo && skipped) {
    howToProblems.push(`${path}: in HOWTO_PAGES and HOWTO_NOT_A_SEQUENCE at once`);
  }
  if (strips.length && !expectHowTo && !skipped) {
    howToProblems.push(
      `${path}: renders ${strips.length} process strip(s) and is in neither ` +
        `HOWTO_PAGES nor HOWTO_NOT_A_SEQUENCE — decide which, and say why`,
    );
  }
  if (!strips.length && (expectHowTo || skipped)) {
    howToProblems.push(`${path}: listed here as a process strip, renders none`);
  }
  if (howtoBlocks.length > 1) {
    howToProblems.push(`${path}: ${howtoBlocks.length} HowTo nodes; a band is one sequence`);
  }
  if (expectHowTo !== Boolean(howto)) {
    howToProblems.push(
      `${path}: expected HowTo ${expectHowTo}, found ${Boolean(howto)}` +
        (skipped ? ` (HOWTO_NOT_A_SEQUENCE: ${HOWTO_NOT_A_SEQUENCE.get(path)})` : ""),
    );
  } else if (howto) {
    const problems = [];
    const steps = [].concat(howto.step ?? []);

    // A HowTo with a placeholder name is worse than none (see the header of
    // lib/seo/schema/howto.ts), so "has a name" is not enough: it has to be a
    // name the reader can see. `visibleText` drops <script> bodies, so the
    // node cannot satisfy this with its own copy of the string — the only way
    // to pass is for the band's heading to actually say it.
    if (!howto.name) problems.push("no name");
    else if (!visibleText(html).includes(howto.name)) {
      problems.push(`name is nowhere in the rendered text: ${JSON.stringify(howto.name)}`);
    }
    if (steps.length < 2) {
      problems.push(`${steps.length} step(s) — a sequence needs at least two`);
    }
    for (const s of steps) {
      if (s["@type"] !== "HowToStep") problems.push(`step @type ${s["@type"]}`);
      if (!s.name || !s.text) problems.push(`step missing name or text: ${JSON.stringify(s)}`);
    }

    // The FAQ gate's whole idea, applied to the strip: one of the rendered
    // strips must equal the marked-up steps card for card, in order, in the
    // same words. Comparing against every strip rather than the first is what
    // makes this survive a page growing a second one.
    const rendered = strips.map((cards) => cards.map((c) => ({ name: c.t, text: c.p })));
    const want = steps.map((s) => ({ name: s.name, text: s.text }));
    if (!rendered.some((r) => JSON.stringify(r) === JSON.stringify(want))) {
      problems.push(
        `no rendered strip matches the marked-up steps` +
          `\n        markup:  ${JSON.stringify(rendered)}` +
          `\n        json-ld: ${JSON.stringify(want)}`,
      );
    }
    if (problems.length) howToProblems.push(`${path}: ${problems.join("; ")}`);
  }

  // --- Service
  const svc = byType.get("Service");
  if (SERVICE_PAGES.has(path) !== Boolean(svc)) {
    serviceProblems.push(
      `${path}: expected Service ${SERVICE_PAGES.has(path)}, found ${Boolean(svc)}`,
    );
  } else if (svc) {
    const problems = [];
    if (svc.url !== canonical) problems.push(`url ${svc.url} != canonical ${canonical}`);
    if (svc["@id"] !== `${canonical}#service`) problems.push(`@id ${svc["@id"]}`);
    if (svc.provider?.["@id"] !== ORG_ID) problems.push(`provider ${JSON.stringify(svc.provider)}`);
    if (!svc.areaServed) problems.push("no areaServed (§11a.3)");
    // Offers carry no price by decision; they must still name things the page
    // actually shows. This is what makes the hand-stated hellov catalogue safe.
    const text = visibleText(html);
    for (const offer of svc.hasOfferCatalog?.itemListElement ?? []) {
      const o = offer.itemOffered;
      if (o.name && !text.includes(o.name)) problems.push(`offer name not on page: ${o.name}`);
      if (o.description && !text.includes(o.description)) {
        problems.push(`offer description not on page: ${o.description}`);
      }
      if ("price" in offer || "priceCurrency" in offer) {
        problems.push(`offer carries a price while prices are placeholders (IA §10.4)`);
      }
    }
    if (problems.length) serviceProblems.push(`${path}: ${problems.join("; ")}`);
  }

  // --- BlogPosting
  const post = POSTS.find((p) => path === `/en/resources/blog/${p.slug}`);
  const bp = byType.get("BlogPosting");
  if (Boolean(post) !== Boolean(bp)) {
    blogProblems.push(`${path}: post ${Boolean(post)}, BlogPosting ${Boolean(bp)}`);
  } else if (bp) {
    const h1 = decodeEntities(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");
    const problems = [];
    if (bp.headline !== h1) problems.push(`headline ${bp.headline} != h1 ${h1}`);
    if (bp.datePublished !== post.date) problems.push(`datePublished ${bp.datePublished} != ${post.date}`);
    if (bp.mainEntityOfPage !== canonical) problems.push(`mainEntityOfPage ${bp.mainEntityOfPage}`);
    if (!bp.author) problems.push("no author");
    if (problems.length) blogProblems.push(`${path}: ${problems.join("; ")}`);
  }
}

// ------------------------------------------------------------------- report
if (badJson.length) fail(`${badJson.length} JSON-LD block(s) do not parse`, badJson.join("\n      "));
if (badType.length) {
  fail(
    `${badType.length} node(s) use a @type outside §8.2's table`,
    `add it to ALLOWED_TYPES here if it is deliberate:\n      ${badType.join("\n      ")}`,
  );
}
if (deprecated.length) {
  fail(
    `${deprecated.length} use(s) of a schema Google retired in January 2026`,
    `§8.2 says do not implement these:\n      ${[...new Set(deprecated)].join("\n      ")}`,
  );
}
if (missingOrg.length) {
  fail(
    `${missingOrg.length} page(s) do not carry exactly one Organization and one WebSite`,
    missingOrg.join("\n      "),
  );
}
if (entityProblems.length) {
  fail(
    `${entityProblems.length} page(s) have an incomplete Organization entity`,
    `§11a.3: these fields are what tie HelloVerify's claims to its real\n      ` +
      `external profiles. Values live in lib/content/company.ts.\n      ` +
      // Identical on every page by construction, so one line is the whole story.
      `${entityProblems[0]}${entityProblems.length > 1 ? `\n      (and ${entityProblems.length - 1} more, identically)` : ""}`,
  );
}
if (orgBlocks.size > 1) {
  fail(
    `the Organization block is NOT byte-identical across pages (${orgBlocks.size} variants)`,
    `§11a.3: inconsistent entity data is the most common reason an engine\n      attributes a claim to the wrong company. Variants:\n      ` +
      [...orgBlocks.values()].map((ps) => `${ps.length} page(s), e.g. ${ps[0]}`).join("\n      "),
  );
}
if (siteBlocks.size > 1) {
  fail(`the WebSite block is not byte-identical (${siteBlocks.size} variants)`, "");
}
if (danglingRefs.length) {
  fail(
    `${danglingRefs.length} @id reference(s) point at a node nothing defines`,
    [...new Set(danglingRefs)].join("\n      "),
  );
}
if (strayGraph.length) {
  fail(
    `${strayGraph.length} page-level node(s) on a non-page route`,
    `these URLs are not pages and must not describe one:\n      ${strayGraph.join("\n      ")}`,
  );
}
if (crumbMismatch.length) {
  fail(
    `${crumbMismatch.length} breadcrumb disagreement(s) between markup and JSON-LD`,
    `Google requires the two to match:\n      ${crumbMismatch.join("\n      ")}`,
  );
}
if (faqMismatch.length) {
  fail(
    `${faqMismatch.length} FAQ disagreement(s) between the page and its FAQPage`,
    `the marked-up question and answer must both be visible, verbatim:\n      ${faqMismatch.join("\n      ")}`,
  );
}
if (howToProblems.length) {
  fail(
    `${howToProblems.length} HowTo problem(s)`,
    `§17 condition 18: every marked-up step must be a rendered card, in the\n      ` +
      `same words, and every process strip must be a stated decision:\n      ` +
      howToProblems.join("\n      "),
  );
}
if (serviceProblems.length) {
  fail(`${serviceProblems.length} Service problem(s)`, serviceProblems.join("\n      "));
}
if (blogProblems.length) {
  fail(`${blogProblems.length} BlogPosting problem(s)`, blogProblems.join("\n      "));
}

console.log(`pages with a graph:  ${pagesWithGraph} / ${sitemapPaths.size}`);
console.log("");
note.push(`Organization block variants: ${orgBlocks.size} (must be 1)`);
note.push(`BreadcrumbList: ${counts.BreadcrumbList}   FAQPage: ${counts.FAQPage}`);
note.push(`Service: ${counts.Service}   BlogPosting: ${counts.BlogPosting}`);
note.push(
  `HowTo: ${counts.HowTo} of ${HOWTO_PAGES.size + HOWTO_NOT_A_SEQUENCE.size} strips ` +
    `(${HOWTO_NOT_A_SEQUENCE.size} are not sequences), ${stepCards} step cards read`,
);
for (const n of note) console.log(`  - ${n}`);
console.log("");

if (failures.length === 0) {
  console.log(
    "PASS - the emitted graph matches the pages it describes, every FAQ answer\n" +
      "       and process step is on the page verbatim, the Organization entity is\n" +
      "       identical everywhere, and no retired schema is in use",
  );
  process.exit(0);
}
for (const f of failures) console.log(`  x ${f}\n`);
console.log(`FAIL - ${failures.length} problem(s)`);
process.exit(1);
