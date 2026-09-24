import { copy } from "@/lib/copy/request";
import { SECTIONS, type WhyReasonId } from "@/lib/copy/sections";
import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
// Homepage v2 styles are one sheet per section (see `app/v2/hero.css`).
import "@/app/v2/why.css";
import { WhyArt, type WhyCardId } from "./WhyArt";
import { WhyDeck } from "./WhyDeck";

/** Why governments work with us.
 *
 *  HOMEPAGE V2, ONE TREE AT EVERY WIDTH (Sep 2026): five reasons beside a deck
 *  of eight illustrated cards that advances on its own (`./WhyDeck`, art in
 *  `./WhyArt`). On a phone the deck stacks under the reasons and takes a
 *  swipe. The old phone tree — the same reasons over a licensing-officer
 *  photo card — was deleted with its copy (`why.card`, `why.evidence`).
 */

/** The five reasons, in order. The numeral is the ordinal the card prints AND
 *  the React key, so it stays here and doubles as the dictionary key - it is
 *  position, not words. The two lines of words are in `lib/copy/sections`. */
const REASONS: readonly WhyReasonId[] = ["01", "02", "03", "04", "05"];

/** The deck, in board order: which card, its tint class, and
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

export async function Why() {
  const t = (await copy(SECTIONS)).why;
  const d = t.deck;
  const pad = (k: number) => String(k).padStart(2, "0");

  return (
    <div className="wrap hair-top wy-sec">
      <div className="wy-grid">
        <div>
          <h2 className="h2">{t.heading}</h2>
          <p className="lede">{t.lede}</p>
          <div className="wy-rz">
            {REASONS.map((n) => (
              <div className="rz" key={n}>
                <span className="n">{n}</span>
                <div>
                  <div className="t">{t.reasons[n].t}</div>
                  <div className="p">{t.reasons[n].p}</div>
                </div>
              </div>
            ))}
          </div>
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
  );
}
