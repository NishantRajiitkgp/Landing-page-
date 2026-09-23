import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";

import { copy } from "@/lib/copy/request";
import { BLOCKS, type MockFieldId, type SegmentId } from "@/lib/copy/blocks";

/** The closing band's lead-form mock — six field rows and the audience
 *  segments — lifted out of `sections/Contact.tsx` (BUILD-SPEC §4 rule 2,
 *  §17 condition 22).
 *
 *  `Contact.tsx` stood at 319 lines against `max-lines` max 300
 *  (`eslint.config.mjs`), and it was never in Part 5's table. `git log
 *  --follow` puts the growth at `1117d35`, the colour gate — NOT at `9053098`,
 *  the credential table, which the note that sent me here named and which
 *  touches this file not at all. `1117d35` added 30 lines: one `noteInk()`
 *  call, one `eslint-disable-next-line`, and 29 lines of comment arguing why
 *  the `rgba()` under it stays. So the file crossed on explanation, and the
 *  markup that was already written twice is what pays for it.
 *
 *  MEASURED BY SCRIPT, not read by eye — the instruction Part 5 recorded after
 *  eye-reading cost it a second pass. Both breakpoints write six field rows;
 *  after dedent, FOUR ARE BYTE-IDENTICAL (Full name, Company, Business email,
 *  Mobile) and so is the three-span segment row. Both grids carry the same
 *  seven `{" "}` separators around their six blocks, at the same indent — so
 *  one list rendered twice reproduces both.
 *
 *  AND THE BYTE-IDENTITY IS MEASURED, not argued, which matters because a
 *  build was not available to check it: both grids and the segment row were
 *  rendered twice through the installed `react-dom/server` — hand-transcribed
 *  from the pre-patch file, then through the list below — and compared as
 *  strings. Equal all three times. `renderToString`, NOT
 *  `renderToStaticMarkup`, because static markup suppresses the `<!-- -->`
 *  text separators and would have hidden exactly the defect Part 5 hit when
 *  `{n} checks` emitted nine of them. The Mobile row carries one separator (its
 *  `<span>` has an element and two adjacent strings); it carried one before and
 *  carries one now, which is the whole point of moving that row's markup as a
 *  node instead of re-expressing it.
 *
 *  THE OTHER TWO ROWS GENUINELY DIFFER, in three fields rather than one, which
 *  is why the variance is data here and not a shared default: desktop spans
 *  both columns (`wide`), desktop's select names two more services than the
 *  phone's, and only desktop's message box is 84px tall. That is the same
 *  per-file measurement that kept `PeopleStrip`'s two lists apart and merged
 *  `Packages`' — checked, not assumed.
 *
 *  DELIBERATELY NOT SHARED WITH `forms/LeadFields.tsx`. Its `TEXT_FIELDS`
 *  carries the same four labels and three of the same four placeholder strings
 *  for the REAL form, and importing it here was the obvious reuse. Rejected:
 *  those values are derived from `lib/leads/constraints`, the module the server
 *  schema is built from, so a mock that moved when a validation limit moved
 *  would be a worse coupling than two lists. Nothing gates the two against
 *  each other, so the drift is recorded rather than closed.
 */

type MockField = {
  readonly id: MockFieldId;
  /** The `.inp` class. One row of the six carries `fill`. */
  readonly inp?: string;
  /** Desktop's message box only. Key order is the emitted declaration order,
   *  so it is kept as the artboard wrote it. */
  readonly inpStyle?: CSSProperties;
  /** Desktop's two-column rows. The phone's column has nothing to span. */
  readonly wide?: true;
  /** Wraps the value in a `<span>` and adds the chevron. */
  readonly select?: true;
};

/** What `MockFields` resolves and hands down. The lookup happens THERE and
 *  not here because the `key={label}` in that map needs the same string, so
 *  one component has to hold the dictionary either way. */
type MockRowProps = MockField & { readonly label: string; readonly value: ReactNode };

const WIDE: CSSProperties = { gridColumn: 'span 2' };

/** The select chevron, drawn once.
 *
 *  The two copies in `Contact.tsx` were byte-identical to each other, and this
 *  is NOT a mark `components/brand/` already holds: `Tick` is
 *  `M3.5 8.5l3 3 6-7` in a 16-box and `Arrow` is `M3 8h10M9 4l4 4-4 4` in the
 *  same box. Two occurrences is thin evidence for a fourth `brand/` file, and
 *  folding it into the row that carries it writes it once either way — the
 *  same reasoning `brand/Arrow.tsx` used to refuse a size prop for three call
 *  sites.
 *
 *  `tools/port/jsx/d-Footer.txt` holds this exact path at 12x12 with
 *  `stroke="currentColor"` — a different instance, and one that was never
 *  ported into `src/`, so `chrome/SiteFooter.tsx` has no chevron to share.
 *
 *  `#15140F` is `--ink`'s value and it STAYS a literal: an SVG presentation
 *  attribute the artboard set, which is the exemption `hv/no-color-literal` is
 *  written to allow and the one `blocks/HowItWorksPanels.tsx`'s two literals
 *  and `sections/International.tsx`'s flags already hold.
 */
function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 4.5l3 3 3-3" stroke="#15140F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The four rows the script found byte-identical across the two breakpoints.
 *  Label and mock value are `lib/copy/blocks`' `leadMock.fields`, keyed by
 *  these ids - the phone row's value among them, still the `<span>` node it
 *  always was, because its three children are what the SSR separators depend
 *  on and re-expressing it is exactly what this file refused to do. */
const MOCK_HEAD: readonly MockField[] = [
  { id: "fullName", inp: "inp fill" },
  { id: "company" },
  { id: "email" },
  { id: "mobile" },
];

export const MOCK_FIELDS_DSK: readonly MockField[] = [
  ...MOCK_HEAD,
  { id: "services", wide: true, select: true },
  { id: "message", wide: true,
    inpStyle: { height: '84px', alignItems: 'flex-start', paddingTop: '14px' } },
];

/** `servicesMob` is its own id because the phone names two fewer services;
 *  `message` is NOT, because its label and its value are identical at both
 *  breakpoints and only the box height differs - which is layout, and stays
 *  above. */
export const MOCK_FIELDS_MOB: readonly MockField[] = [
  ...MOCK_HEAD,
  { id: "servicesMob", select: true },
  { id: "message" },
];

/** Label, box, contents — the shape all twelve rendered rows had.
 *
 *  `className` is placed before `style` and the wrapper's `style` before its
 *  children because React emits attributes in props order; an absent prop is
 *  simply omitted, so this one ordering reproduces the bare `<div>` wrappers
 *  and the two `gridColumn` ones alike. */
function MockRow({ inp = "inp", inpStyle, wide, label, value, select }: MockRowProps) {
  return (
    <div style={wide ? WIDE : undefined}>
      <div className="fld-l">
        {label}
      </div>
      <div className={inp} style={inpStyle}>
        {select ? (
          <>
            <span>
              {value}
            </span>
            <Chevron />
          </>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

/** Seven separators around six rows, which is what both grids wrote by hand.
 *  The leading `{" "}` sits inside the map and the trailing one after it, so
 *  the parent's children flatten to the same text/element alternation — no two
 *  text nodes ever land adjacent, which is the condition React's `<!-- -->`
 *  separator turns on.
 *
 *  AND THAT TRAILING `{" "}` IS WHY THIS COMPONENT IS SYNC AND `Rows` IS NOT.
 *  `MockFields` was `async` for one round and the homepage gained a
 *  `<!-- -->` after the last row at BOTH breakpoints — caught by the central
 *  byte comparison, then reproduced here: rendering the pre-migration file
 *  and this one into the same grid `<div>` gave 1002 vs 1010 bytes on the
 *  desktop list and 867 vs 875 on the phone's, and 1002/867 either way once
 *  the await moved down. An async component whose output ends in a TEXT
 *  node gains a separator there; the eleven others this migration made
 *  async end in an ELEMENT, six of them with a trailing `{" "}` INSIDE the
 *  wrapper, and all eleven were byte-identical. So `Rows` takes the await
 *  and ends on a `<MockRow />`, and the text stays up here in a sync
 *  parent. Fourth corollary in `lib/copy/index.ts` has the full evidence,
 *  including the two probe shapes that come back clean. */
export function MockFields({ fields }: { fields: readonly MockField[] }) {
  return (
    <>
      <Rows fields={fields} />
      {" "}
    </>
  );
}

async function Rows({ fields }: { fields: readonly MockField[] }) {
  const t = (await copy(BLOCKS)).leadMock;

  return (
    <>
      {fields.map((f) => (
        <Fragment key={t.fields[f.id].label}>
          {" "}
          <MockRow {...f} label={t.fields[f.id].label} value={t.fields[f.id].value} />
        </Fragment>
      ))}
    </>
  );
}

/** Which audience the form is for. `on` is the selected chip, stored rather
 *  than derived from the position: this is a mock of a chosen state, and the
 *  choice is the datum. Nothing here is interactive — the live control is in
 *  `forms/ContactForm.tsx`. */
const SEGMENTS: readonly { readonly k: SegmentId; readonly on?: true }[] = [
  { k: "business", on: true },
  { k: "government" },
  { k: "individual" },
];

export async function Segments() {
  const t = (await copy(BLOCKS)).leadMock;

  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {SEGMENTS.map((s) => (
        <span key={t.segments[s.k]} className={s.on ? "seg on" : "seg"}>
          {t.segments[s.k]}
        </span>
      ))}
    </div>
  );
}
