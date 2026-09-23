/** Installs tools/git-hooks/ as this clone's hook directory. Run by npm's
 *  `prepare` script, which npm executes after every `npm install` and `npm ci`
 *  in this package.
 *
 *  HOW A DEVELOPER INSTALLS IT: they do not. They run `npm install`, which they
 *  have to do anyway, and this runs. Part 11 asks for a hook that is
 *  "installable without a network fetch and not bypassable by accident", and
 *  those two requirements together rule out the obvious answers:
 *
 *    husky / lefthook / pre-commit - each is a dependency to download, and
 *        `pre-commit` is a Python tool whose config fetches hook repositories
 *        from the network at install time. A hook that needs the network to
 *        install is a hook that is absent on the machine behind a proxy, and
 *        this repo has already been bitten by a tracked .npmrc pointing npm's
 *        cache at a path that does not exist on Linux.
 *    "copy this file into .git/hooks" in the README - the install step nobody
 *        performs. .git/hooks is not versioned, so there is no way to tell
 *        whether anyone did.
 *
 *  core.hooksPath is the mechanism instead: one git config value, pointing at a
 *  directory that IS versioned, so the hook is reviewed and updated like any
 *  other file and a change to it reaches everyone on their next install.
 *
 *  WHAT HAPPENS IF IT IS NOT INSTALLED - because that is the honest question,
 *  and the answer is not "nothing":
 *
 *    - Nothing blocks the commit locally. `git commit` with no hook is a normal
 *      commit, and so is `git commit --no-verify` with one. A pre-commit hook is
 *      not a security control and this one is not pretending to be: it cannot
 *      be, because the machine running it is the machine being protected.
 *    - The pull request still fails. azure-pipelines.yml runs
 *      `npm run check:secrets:source`, which is this same scanner over every
 *      tracked file, and the branch policy makes that check required. So an
 *      uninstalled hook costs a round trip to CI; it does not cost the control.
 *    - What is lost is the only thing that matters: CI finds the credential
 *      AFTER it is in a commit, and by then the fix is rotation rather than
 *      unstaging. That is what the hook buys, and it is why it is installed by
 *      `prepare` rather than documented.
 *
 *  THIS SCRIPT NEVER FAILS AN INSTALL. Every path exits 0. `prepare` runs inside
 *  `npm ci` on the CI agent and inside anyone's first `npm install`, and a
 *  hook installer that can break `npm ci` is a worse problem than a missing
 *  hook.
 */
import { execFileSync } from "node:child_process";
import { chmodSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath rather than new URL(...).pathname: on Windows the latter yields
// "/D:/Projects/..." with a leading slash, and every path.join below would then
// be silently wrong on the platform this repo is developed on.
const HOOKS_DIR = path.dirname(fileURLToPath(import.meta.url));

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

try {
  // Not a git working tree: an npm tarball, a Docker build context, a vendored
  // copy. There is nothing to install into and nothing is wrong.
  let root;
  try {
    root = git(["rev-parse", "--show-toplevel"]);
  } catch {
    process.exit(0);
  }

  // Relative to the working-tree root, which is what git resolves a relative
  // core.hooksPath against. Computed rather than hardcoded as
  // "helloverify-web/tools/git-hooks" so that it survives the package moving or
  // the repo root and the package being the same directory.
  const relative = path.relative(root, HOOKS_DIR).split(path.sep).join("/");

  let existing = "";
  try {
    existing = git(["config", "--local", "--get", "core.hooksPath"]);
  } catch {
    existing = "";
  }

  if (existing && existing !== relative) {
    // Somebody else's hook manager is installed. Overwriting it would silently
    // disable their hooks, which is the same class of harm this script exists to
    // prevent, pointed at a different victim.
    console.log(
      `git-hooks: core.hooksPath is already "${existing}" - left alone.\n` +
        `           The secret scan is NOT installed. Either point that directory's\n` +
        `           pre-commit at "node tools/ci/scan-source-secrets.mjs --staged",\n` +
        `           or run: git config --local core.hooksPath ${relative}`,
    );
    process.exit(0);
  }

  if (existing !== relative) {
    git(["config", "--local", "core.hooksPath", relative]);
    console.log(`git-hooks: core.hooksPath -> ${relative}`);
  }

  // The executable bit, set at install time on every platform rather than
  // relied on from the index. Git refuses to run a hook that is not executable
  // and says nothing about why, and the mode bit in a commit made from Windows
  // is whatever core.filemode decided - so the one place it can be guaranteed is
  // here, after checkout, on the machine that will run it. chmod is a no-op on
  // Windows and harmless.
  for (const entry of readdirSync(HOOKS_DIR)) {
    if (entry.endsWith(".mjs") || entry.endsWith(".md")) continue;
    try {
      chmodSync(path.join(HOOKS_DIR, entry), 0o755);
    } catch {
      /* a read-only checkout; the hook may still run if the bit is already set */
    }
  }
} catch (err) {
  console.log(`git-hooks: not installed (${err?.message ?? err}). Commits are not blocked.`);
  process.exit(0);
}
