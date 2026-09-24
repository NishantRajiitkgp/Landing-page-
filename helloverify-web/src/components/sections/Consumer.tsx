import { Fragment } from "react";

import { HelloVPhone } from "@/components/blocks/HelloVPhone";
import { Tick } from "@/components/brand/Tick";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type PlanId, type PlanLineId, type ServiceId } from "@/lib/copy/sections";
import { ConsumerShop } from "./ConsumerShop";

/** HelloV - the consumer side.
 *
 *  DESKTOP IS NOW HOMEPAGE V2's STOREFRONT (`./ConsumerShop`, Sep 2026);
 *  what follows describes the chips and plan cards the phone still renders.
 *
 *  610 lines, of which 284 were two more hand-written copies of a component
 *  this repo already had. `components/blocks/HelloVPhone.tsx` was lifted from
 *  the same artboard for `/individuals/hellov`; the two blocks here were
 *  byte-identical to it, all 142 lines each, checked line by line rather than
 *  by eye. Three copies of one mock, now one (BUILD-SPEC §4 rule 2, §17
 *  condition 22).
 *
 *  The eight service chips were also written twice and are the same eight
 *  strings in the same order at both breakpoints, so they are one list.
 *
 *  THE TWO PLAN CARDS ARE NOT THE SAME AT BOTH BREAKPOINTS, and this is the
 *  case the method exists for. Diffing the four copies found one real content
 *  difference: the mobile Basic card has two ticked lines where desktop has
 *  three, the third being the excluded "Current address check" drawn dim with a
 *  muted tick. Folding the lists would have silently given mobile a line it has
 *  never shown - the mirror of the caption `PeopleStrip.tsx` silently lost. So
 *  `dimmed` is a desktop-only branch, not a field.
 *
 *  The other breakpoint facts: the buy button is `full` with a 14px top margin
 *  on mobile and `width:100%` with 16px on desktop, and the service-chip row
 *  has a leading and trailing space text node on desktop and none on mobile.
 */

/** Same eight, same order, at both breakpoints. The words are in
 *  `lib/copy/sections`; this is the order, which is not copy. */
const SERVICES: readonly ServiceId[] = [
  "driver",
  "homeStaff",
  "tenant",
  "nanny",
  "verifyAnyone",
  "cyberIdentity",
  "knowIdentity",
  "knowContact",
];

type Plan = {
  /** The ink-coloured card. Also decides the tick tone - the brand green does
   *  not carry on it, which is why `Tick` has a `light` tone at all. */
  readonly dark?: boolean;
  readonly k: PlanId;
  /** The "Most chosen" flash. A FLAG, not the words: which card is flashed is
   *  a choice about the card and the words are one shared leaf, which is also
   *  what keeps `plans` a square table - see `lib/copy/sections`' header on
   *  ragged rows, and `blocks/LeadMock.tsx`'s `on` for the same shape. */
  readonly most?: true;
  readonly lines: readonly PlanLineId[];
  /** The excluded line, ticked muted. DESKTOP ONLY - see the header note. */
  readonly dimmed?: PlanLineId;
};

/** Which lines each card lists, and in what order. The three line strings are
 *  one flat table in `lib/copy/sections`: they are the same three checks in
 *  both cards, so what differs between the plans is membership, not words. */
const PLANS: readonly Plan[] = [
  { k: "basic", lines: ["licence", "criminal"], dimmed: "address" },
  { dark: true, k: "advanced", most: true, lines: ["licence", "criminal", "address"] },
];

async function PlanCard({ p, mob = false }: { p: Plan; mob?: boolean }) {
  const t = (await copy(SECTIONS)).consumer;
  const c = t.plans[p.k];

  return (
    <div className={p.dark ? "plan dark" : "plan"}>
      {" "}
      <div className="ph1">
        <span className="pn">{c.name}</span>
        {p.most !== undefined && <span className="most">{t.most}</span>}
      </div>
      {" "}
      <div className="pp">
        <span className="cur">{t.currency}</span>
        {c.price}
        <span className="per">{t.per}</span>
      </div>
      {" "}
      <div className="pl">
        {p.lines.map((l, i) => (
          <div key={i}>
            <Tick tone={p.dark ? "light" : "green"} />
            {t.checkLines[l]}
          </div>
        ))}
        {!mob && p.dimmed !== undefined && (
          <div className="dim">
            <Tick tone="muted" />
            {t.checkLines[p.dimmed]}
          </div>
        )}
      </div>
      {" "}
      <div className="pf">
        <span className="rd">
          <span className="dot"></span>
          {c.ready}
        </span>
      </div>
      {" "}
      <a
        href="#"
        className={(p.dark ? "btn" : "btn btn-line") + (mob ? " full" : "")}
        // Spread, so the declaration order matches the hand-written markup:
        // the dark card's background and colour come after the box metrics.
        style={{
          ...(mob ? { marginTop: "14px" } : { width: "100%", marginTop: "16px" }),
          ...(p.dark ? { background: "var(--white)", color: "var(--ink)" } : {}),
        }}
      >
        {c.cta}
      </a>
      {" "}
    </div>
  );
}

async function Services({ mob, style }: { mob?: boolean; style: React.CSSProperties }) {
  const t = (await copy(SECTIONS)).consumer;
  // Desktop opens and closes the row with a real space text node; mobile does
  // not. Neither has one between the chips.
  const gap = mob ? null : " ";
  return (
    <div style={style}>
      {gap}
      {SERVICES.map((s, i) => (
        <span className="svc" key={i}>
          {t.services[s]}
        </span>
      ))}
      {gap}
    </div>
  );
}

/** Each card is preceded by a space and the run ends with one, exactly as the
 *  hand-written markup did. */
function Plans({ mob, style }: { mob?: boolean; style: React.CSSProperties }) {
  return (
    <div style={style}>
      {PLANS.map((p, i) => (
        <Fragment key={i}>
          {" "}
          <PlanCard p={p} mob={mob} />
        </Fragment>
      ))}{" "}
    </div>
  );
}

/** The phone, centred. The wrapper differs only by a top margin on mobile. */
function Phone({ mob }: { mob?: boolean }) {
  return (
    <div style={mob ? { marginTop: "28px", display: "flex", justifyContent: "center" } : { display: "flex", justifyContent: "center" }}>
      {" "}
      <HelloVPhone />
      {" "}
    </div>
  );
}

export async function Consumer() {
  const t = (await copy(SECTIONS)).consumer;

  return (
    <>
      {/* Homepage v2: the HelloV storefront replaces the chips and plan
          cards on desktop. The phone keeps the tree below until the v2
          boards have a 390px artboard to port from. */}
      <div className="dsk">
        <ConsumerShop />
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {" "}
          <div className="k">{t.k}</div>
          {" "}
          <h2 className="h2" style={{ marginTop: "12px" }}>
            {t.headingMob}
          </h2>
          {" "}
          <p className="lede">
            {t.ledeMob}
          </p>
          {" "}
          <Services mob style={{ marginTop: "18px", display: "flex", flexWrap: "wrap", gap: "6px" }} />
          {" "}
          <Phone mob />
          {" "}
          <Plans mob style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }} />
          {" "}
          {/* Shorter than the desktop note, and a 12px top margin rather than
              14px. Both measured, not assumed symmetrical. */}
          <p className="mono" style={{ margin: "12px 0 0", color: "var(--muted)" }}>
            {t.noteMob}
          </p>
          {" "}
        </div>
      </div>
    </>
  );
}
