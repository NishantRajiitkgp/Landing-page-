import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { check } from "./harness.ts";

import { parseContactTab, writeContactTab } from "../../src/lib/contact/tab.ts";
import { pick } from "../../src/lib/copy/index.ts";
import { CONTACT } from "../../src/lib/copy/contact.ts";
import { LEGACY_ROUTES } from "../../src/lib/seo/legacy-urls.ts";
import { allRoutes } from "../../src/lib/seo/routes.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

console.log("1. ?tab=enquiry | ?tab=track matches the old ContactUsUnified pair");
check("bare query is enquiry", parseContactTab(null) === "enquiry");
check("empty is enquiry", parseContactTab("") === "enquiry");
check("enquiry stays enquiry", parseContactTab("enquiry") === "enquiry");
check("track is track", parseContactTab("track") === "track");
check("junk falls back to enquiry", parseContactTab("applicant") === "enquiry");

{
  const hrefs: string[] = [];
  const state = { __NA: 1 };
  const history = {
    state,
    replaceState(next: unknown, _title: string, url: string) {
      hrefs.push(url);
      this.state = next;
    },
  };
  const previous = (globalThis as { window?: unknown }).window;
  (globalThis as { window?: unknown }).window = {
    location: { href: "https://www.helloverify.com/en/contact?interest=certifier" },
    history,
  };
  try {
    writeContactTab("track");
    check(
      "write keeps other params",
      hrefs[0] === "/en/contact?interest=certifier&tab=track",
      hrefs[0],
    );
    check("write keeps history.state", history.state === state);
  } finally {
    (globalThis as { window?: unknown }).window = previous;
  }
}

console.log("2. leftover aliases still land on /contact");
{
  const aliases = ["/signup", "/support", "/support/enquiry", "/support/track", "/premium"];
  for (const from of aliases) {
    const row = LEGACY_ROUTES.find((r) => r.from === from);
    check(`${from} -> /contact`, row?.to === "/contact", row);
  }
}

console.log("3. blog and legal old paths stay 308 onto the IA canonicals");
{
  const keep = [
    ["/blog", "/resources/blog"],
    ["/blog/fir-check-api", "/resources/blog/fir-check-api"],
    ["/privacy-policy", "/legal/privacy-policy"],
    ["/terms-and-conditions", "/legal/terms-of-service"],
  ] as const;
  for (const [from, to] of keep) {
    const row = LEGACY_ROUTES.find((r) => r.from === from);
    check(`${from} -> ${to}`, row?.to === to, row);
    check(`${to} is a live route`, allRoutes().some((r) => r.path === to), to);
  }
}

console.log("4. contact copy names both tabs");
{
  const en = pick(CONTACT, "en");
  check("enquiry label", en.tabs.enquiry === "Enquiry");
  check("track label", en.tabs.track === "Track your Application");
  check("hi is not English paste", pick(CONTACT, "hi").tabs.track !== en.tabs.track);
  check("ar is not English paste", pick(CONTACT, "ar").tabs.track !== en.tabs.track);
}

console.log("5. track stays honest — old TrackPanel never called an API");
{
  const en = pick(CONTACT, "en");
  check(
    "English result refuses a live lookup",
    en.track.result.includes("cannot look up a live case"),
    en.track.result,
  );
  check(
    "hi result is not English paste",
    pick(CONTACT, "hi").track.result !== en.track.result,
  );
  check(
    "ar result is not English paste",
    pick(CONTACT, "ar").track.result !== en.track.result,
  );
  const form = readFileSync(join(root, "src/components/forms/ContactTrackForm.tsx"), "utf8");
  check("track form does not fetch", !form.includes("fetch(") && !form.includes("/api/"));
  const api = join(root, "src/app/api");
  const names = existsSync(api) ? readdirSync(api) : [];
  check("no /api/track route", !names.includes("track"), names);
}
