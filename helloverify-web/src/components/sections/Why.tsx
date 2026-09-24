import { Fragment } from "react";
import Image from "next/image";

import { SIZES_WHY, noteInk, tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type WhyEvidenceId, type WhyReasonId } from "@/lib/copy/sections";
import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
// Homepage v2 styles are one sheet per section (see `app/v2/hero.css`).
import "@/app/v2/why.css";
import { WhyArt, type WhyCardId } from "./WhyArt";
import { WhyDeck } from "./WhyDeck";

/** Why governments work with us.
 *
 *  DESKTOP IS HOMEPAGE V2 (Sep 2026): the five reasons stay, and the photo
 *  evidence card beside them is replaced by a deck of eight illustrated
 *  cards that advances on its own (`./WhyDeck`, art in `./WhyArt`). The
 *  phone keeps the photo card below until its own part — `WhyCard` is now
 *  rendered by the `.mob` tree only.
 *
 *  328 lines for five reasons and one evidence card, each written out once per
 *  breakpoint. One list now, and one card component (BUILD-SPEC §4 rule 2,
 *  §17 condition 22).
 *
 *  Everything is shared: the five reasons matched field for field between the
 *  copies, and so did all fourteen strings in the evidence card. What differs
 *  is geometry only - the mobile photograph is a fixed 520px tall and its
 *  evidence card is inset to the edges instead of sized by the artboard.
 *
 *  The reason rows are separated differently at the two breakpoints, which is
 *  output and not formatting: desktop puts a space text node before the first
 *  row and after the last, mobile only between them.
 */

/** The five reasons, in order. The numeral is the ordinal the card prints AND
 *  the React key, so it stays here and doubles as the dictionary key - it is
 *  position, not words. The two lines of words are in `lib/copy/sections`. */
const REASONS: readonly WhyReasonId[] = ["01", "02", "03", "04", "05"];

/** The four lines under "One result, and how we know", in order. The label is
 *  still the React key, and it still resolves to the same English string -
 *  third corollary of the byte-identity rule in `lib/copy`'s header. */
const EVIDENCE: readonly WhyEvidenceId[] = ["read", "confirmed", "artefact", "reviewed"];

const PHOTO = "/img/09-licensing-officer.jpg";

/** The v2 desktop deck, in board order: which card, its tint class, and
 *  where "Explore More" goes. The four audience cards open their own
 *  `/governments/*` page; the four "why we stand out" cards have no page of
 *  their own yet, so they open `/governments`, the page that sells them. */
const DECK: readonly { id: WhyCardId; tint: string; href: string }[] = [
  { id: "health", tint: "mint", href: "/governments/health" },
  { id: "immigration", tint: "sky", href: "/governments/immigration" },
  { id: "manpower", tint: "sand", href: "/governments/manpower-education" },
  { id: "trade", tint: "lilac", href: "/governments/trade" },
  { id: "fraud", tint: "rose", href: "/governments" },
  { id: "dashboards", tint: "teal", href: "/governments" },
  { id: "reports", tint: "paper", href: "/governments" },
  { id: "integration", tint: "slate", href: "/governments" },
];

async function Reasons({ mob, style }: { mob?: boolean; style: React.CSSProperties }) {
  const t = (await copy(SECTIONS)).why;

  return (
    <div style={style}>
      {REASONS.map((n, i) => (
        <Fragment key={n}>
          {(!mob || i > 0) && " "}
          <div className="rz">
            <span className="n">{n}</span>
            <div>
              <div className="t">{t.reasons[n].t}</div>
              <div className="p">{t.reasons[n].p}</div>
            </div>
          </div>
        </Fragment>
      ))}
      {!mob && " "}
    </div>
  );
}

async function WhyCard({ mob }: { mob?: boolean }) {
  const t = (await copy(SECTIONS)).why;

  return (
    <div
      className="whyv ph"
      style={mob ? { background: tint(PHOTO), height: "520px" } : { background: tint(PHOTO) }}
    >
      {" "}
      <div className="light"></div>
      <Image className="pimg" src={PHOTO} alt="" fill sizes={SIZES_WHY} />
      {/* The caption is inverted because THIS photograph's tint is dark
          (`#8C8C7A`, relative luminance 0.2574) - a per-photograph fact, so it
          sits beside the tint in `lib/img.ts` rather than as a literal here.
          The literal was one of six `rgba()` values that `hv/no-color-literal`
          could not see before 22 Sep 2026. */}
      <div className="note" style={{ top: "18%", color: noteInk(PHOTO) }}>
        {t.card.note}
      </div>
      {" "}
      <div className="scrim" style={{ height: "70%" }}></div>
      {" "}
      <div
        className="evcard"
        {...(mob
          ? { style: { insetInlineStart: "16px", insetInlineEnd: "16px", bottom: "16px", width: "auto" } }
          : {})}
      >
        {" "}
        <div className="sealsm">
          <span>{t.card.seal}</span>
        </div>
        {" "}
        <div className="k">{t.card.k}</div>
        {" "}
        <div className="serif" style={{ margin: "8px 80px 12px 0", fontSize: "22px", lineHeight: "1.05" }}>
          {t.card.title}
        </div>
        {EVIDENCE.map((k) => (
          <Fragment key={t.evidence[k].label}>
            {" "}
            <div className="r">
              <span>{t.evidence[k].label}</span>
              <span>{t.evidence[k].value}</span>
            </div>
          </Fragment>
        ))}{" "}
      </div>
      {" "}
    </div>
  );
}

export async function Why() {
  const t = (await copy(SECTIONS)).why;
  const d = t.deck;
  const pad = (k: number) => String(k).padStart(2, "0");

  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: "120px", paddingBottom: "140px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)", gap: "80px", alignItems: "center" }}>
            <div>
              <h2 className="h2" style={{ fontSize: "60px" }}>
                {t.heading}
              </h2>
              <p className="lede" style={{ marginTop: "22px", maxWidth: "400px" }}>
                {t.lede}
              </p>
              <Reasons style={{ marginTop: "36px" }} />
            </div>
            <WhyDeck
              label={d.kicker}
              cardOf={d.cardOf}
              pauseLabel={d.motion.pause}
              playLabel={d.motion.play}
              tints={DECK.map((c) => c.tint)}
              cards={DECK.map(({ id, href }, k) => {
                const c = d.cards[id];
                const title = `wy-t-${id}`;
                return (
                  <>
                    <div className="wy-vis" aria-hidden="true">
                      <WhyArt id={id} a={d.art} />
                    </div>
                    <div className="wy-body">
                      <div className="wy-top">
                        <span className="wy-tag"><i />{c.tag}</span>
                        <span className="wy-n">{`${pad(k + 1)} / ${pad(DECK.length)}`}</span>
                      </div>
                      <h3 className="wy-t" id={title}>{c.title}</h3>
                      <p className="wy-l">{c.line}</p>
                      <div className="wy-foot">
                        {c.chips.length ? (
                          <ul className="wy-chips">
                            {c.chips.map((x: string) => <li key={x}>{x}</li>)}
                          </ul>
                        ) : (
                          <span />
                        )}
                        {/* Eight links read "Explore More"; the card title
                            tells them apart for a screen reader. */}
                        <AppLink href={href} className="wy-more" aria-describedby={title}>
                          {d.more}
                          <Arrow size="14" />
                        </AppLink>
                      </div>
                    </div>
                  </>
                );
              })}
            />
          </div>
        </div>
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {" "}
          <h2 className="h2">{t.heading}</h2>
          {" "}
          <p className="lede">
            {t.lede}
          </p>
          {" "}
          <Reasons mob style={{ marginTop: "24px" }} />
          {" "}
          {/* The mobile card carries its own top margin on a wrapper, where the
              desktop card is a grid column. */}
          <div style={{ marginTop: "28px" }}>
            <WhyCard mob />
          </div>
          {" "}
        </div>
      </div>
    </>
  );
}
