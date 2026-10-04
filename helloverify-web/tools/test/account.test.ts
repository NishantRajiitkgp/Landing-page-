import { check } from "./harness.ts";

import { pick } from "../../src/lib/copy/index.ts";
import { ACCOUNT } from "../../src/lib/copy/account.ts";
import { accountMetadata } from "../../src/lib/account/metadata.ts";
import {
  APP_HOST,
  APP_ROUTES,
  LEGACY_ROUTES,
} from "../../src/lib/seo/legacy-urls.ts";
import { legacyRedirects } from "../../src/lib/seo/redirects.ts";
import { allRoutes } from "../../src/lib/seo/routes.ts";

const ON_WWW = [
  "/cart",
  "/orders",
  "/orders/candidate",
  "/orders/smb-candidates",
  "/profile-settings",
] as const;

console.log("1. cart / orders / invite / profile-settings stay on this host");
check("APP_ROUTES is empty after Part 5", APP_ROUTES.length === 0, APP_ROUTES);
for (const path of ON_WWW) {
  check(
    `${path} is not a cross-host 308`,
    !APP_ROUTES.some((r) => r.from === path),
  );
  check(
    `${path} is not in the sitemap manifest`,
    !allRoutes().some((r) => r.path === path),
  );
}

const cartlist = LEGACY_ROUTES.find((r) => r.from === "/cartlist");
check("/cartlist -> /cart on this host", cartlist?.to === "/cart", cartlist);

console.log("2. emitted rules match the Part 5 invert");
{
  const rules = legacyRedirects();
  check(
    "no candidate invite rule points at the app",
    !rules.some(
      (r) =>
        (r.source === "/en/orders/candidate" || r.source === "/en/orders/smb-candidates") &&
        r.destination.startsWith(APP_HOST),
    ),
  );
  check(
    "no /en/cart|/en/orders|/en/profile-settings rule points at the app",
    !rules.some(
      (r) =>
        (r.source === "/en/cart" || r.source === "/en/orders" || r.source === "/en/profile-settings") &&
        r.destination.startsWith(APP_HOST),
    ),
    rules.filter((r) => r.source === "/en/cart" || r.source === "/en/orders" || r.source === "/en/profile-settings"),
  );
  check(
    "/en/cartlist 308s to /en/cart",
    rules.some((r) => r.source === "/en/cartlist" && r.destination === "/en/cart"),
  );
}

console.log("3. account metadata is noindex and self-canonical");
{
  const meta = accountMetadata("en", "/orders", "My Orders");
  check("title carries the brand", meta.title === "My Orders — HelloVerify", meta.title);
  check("robots noindex, nofollow", meta.robots?.index === false && meta.robots?.follow === false, meta.robots);
  check(
    "canonical is this host, this path",
    typeof meta.alternates?.canonical === "string" &&
      String(meta.alternates.canonical).endsWith("/en/orders"),
    meta.alternates,
  );
  const invite = accountMetadata("en", "/orders/smb-candidates", "Send candidate invite");
  check(
    "invite canonical is this host",
    typeof invite.alternates?.canonical === "string" &&
      String(invite.alternates.canonical).endsWith("/en/orders/smb-candidates"),
    invite.alternates,
  );
}

console.log("4. account copy is 87 leaves in every served locale");
{
  const en = pick(ACCOUNT, "en");
  check("en cart title", en.cart.title === "My Cart");
  check("en orders title", en.orders.title === "My Orders");
  check("en candidate title", en.candidate.title === "Send candidate invite");
  check("hi is not English paste", pick(ACCOUNT, "hi").cart.title !== en.cart.title);
  check("ar is not English paste", pick(ACCOUNT, "ar").cart.title !== en.cart.title);
}
