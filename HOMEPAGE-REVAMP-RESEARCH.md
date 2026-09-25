# HelloVerify Homepage: Sales & Storytelling Revamp Research

**Companion to:** [`DESIGN.md`](./DESIGN.md) · [`INFORMATION-ARCHITECTURE.md`](./INFORMATION-ARCHITECTURE.md) · [`DESIGN-RESEARCH.md`](./DESIGN-RESEARCH.md) · [`AUDIT.md`](./AUDIT.md)
**Status:** Research and recommendations only. No code was changed. This file is the brief for the section-by-section work in the canvas playground (*HelloVerify Homepage – Desktop Working Copy*) before anything goes into `helloverify-web`.
**Date:** 24 Sep 2026

---

## 0. Summary

**The verdict in one line:** the new homepage looks better than the old one but sells less. It explains how verification works three times, and never shows a government buyer the four products built for them.

The old site was cluttered, slow (12.5 MB, see `AUDIT.md`) and inconsistent. But it did one thing the new homepage doesn't: it **laid out the catalogue**. Four named government solutions with authority-specific CTAs, an Enterprise/SMB switch with **visible prices**, eight priced consumer products, a vendor due-diligence line and a country-by-country offer. The redesign kept the look and replaced the catalogue with a showcase of the process. Most of the old selling copy was never carried over. Section 3 lists what was lost; I found no record in the repo of any of it being rejected.

**The ten biggest things missing from the new homepage:**

| # | Missing | Why it matters |
|---|---|---|
| 1 | **The four government products** (Health, Immigration, Manpower & Education, Business & Trade). They've been cut down to one photo card titled "Licences, visas and permits". | This is the highest-value buyer, and the IA calls it priority #1. They can't find their product on the homepage. |
| 2 | **Named government proof.** Embassy of Latvia and Embassy of Italy are gone. The Saudi health authority PSV became "Kingdom of Saudi Arabia · Authorities". The MOM Singapore COMPASS empanelment is shown as a chip with no story. | B2G buyers convert on named references. These are the company's strongest facts. |
| 3 | **Fraud.** "1 in 8 applicants misrepresent their academic credentials" and "fraud detected in 12–14% of applications" are gone. The only demo on the page ends "All clear". | Fraud is *why anyone buys*. The new page never shows the product catching anything. |
| 4 | **SMB prices** (₹1,799 / ₹2,199 / ₹2,399 packages, per-check prices from ₹349). | The IA's own SMB flow says a buyer who can't see the price bounces. The new homepage shows no business price at all. |
| 5 | **Real HelloV prices.** The new page shows ₹499 / ₹799 labelled "Prices are placeholders". The old site sells Driver ₹1,799, Tenant ₹1,799, Home staff ₹1,399, Nanny ₹1,399. | A visitor can read the word "placeholder" on a live sales surface. |
| 6 | **KYC / Trust & Safety as a product.** An entire platform (KYC, KYB, underwriting, fraud & risk, e-sign, AML) is reduced to four words: "Customers, verified at signup". | It's a separate revenue line with its own buyer (fintech, marketplaces). |
| 7 | **Enterprise proof.** Three real, de-identified client testimonials ("India's largest IT company", "India's largest fintech"), "trusted by India's top IT/ITES companies", API + bulk upload, 1–7 working-day TAT. | The enterprise HR buyer scans for client logos, TAT and integration (IA §4.2). None of these are on the homepage. |
| 8 | **The founder's thesis.** *"Trust is becoming the world's next critical digital infrastructure. HelloVerify is building the platform through which trust will move."* It isn't on the homepage. | This is the big idea the whole experience can be built around (§5). |
| 9 | **The platform story.** *"Most verification systems are static. Ours compound."* Plus the proprietary database of fraudulent institutions and the three AI engines. | It's what makes HelloVerify a defensible platform rather than another BGV vendor, and it's gone. |
| 10 | **The applicant side of government** (Premium Services: form-filling support for healthcare professionals, visa pre-screening for applicants). It's now one receipt. | A revenue stream that comes directly from the government contracts. |

**What the new homepage does better (keep all of it):** the design system (paper, ink, green, ledger voice), honest numbers, the "Watch it read a licence" AI demo, the 33-check dot-plot, prices-as-receipts, the six-office day band, photo cards with role + city + time, the WhatsApp phone, precisely worded compliance claims, the audience-first nav, and the accessibility and performance discipline. The revamp should **add** to the new site, not undo it.

**The opening in the market:** DataFlow Group, the main GCC primary-source-verification competitor, writes its homepage *for applicants* and publishes no success rate, no turnaround and no process. No competitor shows primary-source verification step by step. A homepage that **speaks to the regulator first, shows the process and footnotes its numbers** is open ground (§9.3).

**The recommendation:** rebuild the homepage as one connected story. The concept is **"How trust moves"**, taken from the founder's own line (§5). Every section follows a *claim* (a degree, a licence, a company, a person) to its *source* and back as a *verdict*. The existing green accent becomes the **green thread**: one line that runs the length of the page, stays dashed ink while a claim is unverified, and turns solid green only once it reaches the source. The art direction is **security print** (guilloche, microtext, embossed seals, UV-reveal ink): the visual language of documents that must not be forged, layered on top of the existing ledger system. The products come back as **chapters**: Governments, Enterprises, Growing businesses, Families. Each chapter has its own visual identity and one signature interaction.

---

## 1. Method and sources

| Source | What was examined |
|---|---|
| Old homepage `helloverify.com/en` | Full text of every section in every state: 2 segment tabs, 8 consumer tabs with every accordion opened, both carousel slides, 3 form dropdowns, the 4 nav mega-menus, all links, image alts. |
| Old site screenshots | `old-site-screenshots/`: 68 captures at 1440px @2×, covering every section, tab, accordion, slide, dropdown and nav menu. Also `HV-screenshots/` (the team's own 17 captures). |
| Old product pages (where the selling copy lives) | `/about`, `/technology`, the 4 authority pages + the MOM page, `/products/bgv-enterprise`, `bgv-smb`, `certifier`, `customer-kyc`, `hellov`, `/employee-verification`. Full text extracted. |
| New homepage (canvas) | The *HelloVerify Homepage* canvas, Desktop 1/4–4/4 artboards. This is the "playground", duplicated as *HelloVerify Homepage – Desktop Working Copy*. |
| New homepage (code) | `helloverify-web/src/app/[locale]/page.tsx` and `components/sections/*`. Rendered locally from a scratch copy (the repo was not touched) and reviewed screen by screen at 1440px. |
| Repo docs | `DESIGN.md`, `INFORMATION-ARCHITECTURE.md`, `AUDIT.md`, the copy registry `lib/copy/*`, the facts registry `lib/content/company.ts`. |
| External research | Award-level sites, B2G/govtech positioning, competitor homepages, motion and scroll craft. See §9. |

---

## 2. The two homepages side by side

### 2.1 Old homepage: what it laid out, top to bottom

| # | Section | What it sold |
|---|---|---|
| — | **Nav mega-menus** | *Solutions:* Government Authorities (4, each with a one-line job: "Verify healthcare professionals credentials from primary source", "Streamlining pre-screening & verification of Visa Application process", "Verifying education qualification from primary source", "Verifying business entities & directors for regulatory compliance"); Enterprise & Small Business; Employee Verification; KYC ("facial recognition and liveness checks"); Consumer; "Start Your Visa Screening Process"; Global Verification (120+ countries). *Products:* 6 named products. *Premium Services:* one-to-one applicant support. |
| 1 | **Hero.** "Backed by YC · Hire the Right People Faster · Instant AI-Powered Background Checks" | Employers only. (IA §4.2 rightly criticised it.) |
| 2 | **Built on trust, proven by numbers.** 20M+ checks since 2018 · 2,000+ enterprise clients · 120+ countries · 6 office flags | Scale |
| 3 | **Why governments… work with HelloVerify.** 6 pillars: Trust Infrastructure · Primary Source Verification at Scale · AI Powered Trust Platform · Governments We Work With · Long-Term Digital Infrastructure · Evidence-Backed Reports | The government value proposition |
| 4 | **Solutions: Government & International Authorities.** 4 photo cards, each with Explore More **and its own authority-specific CTA**: Health → Talk to Sales · Immigration → *Select Authority ▾ (Embassy of Latvia, Embassy of Italy)* · Manpower & Education → *Ministry of Manpower (Singapore)* · Business & Trade → Talk to Sales | **Four government products + named references** |
| 5 | **Segments switch.** *Large Enterprise:* White-collar, Blue-collar, KYC, Vendor & Supplier (Certifier). *SME:* 3-step how-it-works + **Basic ₹1,799 / Standard ₹2,199 / Premium ₹2,399** (60 min) + "Customize Your Package" | Enterprise catalogue + **SMB prices** |
| 6 | **Consumer Services.** "Instant Verification In Minutes": 8 tabs (Driver, Home Staff, Tenant, Nanny, Verify Anyone, Cyber Identity, Know The Identity, Know Your Contact), each with its own one-line pitch, Basic/Advanced check lists, a WhatsApp badge and **Buy Now → WhatsApp** | **8 consumer products, purchasable** |
| 7 | **Key Verification Solutions** ("33+ checks"). White/Blue-collar check lists · *Individual Checks* carousel (6 checks with 15/30/60-min badges and one-line descriptions) · *Business Due Diligence* (Trade Licence Risk, Vendor Financial Risk) · *International* (UK, Philippines, UAE, Singapore, Egypt hooks + 3 country packages) | Check catalogue, vendor DD, international |
| 8 | **"Every Great Journey Deserves a Verified Beginning."** Form: I am a/an *Applicant / Consumer / Business / Authority* · Services: White collar, Blue collar, International, Vendor DD, Partnership (demo) | Lead capture by audience |
| — | **Footer** | Every product listed again |

### 2.2 New homepage: what it shows, top to bottom

| # | Section (component) | What it does |
|---|---|---|
| 1 | **Hero.** "Verified at the source, *in minutes.*" + "AI reads the documents. Our team confirms with the issuer…" · Talk to sales / See all 33 checks | Speed + method promise. Names no product and no audience. |
| 2 | **People strip.** 8 photo cards: role · city · check · time | Human warmth, breadth |
| 3 | **"Watch it read a licence."** (Demo2) AI extraction panel: driving licence, Karnataka | Mechanism #1 |
| 4 | **"Built on trust. Proven by numbers."** 20M+ / 2,000+ / 120+ / 33+ | Scale |
| 5 | **"Six offices. Twelve hours apart."** Day band + *Governments we work with* chips (MOM Singapore, Government of India, KSA, UAE, European authorities) | Coverage + thin government proof |
| 6 | **"Why governments work with us."** 5 rows + "One result, and how we know" evidence card (driving licence, RTO Karnataka) | Government value proposition + mechanism #2 |
| 7 | **"33 checks. Most take minutes."** Dot-plot by turnaround | Check catalogue (a real improvement) |
| 8 | **"Or take a package."** 6 receipts: Blue-collar, White-collar, Driver, Trade licence risk, Vendor financial risk, Visa & healthcare. **No business prices.** | Packages |
| 9 | **"One upload. Then we get to work."** 4-step animated run: driving licence, Bengaluru | Mechanism #3 |
| 10 | **"For the moment you need to trust someone."** 6 photo cards: Governments, Enterprise & SMB, KYC, Vendors, Premium, HelloV | Audience router (arrives in the 10th section) |
| 11 | **"Verified in 120 countries."** 5 country cards with "Report ready by…" | International |
| 12 | **HelloV.** "Verify anyone. From your phone, in 30 minutes." 8 tabs, ₹499/₹799 **"Prices are placeholders"**, WhatsApp chat mock | Consumer |
| 13 | *Customer story:* **withheld** (`STORY_IS_ATTRIBUTABLE = false`, fabricated sample) | — |
| 14 | **"The unexciting part, done properly."** ISO 27001, GDPR, PBSA, NSR | Compliance |
| 15 | **"Every great journey deserves a verified beginning."** Form: Business / Government / Individual | Lead capture |

---

## 3. Gap analysis

### 3.1 Product coverage matrix

Severity: **Critical** = a product or proof a buyer needs to convert is absent · **High** = present but can't be recognised as a product · **Medium** = present, weakened · **Low** = parity or improved.

| Offering | Old homepage | New homepage | Gap |
|---|---|---|---|
| **Health Authorities: PSV for doctors, nurses, pharmacists, allied** | Named card, one-liner, Explore, Talk to Sales | Not named. Folded into "Governments & authorities: Licences, visas and permits" | **Critical** |
| **Immigration Authorities: visa pre-screening** | Named card + *Select Authority*: Embassy of Latvia, Embassy of Italy | Not named. Embassies absent from the whole site | **Critical** |
| **Manpower & Education: qualification, accreditation, equivalency** | Named card + MOM Singapore link | One MOM chip, no story | **High** |
| **Business & Trade Authorities** | Named card | Absent | **High** |
| **SMB packages (priced)** | SME tab: 3 steps, 3 priced packages, customise | Absent. No price anywhere for business | **Critical** |
| **KYC / Trust & Safety platform** | Enterprise tab card; nav: "facial recognition and liveness checks" | 4-word photo card | **High** |
| **Enterprise white-collar / blue-collar BGV** | Tab cards + check lists | 2 unpriced receipts (good), no enterprise proof | **Medium** |
| **Certifier: vendor due diligence** | Tab card + 2 packages | 2 receipts + photo card. The Certifier story is missing | **Medium** |
| **HelloV: 8 consumer products** | 8 tabs, each with its own pitch, Buy Now | 8 tabs, one generic set of checks, placeholder prices | **Medium** |
| **Premium Services: applicant support** | Nav section (3 items) + footer | 1 receipt + 1 photo card | **Medium** |
| **Visa applicants (B2C side of immigration)** | Nav: "Start your visa screening process" (tourist, student, work) | Folded into the Premium receipt | **Medium** |
| **Individual checks (time + description)** | 6-card carousel | 33-check dot-plot (better). Descriptions lost | **Low** |
| **International / country packages** | 5 hooks + 3 packages | 5 country cards | **Low** |
| **Technology / platform vision** | Nav link to a strong page | Demo only | **High** (story) |

### 3.2 Missing sales information

**Prices (all on the old live site, none on the new homepage)**
- SMB packages: **Basic ₹1,799** (Identity, Criminal, Global DB) · **Standard ₹2,199** (+ Current Address) · **Premium ₹2,399** (+ Moonlighting).
- SMB per-check prices ("Customize Your Package"): Identity ₹349 · Employment ₹499 · Education ₹999 (+ university fees) · Address ₹499 · Professional Reference ₹499.
- HelloV Advanced: **Driver ₹1,799 ("Most popular")** · **Tenant ₹1,799** · **Home staff ₹1,399** · **Nanny ₹1,399**. Basic prices aren't published anywhere I could find: *[Basic price: to confirm]*.
- MOM COMPASS: Education check SGD 108 · Accreditation SGD 33 · Express ≤ 7 working days SGD 54 (inner page. Worth one line on the homepage as proof of a live government programme.)

**Proof points (dropped, not rejected). Each needs an owner and a source before it's used; see §4.2**
- "Fraud detected in 12–14% of applications" (Health, Education pages)
- "1 in 8 applicants misrepresent their academic credentials" (Education page)
- "10–15% of complex fraudulent cases often missed by traditional checks" (Immigration page)
- "99.2% verified report rate" · "3× faster than industry average" (Enterprise, Immigration pages)
- "91% simplified screening workflow · 88% improved accuracy · 81% improved candidate experience" (Employee verification page, HR survey)
- "1,200+ SMBs trust HelloVerify" · "Onboard vendors 10× faster" · "lowering operational costs by up to 75%"
- "Recognized by Y Combinator as part of the top 1% of applicants"

**Named references**
- **Embassy of Latvia, Embassy of Italy** (Immigration partners, with their own "Partner with Us" CTA)
- **Health authority in Saudi Arabia** ("a globally recognised verification partner trusted by health authority in Saudi Arabia")
- **Ministry of Manpower, Singapore**: "officially empanelled… to provide Primary Source Verification for educational qualifications under the COMPASS framework"
- **Enterprise:** "Trusted by India's top IT/ITES companies"; three real testimonials attributed by role + company line ("HR Shared Services @ India's largest IT company", "People Function @ India's largest IT company", "Associate Lead @ India's largest Fintech company"). The code comments in `CustomerStory.tsx` confirm these are real.

**Compliance/business facts the new homepage doesn't show**
- **Data sovereignty:** "Data stored & processed locally · compliant with localisation laws · meets regulatory mandates." For a ministry this is a deal-breaker item.
- ISO/IEC 27701 (privacy). The new site's own platform copy flags its evidence as weaker than 27001's, so confirm the certificate before headlining it.
- Audit-ready reports, real-time dashboards, customisable reporting (government products).
- Practitioner categories (Doctors, Non-physicians, Pharmacists, Nurses & Midwives) and work-pass types (EP, S Pass, ONE Pass, PEP, TEP).
- REST API + bulk upload, HRMS integration, automated rules engine, 1–7 working-day enterprise TAT.

**CTAs that were more specific than "Talk to sales"**
- *Select Authority* → the embassy's applicant flow. *Ministry of Manpower (Singapore)* → the COMPASS portal. *Customize Your Package* → the SMB configurator. *Buy Now* → WhatsApp. *Partner with Us* (embassies). *Start Verification* (MOM applicants).

### 3.3 Selling ideas that were lost in the redesign

1. **"You're buying infrastructure, not reports."** The new "Why" section keeps a sharper version of this ("A ministry isn't buying reports…"). Keep it.
2. **The applicant is also a customer.** Governments buy, and applicants (doctors, visa seekers, EP candidates) pay for form-filling, pre-screening and PSV. The old nav sold both sides. The new homepage sells neither side explicitly.
3. **"We check the university before we check the degree."** The accreditation check ("…not a diploma or degree mill") is the most intuitive proof of rigour in the whole catalogue, and it's gone.
4. **Fraud has a number.** 12–14%, 1 in 8, 10–15%. The new homepage doesn't show fraud even once.
5. **"Most verification systems are static. Ours compound."** The flywheel (verifications → intelligence, institutions → network, customers → ecosystem) is the moat.
6. **"Verify once, trust everywhere."** The Persistent Trust Layer vision: governments and enterprises reuse continuously validated credentials instead of repeating checks. Flag this as roadmap language unless it's live.
7. **Family safety as an emotion.** "The nannies, house staff, drivers, and tenants you trust with your home deserve thorough verification… so you never have to wonder about the people closest to your family." The new HelloV section is functional but has no emotion.
8. **Certifier's teeth.** "Stop previously blacklisted vendors", a "Rolodex (Fake Company List)", decoy calls and mystery shopping, continuous monitoring with photos, videos and voice notes.

### 3.4 Structural problems in the new homepage

1. **The same story, told three times.** "Watch it read a licence" (Demo2), "One result, and how we know" (Why) and "One upload. Then we get to work" (HowItWorks) all follow **a driving licence in Karnataka**. That's roughly 3,500px of a 15,000px page on one blue-collar check. Meanwhile the nurse, the visa applicant, the degree, the supplier and the family each get one photo card.
2. **The wrong main character for the priority buyer.** A health ministry is shown a delivery rider's licence. Nobody is shown a nurse's degree going to a registrar and a licensing board.
3. **"In minutes" doesn't hold for governments.** Government products take days (a PSV degree check is "from 3 days"). Leading with *in minutes* speaks to the blue-collar buyer and, to a regulator, can sound like corners are being cut. *At the source* is the promise that holds for every audience.
4. **The audience router comes 10th.** "For the moment you need to trust someone" (six doors) sits around 9,300px down. IA §2 says a visitor should find their path in one decision. The doors should be in the first scroll.
5. **Placeholders are on show:** "Prices are placeholders." (HelloV). The withheld customer story leaves a hole with no substitute, and a real, attributable story exists (MOM COMPASS, §7.5).
6. **The sections are all the same shape.** Almost every section is the same `.sec-head` (H2 left, lede right) followed by a white card grid. That consistency is professional, but it's also why the page feels like "sections" rather than an experience. Nothing changes pace, nothing is pinned, and nothing responds to the visitor except the demo tabs.

### 3.5 What the new build got right, and must keep

- **The design system is an asset.** Paper/ink/green, "green is a verdict, not a theme", mono for evidence, serif for claims, receipts for prices, one verdict per surface. It's ideal material for a security-print art direction. Nothing below breaks it. It extends it.
- **Honest claims.** The team withheld a fabricated testimonial and worded every certification precisely. Keep that standard: every proof point in this document is marked for substantiation.
- **Components that already sell:** the AI demo, the dot-plot, receipts, the day band, photo cards, the WhatsApp phone, cert rows. The revamp reuses every one of them.

---

## 4. Copy bank: the best of the existing copy, improved

The founder and the writing team wrote a lot of good copy. It was spread across 14 pages and diluted by filler. Below are the strongest lines, why they work, and a sharper version written in the new voice (DESIGN.md §6: H1s under 8 words, italic serif for the human clause, no "world-class/seamless", no exclamation marks).

### 4.1 Lines to carry into the new homepage

| # | Original (verbatim) | Source | Why it works | Proposed |
|---|---|---|---|---|
| 1 | "Trust is becoming the world's next critical digital infrastructure. HelloVerify is building the platform through which trust will move." | About · Our Belief | The founder's thesis: a category, not a feature | Keep verbatim as the **platform chapter's closing statement**, labelled *Our belief*. It gives the concept its name: **How trust moves.** |
| 2 | "Governments are not simply buying verification reports they are investing in national trust infrastructure that underpins every regulated interaction." | Home · Why | Reframes a purchase as infrastructure | New site already has the best version: *"A ministry isn't buying reports. It's buying the trust layer under every permit, licence and clearance."* Keep it as the lede for the Government chapter. |
| 3 | "Verify individuals before they receive a work permit, immigration approval, professional licence, security clearance, or access to regulated professions." | Home · Why | Lists concrete government moments | Government chapter sub-lede: *"Before the permit. Before the visa. Before the licence."* The rhythm carries it and the list stays in the body copy. |
| 4 | "Every Great Journey Deserves a Verified Beginning" | Home · CTA | Warm, memorable, founder-written | Keep it as the closing line. It's the other bookend to the hero (§7.12). |
| 5 | "Accuracy Is Not Our Feature. It's Our Promise." / "While technology is our backbone, results are our benchmark." | Health, Education | A confident promise | *"Accuracy isn't a feature. It's the promise."* Place it on the evidence card in *How we know*. |
| 6 | "Most verification systems are static. Ours compound." | Technology | Short, true, defensible. Names the moat | Keep verbatim as the **H2 of the platform chapter**. |
| 7 | "Our accreditation check confirms that the institution is a legitimate and approved provider of degree programs, not a diploma or degree mill." | Education | The most intuitive proof of rigour | *"We check the university before we check the degree."* Signature line for the Manpower & Education dossier. |
| 8 | "1 in 8 applicants misrepresent their academic credentials" | Education | A human-scale number | *"One in eight isn't who the paper says."* H2 of the fraud scene. **Needs a source (§4.2).** |
| 9 | "We flag fraudulent documents before approval. Our system detects fraud in 12–14% of applications." | Education, Health | Timing ("before approval") plus a number | *"We catch it before the approval, not after. In 12–14% of the applications we screen."* **Needs a source.** |
| 10 | "Identifies hidden inconsistencies invisible to the naked eye." | Immigration | Visual promise | Microcopy for the UV-loupe interaction: *"What the naked eye misses, the issuer confirms."* |
| 11 | "Stop Bad Hires Before They Happen" | Enterprise | Direct, the enterprise pain | Kicker for the Enterprise chapter. H2: *"Everyone inside, checked before they're in."* |
| 12 | "The nannies, house staff, drivers, and tenants you trust with your home deserve thorough verification… so you never have to wonder about the people closest to your family." | SMB page | Emotion plus specificity | Families chapter H2: *"Before they hold your keys."* Lede: *"The people closest to your family deserve the closest look."* |
| 13 | "Because the cost of a wrong vendor is one your business should never have to pay." / "Bad actors don't stand a chance." | Certifier | Consequence framing | Certifier ring: *"A wrong vendor costs more than a check."* |
| 14 | "Verify Your Qualifications. Get Your Work Pass." | MOM | Two-beat applicant promise | Keep for the MOM case story's applicant line. |
| 15 | "Trusted qualifications are the foundation of global education and workforce mobility… allowing countries to attract qualified talent while protecting national standards." | Education | The regulator's real goal | Manpower dossier H3: *"Attract talent. Protect standards."* |
| 16 | "Every verification is supported with clear remarks, verification artefacts and an auditable trail for confident decision making." | Home · Why | Procurement language | New site already has *"Evidence, not opinion."* Keep, and show the artefact (hash, time, reviewer) on the evidence card. |
| 17 | "Onboard faster. Detect fraud earlier." | KYC | Two benefits, symmetrical | Keep for the KYC ring. |
| 18 | "Behind every verification is a person." | About · Values | Dignity. Rare in this category | Use it under the people strip or in the compliance section: *"Behind every check is a person. We treat them like one."* |
| 19 | "Hire drivers you can trust." · "Know your tenant before you rent." · "Verify education credentials in minutes." · "Confirm employment history before you hire." | Home · International | Good one-line country hooks | Keep as microcopy on the world-map routes. |
| 20 | "Data Sovereignty – Local Assurance: Data stored & processed locally… meets regulatory mandates." | Gov pages | A procurement deal-breaker item | *"Your citizens' data stays in your country."* **Confirm which countries have in-country processing before promising it.** |
| 21 | "Persistent Trust Layer… Governments and enterprises access continuously validated credentials instead of repeating the same verification process." | Technology | The future product | *"Verify once. Trusted everywhere."* **Label as roadmap unless live.** |
| 22 | "Get verified in minutes, not days!" / "Trust in Minutes, not Days" | Home, Employee | Speed | Already improved by the new site: *"33 checks. Most take minutes."* Keep the new version. |

### 4.2 Claims register: substantiate before publishing

The new build treats claims as liabilities (`CustomerStory.tsx`, the cert glosses in `lib/copy/platform.en.tsx`). This revamp follows the same rule. Each of these needs a named owner and a source document before it goes on the page:

| Claim | Where it appeared | Status / conflict to resolve |
|---|---|---|
| Fraud detected in 12–14% of applications | Health, Education | Which programme, which period? |
| 1 in 8 applicants misrepresent academic credentials | Education | Internal data or an industry statistic? |
| 10–15% of complex fraud missed by traditional checks | Immigration | Source? |
| 99.2% verified report rate · 3× faster than industry | Enterprise, Immigration | Definition of "verified report rate"? Benchmark for "3×"? |
| 91% / 88% / 81% HR survey | Employee verification | Survey date and sample size? |
| 1,200+ SMBs · ₹649 starting per check · "9 Day TAT average" | SMB page | Conflicts: ₹649 vs Identity at ₹349; "60 mins" packages vs "as fast as 24 hours" vs "9 Day TAT". |
| Onboard vendors 10× faster · costs down up to 75% | Certifier | Source? |
| Y Combinator "top 1% of applicants" | About | YC-backed is safe. "Top 1%" needs wording approval. |
| Trusted by a health authority in Saudi Arabia | Health | Permission to name the authority (a named reference is far stronger)? |
| Embassy of Latvia · Embassy of Italy as partners | Immigration | Permission to show them as partners, and the exact wording? |
| MOM Singapore empanelment (COMPASS PSV) | MOM | Publicly verifiable. Safe, and should be the headline case. |
| ISO/IEC 27701 · ISO 9001 | Gov pages | The old Education page says "ISO 9001 and 27701" where other pages say 27001 + 27701. The new platform copy says 27701 rests on weaker evidence. Confirm the certificates. |
| Real-time checks in "80+ countries" | Trade page | Conflicts with 120+ everywhere else. Probably a different metric (real-time vs any). |
| HelloV Basic prices | — | Not published. Needed to replace the placeholders. |
| "30 mins" consumer turnaround | Home | The Basic/Advanced tiers both say 30 mins. Confirm. |

---

## 5. The big idea: *How trust moves*

### 5.1 The concept

> *"Trust is becoming the world's next critical digital infrastructure. HelloVerify is building the platform through which trust will move."* (the founder's belief, from the old About page)

If trust is infrastructure, the homepage should **show trust moving**, the way a transit map shows a city moving. Every product HelloVerify sells is the same basic journey:

```
  CLAIM ──────────────▶ SOURCE ──────────────▶ VERDICT
  "I'm a licensed        the university,         Verified · named source
   nurse"                the licensing board,    · time · artefact · audit trail
                         the RTO, the court,
                         the registry
```

A nurse's degree travels from a university in Manila to a health authority in Riyadh. A driving licence travels from RTO Karnataka to a fleet manager in Bengaluru. A supplier's trade licence travels from a company registry to a procurement desk. A nanny's criminal record travels from the district courts to a mother's WhatsApp. **The same machine running different routes, at different speeds, for different buyers.** That one sentence explains the platform, gives every product a place, and makes every section part of one story.

### 5.2 The three devices that make it one experience

**1. The green thread (continuity).** One SVG line runs the length of the homepage, drawn as you scroll. It's the route of the claim. The design system already says *"green is a verdict, not a theme"*, so the thread **starts as a dashed ink line** and **turns solid green only when it passes through a source**. In each scene it becomes something else: the stamp's path in the hero, the timeline in *How we know*, the index-tab edge of the government dossiers, the orbit in the enterprise perimeter, the paper feed of the SMB receipt, the message line in the WhatsApp chat, the routes on the world map, the edges of the platform network. It **ends at the Submit button** of the closing form. This is what turns "a collection of sections" into "one connected experience", and it costs a single SVG path with a scroll-driven `stroke-dashoffset`.

**2. The case file (structure).** The page is organised like a dossier: a slim **index rail** of chapter tabs, which later turns into a sticky progress index (`Claim · Proof · Governments · Enterprises · Businesses · Families · World · Platform · Begin`). Each audience can jump straight to its chapter, and the rail shows how far you've read. This is the IA's "one decision" router, presented as a physical object.

**3. Security print (art direction).** Documents that must not be forged (passports, banknotes, degree certificates, stamp papers) have their own visual vocabulary: **guilloche** rosettes and waves, **microtext** lines, **intaglio/engraved** line illustration, **perforations**, **embossed seals**, **UV-reactive ink** that appears only under blacklight, **holographic foil** that shifts with angle. HelloVerify's product is telling a real document from a fake, so this is the one art direction that *means* something here rather than decorates. It fits the existing system: guilloche and microtext are drawn in `--hair` and `--muted` ink on `--paper`, seals are embossed paper-on-paper, and the only colour event is still the green verdict. Every chapter gets **its own guilloche signature** (a different rosette per audience, like passport covers of different countries), so each section has its own identity while the whole page reads as one family.

### 5.3 Rules the experience must respect

- **Selling beats spectacle.** Every signature moment has to demonstrate a product claim: the loupe proves "we find what the eye can't", the receipt proves "transparent prices", the dossiers prove "four government products". If an effect doesn't prove something, cut it.
- **One signature moment per chapter.** Everything else stays quiet: one-shot reveals, hairlines, the existing easing. Restraint is what makes award-level work read as premium, and a ministry reader as credible.
- **Every interaction degrades to a readable page.** With JavaScript off or `prefers-reduced-motion`, every scene shows its final, verified state as a static ledger (DESIGN.md §4 already requires this).
- **No fabricated data.** "Live" feeds and counters show real aggregates or are labelled *illustrative*. Named issuers appear only with permission (§4.2). Every statistic links to a methodology note, with a "last updated" date on anything live.
- **No real crests or document templates.** Every document drawn on the page is a fictional issuer with synthetic data. Drawing a real ministry's emblem or licence template is an impersonation risk and a procurement red flag (§9.5).

### 5.4 Keep the concept internal; anchor the public words in "the source"

"Trust infrastructure" is **already claimed**: Socure calls itself "AI-Native Trust Infrastructure", World "the new standard of trust online", and AuthBridge's hero, "Trust. Transformed by AI. Verified by Humans", is close to HelloVerify's own positioning (§9.3). So *How trust moves* is the **internal creative concept**: it shapes the structure, the thread and the transitions. The founder's belief is quoted once, as a statement, in the platform chapter. The **public promise everywhere else is anchored in what only HelloVerify can prove: _the primary source_ and _the governments already relying on it_.** That's why the recommended H1 is "Every claim, verified *at its source*", not a trust-infrastructure line.

---

## 6. The proposed homepage: narrative and section order

### 6.1 The arc

```
 HOOK            STAKES          MECHANISM        CHAPTERS (the catalogue, by buyer)                      SCALE    VISION     PROOF    ACTION
 ─────────────── ─────────────── ──────────────── ──────────────────────────────────────────────────────── ──────── ────────── ──────── ────────
 01 The claim    03 One in eight 04 How we know   05 Governments · 06 Enterprises · 07 Growing businesses  09 World 10 Platform 11 Seals  12 Begin
 02 Proof strip                                      · 08 Families
 thread: ink ──── ink ─────────── turns GREEN ──── green, with a different shape in each chapter ────────────────────────────────────────▶ ends at Submit
```

A government reader can scan 01 → 02 → 05 → 11 → 12 in under a minute using the index rail. An SMB owner jumps to 07 and sees prices in one click. A parent jumps to 08. Someone reading from the top gets the whole story.

### 6.2 From the current homepage to v2

| Current section | v2 fate | Where it goes |
|---|---|---|
| Hero "Verified at the source, in minutes." | **Rewrite** | 01. New H1, product and audience named, claims deck, four doors |
| People strip | **Keep** | 01, as the band under the hero (retimed to the concept) |
| Demo2 "Watch it read a licence" | **Merge** | 04 *How we know*, as its first beat ("Read") |
| Numbers 20M+/2,000+/120+/33+ | **Move up + restyle** | 02 proof strip (odometer), repeated as the 11 crescendo |
| Presence (day band) | **Move** | 09 *World* |
| Governments-we-work-with chips | **Upgrade** | 02 (named references with permission) + 05 dossiers |
| Why governments (5 rows + evidence card) | **Split** | Rows → 05 *Why governments* ledger. Evidence card → 04 verdict |
| 33-check dot-plot | **Keep** | End of 04, as the catalogue drawer ("See all 33") |
| Packages (6 receipts) | **Distribute** | Blue/white-collar → 06 · Certifier ×2 → 06 · Driver → 08 · Visa & healthcare → 05 applicant side |
| HowItWorks (DL Bengaluru) | **Merge** | 04, as the rider's route in "two speeds" |
| Who it's for (6 cards) | **Move to the top, slim down** | 01, the four doors |
| International | **Upgrade** | 09 world map of sources |
| HelloV | **Upgrade** | 08. Real prices, grouped products, QR, emotion |
| Customer story (withheld) | **Replace** | 05. MOM COMPASS case story (real, public) + 06 real testimonials |
| Compliance | **Keep + extend** | 11. Add data sovereignty and a procurement pack |
| Contact | **Keep** | 12. The thread ends at Submit |
| — *(new)* | **Add** | 03 *One in eight* (fraud) |
| — *(new)* | **Add** | 05 four government dossiers + applicant side |
| — *(new)* | **Add** | 06 enterprise trust perimeter (BGV + KYC + Certifier) |
| — *(new)* | **Add** | 07 SMB receipt configurator (prices) |
| — *(new)* | **Add** | 10 *Ours compound*, the platform and the founder's belief |

Page length: the current page is about 15,000px at 1440. v2 should land around **17,000–19,000px**, because three mechanism sections become one and the six-card router becomes a strip. The index rail keeps every chapter one click away.

---

## 7. Section-by-section specification

Each section below states its **sales job**, **the product it sells**, the **story beat**, **draft copy**, **art direction**, the **one signature interaction**, **motion**, **proof on screen**, the **CTA**, the **transition** into the next section, what's **reused** from the current build, and the **fallback** (reduced motion / no JS / phone). Copy is a draft for the section-by-section sessions, not final. Anything in *[brackets]* needs a fact from the team.

---

### 7.0 Chrome: nav and the index rail

- **Sales job:** one decision to reach the right product. Keep "Talk to sales" as the single persistent primary CTA.
- **Nav:** keep the new audience-first nav (Governments · Business · Individuals · Platform · Resources). Add **mega-panels that sell**: each item opens a panel with the products as mini-receipts (name, one-line job, turnaround, "from" price where one exists). That brings back the old nav's product-per-line clarity in the new visual language.
- **Index rail (new):** after the hero, a slim sticky rail (vertical on the left at ≥1280px, a horizontal top strip below that) lists the chapters as **dossier tabs**. The active tab is ink. Chapters you've already passed get a small green tick, a tiny version of the thread's verdict. Clicking a tab smooth-scrolls there; keyboard and screen readers get a `<nav aria-label="On this page">`.
- **Fallback:** without JS it's a plain in-page link list.

---

### 7.1 Hero: *The claim*

- **Sales job:** in five seconds, say **what is sold** (verification of people, credentials and companies at the primary source), **to whom** (governments, businesses, families) and **why believe it** (named issuers, scale).
- **Story beat:** a claim is made.
- **Copy (options, H1 under 8 words):**
  1. **"Every claim, verified *at its source.*"** *(recommended. Works for all four audiences. Keeps the new site's strongest idea, "at the source", and drops the "in minutes" promise that doesn't hold for government products.)*
  2. "Trust, verified *at the source.*"
  3. Keep "Verified at the source, *in minutes.*" and let the lede carry the government story (weaker for B2G).
  - Lede: *"Degrees, licences, identities, companies — confirmed with the university, the regulator or the registry that issued them. For governments licensing professionals, enterprises hiring at scale, and families letting someone in."*
  - Proof line (mono, under the CTAs): `20M+ checks since 2018 · 120+ countries · 2,000+ clients · Y Combinator`
- **Art direction:** paper ground with a very faint, large **guilloche rosette** behind the H1, drawn in `--hair` and slowly rotating (ambient loop, allowed by DESIGN.md §4). To the right, or below on narrow screens, a **claims deck**: five documents drawn as engraved security-print illustrations, not photos. A nurse's licence, a degree certificate, a trade licence, a driving licence and a passport visa page, with microtext borders. **All are fictional issuers with synthetic data. No real crest or template** (§9.5).
- **Signature interaction: the stamp.** The deck cycles every ~3s. Each document gets a round **"VERIFIED · [issuer] · [time]" seal** that lands with physical weight: scale 1.08 → 1, a 2px settle, an ink-bleed mask that spreads 120ms. The seal is the existing `.vseal`, animated. Hovering a document pauses it and shows its route in mono (`Degree · University registrar · 3 days`). The green thread starts at the last stamp and drops down the page.
- **Four doors (the router, moved up from section 10):** a row of four slim cards under the fold line: **Governments** (licences, visas, permits · from 3 days) · **Enterprises** (employees, customers, vendors · from 30 min) · **Growing businesses** (packages from ₹1,799) · **Families** (verify on WhatsApp · 30 min). Each scrolls to its chapter.
- **Then** the existing **people strip** runs underneath as the human band (role · city · check · time).
- **CTA:** Talk to sales (primary) · "Find your solution ↓" (secondary, scrolls to the doors).
- **Transition →** the thread runs down from the stamp into the proof strip, still dashed ink.
- **Reuse:** YC badge, people strip, `.vseal`, buttons.
- **Fallback:** a static deck showing all five documents already stamped. The H1 is live text, so it's the LCP element and paints immediately.

---

### 7.2 Proof strip: *Who already trusts it*

- **Sales job:** credibility within the first scroll, especially for the government buyer.
- **Content:** one ruled band. On the left, **named references** as cert-row-style marks: *Ministry of Manpower, Singapore (empanelled PSV partner, COMPASS)* · *Health authority, Saudi Arabia [name if permitted]* · *Embassy of Latvia* · *Embassy of Italy* · *[India: named authority if permitted]*. On the right, the **four numbers** as an **odometer** (digits roll once into place): 20M+ checks since 2018 · 2,000+ clients · 120+ countries · 33+ checks.
- **Signature:** none. This band is deliberately calm, so the fraud scene lands harder.
- **Transition →** the band's bottom hairline becomes a *perforation* (the dotted tear line of a document). The next scene is "torn off" the stack.
- **Reuse:** Numbers (`.big`), the Governments block, `.cert`.

---

### 7.3 *One in eight*: the stakes (new)

- **Sales job:** make every buyer feel the cost of *not* verifying, and prove HelloVerify catches what others miss. This sells every product at once.
- **Story beat:** the claim might be false.
- **Copy:**
  - H2: **"One in eight isn't *who the paper says.*"** *(needs the 1-in-8 source, §4.2)*
  - Lede: *"Forged degrees, tampered licences, companies that exist only on letterhead. We catch them before the approval, not after — in 12–14% of the applications we screen for authorities."* *(needs source)*
  - Three reason lines (mono ledger): `Template & fonts — against the issuing series` · `Institution — accredited, or a degree mill?` · `Issuer — confirmed, or unreachable?`
  - Signature line: **"What the naked eye misses, the issuer confirms."**
- **Art direction:** eight documents laid out like evidence on a table (a 4×2 grid of degree certificates, each with its own engraved crest). Seven are genuine. One is forged: its crest is subtly off, the font weights don't match, and the "university" doesn't exist.
- **Signature interaction: the UV loupe.** Over this section the cursor becomes a **circular blacklight loupe** (a CSS `mask-image` radial gradient revealing a second "UV layer" of the same illustrations). Under the loupe, genuine documents show their hidden **UV security features** (microtext "VERIFIED AT SOURCE", a hidden seal, green fluorescent fibres, the one legitimate use of green on the documents). The forged document shows *nothing* under UV, and its mismatches are circled in ink with mono annotations (`font weight 500 ≠ series 400`, `institution: not accredited`). When the visitor finds it (or after ~6s, or when they press **"Show me the forgery"**), the forged document gets an **ink stamp: "REFERRED · NOT VERIFIED"** (ink, never red, per DESIGN.md) and the seven genuine ones tick green in sequence: *7 verified, 1 referred.*
- **Second beat: Claimed ⇄ Verified.** Once the forgery is found, it enlarges beside a two-position switch (after *The Other Side of Truth*, §9.1). **Claimed** shows the document as submitted: *"B.Sc. Nursing · [Fictional] Institute of Health Sciences · 2019"*. **Verified** shows what the sources returned, as a ledger: `Institution — not accredited by [national body]` · `Registrar — no record of enrolment` · `Verdict — referred`. It's the most direct possible picture of "misrepresentation", and it makes the same point for a degree, a licence or a company.
- **Why it sells:** it's the product demonstration, compressed into a game a ministry official and a parent both understand in five seconds. It also directly visualises old copy ("hidden inconsistencies invisible to the naked eye"). All documents are fictional and labelled *illustrative, synthetic data*.
- **Motion:** the loupe follows the cursor with light easing (lerp ~0.18). Stamps land with the hero's stamp physics, which is a deliberate callback.
- **Proof:** the fraud rates (sourced), "we check the university before the degree", "proprietary database of fraudulent institutions".
- **Transition →** the forged document is lifted off the table and becomes the case in *How we know*: "Here's how we knew."
- **Fallback / phone:** on touch, tapping a document reveals its UV layer. A visible button "Show me the forgery" does the reveal for keyboard, screen-reader and reduced-motion users, and the final state (7 green, 1 referred, annotations visible) is static and readable. The loupe is decorative: the annotations exist as real text.

---

### 7.4 *How we know*: the mechanism, told once (merges three current sections)

- **Sales job:** prove *primary source* in a way that holds for both the government buyer (days, registrars) and the business buyer (minutes, registries). Replaces Demo2, the Why evidence card and HowItWorks.
- **Story beat:** the claim travels to its source.
- **Copy:**
  - H2: **"Same machine. *Two speeds.*"**
  - Lede: *"AI reads the document in about a second. Then a person takes it to the source — the registrar, the licensing board, the RTO, the court — because a website that looks like the university isn't the university."* (built from the new hero lede + the new HowItWorks copy "not a website that looks like one")
  - The four stage names stay: **Upload · Read · Confirm · Report**.
- **Art direction:** one wide white "case" card (the existing HowItWorks panel) with a **route line** across the top: the green thread, now a timeline.
- **Signature interaction: pick a route.** A two-way switch at the top: **"A nurse's degree · Manila → Riyadh"** and **"A rider's licence · Bengaluru"**. The same four stages play out with different documents, sources and clocks:
  - *Nurse:* Upload (applicant portal) → Read (AI, 14 fields, 1.2s) → **Confirm** (university registrar → accreditation body → licensing board → certificate of good standing) → Report (health authority, audit trail) · **3–5 days** *(confirm typical PSV TAT)*
  - *Rider:* Upload (candidate's phone, 09:40) → Read (0.9s) → Confirm (RTO Karnataka, 10:08) → Report (HR, 10:10) · **30 min** (existing content)
  - The stage scrubs with scroll (pinned about 120vh). The thread turns green at "Confirm", the moment of the source. The verdict strip reads: *"Accuracy isn't a feature. It's the promise."* plus the artefact: `Artefact · registrar letter · PDF · hashed` / `Reviewed · K.S. · audit trail, 5 events` (from the current evidence card).
- **Then:** the **33-check dot-plot**, collapsed into a drawer ("33 checks. Most take minutes. *See where each one lands →*"), with each pill gaining its old one-line description on hover or focus (e.g. *Criminal · 30 min — "Checks court records for any cases against the candidate"*).
- **Transition →** the switch's two routes split: the nurse's route curves into the Government chapter, and the rider's is picked up later in Enterprises.
- **Reuse:** Demo2 extraction panel (the "Read" beat), HowItWorksPanels, the evidence card, Checks dot-plot.
- **Fallback:** both routes shown as two static ledgers side by side, final states visible.

---

### 7.5 Chapter I: Governments (new; the priority chapter)

- **Sales job:** make the four government products unmistakable, show named proof, and pass the procurement sniff test (sovereignty, audit, certification).
- **Sells:** Health Authorities PSV · Immigration Authorities pre-screening · Manpower & Education qualification + accreditation + equivalency · Business & Trade Authorities · plus the applicant-side services (Premium).
- **Story beat:** trust at national scale.
- **Copy:**
  - Kicker: `CHAPTER I · GOVERNMENTS & AUTHORITIES`
  - H2: **"Every permit, *traced to its source.*"** (alt: *"National scale. Primary source."* The phrase "trust infrastructure" is avoided in headlines because competitors already own it, §5.4)
  - Lede: *"A ministry isn't buying reports. It's buying the trust layer under every permit, licence and clearance."* (new site, keep)
  - Sub-lede: *"Before the permit. Before the visa. Before the licence."*
- **Signature interaction: the four dossiers.** A pinned scene (about 4 × 60vh). On the left, a stack of **four case folders with index tabs**: *Health · Immigration · Manpower & Education · Business & Trade*. As you scroll, the top folder's cover slides aside (a 3D-free, 2D paper slide with a long soft shadow, per DESIGN.md) and its contents fan out on the right. Tabs are real buttons, so readers can jump straight to any folder. Each folder cover has **its own guilloche signature and seal**, like passport covers:
  1. **Health Authorities.** *"Every clinician, verified where they qualified."* Ledger: Education · Institute accreditation · Health licence · Certificate of good standing · Employment · Business registration. Chips: Doctors · Non-physicians · Pharmacists · Nurses & midwives. Proof: *"PSV partner to [a health authority in Saudi Arabia]"* · audit-ready reports · data processed locally. Route: `Manila → Riyadh · nurse · PSV`.
  2. **Immigration Authorities.** *"Screen the file before the visa."* Ledger: identity · education · employment · financial · criminal · supporting records, digital and paperless. Proof: **Embassy of Latvia · Embassy of Italy** *(with permission)* · fraud alerts · real-time dashboards · *"10–15% of complex fraud is missed by traditional checks"* *(source)*. Route: `Applicant → Embassy · pre-screen`.
  3. **Manpower & Education.** *"We check the university before we check the degree."* H3: *"Attract talent. Protect standards."* Ledger: qualification verification · institution accreditation · equivalency across 120+ countries. Proof: **Ministry of Manpower, Singapore: empanelled PSV partner under COMPASS.** Route: `University → MOM · EP / S Pass`.
  4. **Business & Trade Authorities.** *"Know every company, and who runs it."* Ledger: entity registration · directors · foreign-worker credentials · criminal · API into visa-processing systems. Route: `Registry → Authority · entity + directors`.
- **Why governments (ledger):** after the dossiers, the current five *Why* rows as a ruled ledger (Primary source at national scale · One platform, public and private · Proven with governments · Built to last · Evidence, not opinion), plus **Data sovereignty** as a sixth row *(confirm per country)*.
- **The case story (replaces the withheld fake one):** **"When Singapore changed the rules."** From 1 Sept 2023 every Employment Pass candidate has to pass COMPASS, and under criterion C2 every post-secondary qualification has to be verified by an empanelled vendor. HelloVerify is one of them. Layout: the current CustomerStory shell with the MOM mark where the headshot was, and **no invented metrics**. The facts are public (MOM's framework) and HelloVerify's own (SGD 108 per qualification, ≤ 7-working-day express, all work-pass types: EP, S Pass, ONE Pass, PEP, TEP). This is real, attributable and specific, which is exactly what `CustomerStory.tsx` is waiting for.
- **The applicant side (Premium Services):** a slim band: *"On the other side of every application is an applicant."* Two receipts: **Healthcare professionals** (application form-filling support, document pre-screening, PSV → *"submission-ready file"*) and **Visa applicants** (pre-screening for tourist, student and work visas). The CTA is "Start your application", a different buyer from "Talk to sales", so it's scoped inside the band.
- **Programme cards, not a logo wall.** Where permission exists, each dossier carries a programme card in mono: `Authority · Scope · Since · Volume · Turnaround` (e.g. `Ministry of Manpower, Singapore · COMPASS C2 qualification PSV · since [year] · [volume] · ≤ 7 working days express`). This is the format IDEMIA and SITA use for government proof, and the one DataFlow's homepage lacks (§9.3).
- **CTA ladder for government (procurement-friendly, not aggressive):** **"Request a briefing"** (the primary CTA, labelled for this audience) · "Download the capability statement (PDF)" · "RFP & security pack" · *optionally* **"Scope a pilot"**, a pilot framed as a product (Palantir's bootcamp pattern) if sales can offer one (D9). Secondary links: "Explore Health Authorities →" etc.
- **Transition →** the last folder closes. The thread leaves the government registry and runs to an office building: *"The same checks, inside a company."*
- **Reuse:** Why rows, Governments marks, CustomerStory shell, the Visa & healthcare receipt, `.cert`.
- **Fallback / phone:** the folders become a horizontal swipeable stack (scroll-snap) with visible tabs, and every folder's contents are in the DOM.

---

### 7.6 Chapter II: Enterprises (new structure)

- **Sales job:** show that one vendor covers **every group of people a company has to trust**, with enterprise proof (clients, integration, TAT).
- **Sells:** White-collar BGV · Blue-collar BGV · Customer KYC / Trust & Safety · Certifier vendor due diligence.
- **Story beat:** trust around an organisation.
- **Copy:**
  - Kicker: `CHAPTER II · ENTERPRISES` · *"Stop bad hires before they happen."* (old, keep as the kicker line)
  - H2: **"Everyone inside, *checked before they're in.*"**
  - Lede: *"Employees, customers, suppliers. Three doors into your company, one platform watching all of them."*
- **Signature interaction: the trust perimeter.** A sticky diagram of three concentric hairline rings around a small engraved "company seal" (your organisation). As you scroll, each ring is highlighted in turn and the thread orbits it:
  1. **Employees:** white-collar and blue-collar receipts (the existing ones: *4 checks · ready in 3 days*, *4 checks · ready in 30 minutes*) plus "HRMS API · bulk upload · 1–7 working days" *(confirm)*.
  2. **Customers (KYC).** *"Onboard faster. Detect fraud earlier."* A mini phone sequence: ID photo → selfie → face match → liveness → decision (from the old KYC page's 6 steps). Chips grouped as on the old page: KYC · KYB · Underwriting · Fraud & risk · Execute (e-sign, e-stamp, bank-account validation) · AML.
  3. **Suppliers (Certifier).** *"A wrong vendor costs more than a check."* The two Certifier receipts (Trade licence risk, Vendor financial risk · 2 days) plus the teeth: *"We keep a list of companies that don't exist"* (the Rolodex) · continuous monitoring · 4-step virtual onboarding.
- **Proof:** the three **real de-identified testimonials** as ruled quote cards (role + company line only, no photo, no metrics), exactly the format the `CustomerStory.tsx` comment calls safe. For example: *"They are fast and accurate in running background checks, which have always helped us to make better hiring decisions." — HR Shared Services, India's largest IT company.* Plus NSR membership and *[client logos if permitted]*.
- **CTA:** Talk to sales · "Explore Enterprise BGV →".
- **Transition →** the rings collapse to a single point, *"Smaller team? Same checks, priced on the page,"* and the point becomes the tip of a receipt feeding out.
- **Reuse:** receipts, cert rows, `LeadMock`-style phone for KYC.
- **Fallback / phone:** rings become a three-segment control (Employees / Customers / Suppliers) with each panel stacked. Diagram as a static SVG.

---

### 7.7 Chapter III: Growing businesses (new; brings back prices)

- **Sales job:** show prices and let an SMB buy without talking to anyone. This is the IA §4.3 flow, and right now the homepage fails it.
- **Sells:** SMB BGV packages + à la carte checks → `app.helloverify.com`.
- **Story beat:** trust you can price.
- **Copy:**
  - Kicker: `CHAPTER III · GROWING BUSINESSES`
  - H2: **"Know the price *before the call.*"** (alt: *"Three packages. Prices on the page."*)
  - Lede: *"Pick a package or build your own. Consent is collected from the candidate's phone, and the report lands in [60 minutes — confirm]."*
  - How it works (from the old site, tightened): **01 Select checks · 02 Candidate consents · 03 Get the report.**
- **Signature interaction: the receipt that prints.** On the left, three package receipts on a spike: **Basic ₹1,799 · Standard ₹2,199 · Premium ₹2,399** (existing `.rc` style, real prices, checks listed, each builds on the last: "All Basic checks plus address verification…"). On the right, **"Build your own"**: tapping checks (Identity ₹349 · Employment ₹499 · Education ₹999* · Address ₹499 · Reference ₹499) feeds a receipt out of a slot line by line. The paper advances with a 180ms step, the dashed separators draw in, the **total in serif-italic green ticks up**, and the barcode regenerates from the selection. "Buy now" sits at the bottom of the receipt. *\*University fees extra*, as a mono footnote.
- **Why it's award-level and sells:** it's tactile, honest and fast, and it turns pricing (usually the most boring block on a page) into the most satisfying one. It also doubles as a configurator for the real app.
- **CTA:** **Buy now** (ink, scoped to this chapter; see decision D3 in §10) · "Talk to sales" for more than *[N]* hires a month.
- **Proof:** *[1,200+ SMBs, if confirmed]* · the SMB testimonials exist on the old page but read as invented (first-name-plus-role personas). Don't reuse them without verification.
- **Transition →** the receipt tears off along its perforation and becomes a WhatsApp message bubble: *"And at home?"*
- **Fallback:** a static package table plus a price list. Buy-now links still work.

---

### 7.8 Chapter IV: Families (HelloV, upgraded)

- **Sales job:** make a parent or landlord buy from their phone in one sitting, with real prices and a reason to care.
- **Sells:** HelloV: Driver · Home staff · Nanny · Tenant (*in your home*) · Verify anyone · Cyber identity · Know the identity · Know your contact (*people you meet online*).
- **Story beat:** trust at the front door.
- **Copy:**
  - Kicker: `CHAPTER IV · FAMILIES · HelloV`
  - H2: **"Before they *hold your keys.*"**
  - Lede: *"The people closest to your family deserve the closest look. Send a photo of their ID on WhatsApp. We check with the RTO and the courts, and message you the report — in about 30 minutes."*
- **Two groups instead of eight tabs:** **In your home** (Driver ₹1,799 *most chosen* · Home staff ₹1,399 · Nanny ₹1,399 · Tenant ₹1,799, the Advanced prices) and **Online** (Verify anyone · Cyber identity · Know the identity · Know your contact). Each product keeps its own one-line pitch from the old site (e.g. Tenant: *"credit, criminal and identity signals"*; Know your contact: *"verify picture, ID and location before you trust a contact"*).
- **Signature interaction: the conversation plays.** The existing WhatsApp phone is kept, but the chat now **plays as a one-shot sequence when it enters view** (Priya's school-run driver, 09:12 → 09:42, *Verified · 27 min*) and **replays with the right script** when a different person is chosen (nanny, tenant…). Beside the phone on desktop: a **real QR code**, *"Scan with your WhatsApp camera"*, the old site's 3-step flow reduced to one action.
- **Art direction:** warmer. Candid photography of the four people (per the DESIGN.md photo brief), and this chapter's guilloche is a soft **house-key rosette**.
- **CTA:** **Buy on WhatsApp** (scoped) · prices are real, and the placeholder note is removed.
- **Transition →** the chat's delivery ticks become two dots on a map: *"Wherever the document was issued."*
- **Reuse:** HelloVPhone, Consumer tabs → groups.
- **Fallback:** a static chat transcript plus a price list. The QR also works as a plain link.

---

### 7.9 *Wherever it was issued*: the world (upgrade)

- **Sales job:** make "120+ countries" concrete and plannable.
- **Copy:** H2 **"Wherever it was issued, *we go there.*"** · Lede: *"Local sources — the same courts, registries and licensing bodies a local employer would call."* (new site, keep)
- **Signature interaction: routes on a dot map.** A light **dot-matrix world map** (SVG, printed-halftone style, not a WebGL globe; globes are the most generic move in this category and heavy). As you scroll, the thread draws routes from issuer to buyer. **If the data exists, the routes are real, aggregated, anonymised corridors** (the Stripe/GitHub globe principle, §9.1): *"Nursing licence · Philippines → Saudi Arabia · median [n] days"*, with a methodology note. Each route is focusable and shows its detail on hover or focus. Otherwise, use the five existing country stories, each with its country hook and a "report ready by" clock (existing cards, in the visitor's local time): UK · drivers · *"Hire drivers you can trust."* · Philippines · tenants · UAE · house help (Criminal, Passport, Entitlement to work) · Singapore · graduates · Egypt · tenants. Below it, the existing **six-office day band** with its live now-line (*"Someone at a desk · 21 of 24 hours"*).
- **CTA:** "All countries →" (programmatic `/countries/:country` pages).
- **Transition →** zoom out: the routes become the edges of a network: *"Every route makes the next one faster."*
- **Fallback:** static map with all routes drawn. Country cards as a list.

---

### 7.10 *Ours compound*: the platform and the belief (new)

- **Sales job:** show what makes HelloVerify defensible (the moat), and end the story on the founder's vision. It's the section that makes a government buyer see a long-term partner.
- **Copy:**
  - H2: **"Most verification systems are static. *Ours compound.*"** (old, verbatim)
  - Three engines as three ruled rows: **Onboarding AI** (*"captures, structures and validates data straight from the document"*) · **Research intelligence** (*"connects with the right authorised contact, and a proprietary database of fraudulent institutions"*) · **Workflow orchestration** (*"routes every case across countries and institutions"*).
  - Flywheel captions: *"Every verification enriches our intelligence. Every connected institution becomes a permanent node. Every customer strengthens the network."*
  - Closing statement, set very large, one line at a time: **"Trust is becoming the world's next critical infrastructure." / "We're building the platform through which it moves."** · `OUR BELIEF`
- **Signature interaction: the network grows.** A hairline network drawing where scroll adds **nodes** (institutions, in ink) and **edges** (verifications, in green), the density compounding visibly. Real aggregates only (20M+, 120+, 2,000+). No invented "institutions connected" figure. The thread from every earlier chapter terminates into this network, so all the routes from the page are in it.
- **CTA:** "How the platform works →" (`/platform/technology`) · API docs *[if public]*.
- **Transition →** the network settles into a single embossed seal: the proof.
- **Fallback:** static network illustration plus the three rows.

---

### 7.11 *Done properly*: compliance and proof (keep + extend)

- **Sales job:** remove procurement objections.
- **Copy:** keep H2 **"The unexciting part, done properly."** and its lede (new site, excellent). Add *"Behind every check is a person. We treat them like one."* under the consent line.
- **Content:** the current cert rows (ISO 27001 · GDPR-aligned · PBSA · NSR) + **ISO 27701** *(confirm)* + **Data sovereignty** *(confirm per country)* + the four data-protection controls from `/platform/security-compliance` (consent per verification · encrypted · least privilege · bounded retention). The four numbers return here as a closing count.
- **Signature:** **embossed seals.** Each certificate is shown as a blind-embossed paper seal, and a raking light (a CSS gradient tied to cursor position) catches the emboss as you move. It's subtle and tactile. Tapping one opens the plain-language gloss already written in `platform.en.tsx`.
- **CTA:** "Request the procurement pack" (security overview, certificates, DPA).
- **Transition →** the last seal is the one that stamps the form.

---

### 7.12 *A verified beginning*: the close (keep)

- **Copy:** keep **"Every great journey deserves a verified beginning."** / *"Take the first step. We'll handle the rest."* (founder copy).
- **Form:** segments aligned to the chapters, **Authority · Business · Individual · Applicant** (the old site had Applicant, a real buyer), and services aligned to the products.
- **Signature:** the **thread ends at Submit.** On a successful submit, the hero's stamp lands on the form: *"Received · [time] · a person will reply within [SLA]."* That bookends the page.
- **Reuse:** Contact section, photo (DESIGN.md: the strongest image goes here).

---

## 8. The experience layer: how this reaches award level

### 8.1 What separates award-winning work from good work

Awwwards juries score **Design 40% · Usability 30% · Creativity 20% · Content 10%** (awwwards.com/about-evaluation). **70% of the grade is design quality and clarity, not spectacle**, so institutional restraint isn't a handicap. Shift5, a defence-fleet intelligence company, won Site of the Day in March 2026 with a two-colour, instrument-panel site. Honourable Mention starts at 6.5. The SOTDs in this research scored 7.2–8.4. The Developer Award (> 7) is judged on semantics, accessibility, performance, responsiveness, animation and markup, all areas where this build is already strong. The pattern across Site-of-the-Day winners in B2B is consistent: **one strong idea carried through every section, a few signature interactions that are about the product, excellent typography, and pacing that changes.** Generic landing pages fail on pacing (every section is the same shape) and on metaphor (effects unrelated to what's sold). v2 answers both: the concept is the product (claims → sources → verdicts), and the pacing alternates.

**Pacing map (quiet vs. signature):**

| Section | Pace | Signature |
|---|---|---|
| 01 Hero | Signature | The stamp |
| 02 Proof strip | Quiet | — |
| 03 One in eight | **Signature (peak)** | UV loupe |
| 04 How we know | Signature | Two speeds (pinned) |
| 05 Governments | **Signature (peak)** | Four dossiers (pinned) |
| 06 Enterprises | Signature | Trust perimeter |
| 07 Growing businesses | Signature (playful) | The printing receipt |
| 08 Families | Signature (warm) | The conversation plays |
| 09 World | Medium | Routes on a map |
| 10 Platform | **Signature (finale)** | The network grows + belief |
| 11 Compliance | Quiet | Embossed seals |
| 12 Close | Payoff | Thread ends, stamp lands |

Only **three sections pin** (04, 05, and optionally 06). Everything else scrolls natively. That keeps "scroll-jacking" complaints and motion sickness away and keeps the page skimmable.

### 8.2 Art direction system (extends DESIGN.md, doesn't replace it)

| Layer | Rule |
|---|---|
| **Ground** | `--paper` stays. Chapters don't change background colour (DESIGN.md: separation by hairlines). They change **guilloche signature** instead: a unique rosette per chapter, drawn in `--hair` at 4–8% visual weight. |
| **Security-print motifs** | Guilloche (SVG, generated once, spirograph maths, <8 KB each) · microtext borders (mono 5–6px, *decorative only*, `aria-hidden`) · perforation separators (a radial-gradient dotted line) · blind-embossed seals (layered inset shadows on paper) · UV layer (a second SVG layer revealed by mask). |
| **Illustration** | Documents are **engraved line illustrations** (intaglio style: parallel-hatching SVG), not photos and not flat icons, so fake and real can differ in drawn detail. Photos stay for **people** only, candid (DESIGN.md §5). |
| **Colour** | Unchanged: ~95% ink/paper, green only for verdicts. The thread is the main green element. The UV layer uses green fluorescence, which is still a verdict ("genuine"). |
| **Type** | Newsreader (opsz) display, weight 400, italic for the human clause · Instrument Sans UI · Geist Mono evidence. **New:** kinetic redaction reveals for chapter H2s. Black redaction bars lift off the words in one-shot sequence (the "declassified" move), real text underneath. Maximum one per chapter. |

### 8.3 Motion system

- **Two motion families only**, from DESIGN.md §4: entrances `cubic-bezier(0.16, 1, 0.3, 1)` (one-shot) and ambient loops (light and position only). **Add one:** "physical" for stamps and paper (a short overshoot `cubic-bezier(0.34, 1.56, 0.64, 1)`, ≤ 240ms), used only for things that are *placed* (stamps, receipts, folders).
- **Scroll-linked, not scroll-jacked.** Native scroll everywhere. Pinned scenes use `position: sticky` plus scroll progress. Prefer **CSS scroll-driven animations** (`animation-timeline: view()/scroll()`, which run off the main thread) for the thread and reveals, and **GSAP ScrollTrigger** only for the two or three choreographed pinned scenes. Avoid smooth-scroll hijackers, or treat them as optional and disabled under reduced motion (see §9 for the current state of these libraries).
- **Homepage → product page** uses **View Transitions** (stable in React 19.3 / Next.js App Router, §9.4): the folder you clicked in the government dossiers morphs into the hero of `/governments/health`, and a receipt morphs into `/business/smb`. The homepage and the product pages then feel like one object.
- **Transitions between chapters** are *document* transitions: a perforation tear (02→03), a folder closing (05→06), a receipt tearing off into a chat bubble (07→08), a network settling into a seal (10→11). Each is 400–700ms of scroll, not a timed animation.
- **Micro-interactions:** buttons press 1px with a hairline darkening; the index rail ticks green as chapters are passed; the check pills in the dot-plot lift 2px and show their description; hovering a mono fact underlines it with a thread-green 1px line.
- **Reduced motion:** the global `@media (prefers-reduced-motion: reduce)` block (already planned in DESIGN.md §4) swaps every scene for its final state, stops the rosette rotation and the people-strip drift, disables the loupe's follow (the reveal button stays), and draws the thread fully.

### 8.4 Performance and accessibility (non-negotiable for a B2G site)

- **Budget:** keep the build's current LCP and CLS discipline. JS for the experience layer ≤ **~90 KB gzip** (ScrollTrigger + a small scene runtime, loaded as islands after first paint). SVG illustration ≤ **150 KB** total. No video on the homepage. No WebGL.
- **LCP:** the H1 text (no image dependency). Scenes below the fold hydrate on `IntersectionObserver`.
- **Pause and skip controls:** everything that moves on its own (hero deck, rosette, people strip, playing chat) gets a visible **pause** control (WCAG 2.2.2, Level A). Pinned stories get a **"Skip the story"** link to the next chapter (NN/g: procurement-type users tolerate altered scrolling least).
- **WCAG 2.2 AA:** every interaction has a keyboard path (the loupe → "Show me the forgery"; dossier tabs are buttons; ring segments are a tablist; receipt checks are checkboxes). Pinned scenes never trap focus. Decorative layers (guilloche, microtext, UV) are `aria-hidden`. Every animated fact exists as text. INP < 200ms.
- **Phones:** every signature has a touch translation (loupe → tap-to-reveal; dossiers → swipe; perimeter → segments; receipt → tap; map → static routes with a scroll-drawn thread). Design the 390px version of each scene in the canvas alongside the desktop one.

---

## 9. Inspiration and references

*From an external research pass (24 Sep 2026). Awards were checked against the Awwwards site listing unless marked* unverified. *Links are listed at the end of this section.*

### 9.1 The references that matter most for this homepage

| Site | Award | What happens on screen | What we borrow, and where |
|---|---|---|---|
| **Shift5** (shift5.io), defence fleet intelligence | Awwwards SOTD, Mar 2026 | Two-colour, sober. A "System Status" grid of monitored subsystems with binary-style readouts. | **Proof that a defence/government audience and an SOTD can go together.** The status-board idea feeds the verdict strip in §7.4. |
| **The Other Side of Truth** | SOTD Jun 2022. Highest sub-score: Content 8.13 | One button switches the whole site between two versions of "the truth". | The **Claimed ⇄ Verified** switch on the flagged document in §7.3. The same record, as submitted and as the source confirmed it. |
| **Mosby's Files** | SOTD Aug 2026 | A research archive whose navigation is a *CSS-only* skeuomorphic folder system. | Direct precedent for the **four government dossiers** (§7.5) and the index rail (§7.0). Cheap, accessible, no WebGL. |
| **Poor Charlie's Almanack** (Stripe Press) | SOTD Jan 2024 | Editorial book on the web: chapter mastheads, text highlighted as you read, restrained serif. | Chapter mastheads and highlight-as-you-read for key claims. Evidence that **serif restraint wins**, which suits Newsreader. |
| **Prometheus Fuels** (Active Theory) | SOTD + SOTM May 2021 | A chaptered scroll story that explains an abstract industrial process to lay readers. Only one heavy scene renders at a time. | The chaptered process narrative (§7.4) and the **one-scene-at-a-time** performance rule. |
| **Google Cloud Infrastructure** (Hello Monday) | SOTD 2018 | Makes invisible infrastructure tangible: case studies, a map of physical presence. | Chaptered case studies plus a presence map, for §7.9 World and the six offices. |
| **Jeton** (Bürocratik) | SOTD Jan 2025 | Features revealed on scroll "without overwhelming autoplay animations". The client asked for purposeful motion. Contrast-driven palette. | The **restraint model** for product sections. **Rive** for small stateful demos: the HelloV WhatsApp flow (§7.8). |
| **Cerebrium** | SOTD Sep 2026 | A hero visual paired with a **transparent pricing calculator**. | The jury rewards utility beside spectacle. Precedent for the printing-receipt configurator (§7.7). |
| **Igloo Inc** (abeto) | Site of the Year 2024 | Fully WebGL. Ice crystals grow inside each portfolio block. | The metaphor, not the engine: *a raw claim crystallises into a verified record.* All-WebGL is wrong for a ministry audience. |
| **Stripe globe / GitHub globe** | GitHub homepage: Honourable Mention 2021 | Arcs are *real* corridors (payments, merged PRs), clickable, anonymised. Stripe's rule: 60fps or fall back to a static image. | §7.9 routes should be **real, aggregated, anonymised verification corridors** if the data exists ("Nursing licence · Philippines → KSA · median [n] days"), with Stripe's performance rule. |
| **Plaid rebrand** (Feb 2025) | Brand work, not a web award | Guilloche patterns, woodcut illustration, a palette taken from the holographic strip on banknotes. | **Proof that security-print art direction works at scale for a fintech/trust brand** (§5.2, §8.2). |
| **The Boat** (SBS) | SOTD, FWA, Webby | A mostly conventional long scroll with a few earned immersive moments. | The pacing model: calm by default, 1–2 peaks (§8.1). |
| **Snow Fall** (NYT) · **NSA Files: Decoded** (Guardian) | Pulitzer / Webby / SND | Explained an invisible system in one scroll with "what this means for you" framing. | Audience-specific "what this means for you" chapters (§7.5–7.8). |
| Anduril | Honourable Mention 2020 | Black and white, typographic, mission tone. | Sober government tone. *(Current homepage not fully verified.)* |

Checked and deprioritised: Stripe Sessions, Vercel Ship, GitHub Universe (event sites, Honourable Mentions only); Linear, Mercury, Ramp, World ID, Palantir, Persona (no award found or not retrievable). Useful as product-UI or monochrome references only.

### 9.2 Storytelling patterns that sell invisible trust

| Pattern | Example | Used in |
|---|---|---|
| **Follow one case**: a single synthetic case document transforms step by step | NPR *Planet Money Makes a T-Shirt*; Snow Fall | §7.4 *How we know* ("Case HV-…", 4 stages, two routes) |
| **Claimed vs verified**: the same record twice, as submitted and as confirmed | *The Other Side of Truth*; NYT before/after sliders | §7.3 |
| **Fraud-caught reveal**: one flagged document among eight, found with a UV loupe, labelled *illustrative, synthetic data* | Passport UV-reactive inks | §7.3 |
| **Real network**: aggregated, delayed, anonymised corridors with a methodology link beside any live number | Stripe, GitHub, Cloudflare Radar (cites its data sources) | §7.9, §7.10 |
| **Product as hero**: the real report, dashboard and WhatsApp thread, not abstract 3D | Checkr hero (candidate photos with status badges) | §7.1 people strip, §7.6 KYC, §7.8 |
| **The seal as a state change**: the seal appears only when a chapter reaches "verified" | — | §7.1, §7.11, §7.12 |
| **Audience doors near the top** | TLScontact ("Applying for a visa?" beside "Our government clients") | §7.1 four doors |
| **Annual data report** as a companion to the homepage: *State of Credential Fraud*, broken down by credential type and corridor | "AI in Design Report 2026" (SOTD Aug 2026) | Follow-on content. The home for the 12–14% figure and its methodology. |

### 9.3 Competitors, and where the homepage can win

| Competitor | Homepage stance | Gap HelloVerify can take |
|---|---|---|
| **DataFlow Group** (main GCC PSV rival) | Written *for applicants*: "Enabling global talent mobility, built upon trust"; cards for Start / Track / Support; generic "Why choose" tiles; client logos (DHA, SCFHS, Qatar MoEHE, NHRA, DOH…); stats (160,000+ issuing authorities, 200+ countries, 6.6M+ verifications). Its PSV page claims an "industry-leading success rate" **with no number, no turnaround and no process.** | **Speak to the regulator first. Show the process step by step. Publish footnoted numbers.** |
| First Advantage (with Sterling) | "HIRE FASTER. TRUST MORE." Scale stats (200M+ screens/yr). Doors: Candidate / Existing / New customer. | Scale can't be matched. Primary-source rigour and government programmes can beat it. |
| Checkr | "Verify candidates with confidence". Product-UI badges. "97% say turnaround beats previous vendor". | Product-as-hero is table stakes: ours has to be as concrete. |
| **AuthBridge** (Indian rival) | "Trust. Transformed by AI. Verified by Humans". **Almost HelloVerify's positioning.** Sprawl of 9 sub-brands. | Differentiate on *the source* and on *governments*, not on "AI + humans". |
| Socure / World | "AI-Native Trust Infrastructure" / "the new standard of trust online" | **"Trust infrastructure" is a crowded phrase** (see §5.4). |
| IDEMIA · SITA · TLScontact · VFS | Named government *programmes* (TSA PreCheck, Changi); hard case metrics (SITA: border processing 40s → 18–20s); ISO walls; a separate /governments section | **Programme cards**: authority · scope · since · volume · turnaround, published with permission (§7.5). |

**Where to win, in order:**
1. **Regulator-first.** DataFlow and VFS lead with applicants.
2. **Show primary-source verification step by step.** No competitor does.
3. **Footnoted numbers**, where DataFlow publishes none.
4. **Programme cards, not a logo wall.**
5. **Data residency made explicit** (only where true). None of the competitor set puts it on the homepage.

B2G research backs this. Government buyers are "risk-averse by design", "rarely persuaded by aspirational messaging or aggressive CTAs", and look for past performance, compliance and "procurement-friendly formatting". Govcon practice is a downloadable one-page **capability statement** and a **trust centre**. 82% of US federal decision-makers cite vendor websites as a top information source (Market Connections, 2018; US-specific, directional). A **pilot framed as a product** (Palantir's "AIP Bootcamp: 0 to use case in 5 days") is a proven government CTA.

### 9.4 Craft: the state of the tools (Sept 2026)

| Tool | Status | Use it for |
|---|---|---|
| **CSS scroll-driven animations** (`animation-timeline`) | Chrome and Safari 26. Firefox still behind a flag mid-2026 (an Interop 2026 focus). About 83% global support. | The thread, reveals, the redaction lifts. **The default CSS must be the final state.** Motion goes inside `@supports` + `prefers-reduced-motion: no-preference`. |
| **View Transitions** | Same-document is Baseline. **React 19.3 made `<ViewTransition>` stable (9 Sep 2026)**, and the Next.js App Router supports it. | **Shared-element morphs from homepage to product page**: a dossier folder in §7.5 morphs into the `/governments/health` hero, a receipt into `/business/smb`. |
| **GSAP** (incl. ScrollTrigger, SplitText) | 100% free since Apr 2025. SplitText rewritten, smaller, with built-in screen-reader handling. | The two or three pinned scenes. Line-masked reveals on chapter titles only. |
| **Lenis** | Native-scroll based, honours reduced motion by default | Optional. For a procurement audience, prefer **no smooth scroll** or a very light setting. |
| **Motion** (motion.dev) | Uses native ScrollTimeline where available | Component micro-interactions in React. |
| **Rive** | — | The HelloV chat and KYC phone sequences. |

- **Scroll-jacking.** Nielsen Norman Group found altered scrolling disorients users, some took it for a bug, and **task-oriented users (procurement officers) tolerate it least**. So: never change scroll speed or direction, anchor every chapter, provide a visible **"Skip the story"** link, and on phones prefer *stack* over *scrolly* unless the transition itself carries meaning (The Pudding's guidance).
- **Accessibility.** WCAG 2.2.2 (Level A): anything that moves on its own (hero deck cycling, rosette rotation, people-strip drift) needs a **pause control**. WCAG 2.3.3: under reduced motion, replace movement with opacity changes.
- **Performance.** Alex Russell's 2026 budget for a low-end Android (Galaxy A24 class) is about 2.0 MiB total with about 0.3 MiB of JS for a JS-light page. Targets: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Server-render the hero, keep WebGL off the LCP path, and pause anything off-screen.
- **Kinetic type.** Newsreader's optical-size axis can shift from Display toward Text as a pinned headline scales down. It's a subtle detail juries notice.

### 9.5 Security print: do and don't

**Do:**
- Parametric SVG guilloche at 3–6% contrast, drawn in once on "verified" rather than looping when it's a state change.
- Microprint rules around the report card, `aria-hidden`.
- **One** thin holographic-foil strip (conic gradient) on the seal only, reacting to pointer or device tilt, static under reduced motion.
- UV reveal reserved for the fraud scene.
- One HelloVerify seal with date and report ID in mono.
- Footnote every statistic to a methodology page, with a "last updated" date on anything live.

**Don't:**
- Draw **real government crests, emblems or document templates**. This is an impersonation risk and a procurement red flag. Every document illustration is a **fictional issuer with synthetic data**, labelled *illustrative*.
- Use clip-art passports, "TOP SECRET" stamps or grunge textures.
- Put full-screen WebGL on the hero.
- Autoplay sound.
- Use red. The research pass suggested warning red for the fraud reveal. This document keeps **ink**, per DESIGN.md §2.1.

### 9.6 Sources

Awwwards evaluation system: awwwards.com/about-evaluation · Shift5: awwwards.com/sites/shift-5 · The Other Side of Truth: awwwards.com/sites/the-other-side-of-truth · Mosby's Files: awwwards.com/sites/mosbys-files · Poor Charlie's Almanack: awwwards.com/sites/poor-charlies-almanack · Prometheus Fuels: awwwards.com/sites/prometheus-fuels · Google Cloud Infrastructure: awwwards.com/sites/google-cloud-infrastructure · Jeton case study: awwwards.com/case-study-jeton-by-burocratik.html · Cerebrium: awwwards.com/sites/cerebrium · Igloo Inc case study: awwwards.com/igloo-inc-case-study.html · GitHub homepage: awwwards.com/sites/github-homepage · The Boat: awwwards.com/sites/the-boat · Anduril: awwwards.com/sites/anduril-industries · Stripe globe: stripe.com/blog/globe · GitHub globe: github.blog/engineering/engineering-principles/how-we-built-the-github-globe · Plaid rebrand: plaid.com/blog/plaid-the-fabric-of-financial-progress · DataFlow Group: dataflowgroup.com, /verification-services, /partners · Competitors: fadv.com, checkr.com, authbridge.com, socure.com, idemia.com, tlscontact.com, sita.aero, world.org · B2G: bluetext.com/blog/b2g-marketing-strategies-how-to-win-government-contracts-with-your-brand · Market Connections (2018 PDF) · Palantir AIP Bootcamp: palantir.com/platforms/aip/bootcamp · React 19.3: react.dev/blog/2026/09/09/react-19-3 · View transitions Baseline: web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available · Interop 2026: webkit.org/blog/17818/announcing-interop-2026 · GSAP free: webflow.com/updates/gsap-becomes-free · Lenis: github.com/darkroomengineering/lenis · Motion: motion.dev/docs/scroll · Performance inequality gap 2026: infrequently.org/2025/11/performance-inequality-gap-2026 · Responsive scrollytelling: pudding.cool/process/responsive-scrollytelling · WCAG 2.3.3: w3.org/WAI/WCAG21/Understanding/animation-from-interactions · NPR T-shirt: apps.npr.org/tshirt

---

## 10. Risks, constraints and decisions needed

| # | Decision | Recommendation |
|---|---|---|
| **D1** | DESIGN.md §8.4 says "All pages static; no client JS for design-phase pages." The experience layer needs client JS. | Allow **progressive-enhancement islands on the homepage only**: static HTML is the complete page and JS adds the scenes. Record it as an approved deviation in DESIGN.md. |
| **D2** | Which proof points can be published (§4.2)? | A one-hour claims review with the founder and sales before copy is locked. Anything unconfirmed ships as *[placeholder]* in the canvas, never on the live site. |
| **D3** | "One primary CTA per page" (IA §5) vs. three buyer types on one page. | Global primary = **Talk to sales** (nav + hero + close). **Chapter-scoped primaries**: *Buy now* inside Growing businesses, *Buy on WhatsApp* inside Families, *Start your application* inside the applicant band. Each is the only ink button in its chapter, so they never compete on screen. |
| **D4** | Named references (Saudi health authority, Embassies of Latvia and Italy). | Get written permission and exact wording. The MOM empanelment is public and can go first. |
| **D5** | Photography for the new chapters (nurse/clinician, embassy/ministry hall, supplier site, family at the door). | A shoot or licensed candid set per the DESIGN.md §5 brief. The government chapter needs its own imagery most. |
| **D6** | Homepage sections are generated files (`tools/port/*`, DESIGN.md §8.2) with a dual `.dsk/.mob` tree. | Design v2 in the canvas first (as agreed), then port the homepage as a single responsive tree. The generator approach doesn't suit scroll scenes. |
| **D7** | Page length (~17–19k px). | Accept it, with the index rail + four doors making every chapter one click away. Re-measure after the canvas pass. |
| **D8** | "Verify once, trusted everywhere" (Persistent Trust Layer) and API claims. | Label as roadmap in the platform chapter unless the product is live. |
| **D9** | Government CTAs: can sales offer a **capability statement PDF**, an **RFP/security pack** and a **scoped pilot**? | Produce the capability statement and security pack (low effort, high B2G value). Offer "Scope a pilot" only if sales can deliver one. |
| **D10** | Do corridor-level aggregates exist (median turnaround by credential × country) for real map routes and a methodology page? | If yes, use real corridors (§7.9) and consider an annual *State of Credential Fraud* report (§9.2). If no, keep the five illustrative country stories, labelled as such. |

---

## 11. How we work from here

1. **Claims review** (D2, D4) runs in parallel with design, because copy depends on it.
2. **Canvas playground, section by section**, in this order, which puts the largest sales gaps first and gets the concept proven early:
   1. **01 Hero + 02 Proof strip.** Sets the concept, the stamp and the thread.
   2. **05 Governments.** The biggest gap and the priority buyer.
   3. **03 One in eight.** The emotional peak. Proves the art direction.
   4. **04 How we know.** Consolidates three current sections.
   5. **07 Growing businesses.** Prices return.
   6. **06 Enterprises.**
   7. **08 Families.**
   8. **09 World · 10 Platform · 11 Compliance · 12 Close.**
   9. **00 Chrome:** mega-panels and index rail, once chapter names are final.
3. For each section we agree **design, story, UX, sales copy, content, transition in and out, the signature interaction, motion and the phone version** (the checklist in the brief), then mark it *final* in the canvas.
4. Only when every section is final: port to `helloverify-web` (D1, D6), with the reduced-motion and no-JS states built and tested first.

---

## Appendix A: Old-site product and pricing inventory (as captured 23–24 Sep 2026)

**Government solutions:** Health Authorities (PSV: education, institute accreditation, health licence, certificate of good standing, business registration, employment; categories: doctors, non-physicians, pharmacists, nurses & midwives) · Immigration Authorities (identity, education, employment, financial, criminal, supporting records; partners: Embassy of Latvia, Embassy of Italy) · Manpower & Education (qualification verification; institution accreditation; equivalency, 120+ countries; client: MOM Singapore) · MOM COMPASS page (Education SGD 108 incl. GST · Accreditation SGD 33 · Express ≤ 7 working days SGD 54; EP, S Pass, ONE Pass, PEP, TEP; 4 steps: register & upload → add qualifications → sign LOA & pay → receive report) · Business & Trade Authorities (for government missions, enterprises, hiring agents; API-ready).

**Enterprise:** 30+ checks · 120+ countries · 1–7 working-day TAT · REST API + bulk upload. Enterprise checks: ID, Education, Education institution, Employment, Bank statement, Business registration certificate, 3D profiling & facial recognition, Professional licence, Criminal, Address, Global database, Company, All drug panels, Document tampering. White-collar: Education, Identity, Employment, Criminal record, Reference, Drug test, Global DB, Address, Company, Credit, Criminal via law firm, Directorship, Form 16, Resume validation. Blue-collar: PAN, Registration certificate, Driving licence, Criminal records, Penny drop, Liveness.

**KYC platform:** KYC (identity, location, liveness, facial recognition) · KYB (GST, MCA, Udyam, company PAN) · Underwriting (GST-lite/advanced, bank statement analysis, ITR, MCA data pull) · Fraud & risk (court records, PAN-Aadhaar link, email risk, 1:N face match) · Execute (bank-account validation, e-sign, device fingerprinting, e-stamp) · AML.

**Certifier:** Business licence & promoter verification (trade licence, defaulting directors, criminal records, credit & company) · Vendor credit & financial (financial assessment, GST screening, credit checks, promoter criminal history) · MCA, GST, owner & director verification, company check (site visit, Rolodex fake-company list, MoCA, NASSCOM, reverse domain, decoy calls, mystery shopping) · virtual onboarding, monitoring, statutory screening, e-agreement · industries: real estate/construction/manufacturing, e-commerce, IT & healthcare, FMCG & retail.

**SMB:** Basic ₹1,799 · Standard ₹2,199 · Premium ₹2,399 (listed as 60 min) · per-check: Identity ₹349, Employment ₹499, Education ₹999 (+ university fees), Address ₹499, Professional reference ₹499.

**HelloV (Advanced):** Home staff ₹1,399 (Voter ID, Criminal, Address) · Nanny ₹1,399 (Identity, Criminal, Address) · Driver ₹1,799 *most popular* (DL, Criminal, Voter ID, Address) · Tenant ₹1,799 (Credit, Criminal, Aadhaar). Homepage tabs (Basic/Advanced, 30 min): Driver, Home staff, Tenant, Nanny, Verify anyone, Cyber identity (+ social media check), Know the identity, Know your contact (+ email verification). WhatsApp: +1 415 792 4931 (from the Buy Now link).

**Company:** founded 2018 (Noida) · 20M+ checks · 2,000+ clients · 120+ countries · offices: Egypt, India, Philippines, Singapore, UAE, United States · Y Combinator · values: Integrity always · Accuracy in every detail · Privacy by design · Fairness and respect · Speed with responsibility · Continuous improvement.

## Appendix B: Old routes → new routes for homepage links

| Old | New |
|---|---|
| `/solutions/health-authorities` | `/governments/health` |
| `/solutions/immigration-authorities` | `/governments/immigration` (applicants: `/individuals/immigration`) |
| `/solutions/manpower-and-education-authorities` | `/governments/manpower-education` |
| `…/ministry-of-manpower` | `/governments/manpower-education/ministry-of-manpower` |
| `/solutions/trade-authorities` | `/governments/trade` |
| `/products/bgv-enterprise` | `/business/enterprise` |
| `/products/bgv-smb` | `/business/smb` |
| `/employee-verification` | `/business/employee-verification` |
| `/products/customer-kyc` | `/business/customer-kyc` |
| `/products/certifier` | `/business/certifier` |
| `/products/hellov` | `/individuals/hellov` |
| `/technology` | `/platform/technology` |
