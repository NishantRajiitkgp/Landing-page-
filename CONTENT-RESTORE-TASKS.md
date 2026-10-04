# Restore old-site content on the new design

The new chrome, type, templates and SEO stay. The **facts** on every
navbar destination go back to what
`D:\Projects\Application Frontend HV\public\cms\en\*.base.json` already
sold. Say **"next"** to move to the following part.

Do **not** restyle or rewrite these three pages:

- `/` — live homepage (`helloverify-web/src/app/[locale]/page.tsx` and the
  `src/components/sections/**` it mounts)
- `/landing-page` — frozen snapshot
- `/ai`

Companion: `[ROUTE-AND-AUTH-FLOW.md](./ROUTE-AND-AUTH-FLOW.md)` (URLs and
login are already restored). This file is only **page body copy**.

---

## How we work

One part per sitting. A part is done when the commands at the bottom have
been run and this file's status line for that part says **DONE**.

Source of truth for facts: the old English CMS JSON (and the old page
that loaded it). Source of truth for layout: this repo's `PageShell`,
`VerticalPage`, `Lanes`, `Steps`, `CheckTable`, `.rc` receipts, FAQ,
`CommerceCta`. Do not port old CSS or old section components.

---

## The contract

| Surface | Rule |
| --- | --- |
| Navbar destination that existed on the old SPA | Same **checks, packages, prices, TATs, partner names, FAQs, CTAs**. New type and bands. |
| A claim the old CMS did not make | Delete it. Do not keep rewritten marketing that invents a plan, a price, or a partner. |
| A price the old CMS published | Show it. Drop the "placeholder pending sign-off" note once the figure is the live old figure. |
| A price the old CMS did not publish | Do not invent one. |
| `lib/seo/copy.ts` | Title and description must name the same product the body now names. |
| `hi` / `ar` | Same leaf paths as English. Translate; do not paste English. Figures, ₹, brand names stay Latin. |
| Homepage / landing-page / `/ai` | Untouched, even when they still show the rewritten HelloV "Basic / Advanced" story. |
| Buy now | Keep `CommerceCta` (OTP then cart). Wire `packageId` / `unitAmount` to the old SKU, not a made-up `hellov-basic`. |
| JSON-LD `Service` offers | Names and descriptions that the rendered page actually shows. No prices in the offer node (`check-schema`). |

Old CMS files live at `D:\Projects\Application Frontend HV\public\cms\en\`.

---

## Navbar destinations (unique hrefs)

From `SiteNav.tsx`. Premium repeats three of these; they are not extra
parts.

| Nav item | Live path | Old CMS / page | What is wrong today |
| --- | --- | --- | --- |
| HelloV | `/products/hellov` | `hellov.base.json` | Invented Basic ₹499 / Advanced ₹799. Old catalogue is 8 packages + 6 singles + 4 advanced SKUs. |
| For Individuals / Premium consumer | `/individuals/home-family` | same HelloV consumer facts (old had no separate page) | Rewritten household essay; must not contradict HelloV prices or checks. |
| For SMBs | `/products/bgv-smb` | `bgvSmb.base.json` | New copy + placeholder ₹349/₹999. Old has the real SMB packages and custom-pack flow. |
| For Business | `/products/bgv-enterprise` | `enterprise.base.json` | New VerticalPage voice. Old: India enterprise hero, named logos (Cognizant, Infosys, …), employee/vendor tabs, 30+ named checks. |
| Employee Verification | `/employee-verification` | `employees.base.json` | New voice. Old: white-collar / blue-collar split, named checks, TAT, why-it-matters. |
| Customer KYC / Trust | `/products/customer-kyc` | `customerKyc.base.json` | New voice. Old: KYC / KYB / underwriting / AML steps and product names. |
| Certifier | `/products/certifier` | `certifier.base.json` | New voice. Old: vendor checks, invite steps, watchlists, industry list. |
| Health / Premium health | `/solutions/health-authorities` | `healthAuthorities.base.json` | New "unchecked degree" voice. Old: PSV for healthcare workforce, practitioner categories, named checks. |
| Visa / Premium immigration | `/products/immigration?tab=applicant` | `immigrationMigrationService.base.json` (applicant) | Applicant body is new screening essay; old has the applicant how-it-works and authority-adjacent facts. |
| Immigration (Solutions) | `/solutions/immigration-authorities` | same CMS, authority tab | New "check where issued" voice vs old authority overview, partners, fraud claims. |
| Manpower & education | `/solutions/manpower-and-education-authorities` | `educationAuthorities.base.json` | New voice vs old equivalency / qualification / MOM + Client AE. |
| Trade | `/solutions/trade-authorities` | `businessTradeAuthorities.base.json` | New voice vs old authority page. |
| Global Coverage | `/international` | `international.base.json` | New coverage essay vs old international BGV + country packages. |
| Enquiry | `/contact` | `contactUs.base.json` | Tabs already restored (route work). Body copy / offices / role emails if they drifted. |

Not in the navbar but same job, later if needed: `/about` (`about.base.json`),
`/technology` (`technology.base.json`), MOM / MOHESR records.

---

## Part 1 — HelloV catalogue · **DONE (5 Oct 2026)**

Put the live HelloV SKUs on `/products/hellov`. Keep `PageShell`, the
phone, consent steps, FAQ chrome. Replace the two invented plans.

Old catalogue (`hellov.base.json`):

- Packages: Driver ₹499 · Home Staff ₹599 · Tenant ₹549 · Nanny ₹549 ·
  Verify Anyone ₹1099 · Cyber Identity ₹1099 · Know The Identity ₹1099 ·
  Know Your Contact ₹1099
- Single checks: Age ₹199 / 30 min · Digital Employment ₹299 / 60 min ·
  Driving License ₹299 / 30 min · PAN ₹299 / 30 min · Criminal ₹899 /
  30 min · Digital Address ₹299 / 30 min
- Advanced: Home Staff ₹1399 · Nanny ₹1399 · Driver ₹1799 · Tenant ₹1799
- Hero fact: "Make Sure You and Your Family Are Safe!" + WhatsApp
- Do not port AI Travel (`showAi: false` on the old page)

**Held back:** `/individuals/home-family` (Part 2). Homepage shop
(untouchable).

**Measured:** `npm test` — 1385 passed. Live `GET /en/products/hellov`
200. Page shows the eight packages, six singles and four advanced SKUs
with the old ₹ figures. Invented Basic / ₹799 and the placeholder note
are gone.

---

## Part 2 — Home & family matches HelloV · pending

`/individuals/home-family` is new, but the nav sends consumers here.
Reuse the same prices, check names and WhatsApp facts Part 1 restored.
Do not invent a second catalogue.

---

## Part 3 — SMB packages · pending

`/products/bgv-smb` ← `bgvSmb.base.json`. Real packages, prices, steps
("Select Checks / Fill Information / As fast as 24 hours"), custom pack.

---

## Part 4 — Enterprise · pending

`/products/bgv-enterprise` ← `enterprise.base.json`. India-enterprise
hero, trust strip + partner names, screening tabs, named check groups,
Fast / Accurate / Compliant figures (3×, 99.2%, ISO 27001 + GDPR).

---

## Part 5 — Employee verification · pending

`/employee-verification` ← `employees.base.json`. White-collar and
blue-collar bands, named checks, why-it-matters.

---

## Part 6 — Customer KYC · pending

`/products/customer-kyc` ← `customerKyc.base.json`. KYC / KYB /
underwriting / fraud / AML, selfie + liveness flow.

---

## Part 7 — Certifier · pending

`/products/certifier` ← `certifier.base.json`. Vendor checks, invite
steps, screening types, industries.

---

## Part 8 — Health authorities · pending

`/solutions/health-authorities` ← `healthAuthorities.base.json`. PSV,
practitioner categories, education / licence / COGS / employment.

---

## Part 9 — Immigration (applicant + authorities) · pending

`/products/immigration` and `/solutions/immigration-authorities` ←
`immigrationMigrationService.base.json`. Keep the restored tab query.
Port overview, partners, applicant steps, why-we-stand-out. Do not
invent embassy-refusal copy the old page did not run.

---

## Part 10 — Manpower & education · pending

`/solutions/manpower-and-education-authorities` ←
`educationAuthorities.base.json`. Equivalency / qualification, MOM and
Client AE. MOM record page only if its body drifted from
`ministryOfManpower.base.json`.

---

## Part 11 — Trade authorities · pending

`/solutions/trade-authorities` ← `businessTradeAuthorities.base.json`.

---

## Part 12 — International · pending

`/international` ← `international.base.json`. Country packages and
international check names.

---

## Part 13 — Contact body · pending

`/contact` ← `contactUs.base.json`. Offices (Noida, Cairo, Dubai,
Singapore) and the three role blocks if the new page dropped them.
Do not rebuild the honest track form (route Part 11 already did).

---

## Later, not navbar

About (`about.base.json` — YC / values / numbers) and Technology
(`technology.base.json` — trust platform claims). Say so if you want
them after Part 13.
