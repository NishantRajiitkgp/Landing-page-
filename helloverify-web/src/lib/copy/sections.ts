/** The `sections` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Tiny and separate from `./sections.en.tsx` for the two reasons
 *  `./chrome.ts` sets out: this is the file a second locale is added to and
 *  the file that fails (TS2741) when one is declared without a dictionary,
 *  and a `.ts` registry is importable from modules that must not be compiled
 *  as JSX.
 *
 *  The key unions below are why this file is longer than `./chrome.ts`.
 *  Eleven of the fifteen bands drive their markup from a table, and each of
 *  those tables is now declared against a union from here — so adding a
 *  country, a bento cell, a package or a check WITHOUT its copy is TS2322 at
 *  the component's own declaration, in every locale at once, rather than a
 *  blank on a page. That is the whole argument of `./index`'s "Where the keys
 *  come from", applied eleven times.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./sections.en";

/** The English object IS the schema — see `./index`. */
export type SectionsCopy = typeof en;

export const SECTIONS: Dictionary<SectionsCopy> = { en };

/** `Why.tsx` — the ordinal a reason prints, which is also its React key. */
export type WhyReasonId = keyof SectionsCopy["why"]["reasons"];
export type WhyEvidenceId = keyof SectionsCopy["why"]["evidence"];

/** `HowItWorks.tsx` — one of the four steps, named rather than positional
 *  because the caption cards, the desktop track and the mobile track all
 *  reach the same entry. */
export type StepId = keyof SectionsCopy["howItWorks"]["steps"];

/** `WhoItsFor.tsx` — a bento cell, keyed by its photograph. */
export type CellSrc = keyof SectionsCopy["whoItsFor"]["cells"];

/** `Consumer.tsx` — a service chip, a plan card, and a line inside one. */
export type ServiceId = keyof SectionsCopy["consumer"]["services"];
export type PlanId = keyof SectionsCopy["consumer"]["plans"];
export type PlanLineId = keyof SectionsCopy["consumer"]["checkLines"];

/** `Checks.tsx` — a check, a lane, a bucket, and a stop on the axis. The
 *  stop union is shared with the component's own `STOPS` table: the axis
 *  labels and the pin positions have to be the same six percentages or the
 *  tick marks and the pins disagree, and this makes that a type error. */
export type CheckId = keyof SectionsCopy["checks"]["items"];
export type LaneId = keyof SectionsCopy["checks"]["lanes"];
export type BucketId = keyof SectionsCopy["checks"]["buckets"];
export type AxisStop = keyof SectionsCopy["checks"]["axis"];

/** `International.tsx` — a country, keyed by its photograph, and the three
 *  fixed stat labels each card renders in order. */
export type CountrySrc = keyof SectionsCopy["international"]["countries"];
export type StatId = keyof SectionsCopy["international"]["statLabels"];

/** `Packages.tsx` — a pack, and a line a pack may list. One line union
 *  for all six packs rather than one per pack: a per-pack union is the
 *  correlated-union problem and does not compile at the `.map()`, which is
 *  argued where the table is. */
export type PackId = keyof SectionsCopy["packages"]["packs"];
export type PackLineId = keyof SectionsCopy["packages"]["lines"];

/** `PeopleStrip.tsx` — a card in each track. Two unions, because the two
 *  breakpoints carry different copy for the same people and the mobile
 *  track is a subset. */
export type PersonSrcDsk = keyof SectionsCopy["peopleStrip"]["dsk"];
export type PersonSrcMob = keyof SectionsCopy["peopleStrip"]["mob"];

/** `Presence.tsx` — an office on the sun map (`lib/sunMap.ts`). */
export type OfficeId = keyof SectionsCopy["presence"]["offices"];

/** `GovSeals.tsx` — one of the five authorities. `GovDossiers.tsx` — one of
 *  the four dossiers. `GovMom.tsx` — a C2 scoring option. */
export type GovSealId = keyof SectionsCopy["govSeals"]["items"];
export type GovDossierId = keyof SectionsCopy["govDossiers"]["items"];
export type MomC2Id = keyof SectionsCopy["govDossiers"]["mom"]["c2"];
