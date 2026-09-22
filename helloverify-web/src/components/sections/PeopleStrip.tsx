import { Fragment } from "react";
import Image from "next/image";

import { SIZES_PERSON, noteInk, tint } from "@/lib/img";

/** Drifting strip of verified people; the track is duplicated so the loop is
 *  seamless.
 *
 *  That duplication used to be literal: 28 hand-written cards for 14 people,
 *  each person's markup appearing twice in the desktop track and twice again in
 *  the mobile one. 684 lines, and editing a caption meant finding both copies.
 *  The cards are now one component over two record lists, and the seam is
 *  `[...PEOPLE, ...PEOPLE]` - which is what the comment above always claimed.
 *
 *  Desktop and mobile are separate lists rather than one list with size
 *  overrides, because the copy genuinely differs: desktop says "Driving licence
 *  · 30 min" where mobile says "Licence · 30 min", and mobile drops the `note`
 *  caption entirely. Collapsing them would have meant inventing a shared string.
 */

type Person = {
  readonly src: string;
  readonly w: number;
  readonly h: number;
  readonly role: string;
  readonly city: string;
  readonly chip: string;
  /** Desktop only - the small caption over the photograph. */
  readonly note?: string;
  /** The one card mid-check: a pulsing dot, and a dimmed caption where there is
   *  one to dim. Both breakpoints show it. */
  readonly live?: boolean;
  /** The progress bar under the role. DESKTOP ONLY - the mobile card is live
   *  but has no bar, which is why this is not folded into `live`. */
  readonly progress?: boolean;
};

const DESKTOP: readonly Person[] = [
  { src: "/img/01-rider-bengaluru.jpg", w: 300, h: 420,
    role: "Delivery rider",
    city: "Bengaluru",
    chip: "Driving licence · 30 min",
    note: "photo · delivery rider",
  },
  { src: "/img/02-nurse-abudhabi.jpg", w: 340, h: 470,
    role: "Nurse",
    city: "Abu Dhabi",
    chip: "Degree · 3 days",
    note: "photo · nurse",
  },
  { src: "/img/03-engineer-manila.jpg", w: 290, h: 390,
    role: "Software engineer",
    city: "Manila",
    chip: "Employment · 60 min",
    note: "photo · engineer",
  },
  { src: "/img/04-nanny-gurugram.jpg", w: 320, h: 440,
    role: "Nanny",
    city: "Gurugram",
    chip: "Criminal · 30 min",
    note: "photo · nanny",
  },
  { src: "/img/05-warehouse-pune.jpg", w: 300, h: 400,
    role: "Warehouse associate",
    city: "Pune · identity check, 00:41 elapsed",
    chip: "Reading Aadhaar…",
    note: "photo · warehouse",
    live: true,
    progress: true,
  },
  { src: "/img/06-supplier-cairo.jpg", w: 330, h: 460,
    role: "Textile supplier",
    city: "Cairo",
    chip: "Trade licence · 2 days",
    note: "photo · supplier",
  },
  { src: "/img/07-tenant-singapore.jpg", w: 290, h: 410,
    role: "Tenant",
    city: "Singapore",
    chip: "Identity · 15 min",
    note: "photo · tenant",
  },
  { src: "/img/08-cfo-london.jpg", w: 310, h: 430,
    role: "Chief financial officer",
    city: "London",
    chip: "Global database · 15 min",
    note: "photo · executive",
  },
];

const MOBILE: readonly Person[] = [
  { src: "/img/01-rider-bengaluru.jpg", w: 200, h: 270,
    role: "Delivery rider",
    city: "Bengaluru",
    chip: "Licence · 30 min",
  },
  { src: "/img/02-nurse-abudhabi.jpg", w: 220, h: 300,
    role: "Nurse",
    city: "Abu Dhabi",
    chip: "Degree · 3 days",
  },
  { src: "/img/03-engineer-manila.jpg", w: 190, h: 250,
    role: "Software engineer",
    city: "Manila",
    chip: "Employment · 60 min",
  },
  { src: "/img/04-nanny-gurugram.jpg", w: 200, h: 280,
    role: "Nanny",
    city: "Gurugram",
    chip: "Criminal · 30 min",
  },
  { src: "/img/05-warehouse-pune.jpg", w: 200, h: 260,
    role: "Warehouse associate",
    city: "Pune · 00:41 elapsed",
    chip: "Reading Aadhaar…",
    live: true,
  },
  { src: "/img/06-supplier-cairo.jpg", w: 210, h: 290,
    role: "Textile supplier",
    city: "Cairo",
    chip: "Trade licence · 2 days",
  },
];

function PersonCard({ p }: { p: Person }) {
  /** Was `p.live ? { color: "rgba(255,255,255,0.4)" } : undefined` inline - the
   *  `rgba()` that TASKS Part 5 carried as the hole in `hv/no-color-literal`,
   *  which matched hex only and is extended as of 22 Sep 2026.
   *
   *  `p.live` was the wrong cause as well as the wrong place. The caption
   *  inverts because `/img/05-warehouse-pune.jpg`'s tint is dark (`#6E6C63`,
   *  relative luminance 0.1494) and not because that card is the live one; the
   *  two coincided on exactly one of the eight photographs. Keyed by photograph
   *  now, beside the tint in `lib/img.ts`, so a reshuffle of which card is live
   *  cannot leave a white caption on a pale tile. The ternary keeps its
   *  `undefined` branch rather than becoming a spread: both render the same
   *  HTML, but they differ in the flight payload (see the note in
   *  `sections/Packages.tsx`), and this change is a colour move, not a payload
   *  one. */
  const noteColour = noteInk(p.src);
  return (
    <div
      className="person ph"
      style={{ width: `${p.w}px`, height: `${p.h}px`, background: tint(p.src) }}
    >
      <div className="light"></div>
      <Image className="pimg" src={p.src} alt="" fill sizes={SIZES_PERSON} loading="eager" />
      {p.note !== undefined && (
        <div className="note" style={noteColour !== undefined ? { color: noteColour } : undefined}>
          {p.note}
        </div>
      )}
      <div className="scrim"></div>
      <div className="chip">
        <span className={p.live ? "dot live" : "dot"}></span>
        {p.chip}
      </div>
      <div className="who">
        <div className="role">{p.role}</div>
        <div className="city">{p.city}</div>
        {p.progress && (
          <div className="progress">
            <span></span>
          </div>
        )}
      </div>
    </div>
  );
}

/** The track, doubled. Each card is preceded by a space and the run ends with
 *  one, exactly as the hand-written markup did - those are real text nodes
 *  between inline-block cards, not formatting. */
function Track({ people }: { people: readonly Person[] }) {
  return (
    <div className="track">
      {[...people, ...people].map((p, i) => (
        <Fragment key={i}>
          {" "}
          <PersonCard p={p} />
        </Fragment>
      ))}{" "}
    </div>
  );
}

export function PeopleStrip() {
  return (
    <>
      <div className="dsk">
        <div className="rise d6" style={{ padding: "40px 0 8px", overflow: "hidden" }}>
          {" "}
          <Track people={DESKTOP} />{" "}
        </div>{" "}
        {/* Desktop only - the mobile block is the track alone. */}
        <div
          className="wrap"
          style={{
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
            color: "var(--muted)",
          }}
        >
          {" "}
          <span>
            Hires, tenants, drivers, suppliers, nannies. Anyone you need to trust.
          </span>{" "}
          <span className="mono" style={{ color: "var(--muted)" }}>
            Times shown are from upload to report
          </span>{" "}
        </div>
      </div>
      <div className="mob">
        <div style={{ padding: "12px 0 0", overflow: "hidden" }}>
          {" "}
          <Track people={MOBILE} />{" "}
        </div>
      </div>
    </>
  );
}
