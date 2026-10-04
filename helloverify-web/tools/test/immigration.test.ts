/** Part 9: old Authorities / Applicant tabs on this host. */
import { check } from "./harness.ts";

import { pick } from "../../src/lib/copy/index.ts";
import { CHROME } from "../../src/lib/copy/chrome.ts";
import { localise } from "../../src/lib/i18n/href.ts";
import {
  IMMIGRATION_APPLICANT_HREF,
  IMMIGRATION_AUTHORITIES_HREF,
  parseImmigrationTab,
  writeImmigrationTab,
} from "../../src/lib/immigration/tab.ts";
import { LEGACY_ROUTES } from "../../src/lib/seo/legacy-urls.ts";
import { legacyRedirects } from "../../src/lib/seo/redirects.ts";
import { allRoutes } from "../../src/lib/seo/routes.ts";

console.log("1. ?tab=applicant | ?tab=authorities matches the old pair");
check("bare query is applicant on this host", parseImmigrationTab(null) === "applicant");
check("empty is applicant", parseImmigrationTab("") === "applicant");
check("applicant stays applicant", parseImmigrationTab("applicant") === "applicant");
check("authorities is authorities", parseImmigrationTab("authorities") === "authorities");
check("junk falls back to applicant", parseImmigrationTab("enquiry") === "applicant");

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
    location: { href: "https://www.helloverify.com/en/products/immigration" },
    history,
  };
  try {
    writeImmigrationTab("applicant");
    check(
      "write sets tab=applicant and keeps history.state",
      hrefs[0] === "/en/products/immigration?tab=applicant" && history.state === state,
      hrefs[0],
    );
  } finally {
    (globalThis as { window?: unknown }).window = previous;
  }
}

console.log("2. premium alias opens the applicant tab");
{
  const row = LEGACY_ROUTES.find((r) => r.from === "/premium/immigration-applicant");
  check(
    "/premium/immigration-applicant -> /products/immigration?tab=applicant",
    row?.to === "/products/immigration?tab=applicant",
    row,
  );
  check(
    "applicant path is a live route",
    allRoutes().some((r) => r.path === "/products/immigration"),
  );
  const rules = legacyRedirects();
  check(
    "/en/premium/immigration-applicant 308s with the tab",
    rules.some(
      (r) =>
        r.source === "/en/premium/immigration-applicant" &&
        r.destination === "/en/products/immigration?tab=applicant",
    ),
  );
}

console.log("3. tab hrefs stay on this host");
check(
  "applicant href localises with the query",
  localise(IMMIGRATION_APPLICANT_HREF, "en") === "/en/products/immigration?tab=applicant",
);
check(
  "authorities href is the live gov vertical",
  IMMIGRATION_AUTHORITIES_HREF === "/solutions/immigration-authorities" &&
    allRoutes().some((r) => r.path === IMMIGRATION_AUTHORITIES_HREF),
);

console.log("4. tab labels are not English paste in hi/ar");
{
  const en = pick(CHROME, "en").footer.links;
  check("en authorities label", en["/solutions/immigration-authorities"] === "Immigration authorities");
  check("en applicant label", en["/products/immigration"] === "Visa & immigration screening");
  check(
    "hi is not English paste",
    pick(CHROME, "hi").footer.links["/products/immigration"] !== en["/products/immigration"],
  );
  check(
    "ar is not English paste",
    pick(CHROME, "ar").footer.links["/products/immigration"] !== en["/products/immigration"],
  );
}
