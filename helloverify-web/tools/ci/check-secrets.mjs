/** "Zero secrets in the client bundle, verified by automated grep of build
 *  output" (BUILD-SPEC §17, AUDIT E1).
 *
 *  §4 rule 3 and `lib/leads/*` already make this structurally true: everything
 *  that touches a credential imports `server-only`, so a client component that
 *  reached for one would fail the build. This is the check that the structural
 *  argument held, run against the bytes that actually ship — the same relation
 *  `check-sitemap.mjs` has to `routes.ts`.
 *
 *  It greps `.next/static/`, which is precisely the set of files served to a
 *  browser. Server bundles under `.next/server/` legitimately contain secrets
 *  at runtime and are deliberately NOT scanned.
 *
 *  Two classes of finding, and the second is the one that catches a real leak:
 *
 *    1. **Known variable names.** `ZOHO_CLIENT_SECRET` appearing as a literal
 *       string in client JS means someone read it without `server-only`, or
 *       prefixed it `NEXT_PUBLIC_` to "make it work".
 *    2. **Shapes.** A Zoho OAuth token, a Google service-account private key, a
 *       JWT, an AWS key. These catch the leak where the variable was renamed,
 *       which is the leak a name list never finds.
 *
 *  Run after `next build`:
 *      node tools/ci/check-secrets.mjs
 */
import { readdir, readFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);

/** Env names that must never appear in client JS. Taken from `.env.example`
 *  and `lib/leads/env.ts` — if one is added there it belongs here too. */
const SECRET_NAMES = [
  "ZOHO_CLIENT_SECRET",
  "ZOHO_REFRESH_TOKEN",
  "ZOHO_CLIENT_ID",
  "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY",
  "LEADS_FALLBACK_EMAIL",
];

/** Shapes, for the rename case. Each is deliberately specific enough not to
 *  fire on minified application code — a bare /[A-Za-z0-9]{32}/ would match a
 *  webpack chunk hash on every build and get this check switched off. */
const SECRET_SHAPES = [
  { name: "private key block", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: "Zoho OAuth token", re: /1000\.[0-9a-f]{32}\.[0-9a-f]{32}/ },
  { name: "Google API key", re: /AIza[0-9A-Za-z_-]{35}/ },
  { name: "AWS access key id", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "Slack token", re: /xox[baprs]-[0-9A-Za-z-]{10,}/ },
  { name: "JWT", re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./ },
];

const findings = [];
let scanned = 0;
let bytes = 0;

async function scan(dir) {
  for (const item of await readdir(new URL(dir, root), { withFileTypes: true })) {
    if (item.isDirectory()) {
      await scan(`${dir}${item.name}/`);
      continue;
    }
    if (!/\.(js|mjs|css|map)$/.test(item.name)) continue;
    const text = await readFile(new URL(`${dir}${item.name}`, root), "utf8");
    scanned++;
    bytes += text.length;

    for (const name of SECRET_NAMES) {
      if (text.includes(name)) findings.push(`${dir}${item.name}: contains "${name}"`);
    }
    for (const shape of SECRET_SHAPES) {
      const m = shape.re.exec(text);
      if (m) {
        // Never print the match itself — a CI log is not a safe place for it.
        findings.push(
          `${dir}${item.name}: looks like a ${shape.name} at offset ${m.index} ` +
            `(${m[0].length} chars, not printed)`,
        );
      }
    }
  }
}

await scan(".next/static/").catch(() => {
  console.log("FAIL - no .next/static in the build output. Run `npm run build` first.");
  process.exit(1);
});

console.log(`client files scanned: ${scanned}  (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
console.log(`patterns: ${SECRET_NAMES.length} names, ${SECRET_SHAPES.length} shapes\n`);

if (findings.length) {
  for (const f of findings) console.log(`  x ${f}`);
  console.log(
    `\nFAIL - ${findings.length} possible secret(s) in the client bundle.\n` +
      "       Anything reachable from a Client Component ships to every visitor.\n" +
      "       The fix is `server-only` on the module that reads it (§4 rule 3),\n" +
      "       not renaming the variable.",
  );
  process.exit(1);
}

console.log("PASS - no secret names or secret-shaped strings in the client bundle");
process.exit(0);
