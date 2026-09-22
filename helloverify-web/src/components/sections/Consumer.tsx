import { Fragment } from "react";

import { HelloVPhone } from "@/components/blocks/HelloVPhone";
import { Tick } from "@/components/brand/Tick";

/** HelloV - the consumer side.
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

/** Same eight, same order, at both breakpoints. */
const SERVICES = [
  "Driver",
  "Home staff",
  "Tenant",
  "Nanny",
  "Verify anyone",
  "Cyber identity",
  "Know the identity",
  "Know your contact",
] as const;

type Plan = {
  /** The ink-coloured card. Also decides the tick tone - the brand green does
   *  not carry on it, which is why `Tick` has a `light` tone at all. */
  readonly dark?: boolean;
  readonly name: string;
  readonly most?: string;
  readonly price: string;
  readonly lines: readonly string[];
  /** The excluded line, ticked muted. DESKTOP ONLY - see the header note. */
  readonly dimmed?: string;
  readonly ready: string;
  readonly cta: string;
};

const PLANS: readonly Plan[] = [
  {
    name: "Driver · Basic",
    price: "499",
    lines: ["Driving licence check", "Criminal record check"],
    dimmed: "Current address check",
    ready: "Ready in 30 min",
    cta: "Buy Basic",
  },
  {
    dark: true,
    name: "Driver · Advanced",
    most: "Most chosen",
    price: "799",
    lines: ["Driving licence check", "Criminal record check", "Current address check"],
    ready: "Ready in 30 min",
    cta: "Buy Advanced",
  },
];

function PlanCard({ p, mob = false }: { p: Plan; mob?: boolean }) {
  return (
    <div className={p.dark ? "plan dark" : "plan"}>
      {" "}
      <div className="ph1">
        <span className="pn">{p.name}</span>
        {p.most !== undefined && <span className="most">{p.most}</span>}
      </div>
      {" "}
      <div className="pp">
        <span className="cur">₹</span>
        {p.price}
        <span className="per">per check</span>
      </div>
      {" "}
      <div className="pl">
        {p.lines.map((l, i) => (
          <div key={i}>
            <Tick tone={p.dark ? "light" : "green"} />
            {l}
          </div>
        ))}
        {!mob && p.dimmed !== undefined && (
          <div className="dim">
            <Tick tone="muted" />
            {p.dimmed}
          </div>
        )}
      </div>
      {" "}
      <div className="pf">
        <span className="rd">
          <span className="dot"></span>
          {p.ready}
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
        {p.cta}
      </a>
      {" "}
    </div>
  );
}

function Services({ mob, style }: { mob?: boolean; style: React.CSSProperties }) {
  // Desktop opens and closes the row with a real space text node; mobile does
  // not. Neither has one between the chips.
  const gap = mob ? null : " ";
  return (
    <div style={style}>
      {gap}
      {SERVICES.map((s, i) => (
        <span className="svc" key={i}>
          {s}
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

export function Consumer() {
  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: "120px", paddingBottom: "140px" }}>
          {" "}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 7fr) minmax(0, 5fr)", gap: "72px", alignItems: "center" }}>
            {" "}
            <div>
              {" "}
              <div className="k">Consumer · HelloV</div>
              {" "}
              <h2 className="h2" style={{ marginTop: "18px", fontSize: "60px" }}>
                Verify anyone.
                <br />
                From your phone, in 30 minutes.
              </h2>
              {" "}
              <p className="lede" style={{ marginTop: "22px", maxWidth: "480px" }}>
                Send a photo of the document over WhatsApp. We do the rest and message you back with the report.
              </p>
              {" "}
              <Services style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "8px" }} />
              {" "}
              <Plans style={{ marginTop: "36px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px", maxWidth: "600px" }} />
              {" "}
              <p className="mono" style={{ margin: "14px 0 0", color: "var(--muted)" }}>
                Prices are placeholders. Home staff, tenant and nanny packages priced the same way.
              </p>
              {" "}
            </div>
            {" "}
            <Phone />
            {" "}
          </div>
          {" "}
        </div>
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {" "}
          <div className="k">Consumer · HelloV</div>
          {" "}
          <h2 className="h2" style={{ marginTop: "12px" }}>
            Verify anyone. From your phone, in 30 minutes.
          </h2>
          {" "}
          <p className="lede">
            Send a photo of the document over WhatsApp. We message you back with the report.
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
            Prices are placeholders.
          </p>
          {" "}
        </div>
      </div>
    </>
  );
}
