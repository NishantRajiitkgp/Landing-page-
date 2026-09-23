/** TASKS.md Part 11: "a pre-commit secret-scanning hook to sit alongside
 *  `npm run check:secrets`".
 *
 *  ALONGSIDE, not instead of, and the two scan different things on purpose:
 *
 *    check-secrets.mjs  reads `.next/static/` - "precisely the set of files
 *                       served to a browser". It answers "did a credential
 *                       SHIP?". It needs a build, so it cannot run in a hook,
 *                       and it is blind to a credential committed into a file
 *                       that no client bundle imports - a .env.local, a service
 *                       account key, a fixture, a note in a markdown file.
 *    this file          reads the STAGED CONTENT, or every tracked text file.
 *                       It answers "is a credential entering the repository?".
 *                       It needs no build and runs in about a second.
 *
 *  The second question is the one that matters more, because the answer to the
 *  first is recoverable and the answer to the second is not: a secret in a build
 *  output is deleted by the next build, and a secret in a commit is in every
 *  clone and every fork forever, and rotating it is the only real fix.
 *
 *  Usage:
 *      node tools/ci/scan-source-secrets.mjs --staged    (the pre-commit hook)
 *      node tools/ci/scan-source-secrets.mjs --tracked   (CI, whole tree)
 *
 *  Exit code is 1 on any finding, and a finding NEVER prints the matched text -
 *  the same rule check-secrets.mjs follows, for the same reason: a CI log and a
 *  developer's scrollback are not safe places for a credential.
 *
 *  NO INLINE ALLOW MARKER, and that is the one design decision worth arguing
 *  about. A `// secret-scan-allow` comment is the usual escape hatch and it was
 *  rejected: this scanner exists to be un-bypassable by accident, and a marker
 *  that silences it is a bypass that survives in the file, gets copied to the
 *  next file, and is invisible in a diff nobody reads closely. If a rule here
 *  produces a false positive, the fix is to narrow the rule in this file, where
 *  the change is reviewable.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";

const mode = process.argv[2];
if (mode !== "--staged" && mode !== "--tracked") {
  console.log("usage: node tools/ci/scan-source-secrets.mjs --staged | --tracked");
  process.exit(2);
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

const root = git(["rev-parse", "--show-toplevel"]).trim();

/** EVERY git call below is `git -C <root> ...`, and the first version of this
 *  file was wrong for want of it. `git ls-files` is one of the commands that
 *  respects the working directory: run from helloverify-web it lists only that
 *  subtree AND prints paths relative to it, so `path.join(root, file)` pointed
 *  at <root>/src/... instead of <root>/helloverify-web/src/..., every read threw
 *  ENOENT, every throw was caught as "skipped", and the scan reported
 *  "1 text file scanned, 281 skipped - PASS". A scanner that passes because it
 *  read nothing is worse than no scanner, so two things changed: this wrapper,
 *  and an unreadable file is now a FINDING rather than a skip - see the
 *  `unreadable` list at the bottom. `git diff --cached` does not have this
 *  behaviour, which is exactly why the bug was invisible in the hook. */
function gitAtRoot(args) {
  return git(["-C", root, ...args]);
}

/** Extensions with no text to scan. `text=auto` in .gitattributes already keeps
 *  these out of EOL normalisation; this is the same list for the same reason,
 *  and skipping them is a speed decision rather than a safety one - a 3 MB jpg
 *  read as UTF-8 produces megabytes of replacement characters and no findings. */
const SKIP_EXT = new Set([
  ".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".ico", ".pdf",
  ".woff", ".woff2", ".ttf", ".otf", ".eot",
  ".zip", ".gz", ".br", ".xlsx", ".pyc", ".mp4", ".webm",
]);

/** 8 MB, and the number was raised from 2 MB after measuring rather than
 *  guessed. The largest tracked text file is not package-lock.json (445 KB) but
 *  design/helloverify-homepage.html at 2.64 MB - a captured page of the OLD
 *  site, which is the single file in this repository most likely to contain a
 *  credential: AUDIT E1 found the old build shipping CRM tokens and an AES key
 *  to every visitor, and a saved copy of that page would contain them. A cap
 *  that excluded exactly that file would have been the wrong cap.
 *
 *  A limit still exists so that a checked-in dataset cannot make a pre-commit
 *  hook take thirty seconds and get itself disabled - but anything over it is
 *  reported in the totals as skipped, never counted as clean. */
const MAX_BYTES = 8 * 1024 * 1024;

// ── Rule 1: files that are never committed at all ────────────────────────────
// A path rule, not a content rule, because these are dangerous whatever is in
// them. `.env*` is already in .gitignore - this catches `git add -f`, which is
// how an ignored file actually gets committed, and the copy someone made at
// `helloverify-web/env.local.txt` while debugging, which .gitignore never
// covered.
const FORBIDDEN_PATHS = [
  {
    re: /(^|\/)\.env($|\.)(?!example$)/,
    why: "an environment file. `.env.example` is the only one that belongs in the repo, and it holds names with empty values",
  },
  {
    re: /(^|\/)env\.(local|prod|production)[^/]*$/i,
    why: "a copy of an environment file under a name .gitignore does not cover",
  },
  {
    re: /\.(pem|p12|pfx|jks|keystore|ppk)$/i,
    why: "a key or certificate store",
  },
  {
    re: /(^|\/)id_(rsa|dsa|ecdsa|ed25519)$/,
    why: "an SSH private key",
  },
  {
    // `[^/]*` on BOTH sides of the keyword, because the test fixture was called
    // prod-service-account.json and a rule anchored to the start of the filename
    // missed it - it was caught only by the service-account-JSON shape below,
    // which a key file stored in some other format would not have.
    //
    // This comment used to quote that shape's JSON key literally, and the
    // scanner flagged its own source: measured, `--staged` over this change
    // reported "scan-source-secrets.mjs:117 looks like a service-account JSON".
    // Which is the rule working. Prose about a pattern has to avoid writing the
    // pattern out, and that is cheaper than an exemption for this file - an
    // exemption would also cover a real key pasted into it.
    re: /(^|\/)[^/]*(service[-_]?account|gcp[-_]?(sa|key)|sa[-_]?key|credentials)[^/]*\.json$/i,
    why: "a service-account key file. azure-pipelines.yml takes the Cloud Run key from a secret variable and writes it to the agent's temp directory, never to the repo",
  },
];

// ── Rule 2: shapes ───────────────────────────────────────────────────────────
// The same five shapes check-secrets.mjs uses, plus two that only make sense in
// source. These are the rules that catch the leak where the variable was
// renamed, which is the leak a name list never finds. Each is deliberately
// specific enough not to fire on minified or hashed application code: a bare
// /[A-Za-z0-9]{32}/ would match a webpack chunk hash on every build and get this
// check switched off.
const SHAPES = [
  { name: "private key block", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: "Zoho OAuth token", re: /1000\.[0-9a-f]{32}\.[0-9a-f]{32}/ },
  { name: "Google API key", re: /AIza[0-9A-Za-z_-]{35}/ },
  { name: "AWS access key id", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "Slack token", re: /xox[baprs]-[0-9A-Za-z-]{10,}/ },
  { name: "JWT", re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./ },
  // A GCP service-account key pasted inline rather than saved as a file. The
  // filename rule above misses that case entirely.
  { name: "service-account JSON", re: /"type"\s*:\s*"service_account"/ },
  // Azure DevOps and GitHub personal access tokens, because this repo is about
  // to be configured by hand in two web UIs and a PAT is what those hand out.
  { name: "GitHub token", re: /\bgh[pousr]_[A-Za-z0-9]{36,}/ },
];

// ── Rule 3: a secret name with a value after it ──────────────────────────────
// Names come from check-secrets.mjs and .env.example. The `\S` at the end is the
// whole rule: it requires a VALUE, which is what makes `.env.example` pass
// unmodified. Measured against that file - `ZOHO_CLIENT_ID=`,
// `ZOHO_CLIENT_SECRET=`, `ZOHO_REFRESH_TOKEN=` and
// `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=` are all empty there, by design ("it is
// the list of names the application reads and what happens when they are
// absent"), so no exemption for that path is needed and none is granted.
//
// LEADS_FALLBACK_EMAIL is in check-secrets.mjs's list and NOT in this one. It is
// not a credential: `.env.example` ships it as
// `LEADS_FALLBACK_EMAIL=sales@helloverify.com`, a published address. It belongs
// in the client-bundle check because a monitored internal address should not be
// in shipped JavaScript; it does not belong here, where including it would fail
// on the documented example file and teach the first developer who hit it to
// pass --no-verify.
const SECRET_NAMES = [
  "ZOHO_CLIENT_SECRET",
  "ZOHO_REFRESH_TOKEN",
  "ZOHO_CLIENT_ID",
  "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY",
  "GCP_SA_KEY",
];
// Two details in this regex are load-bearing and both were found by running it
// over this repository rather than by reading it:
//
//   [ \t] and not \s around the separator. With `\s*` the pattern crosses
//   newlines, so `.env.example`'s empty `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=`
//   matched the `#` beginning the comment on the NEXT line and the documented
//   contract file failed its own scan.
//
//   the negative lookahead. `GCP_SA_KEY: $(GCP_SA_KEY)` in azure-pipelines.yml
//   is not a leaked key, it is the correct way to pass one - an indirection
//   through a secret variable, `process.env`, or a loud REPLACE__ placeholder is
//   the shape of code that handles a secret properly, and flagging it is how a
//   scanner earns a reputation for crying wolf.
const ASSIGNED = new RegExp(
  String.raw`(?:^|[\s'"(,{])(?:export[ \t]+)?(` +
    SECRET_NAMES.join("|") +
    String.raw`)[ \t]*[:=][ \t]*(?:['"\x60])?(?!\$|\{\{|process\.env|REPLACE__)\S`,
  "m",
);

// ── Rule 4: a credential behind a NEXT_PUBLIC_ prefix ────────────────────────
// .env.example's first paragraph: "no credential is ever prefixed NEXT_PUBLIC_.
// Anything so prefixed is inlined into the JavaScript bundle and is public by
// construction - that is precisely how the previous build shipped the CRM tokens
// and an AES key to every visitor" (AUDIT E1). check-secrets.mjs catches that
// after a build; this catches it at the commit, and it catches the invented name
// as well as the known one.
//
// NEXT_PUBLIC_GA_MEASUREMENT_ID does not match, and that is the case this rule
// has to get right: .env.example argues at length that a GA measurement id is an
// identifier rather than a credential. The suffix list is what separates them.
const PUBLIC_SECRET = /NEXT_PUBLIC_[A-Z0-9_]*(SECRET|TOKEN|PASSWORD|PASSWD|CREDENTIAL|KEY)\b/;

function filesToScan() {
  if (mode === "--staged") {
    // --diff-filter=ACMR: added, copied, modified, renamed. A deletion has no
    // content to scan, and including D would try to read an index entry that is
    // gone.
    const out = gitAtRoot(["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"]);
    return out.split("\0").filter(Boolean);
  }
  return gitAtRoot(["ls-files", "-z"]).split("\0").filter(Boolean);
}

/** In --staged mode the bytes come from the INDEX, not the worktree. This is the
 *  difference between scanning what is about to be committed and scanning what
 *  happens to be on disk, and the gap between them is real: `git add` then edit,
 *  or `git add -p` on a file whose unstaged half holds the key, both commit
 *  something the worktree no longer says. */
function contentOf(file) {
  if (mode === "--staged") {
    return execFileSync("git", ["-C", root, "show", `:${file}`], {
      encoding: "utf8",
      maxBuffer: MAX_BYTES * 2,
    });
  }
  const abs = path.join(root, file);
  if (statSync(abs).size > MAX_BYTES) return null;
  return readFileSync(abs, "utf8");
}

const findings = [];
const unreadable = [];
let scanned = 0;
let skipped = 0;

for (const file of filesToScan()) {
  for (const rule of FORBIDDEN_PATHS) {
    if (rule.re.test(file)) findings.push(`${file}: ${rule.why}`);
  }

  if (SKIP_EXT.has(path.extname(file).toLowerCase())) {
    skipped++;
    continue;
  }

  let text;
  try {
    text = contentOf(file);
  } catch (err) {
    // UNREADABLE IS NOT CLEAN. Every entry in this repository's index is mode
    // 100644 or 100755 - measured, `git ls-files -s` finds no symlink (120000)
    // and no submodule (160000) - so a file git listed and this script cannot
    // read means the listing and the reading disagree about where the file is,
    // which is the bug described above the gitAtRoot() wrapper. Swallowing it as
    // a skip is what made that bug pass.
    unreadable.push(`${file}: ${err?.code ?? err?.message ?? "unreadable"}`);
    continue;
  }
  if (text === null) {
    // Over MAX_BYTES. Genuinely skipped, and reported as such in the totals.
    skipped++;
    continue;
  }
  scanned++;

  for (const shape of SHAPES) {
    const m = shape.re.exec(text);
    if (m) {
      const line = text.slice(0, m.index).split("\n").length;
      findings.push(
        `${file}:${line}: looks like a ${shape.name} (${m[0].length} chars, not printed)`,
      );
    }
  }

  const assigned = ASSIGNED.exec(text);
  if (assigned) {
    const line = text.slice(0, assigned.index).split("\n").length;
    findings.push(`${file}:${line}: ${assigned[1]} is assigned a non-empty value`);
  }

  const pub = PUBLIC_SECRET.exec(text);
  if (pub) {
    const line = text.slice(0, pub.index).split("\n").length;
    findings.push(
      `${file}:${line}: ${pub[0]} - a credential behind a NEXT_PUBLIC_ prefix is public by construction (AUDIT E1)`,
    );
  }
}

console.log(
  `${mode.slice(2)}: ${scanned} text file(s) scanned, ${skipped} skipped ` +
    `(binary extension or over ${MAX_BYTES / 1024 / 1024} MB)`,
);
console.log(
  `patterns: ${FORBIDDEN_PATHS.length} path rules, ${SHAPES.length} shapes, ` +
    `${SECRET_NAMES.length} names, 1 NEXT_PUBLIC_ rule\n`,
);

if (unreadable.length) {
  for (const u of unreadable) console.log(`  ? ${u}`);
  console.log(
    `\nFAIL - ${unreadable.length} file(s) git listed and this scanner could not read.\n` +
      "       That is a bug in the scanner, not a clean tree. Nothing was scanned\n" +
      "       for those paths, so the result is unknown rather than PASS.",
  );
  process.exit(1);
}

if (findings.length) {
  for (const f of findings) console.log(`  x ${f}`);
  console.log(
    `\nFAIL - ${findings.length} possible secret(s) entering the repository.\n` +
      "\n" +
      "       A credential in a commit is in every clone and every fork, and\n" +
      "       deleting it in a later commit does not remove it. If one of these\n" +
      "       is real, the fix is to ROTATE it, then unstage the file.\n" +
      "\n" +
      "       If one of these is wrong, narrow the rule in\n" +
      "       tools/ci/scan-source-secrets.mjs. There is deliberately no inline\n" +
      "       allow marker, and `--no-verify` leaves the same finding for the\n" +
      "       pipeline to make on the pull request.",
  );
  process.exit(1);
}

console.log("PASS - no secret-shaped content, and no file that should never be committed");
process.exit(0);
