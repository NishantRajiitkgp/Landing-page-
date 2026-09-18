/** Assertion helpers for the redirect probe.
 *
 *  Split from `probe-redirects.mjs` only to keep both files under BUILD-SPEC
 *  §4 rule 2's 300 lines. This half is the mechanism; the other half is the
 *  contract being asserted, which is the part worth reading.
 *
 *  `configure(base)` has to be called before anything else — the helpers close
 *  over the origin so each assertion reads as a path, not a URL.
 */

let BASE = "";
export function configure(base) {
  BASE = base.replace(/\/$/, "");
}

export function origin() {
  return BASE;
}

let passed = 0;
const failures = [];

export function check(name, condition, detail) {
  if (condition) {
    passed += 1;
    return true;
  }
  failures.push(`${name}\n      ${detail}`);
  return false;
}

/** One request, no following. Returns { status, location }. */
export async function hop(path) {
  const res = await fetch(BASE + path, { redirect: "manual" });
  const location = res.headers.get("location");
  return {
    status: res.status,
    // Next emits an absolute Location; compare on the path so the probe works
    // against localhost and against production unchanged.
    location: location ? new URL(location, BASE).pathname : null,
  };
}

/** Walk the whole redirect chain. Returns every hop plus the terminal status. */
export async function chase(path, limit = 8) {
  const hops = [];
  let current = path;
  for (let i = 0; i < limit; i += 1) {
    const step = await hop(current);
    if (step.status < 300 || step.status >= 400 || !step.location) {
      return { hops, finalStatus: step.status, finalPath: current };
    }
    hops.push({ from: current, status: step.status, to: step.location });
    current = step.location;
  }
  return { hops, finalStatus: null, finalPath: current, overflow: true };
}

const warnings = [];

export function trace(result) {
  return result.hops.map((h) => `${h.status} -> ${h.to}`).join(" then ") || "(no redirect)";
}

/** A legacy URL must 308 straight to its target, and that target must be a
 *  real page. Anything else is a chain or a 308-into-a-404. */
export async function assertOneHop(source, expected) {
  const result = await chase(source);
  const ok = check(
    `308 ${source}`,
    result.hops.length === 1 && result.hops[0].status === 308 && result.hops[0].to === expected,
    result.hops.length === 0
      ? `no redirect — served ${result.finalStatus} directly`
      : `expected 1 hop -> ${expected}, got ${result.hops.length}: ${trace(result)}`,
  );
  if (ok) {
    check(
      `200 ${expected}`,
      result.finalStatus === 200,
      `target returned ${result.finalStatus} — this is a 308 into a dead page`,
    );
  }
}

/** The trailing-slash variant of a legacy URL. Deliberately looser than
 *  `assertOneHop`, and the reason is worth writing down.
 *
 *  Next registers its own `/:path+/` -> `/:path+` rule with `priority: true`,
 *  so it is matched BEFORE anything `redirects()` returns. `/en/smb/`
 *  therefore 308s to `/en/smb` and only then 308s to `/en/business/smb`. Two
 *  hops, and no ordering of our own rules can pre-empt a priority rule.
 *
 *  The only lever that removes it is `skipTrailingSlashRedirect: true`, and
 *  taking it is a bad trade: it makes BOTH `/en/about` and `/en/about/` return
 *  200 for all 57 routes and hands trailing-slash canonicalisation to our own
 *  proxy code. §6.1 says "Trailing slash: Never. One form, enforced at the
 *  edge" — two live 200s is precisely the failure it forbids, and it would be
 *  site-wide rather than confined to obsolete URLs.
 *
 *  So: two hops is accepted here, on the conditions that every hop is a 308
 *  (unambiguous consolidation, no cached negotiation) and the chain still ends
 *  on the right page with a 200.
 */
export async function assertReaches(source, expected, maxHops) {
  const result = await chase(source);
  check(
    `reaches ${source}`,
    result.hops.length <= maxHops &&
      result.hops.length > 0 &&
      result.hops.every((h) => h.status === 308) &&
      result.finalPath === expected &&
      result.finalStatus === 200,
    `expected <=${maxHops} all-308 hops -> ${expected} (200), got ${trace(result)} (final ${result.finalPath} ${result.finalStatus})`,
  );
}

/** Something that is wrong but is not item 3's to fix. Reported loudly,
 *  does not fail the run — otherwise CI goes red for an unrelated reason and
 *  people learn to ignore it. */
export function warn(name, detail) {
  warnings.push(`${name}\n      ${detail}`);
}


/** Print the run and return the process exit code. */
export function report() {
  console.log(`\n${"─".repeat(60)}`);
  if (warnings.length > 0) {
    console.log(`\n${warnings.length} known deviation(s) \u2014 reported, not failing:\n`);
    for (const w of warnings) console.log(`  ! ${w}`);
    console.log("");
  }
  if (failures.length === 0) {
    console.log(`PASS \u2014 ${passed} assertions`);
    return 0;
  }
  console.log(`FAIL \u2014 ${failures.length} of ${passed + failures.length} assertions\n`);
  for (const f of failures) console.log(`  \u2717 ${f}`);
  return 1;
}
