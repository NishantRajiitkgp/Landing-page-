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

**Held back:** homepage shop (untouchable). Home & family is Part 2.

**Measured:** `npm test` — 1385 passed. Live `GET /en/products/hellov`
200. Page shows the eight packages, six singles and four advanced SKUs
with the old ₹ figures. Invented Basic / ₹799 and the placeholder note
are gone.

---

## Part 2 — Home & family matches HelloV · **DONE (5 Oct 2026)**

`/individuals/home-family` keeps `VerticalPage`. Facts are the Part 1
HelloV catalogue: packages from ₹499, singles from ₹199, WhatsApp QR
steps, same check names. No second SKU and no invented 15-minute /
two-day times. CTAs go to `/products/hellov#plans` and `#singles`.

Homepage, `/landing-page`, and `/ai` were not edited.

**Measured:** `npm test` — 1385 passed. Live `GET /en/individuals/home-family`
200. Packages from ₹499, singles from ₹199, CTAs to `/products/hellov`.
Homepage hero unchanged.

---

## Part 3 — SMB packages · **DONE (5 Oct 2026)**

`/products/bgv-smb` keeps the receipt cards and chip cloud. Facts are
`bgvSmb.base.json`: Basic ₹1799, Standard ₹2199 (most popular), Premium
₹2399, all 60 minutes. Steps are Select Checks / Fill Information / As
fast as 24 hours. The custom list is the 35 priced checks (identity
₹349 through gap validation ₹900). Invented blue-collar ₹349 / white-collar
₹999 / driver ₹499 packages are gone.

Homepage, `/landing-page`, and `/ai` were not edited.

**Measured:** `npm test` — 1385 passed. Live `GET /en/products/bgv-smb` 200.

---

## Part 4 — Enterprise · **DONE (5 Oct 2026)**

`/products/bgv-enterprise` keeps the receipt layout. Facts are
`enterprise.base.json`: the India-enterprise hero, partners (Cognizant,
Infosys, Accenture, Reliance Retail, Wipro, HCL), and three audiences —
employees, businesses, customers. Employee claims are Fast (3×), Accurate
(99.2%), Compliant (ISO 27001 + GDPR), with 30+ checks, 120+ countries,
1 to 7 working days, and REST API + bulk upload. Named groups are
Enterprise checks and Document tampering. Invented 15-minute pills and
the rider-volume closing are gone.

Homepage, `/landing-page`, and `/ai` were not edited.

**Measured:** `npm test` — 1385 passed. Live `GET /en/products/bgv-enterprise` 200.

---

## Part 5 — Employee verification · **DONE (5 Oct 2026)**

`/employee-verification` keeps the ledger and step cards. Facts are
`employees.base.json`: white-collar (14 checks, from Education Check
through Resume Validation) and blue-collar (PAN, registration, driving
licence, criminal records, penny drop, liveness), plus the why-it-matters
cards, HR results (91% / 88% / 81%), automated onboarding, and primary
source names. Invented 60-minute re-verification and the EPFO story are
gone. The blue-collar intro's designer note is the four industry chips.

Homepage, `/landing-page`, and `/ai` were not edited.

**Measured:** `npm test` — 1385 passed. Live `GET /en/employee-verification` 200.

---

## Part 6 — Customer KYC · DONE (5 Oct 2026)

`/products/customer-kyc` keeps Template 3: short hero, four-item strip,
two chip lanes, three steps, the stance card plus ISO card, and four FAQs.
Facts are from `customerKyc.base.json`. Headline is "Onboard faster. Detect
fraud earlier." The strip and nine chips name KYC, KYB, underwriting, fraud
and AML checks (identity, liveness, face, location, GST, court record, bank
statement, company PAN, real-time screening). The steps are upload an ID,
take a selfie, then onboard. Invented 15-minute times, the hosted-page and
WhatsApp routes, DPA retention, and 120+ countries are gone. Talk to Sales
goes to `/contact?tab=enquiry`.

Homepage, `/landing-page`, and `/ai` were not edited.

**Measured:** `npm test` — 1385 passed. Live `GET /en/products/customer-kyc` 200.

---

## Part 7 — Certifier · DONE (5 Oct 2026)

**Rule from here on: old CMS wording, word for word, in the existing
slots.** KYC (Part 6) was redone the same way: step titles, solution card
items, AML lines and hero text are the CMS strings, in en, hi, and ar.

`/products/certifier` keeps its hero, strip, two chip lanes, two package
cards, step strip, and FAQ. The h1 is "Certifier" with the CMS subtitle. The strip
holds the four why-cards. The lanes hold the eight API-driven counterparty
checks (name-only, no times). The packages are the two "We Verify What
Matters Most" tabs and their eight checks. The steps are the four
how-it-works tabs (virtual onboarding, vendor monitoring, statutory
screenings, virtual agreement & e-sign), so no HowTo
(`HOWTO_NOT_A_SEQUENCE`). FAQ answers quote the why, industries, statutory
screenings and 4-step onboarding sections. Invented 2-day profiles, 15-min
checks, 120+ countries, registry and renewal claims are gone. Hindi and
Arabic use the old hi/ar CMS, which kept the check tabs in English.

**Measured:** `npm test` — 1385 passed. Live `GET /en/products/certifier`
and `/hi/products/certifier` 200.

---

## Part 8 — Health authorities · DONE (5 Oct 2026)

`/solutions/health-authorities` keeps the shared vertical template. Every
string is `healthAuthorities.base.json`, word for word, in en, hi, and ar:
hero title and subtitle; "Start Your Primary Source Verification" as the
button; strip from the accuracy bullets (12–14% fraud, ISO/IEC 27001 &
27701, fully GDPR compliant, data stored locally); Overview subtitle; the
five practitioner categories; the four "How HelloVerify Makes It Easy"
cards (no HowTo — concurrent benefits); the six Primary Source
Verification checks with their descriptions; Trusted Compliance; the
other five accuracy-promise cards as FAQs; the "Accuracy Is Not Our
Feature" closing. Invented 15-minute / 2–3 day times, 20M+ checks,
120+ countries, the Manila nurse and national-volume FAQs are gone.

Template change: chips without a time and tables without a turnaround
column render without them; `stepsAreSequence={false}` turns off the
HowTo. The other three vertical pages render as before.

**Measured:** `npm test` — 1386 passed. Live
`GET /en/solutions/health-authorities` 200; all 41 old strings checked
are on the page.

---

## Part 9 — Immigration (applicant + authorities) · DONE (5 Oct 2026)

`/products/immigration` and `/solutions/immigration-authorities` keep the
shared vertical template and the tab query. Every string is
`immigrationMigrationService.base.json`, word for word, in en, hi, and ar.

- **Both:** old hero title and subtitle; "Our Partners" with the five old
  embassy logos (`public/img/partners/`).
- **Authorities:** "Partner with Us" button; Overview (all eight bullets);
  The HelloVerify Advantage (Fast / Accurate / Compliant with their
  taglines, no HowTo); the AI-Powered Immigration Verification Solution
  title, subtitle and its twelve bullets; Trusted Compliance; the other
  five Why We Stand Out cards as FAQs; closing from the Why We Stand Out
  subtitle.
- **Applicant:** "Start your Visa Screening" (visa.helloverify.com);
  Information Guide with the six embassies and their visa types; Get
  Started in 3 Simple Steps (HowTo kept); How HelloVerify makes it easy;
  Secure and Compliant; the ten old visa FAQs; closing from Visa
  Screening You Can Trust.

Invented 15-minute / 2–3 day times, 120+ countries, Cairo, "before the
embassy does" and the turnaround tables are gone. Not ported: the
applicant testimonials (HR hiring quotes) and the interactive
how-to-apply / documents dropdown.

Template change: optional partner row; strip, lanes, table lede and table
header render only when present; `plainBands` drops a band eyebrow that
no longer describes the old content ("Turnaround & coverage" over a list
with no times) — used on health and both immigration pages.

**Measured:** `npm test` 1379 passed, `tsc` clean. Live en/hi/ar, both
pages 200; all 62 + 73 old strings checked are on the page per locale.

---

## Part 10 — Manpower & education · DONE (5 Oct 2026)

`/solutions/manpower-and-education-authorities` keeps the shared vertical
template. Every string is `educationAuthorities.base.json`, word for word,
in en, hi, and ar: hero title and subtitle; "Talk to Sales" and "Start
Your Primary Source Verification" (to the MOM page); Our Client with the
Ministry of Manpower logo and its 120+ sentence; Overview with its four
aims (no HowTo); Our Verification Services (qualification, accreditation);
Guaranteed Compliance; the other five promise cards as FAQs; closing from
the promise title and the Overview's closing line. Client AE stays hidden,
as on the old page. Invented work-pass times, Manila and "scope a pilot"
are gone. The FAQ heading "From manpower ministries." is the existing
chrome, as on Health.

**Measured:** `npm test` 1376 passed, `tsc` clean; live en/hi/ar 200, all
40 old strings present per locale.

## Part 10b — Ministry of Manpower page · DONE (5 Oct 2026)

`/solutions/manpower-and-education-authorities/ministry-of-manpower` was an
invented case study ("A ministry's standard, at a ministry's scale",
3 days, "in production"). It is now the old
`ministryOfManpower.base.json` overview, word for word in en, hi and ar,
in the old order and in this site's blocks: hero with the MOM logo and
caption, SGD 99 / 30 / 54 price strip, Why Choose HelloVerify, Our
Services (4, no HowTo), How it works (4, HowTo) with Start Verification
(applicant portal) and Talk to Sales, Required Documents with the
accreditation and non-English notes, the COMPASS framework with the C2
points and the two MOM links, the 19 FAQs, the existing portal entry, and
Support & Appeal as the closing band. SEO title/description are the CMS
hero. `mom.closing` is untouched — Latvia, Italy and MOHESR render it.

Not carried: the Track / COMPASS / Pricing / Resources tabs, the
"Transparent pricing" trio (same prices as the strip), the role-card text
(`ApplicantEntry` does both jobs), the two support cards, the FAQ
subtitle.

**Measured:** `npm test` 1378 passed, `tsc` clean; live en/hi/ar 200, all
122 old strings present per locale, HowTo + FAQPage emitted.

Also 5 Oct: Sign Up hidden from the homepage navbar only
(`<SiteNav showSignUp={false} />`); the locale switcher is back in the bar
at 1200–1439px (globe only below 1280).

---

## Part 11 — Trade authorities · DONE (5 Oct 2026)

`/solutions/trade-authorities` ← `businessTradeAuthorities.base.json`,
word for word in en, hi and ar. The old page was a hero and three audience
rows, so: hero title, subtitle and "Talk to Sales"; "For Government and
Diplomatic Missions" as the steps band (2, no HowTo); "For Companies and
Enterprises" as the table (3 rows, no times); "For Hiring Agents and
Recruitment Intermediaries" as the FAQ list (3). The old government image
is the closing photo. SEO title/description are the CMS hero.

Gone: the invented strip (2 days, 120+, 20M+), lanes and pills with
15 min / 2 days / 3 days, the turnaround table and note, the
appeal-ready compliance copy, the four FAQs and "scope a pilot".

Template: `VerticalPage`'s "what we verify" band is optional (trade has
none), and the compliance band's heading and lede render only when a page
gives them — the default "The unexciting part, done properly." is deleted
from `templates`, so trade shows the eyebrow and cert cards only. The
other five template pages pass their own old headings and are unchanged.

Not verbatim: the eyebrow "Governments · …", the closing heading and sub
(chrome default, as `ClosingCta` renders with none given), and the
"Questions" kicker over the hiring-agents band.

**Measured:** `npm test` 1375 passed, `tsc` clean; live en/hi/ar 200,
all 23 old strings present per locale, no HowTo, FAQPage emitted.

---

## Part 12 — International · DONE (5 Oct 2026)

`/international` ← `international.base.json`, word for word in en, hi and
ar. Hero: breadcrumb "International Checks" as the eyebrow, title and
subtitle. Regional packages: the "Verify Domestic Staff, Drivers, and
Tenants…" heading, then the old country picker (UK, UAE, Philippines,
Egypt, old flags in `public/img/flags/`) over three `rack3` receipts per
country: title, the per-country line, "Checks Include" and its tags, the
price only where the CMS has `priceDisplay`, "Buy Now". International
Checks: title, description, the same country picker over a four-column
`tbl3` (Check Name, Price (US $), Turn Around Time, Action) with each
check's name, details, price, TAT and "Add". "Explore More" is the closing
button. SEO title/description are the CMS hero.

New `components/chrome/CountryTabs.tsx` (WAI-ARIA tabs on `.seg` pills;
all panels server-rendered, only `hidden` toggles). Prices are written
`<bdi dir="ltr">` so Arabic keeps "$40/check".

Gone: the invented strip (6 offices, 21 of 24 hours), the six-office band,
the 24-country time table and note, the "what coverage means" steps (so
`/en/international` left `HOWTO_NOT_A_SEQUENCE`) and the four FAQs.

Not the old behaviour: Buy Now and Add link to the CMS's own
`/contact?tab=enquiry` rather than adding to the cart — the old SPA
resolved USD package ids live from the SMB `client-wise-package` API,
which this host has no port of. Explore More was an expand-the-table
toggle; every row is shown, so it is the closing link instead.

Not verbatim: the "Price (US $)" column label reused as the receipt price
label, and the closing heading and sub (chrome default).

CMS quirks kept verbatim: en "so you can ensure your family is in safe";
hi/ar say 124+ countries where en says 120+; ar's packages heading opens
on "من"; hi/ar checks description addresses NRIs.

**Measured:** `npm test` 1374 passed, `tsc` clean; live en/hi/ar 200 at
1440 and 390, every CMS string in the page (Explore More in the closing),
none of the invented copy, no horizontal overflow, tab switching works.

---

## Part 13 — Contact body · DONE (5 Oct 2026)

`/contact` ← `contactUs.base.json`, word for word in en, hi and ar.
Hero: breadcrumb "Contact Us" as the eyebrow, "Lets Build the Business
Together", subtitle. Image panel: the CMS `leftIntro` title and body.
Enquiry tab: `introTitle` above the form. Track tab: every label,
heading, placeholder and note from the CMS `track` block (the honest
"cannot look up a live case" answer, My Orders and Send an enquiry stay —
no CMS source). Below the form: the consent and data-usage notes. Offices:
"Our Offices" — India, Noida (+91 9289 6276 22), Cairo, UAE, Dubai
(+971 4574 1066), Singapore, with the old flags (phones are `tel:` links).
SEO title/description are the CMS hero.

The "three role blocks" (`enquiry.contactCards`) were never rendered by
the live old page (`ContactUsUnified` does not read them), so they are not
added.

Gone: "Talk to a person who runs checks", the "Other ways in" band, the six
offices with hours (Manila and New York were never old offices), and the
"Prefer to just see it working?" closing.

Not the old page: the enquiry form itself is `./forms` copy (Business /
Government / Individual, shared with the homepage closing and the Zoho
lead schema), not the old four-role form with per-role fields; the old
page hid the Track tab (`showTrack: false`), this one keeps it; the
closing band is the chrome default with its button pointed at `#enquiry`.

CMS quirks kept verbatim: "Lets Build…" (no apostrophe); the en consent
note carries a stray "Flowing & Engaging" heading mid-paragraph; the data
usage note shows "[Privacy Policy]" in brackets, unlinked, as the old page
did; en "An OTP will be send to you registered email id/phone number."

**Measured:** `npm test` 1374 passed, `tsc` clean; live en/hi/ar 200 at
1440 and 390, every CMS string in `<main>`, no horizontal overflow, flags
load, the track tab shows the CMS methods and hides the enquiry intro.

---

## Part 14 — About · DONE (5 Oct 2026)

`/about` ← `about.base.json` plus the shared `globals.base.json`
`certificationsCompliance`, word for word in en, hi and ar, in the CMS
order. Hero: breadcrumb "About Us" as the eyebrow, "Building the
AI-Powered Trust Infrastructure for the World". Our Vision / Our Mission
beside the old team photo. Our Belief (the CMS `<strong>HelloVerify</strong>`
kept) beside Our Investor with the YC wordmark and subtitle. "Built on
trust, Proven by numbers": Accenture, Wipro, IndiGo, Cognizant, HCL,
Infosys, then 20M+ / 2000+ / 120+ with their labels. Our Values: the six
cards. "What Our Client Speak": HCL, Cognizant, Hero Fincorp quotes with
role and company line. Certifications & Compliance: the CMS title and
line over NSR, PBSA, ISO 9001 and GDPR cards. SEO title stays "About
HelloVerify" (pinned in `locales.test.ts`); description is the CMS belief
sentence.

Gone: "Backed by" hero pill and sub, the five-item strip, "What we
believe" (three numbered beliefs), "Who we serve" path cards, the six
offices (Manila and New York), the seven-card credentials band with the
MOM story link and the "Security & compliance, in full" button, and the
closing copy (the chrome default closing shows).

Not the old page: the nav breadcrumb stays the navbar's About label
(`copy.test.ts` ties them); the certification cards are the new design's
typographic cards (name + gloss), not the old logo row, and the old row's
duplicate ISO 9001 logo is one card. TASKS 2b's "credentials page shows
the reviewed list in full" no longer holds for `/about` — ISO 27001,
ISO 27701, SOC 2 and MOM now appear only on `/platform/security-compliance`
and the pages that already showed them. The new IndiGo logo is the old
asset trimmed of its padding.

CMS quirks kept verbatim: "Our Investor" (singular); "What Our Client
Speak"; stats "2000+" while the investor line says "2,000+"; company
lines "@India’s…" / "@ India’s….", the Cognizant quote's "exceptional ,"
and the HCL quote's lower-case "we wish"; "Hello Verify" (two words) in
the certifications line.

**Measured:** `npm test` 1374 passed, `tsc` clean; live en/hi/ar 200, all
43 CMS strings in `<main>` per locale, `check-llms` facts (2018, 20M+,
2,000+, 120+) in `/en/about`, images load, no overflow at 390, language
switcher present.

---

## Part 15 — Technology · DONE (6 Oct 2026)

`/technology` ← `technology.base.json`, word for word in en, hi and ar, in
the CMS order (`platform.technology`). Breadcrumb Home › Technology (the old
one; the Platform rung is gone) and "Technology" as the eyebrow. Hero: "The
Trust Technology Platform", the subtitle, "Contact Sales" →
`/contact?tab=enquiry`. "Global Workforce & Business Trust Infrastructure
platform" with its subtitle over the three numbered AI cards. "A platform
that gets stronger with *every verification.*", its subtitle and three
cards beside the Trust orbit (three rings, the Trust hub, five labels at
the old diagram's positions, `aria-hidden` as before). "From verification
provider to global trust platform." with eight cards. "Building the Future
of Digital Trust." with three. The page's own certifications title and line
over NSR, PBSA, ISO 9001 and GDPR (the shared logo row). SEO: CMS hero
title + " — HelloVerify", description = subtitle.

Gone: "AI reads it. People confirm it." hero and "Request sandbox access" /
"See the endpoints", the 1.2 s / 33 types / webhooks / 99.9% strip, the
four-stage pipeline (and its HowTo — `/en/technology` left `HOWTO_PAGES`),
the request/webhook code samples, the five endpoints, the eight
integrations, the four engineer FAQs (and their FAQPage), the "Read the
docs" closing copy.

Not the old page: the old card icons are not ported (cards are text);
the closing band is the chrome default pointed at the enquiry tab. Still
saying "Technology & APIs" outside this page: the `/platform` hub card
(with "API & pipeline" and an API blurb) and the footer link — both
outside this part.

CMS quirks kept verbatim: "The next Journey" capital J; "Every Connected
institution"; "better outcome for everyone"; "evolving into a global trust
platform the infrastructure layer" (no dash); the Persistent Trust card has
no full stop; hi and ar keep the orbit labels and "Trust" in English; ar
subtitle "بإجراءراء" (doubled syllable).

**Measured:** `npm test` 1374 passed, `tsc` clean; live en/hi/ar 200, all
54 CMS strings in `<main>` per locale, none of the removed API copy, no
overflow at 390, structured data Organization + BreadcrumbList only.

---

## Part 16 — Solution pages rebuilt in the old section order · DONE (6 Oct 2026)

Trade, Health, Manpower & education, Immigration authorities and the
immigration applicant page no longer use the shared `VerticalPage`
template. Each is a bespoke page in the old CMS's section order, copy word
for word in en, hi and ar, with the old images and logos. Only
`/individuals/home-family` (not in the navbar) still uses the template.

- **Trade**: hero + "Contact Sales", then the three image rows
  (government, companies, agents) with their points.
- **Health**: hero, overview + bullets + image, five categories with
  images, the six PSV cards with the old icons, "easy" four cards, promise
  intro + six cards.
- **Manpower & education**: hero, "Our Client" (MOM logo card → the MOM
  page), overview, two service cards with images and CTAs, promise cards.
- **Immigration authorities**: hero + tabs, overview, "stand out" cards,
  partner logos, advantage cards, the three AI columns.
- **Immigration applicant**: hero + tabs, three steps, partner logos, the
  Information Guide (How to apply / Documents / FAQ tabs, the three
  dependent selects, six FAQ categories), "easy" cards, three testimonials
  with photos.
- **About and Technology**: no closing band (the old pages ended on their
  last section); certifications are the old logo row (NSR, PBSA | ISO 9001,
  ISO 9001, GDPR) with the old alts, not cards with written glosses.

Not ported: the old guide's live back-office calls (embassy, country and
visa lists, PDF guides, document checklists, embassy accordions, premium
packages). The guide shows the CMS destinations and FAQs; the CTA goes to
the visa host.

CMS quirks kept verbatim: the Hindi education hero title is in English;
hi/ar Health overview has 8 bullets, en has 3; testimonials keep "usded"
and quotes ending ",,"; ar FAQ answers use → between steps (allowlisted);
the certifications list ISO 9001 twice and the image file is an ISO 27001
badge.

**Measured:** `npm test` 1371 passed, `tsc` clean, lint has no errors in
these files; live audits en/hi/ar 0 missing / 0 non-CMS on each page.

---

## Part 17 — Full navbar scan (copy + structure) · 6 Oct 2026

Audit: `D:\Temp\audit-all.mjs` (runs `audit3.mjs` per page, en/hi/ar):
every old CMS string present, no text the old page lacked, CMS sections in
CMS order, strings inside each section in CMS order. Navbar dropdowns:
`D:\Temp\nav-audit.mjs` against `globals.megaMenus` — PASS (the old "AI
Travel Assistance" item was `hidden`).

PASS: About, Technology (hero eyebrows removed; About testimonial cards in
the old logo / role / company / quote order), Health, Immigration
authorities, Manpower & education, Trade.

Done, in this order: HelloV, SMB, Enterprise, Employee verification,
Customer KYC, Certifier, Immigration applicant (guide documents panel +
FAQ categories), International (17.9), Ministry of Manpower (17.10),
Contact (17.11). The navbar scan is complete.

MOHESR is linked only from the homepage seals; out of this scan.

### 17.1 HelloV · DONE (6 Oct 2026)

`/products/hellov` rebuilt in the old order: hero ("Talk to Sales" →
consumer enquiry), intro line, the Packages / Single Checks tabs, the
Advanced Package cards. Packages tab: title, subtitle, three STEP pills,
the eight-package accordion (description, "Checks Include", pills, Buy Now
→ WhatsApp) beside the HelloV QR card (QR and "Start Verification" →
WhatsApp, the old `HELLOV_WHATSAPP_URL`). Single Checks tab: intro, six
cards three a page with the pager, each with "Verification in just ⚡ N
mins", title, line, Buy Now (checkout with the old `checkoutPackageName`)
and the old photo. Advanced: four cards with the old header and check
icons, INR prices, MOST POPULAR on Driver, Buy Now (checkout).

Gone: the invented strip, chat section, "when" cards, receipts, consent
steps (and their HowTo), five FAQs (and FAQPage), closing band, the
Individuals breadcrumb rung.

Not shown because the old page did not show them: package and single-check
prices (the single-check checkout still carries the old ₹ amount), the AI
Travel tab (`showAi: false`).

Kept verbatim from the old site: "STEP", "Verification in just … mins"
were hard-coded English in every locale; hi/ar CMS keep English check
pills, "Buy Now" and "MOST POPULAR" on single checks and Advanced cards.
Not verbatim: the pager's prev/next aria labels in hi/ar (the old ones were
English).

**Measured:** audit3 PASS en/hi/ar; `npm test` 1372 passed; `tsc` clean;
lint clean for these files; `check:css-color` and `check:logical` PASS; no
overflow at 390.

### 17.2 SMB · DONE (6 Oct 2026)

`/products/bgv-smb` rebuilt in the old order: hero (two-line title, "Talk
to Sales" → business enquiry), How it Works? (three steps; HowTo kept),
Select Or Customize Verification Package (Basic / Standard (featured) /
Premium with "60 mins", price, description, "Checks Included", pills, Buy
Now → checkout; "Customize Your Package" → the table), Select Your Checks
(35 rows: checkbox, name, info tip, price, +/− quantity; Education ticked
on load; five rows until "Explore More" / "Explore Less") beside the
summary (title, running ₹ total, description, "Checks Include", pills with
×N, empty hint, Buy Now posting the old API check codes as `check_codes`),
Trusted by Businesses & Individuals (three stats, three testimonials with
photos and four stars), Solutions We Offer (Employee Verification tab:
three cards; Vendor Screening tab: intro, six feature cards, What We Offer
with four cards). Old icons ported path for path (`components/smb/SmbIcons`).

Gone: the invented eyebrow, trust strip, rack card frame ("Per candidate",
"incl. GST", "N checks · ready in"), price note, chip cloud, four FAQs (and
FAQPage), closing band, the Business breadcrumb rung.

Kept on request, not in the old page: the SMB client-logo strip and its
heading under the hero (5 Oct 2026 request); the audit allows that heading
by name. Kept for the homepage only: `smb.strip`, `smb.hero.talkFirst`,
`smb.closing.ctaLabel` (`sections/SmbPacks.tsx`).

Kept verbatim from the old site: hi/ar CMS check names in the table are
English (35/35, info lines 34/35); "Explore Less", the "4 out of 5 stars"
label and the info / quantity aria labels were hard-coded English; the
"Education Check-Highest Education (Extra University Chargesapplicable)"
and "FINRA Fingerprint(Pan India)" spellings; "usded" and the „ quote
marks in the testimonials.

**Measured:** audit3 PASS en/hi/ar; `npm test` 1372 passed; `tsc` clean;
lint clean for these files; `check:css-color` and `check:logical` PASS; no
overflow at 390 / 1440 en and ar; ticking and quantity update the total
(₹999 → ₹1697); all 35 rows expand; tips open.

### 17.3 Enterprise · DONE (6 Oct 2026)

`/products/bgv-enterprise` rebuilt from `enterprise.base.json` in the old
order: hero (two-line title, "Talk to Sales" → `/contact?tab=enquiry`, no
subtitle — the old hero had none), the trust strip ("Trusted by India's top
IT/ITES companies for / Background Verification", its subtitle, the six
partner logos Cognizant / Infosys / Accenture / Reliance Retail / Wipro /
HCL), then "Background Checks For Every Part of Your Organization / Select
who you're screening" with the three old tabs. Employees: intro, Fast /
Accurate / Compliant cards (title, tagline, description), Explore More →
`/employee-verification#employees-white-collar`, Checks We Offer (four
stats, Enterprise Checks in two columns of 7 + 6, Document Tampering with
4). Businesses: two-line intro, six feature cards, Explore More →
`/products/certifier`. Customers: Trust & Safety, its subtitle, the pillar
heading and two paragraphs, Explore More → `/products/customer-kyc`, the
four advantages (90% / Cost Reduction in Onboarding, then three). Old icons
ported path for path (`components/enterprise/EnterpriseIcons`). All
panels stay in the DOM (`hidden`).

Gone: the invented hero eyebrow and sub, stat strip, check lanes, pills,
quality cards, feature list, advantages copy, the `note` link sentence,
five FAQs (and FAQPage), the Steps strip (and its `HOWTO_NOT_A_SEQUENCE`
entry), closing band, and `bgv-enterprise/content.ts`.

SEO: title = the old hero title on one line + " — HelloVerify";
description = the trust-strip subtitle verbatim (the old hero has no
subtitle to use).

Kept verbatim from the old site: `trustStrip.titleBold` is empty in every
locale (nothing rendered for it); partner alts are English in hi/ar; the hi
breadcrumb is "Enterprise"; the ar "REST API +" stat line is English.

**Measured:** audit3 PASS en/hi/ar (69 CMS strings, 0 missing / extra, tab
labels order-ignored as on SMB); `npm test` 1370 passed; `tsc` clean; lint
at the pre-existing 39 errors / 2 warnings; `check:css-color` and
`check:logical` PASS; no overflow and no broken images at 390 / 1440 en and
ar; live JSON-LD = BreadcrumbList Home > Enterprise + Service.

### 17.4 Employee verification · DONE (6 Oct 2026)

`/employee-verification` rebuilt from `employees.base.json` in the old
order: hero (two-line title, "Talk to Sales" → business support enquiry),
"Employee Verification Solutions", White-Collar Verification (title, intro,
the 14 checks as a vertical list with the selected check's name and
description beside it, the photo, "Talk to Sales" with
`service=white-collar-verification`), Why White-Collar Verification Matters
(three icon cards), "HR's & Staffing organizations see improved results
with HelloVerify" (91% / 88% / 81%), Blue-Collar Verification (same panel,
6 checks, `service=blue-collar-verification`), Why Blue-Collar worker
Verification Matters (three icon cards), Automated Workforce Onboarding
(title, subtitle, six vertical tabs with the old screenshot and
description), Primary Source Verification (eight cards with the old
glyphs). Anchors `#employees-white-collar` / `#employees-blue-collar` kept.
Old icons ported path for path (`components/employee/EmployeeIcons`); old
photos, screenshots and PSV glyphs copied to `public/img/employee/`.

Not carried, because the old page never rendered them: the two sections
the CMS marks `hidden` (blue-collar workforce stats, White & Blue-Collar
benefits) and the white / blue `exploreMore` labels.

Gone: the invented eyebrows, ledes, the Business breadcrumb rung, the hero
sub and "checks" link, the industry chips, the results strip copy, four
FAQs (and FAQPage), the Steps strips (and the `HOWTO_NOT_A_SEQUENCE`
entry), closing band, and `employee-verification/content.ts`.

SEO: title = the old hero title on one line + " — HelloVerify";
description = the Automated Workforce Onboarding subtitle verbatim (the old
hero has no subtitle).

Kept verbatim from the old site: the Blue-Collar intro is a design note
("Manufacturing, Logistics, Construction, Food & Beverage as small chips to
help buyers see themselves explicitly."); "This reduce manual effort",
"Verify applicants employment history", "Verify smart, Trust faster",
"Join us to Modernize the way you hire & scale heights", "HR's & Staffing".
No English left in the hi/ar CMS for this page.

**Measured:** audit3 PASS en/hi/ar (91 / 90 / 85 CMS strings, 0 missing /
extra; onboarding tab labels order-ignored); `npm test` 1370 passed; `tsc`
clean; lint at the pre-existing 39 errors / 2 warnings; `check:css-color`
and `check:logical` PASS; no overflow and no broken images at 390 / 1440
en and ar; checks list and onboarding tabs switch; live JSON-LD =
BreadcrumbList Home > Employee Verification + Service.

### 17.5 Customer KYC · DONE (6 Oct 2026)

`/products/customer-kyc` rebuilt from `customerKyc.base.json` in the old
order: hero ("KYC Platform", the subtitle, "Talk to Sales" →
`/contact?tab=enquiry`), the How it Works grid ("We deliver robust
protection against online identity fraud powerful, seamless and always
on.", six step cards with the old round photos and a STEP 01–06 badge, card
1 lit until another is hovered or focused, "Talk to Sales" → `/contact`),
Solutions We Offer (subtitle, six cards with the old icons and numbered
lists). Old icons ported path for path (`components/kyc/KycIcons`); step
photos copied to `public/img/kyc/`.

Gone: the hero eyebrow and API link, the stat strip, the two check lanes
and chips, the three flow steps, the privacy stance and ISO card, the
security link, four FAQs (and FAQPage), closing band, the Business
breadcrumb rung. The HowTo node went too: step 1's three lines are check
groups rather than an instruction, so the old cards are rendered as they
were and the page left `HOWTO_PAGES`.

SEO: title = "KYC Platform — HelloVerify"; description = the old hero
subtitle verbatim.

Kept verbatim from the old site: the "STEP" badge label is English in every
locale (hard-coded in the old component); step photo alts are "Step 1"…
"Step 6" in English in hi/ar; hi/ar card titles "KYC" / "KYB" / "AML" and
the ar "Udyog/Udyam Aadhaar" and "E-stamp" items are English; step 1's
title ("The user uploads a photo of their ID") sits over three check-group
lines, and steps 3–6 repeat near-identical guidance sentences, as in the
CMS.

**Measured:** audit3 PASS en/hi/ar (54 CMS strings, 0 missing / extra;
"STEP" allowed); `npm test` 1370 passed; `tsc` clean; lint at the
pre-existing 39 errors / 2 warnings; `check:css-color` and `check:logical`
PASS; no overflow and no broken images at 390 / 1440 en and ar; RTL badge
and photo mirror; live JSON-LD = BreadcrumbList Home > KYC + Service.

### 17.6 Certifier · DONE (6 Oct 2026)

`/products/certifier` rebuilt from `certifier.base.json` in the old order:
hero ("Certifier", the subtitle, "Talk to Sales" → `/contact?tab=enquiry`);
We Verify What Matters Most (two pill tabs of four icon cards; the old
homepage's `#certifier-verification-checks-<tab id>` links open the right
tab); How Certifier Works For Businesses? (two intro lines, four tabs —
Virtual onboarding with four STEP 01–04 boxes, Vendor Monitoring with the
old bold runs, Statutory Screenings with two tick lines and six id-card
items, Virtual Agreement & E-Sign with one tick line and three features —
beside the four-image slider, which runs on its own every 6 s, pauses on
hover and stays still under reduced motion); Industries We Serve (four
photo cards); Why Businesses Should Consider Certifier? (four icon cards);
API-Driven Counterparty Platform (two slides of four cards, arrows, dots,
arrow keys). Old icons ported path for path
(`components/certifier/CertifierIcons`); slider and industry images copied
to `public/img/certifier/`.

Gone: the hero eyebrow and packages link, the four-item strip, the lanes
and chips, the two package receipts, the steps strip (the page left
`HOWTO_NOT_A_SEQUENCE`), the FAQs, the closing band, the Business
breadcrumb rung.

SEO: title = "Certifier — HelloVerify"; description = the old hero subtitle
verbatim.

Kept verbatim from the old site: in hi and ar the whole We Verify What
Matters Most section (heading, subtitle, both tab labels, all eight cards)
and the six statutory screening names are English; "STEP" is English in
every locale; the vendor-tab card titles break onto two lines as the CMS
`\n` does; the Trade License Check body describes educational
qualifications, and the Ministry of Corporate Affairs card body is the
employee-experience line; "Our advance verification checks", "Start Free,
Trial Certifier" and "Credit Suit Default Screening" as written. The old
English-only aria labels (the "Certifier workflow" tablist name) are not
carried; the slider's "Previous slide" / "Next slide" / "Show slide n of m"
are.

**Measured:** audit3 PASS en/hi/ar (96 CMS strings, 0 missing / extra;
"STEP" allowed, tab labels order-ignored); `npm test` 1371 passed; `tsc`
clean; lint at the pre-existing 39 errors / 2 warnings; `check:css-color`
and `check:logical` PASS; no overflow and no broken images at 390 / 1440 en
and ar; every tab, slider arrow, dot, hash deep-link and autoplay checked
in the browser; live JSON-LD = BreadcrumbList Home > Certifier + Service.
Later the same day: the slider element passed into the How tabs got a
`key` (React's dev "unique key" warning, en/hi/ar); nothing visible changed.

### 17.7 Immigration applicant · DONE (6 Oct 2026)

`/products/immigration` rebuilt from the applicant tab of
`immigrationMigrationService.base.json` in the old order: hero (crumb
"Immigration Authorities", as the shared old hero had it; two-line title;
subtitle), Get Started in 3 Simple Steps (three icon cards), Our Partners
(five logos, "Start Your Visa Screening" in a new tab), the Information
Guide, How HelloVerify makes it easy for Applicants? (six icon cards), What
Customer Say About Us (three cards: photo, name, quote, four stars). Old
icons ported path for path (`components/immigration/ApplicantIcons`).

The Information Guide works as the old `ImmigrationApplicantInfoGuide` did:
- How to Apply / Documents Required / FAQs tabs; switching tabs resets the
  fields.
- Applying To lists the visa back office's embassies (the CMS names until
  it answers). Applying From and Visa Type come from the back office alone,
  through `/api/visa-guide/[action]` (the browser's CSP only allows
  same-origin), and each choice resets the fields after it.
- How to Apply opens the old step-by-step PDF for a matching visa type
  (`public/docs/immigration/`) and shows the embassy's accordions (Italy:
  one; Latvia: two, the first with the four nationality links).
- Documents Required adds Application Category when the visa type has
  sub-categories and shows the matching checklist under "Document
  Required:" (`lib/immigration/checklists`).
- Latvia adds the Premium Service packages (Insufficiency Clearance 21 €,
  Premium 42 €) on both tabs.
- FAQs: Process (the CMS ten) plus Documents, Download Receipt, Status of
  Application, Payment and Terms & Conditions, all in the DOM, first answer
  open, links clickable.

The guide's extras (FAQ categories past Process, accordions, Premium,
second-level labels) are the old SPA's `immigrationApplicantGuideExtras.ts`,
which that page merged into the CMS guide; the loading / error / "Document
Required:" lines are the old `i18n/<locale>.json`.

Gone: the CMS city and visa-type lists from the copy (the old page never
rendered them; the back office supplies the options), the Steps strip and
its HowTo node (the steps are unnumbered icon cards; the page left
`HOWTO_PAGES`).

Kept verbatim from the old site: hi/ar have nine document checklists
against en's 32 (Italy and Latvia-from-India only); the Latvia link labels
are English in hi/ar; the back office's embassy, city and visa names are
English in every locale; Italy's PDF row points at office 464410, which the
back office no longer returns, so Italy opens no PDF (same as the old
page). Not verbatim: lookup errors are the localized lines (the old page
printed the raw error message); the stars' "4 star rating" label is not
carried (they are `aria-hidden`).

**Measured:** audit3 PASS en/hi/ar (115 / 116 / 115 strings, 0 missing /
extra; the 34 old extra FAQ strings per locale checked as present; the
back office's embassy names allowed; FAQ nav labels order-ignored);
`npm test` 1371 passed; `tsc` clean; lint at the pre-existing 39 errors /
2 warnings; `check:css-color` and `check:logical` PASS; no overflow and no
broken images at 390 / 1440 en and ar. In the browser against the live
back office: Latvia → India / Nepal / Sri Lanka → Student Visa / D-Work
Visa; both open their PDF (200, `application/pdf`); D-Work shows
Application Category; both give a checklist; accordions, Premium, the tab
reset and the FAQ categories all work. Live JSON-LD = BreadcrumbList Home >
Immigration Authorities + Service (no HowTo).

### 17.8 Manpower & education · DONE (6 Oct 2026)

`/solutions/manpower-and-education-authorities` already passed the audit;
two line breaks now follow the CMS: the hero title breaks before its last
line ("AI-Powered Education Equivalency & / *Qualification Checks*", per
locale), and the client card reads "Ministry of Manpower / (Singapore)" on
two lines as the CMS `\n` does. The old components (hero, overview,
verification services, promise) have no icons or hard-coded labels to
port; everything else already matched.

**Measured:** audit3 PASS en/hi/ar (42 / 43 / 43 strings, 0 missing /
extra); no overflow and no broken images at 390 / 1440 en and ar; live
JSON-LD = BreadcrumbList Home > Education Authorities + Service.

**Follow-up, same day: the second client.** The live site shows two client
cards; the repo's `main` CMS (what the audits read) still hides the second
one as "Client AE". The live CMS (`www.helloverify.com/cms/<locale>/…`,
which matches `origin/staging` for this file) has it as Ministry of Higher
Education and Scientific Research (MOHESR), with the old logo and "Start
Your Primary Source Verification". Both cards are now on the page, word for
word per locale (the hi name is English, as live), with the old MOHESR logo
(`public/img/education/mohesr-logo.jpg`). New card design: logo stage,
serif name, button with an arrow (flipped in RTL), the whole card
clickable, a hover lift (none under reduced motion), one column below
720px. MoM → `/solutions/manpower-and-education-authorities/ministry-of-manpower`;
MOHESR → `/governments/manpower-education/mohesr`. The live URL
`/solutions/manpower-and-education-authorities/mohesr` now 308s there too
(`legacy-urls.ts`; Next reads it when the dev server starts).

**Live CMS vs the repo, all pages (6 Oct 2026).** Every navbar page's live
CMS equals the local files the audits used, except: Education (above);
`globals` — seven navbar / footer hrefs only, no copy (the new site keeps its
own routes); Ministry of Manpower — the auth dialog's phone placeholder
("Enter Phone Number") and error ("Enter a valid phone number (7–15
digits).") → fixed in the MoM part. Contact → fixed in 17.11: the page
shows the live inbox `MOHESR@helloverify.ae` and "India, New Delhi:" (the
local file's "(add email)" and "India, Noida:" stay in the CMS the audit
reads, and those two paths are skipped). Home and MOHESR differ too; neither is in this
scan. Downloads in `D:\Temp\live-cms\`.

**Measured (follow-up):** audit3 PASS en/hi/ar (43 / 44 / 44; the live
MOHESR name and alt checked as present); `npm test` 1371 passed; `tsc`
clean; lint at the pre-existing 39 errors / 2 warnings; `check:css-color`
and `check:logical` PASS; no overflow at 390 / 1440 en and ar; clicking
anywhere on either card opens the right page.

### 17.9 International · DONE (6 Oct 2026)

`/international` rebuilt to the live page. Breadcrumb is Home →
International Checks. No platform rung, no eyebrow, no closing band.
Packages (`#international-regional`): the CMS heading, a searchable country
list defaulting to the United Kingdom, three cards (icon, description,
"Checks Include", tags, Buy Now). No prices on the cards. A country with
no CMS bundle shows "No checks are available for the selected country."
Checks (`#international-checks-screening`): the CMS title and description,
a second list defaulting to the United States (`?country=` is honoured),
sortable columns, a chevron that opens the check's details, a checkbox,
the first seven rows, then Explore More / View Less, and Add.

The visible checks are the catalog the live bundle paints (the SMB checks
URL answers this environment with an HTML 404). The CMS check rows stay in
the document. Buy Now and Add go to `/contact?tab=enquiry` — the old USD
cart (`get-package-id`, `packageType: internationalbackground`) is not
ported. There is no filter box: the CMS has `enableFilter: false`, and the
live page does not render one. Flag alts are the CMS's; Hindi's checks
alts differ from the package alts ("यूके ध्वज", "UAE ध्वज"). Countries
outside the four CMS bundles keep the catalog's English names.

**Measured:** audit3 PASS en/hi/ar (59 / 65 / 66 strings, 0 missing /
extra; 32 / 36 / 36 of those strings sit in the hidden CMS rows);
`npm test` 1371 passed; `tsc` clean; lint on the new files clean, full
lint still the pre-existing 39 errors / 2 warnings; `check:css-color` and
`check:logical` PASS. In the browser, en 1440 and ar 1440 and en 390: no
overflow, the United Kingdom cards and the first seven US checks match
the live page, price-sort, expand, Explore More (58 rows) / View Less,
France clears the cards and leaves the checks list on the United States,
Buy Now and Add open `/contact?tab=enquiry`.

### 17.10 Ministry of Manpower · DONE (6 Oct 2026)

`/solutions/manpower-and-education-authorities/ministry-of-manpower` is the
old tab hub again: Overview, Track Application, COMPASS, Pricing, Resources,
FAQs, then each panel in that order. The breadcrumb is Home → Ministry of
Manpower. No closing band. The logo uses the existing mark, with the CMS
alt and the caption (the line break kept). Hindi and Arabic put the caption
after the subtitle in the CMS, so the document follows that; the logo row
still sits above the title.

Overview is the role cards, the transparent-pricing trio, Why Choose
HelloVerify, Our Services (the tags included), How it works (the only
HowTo, four steps), Required Documents, the COMPASS framework, and Support
& Appeal. Track, the COMPASS criteria, both packages plus the express
add-on, the six official resource cards, Track & Authenticate, and the 19
FAQs are in the document. Panels other than the open tab stay mounted.
Learn more and Full COMPASS Details switch tabs. Applicants' Start
Verification opens the existing dialog; it is not in the first HTML.
Employers still go to the agency portal, and Talk to Sales stays the CMS
contact link.

The three price-strip figures (`SGD 99`, `SGD 30`, `SGD 54`) are allowed
because the audit skips `value`. `span`, `category`, and `defaultPackageId`
are layout tokens and are not printed. The dialog's phone line is the live
CMS wording, 7–15 digits (`Enter Phone Number` / the Hindi and Arabic
lines). MOHESR stays 10 digits. `mom.closing` in the governments copy is
unchanged — Latvia, Italy, and MOHESR still use it.

**Measured:** audit3 PASS en/hi/ar (281 / 277 / 278 strings, 0 missing /
extra; 170 / 161 / 159 of those sit in a hidden panel); `npm test` 1376
passed; `tsc` clean; lint on the new files clean; `check:css-color` and
`check:logical` PASS. In the browser, en 1440, ar 1440, and en 390: no
overflow, the six tabs switch, Learn more opens Pricing, Full COMPASS
Details opens the framework, Start Verification asks for a phone of up to
15 digits and closes on Escape, the Arabic logo alt is on the page.

### 17.11 Contact · DONE (6 Oct 2026)

`/contact` is the old Contact Us page again. The enquiry form is the old
four-role form (business, applicant, consumer, authority) with the old
labels, placeholders, service lists, and consent, in the current form
design. Business is the default. Country code is a text field where the
CMS has no options; the consumer role keeps +91 / +971 / +1 / +44. The
homepage form is unchanged. A business enquiry still posts through
`submitLead` (authority maps to government, applicant and consumer to
individual).

The track tab stays (the old page had `showTrack: false`; this site keeps
the tab and does not call an API). All three methods are in the document,
with the CMS consent. After Send OTP the page says it cannot look up a
live case.

Contact cards, the Contact Us / Talk to sales labels, and the talk-to-sales
fields are in the document in CMS order. The old `ContactUsUnified` never
painted them, so they stay hidden. The education-authority inbox is the
live `MOHESR@helloverify.ae`. The first office is the live "India, New
Delhi:" / "भारत, नई दिल्ली:" / "الهند، نيودلهي:". The audit skips the
local Noida title and "(add email)". `#Data Usage` starts with `#`, which
the audit treats as code, so that heading is marked `data-audit-skip` and
still shown.

Quirks kept word for word: "Lets Build…" (no apostrophe), the stray
"Flowing & Engaging" in the consent note, "[Privacy Policy]" in brackets
in the data-usage note, "An OTP will be send to you registered email
id/phone number.", and "IF YOU ARE AN CONSUMER".

**Measured:** audit3 PASS en/hi/ar (109 / 117 / 116 strings, 0 missing /
extra; 70 / 68 / 69 of those sit in a hidden panel); `npm test` 1376
passed; `tsc` clean; lint on the new files clean; `check:css-color` and
`check:logical` PASS. In the browser, en 1440, ar 1440, and en 390: no
overflow, the four roles switch, a business enquiry is accepted, the
track tab shows the three methods and the honest no-lookup answer, the
India office reads New Delhi / नई दिल्ली / نيودلهي, and the four flags
load.

---

## Later, not navbar

Nothing left from the old CMS list.
