import { copy } from "@/lib/copy/request";
import { SECTIONS, type PackId, type PackLineId } from "@/lib/copy/sections";
// Homepage v2 styles are one sheet per section (see `app/v2/hero.css`).
import "@/app/v2/packages.css";
import { PackPhoto, type PackPhotoProps } from "./PackPhoto";

/** Packages — six photo cards (`./PackPhoto`).
 *
 *  HOMEPAGE V2, ONE TREE AT EVERY WIDTH (Sep 2026). On desktop the six sit in
 *  a three-column grid; on a phone they become one scroll-snap row, because
 *  six 600px-tall cards stacked would be a 3,700px band. The old phone tree —
 *  three of the six drawn as receipts, and a link to the rest — was deleted
 *  with its copy (`packages.headingMob`, `ledeMob`, `more`, `package`, `tot`).
 */

type Pack = {
  readonly k: PackId;
  /** Which lines this card lists, and in what order. The words are one flat
   *  table in `lib/copy/sections`. */
  readonly lines: readonly PackLineId[];
  /** The one consumer package sells directly; the other five link to a page. */
  readonly buy?: boolean;
};

/** The six cards in order, and the only two things about one that are
 *  not words: which lines it lists, and whether it sells. Everything a reader
 *  sees is `lib/copy/sections`' `packages`. */
const PACKS: readonly Pack[] = [
  { k: "blueCollar", lines: ["pan", "rc", "licence", "criminal"] },
  { k: "whiteCollar", lines: ["education", "employment", "moonlighting", "address"] },
  { k: "driver", lines: ["licence", "criminal", "address"], buy: true },
  { k: "tradeRisk", lines: ["tradeLicence", "directors", "criminalRecords", "credit"] },
  { k: "vendorRisk", lines: ["financial", "gst", "creditChecks", "promoter"] },
  { k: "visaHealth", lines: ["form", "prescreen", "primary"] },
];

/** The card's photograph, its focal point, and where its link
 *  goes — the IA's page for that package's audience (`lib/seo/routes.ts`).
 *  The focal points are the board's. */
const PHOTOS: Record<PackId, Pick<PackPhotoProps, "src" | "focus" | "href">> = {
  blueCollar: { src: "/img/v2/pkg-bluecollar.jpg", focus: "50% 35%", href: "/business/smb" },
  whiteCollar: { src: "/img/v2/pkg-whitecollar.jpg", focus: "50% 30%", href: "/business/enterprise" },
  driver: { src: "/img/v2/pkg-driver.jpg", focus: "50% 40%", href: "/individuals/hellov" },
  tradeRisk: { src: "/img/v2/pkg-trade.jpg", focus: "40% 40%", href: "/business/certifier" },
  vendorRisk: { src: "/img/v2/pkg-vendor.jpg", focus: "50% 35%", href: "/business/certifier" },
  visaHealth: { src: "/img/v2/pkg-visa.jpg", focus: "55% 40%", href: "/individuals/immigration" },
};

export async function Packages() {
  const t = (await copy(SECTIONS)).packages;

  return (
    <div className="wrap hair-top pq">
      <div className="sec-head">
        <h2 className="h2">
          {t.headingA}
          <br />
          {t.headingB}
        </h2>
        <p className="lede">{t.lede}</p>
      </div>
      {/* On a phone a scroll-snap row. It needs no tabindex of its own:
          every card holds a link, so the row is reachable by keyboard (axe
          `scrollable-region-focusable` counts focusable descendants) and a
          focused card scrolls itself into view. */}
      <div className="pq-grid">
        {PACKS.map((p) => (
          <PackPhoto key={p.k} k={p.k} lines={p.lines} buy={p.buy} {...PHOTOS[p.k]} />
        ))}
      </div>
    </div>
  );
}
