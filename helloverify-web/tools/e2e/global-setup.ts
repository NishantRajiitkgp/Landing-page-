import { readFileSync } from "node:fs";

/** Refuse to run against a server that is serving a different build.
 *
 *  THIS EXISTS BECAUSE IT HAPPENED. `webServer.reuseExistingServer` is on
 *  locally, which is what makes the suite quick to re-run - but it means a
 *  `next start` left over from an earlier build silently becomes the thing
 *  under test. A real accessibility fix was verified as present in
 *  `.next/server/app/.../technology.html`, and the browser kept reporting the
 *  violation, because the page it was given came from a server started three
 *  builds ago. Twenty minutes went into the wrong hypothesis.
 *
 *  Next stamps a fresh 21-character `BUILD_ID` into every page, and
 *  `.next/BUILD_ID` holds the one on disk. If they disagree, the results would
 *  be about bytes nobody can reproduce, so the run stops here rather than
 *  producing a green tick for a stale artefact.
 *
 *  `tools/port/html-identity.mjs` normalises this same value for the opposite
 *  reason - there it is noise, because two builds are being compared. Here it
 *  is the signal.
 */
export default async function globalSetup(): Promise<void> {
  const baseURL = process.env.PW_BASE_URL ?? "http://localhost:3100";
  const onDisk = readFileSync(".next/BUILD_ID", "utf8").trim();

  const res = await fetch(`${baseURL}/en`);
  if (!res.ok) throw new Error(`global-setup: ${baseURL}/en answered ${res.status}`);
  const html = await res.text();

  if (!html.includes(onDisk)) {
    throw new Error(
      `global-setup: the server at ${baseURL} is not serving this build.\n` +
        `  .next/BUILD_ID is ${onDisk}, and /en does not contain it.\n` +
        `  A stale 'next start' is almost certainly still holding the port —\n` +
        `  stop it and let Playwright start its own, or restart it after building.`,
    );
  }
}
