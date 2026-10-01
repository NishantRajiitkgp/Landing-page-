/** International Background Verification — the old home page's country grid
    (30 Sep 2026), which the v2 homepage had dropped. One featured country
    (the United Kingdom) and four more, each a photograph, its flag, the old
    site's line, the turnaround from its country guide, and a link to that
    guide (`/countries/[slug]`).

    FLAGS ARE SHOWN AS THEY ARE. Each is the country's own flag from
    `public/flags/` (the MIT-licensed flag-icons set, the files the relay
    band uses): whole, in its 4:3 proportion — never cropped to a circle,
    recoloured, dimmed, overlaid or laid over a gradient — on a thin white
    border so it reads against any photograph. The flag is decorative
    (`alt=""`): the country's name is printed beside it. */
import Image from "next/image";

import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
import { getCountry } from "@/lib/content/countries";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { tint } from "@/lib/img";
import "@/app/v2/intl.css";

type Key = "uk" | "ph" | "ae" | "sg" | "eg";

/** Grid order, the old site's: the featured card first. `flag` is the file
 *  in `public/flags/`, `slug` the country guide.
 *
 *  THE PHOTOGRAPHS (Higgsfield, 1 Oct 2026) are this grid's own, each its
 *  card's line acted out in that country: a chauffeur on a Notting Hill
 *  street, keys handed to tenants in Makati, a security hire in a Dubai
 *  tower, a graduate on a Singapore campus, a hiring handshake over the
 *  Nile. The country guides keep theirs (`lib/content/countries.ts`, also
 *  the platform pages' and the dossiers'). Composed for the measured boxes:
 *  the featured card is 488×540 at 1440 and 680×300 on a tablet, so its
 *  chauffeur stands in the middle third; the others are 336×260 with the
 *  words over their lower half, so faces sit in the top third and `pos`
 *  keeps them there as a phone's 1.46:1 box crops the 4:3 picture. */
const CARDS: { k: Key; flag: string; slug: string; img: string; pos: string; big?: true }[] = [
  { k: "uk", flag: "gb", slug: "united-kingdom", img: "/img/v2/ig-uk.jpg", pos: "45% 15%", big: true },
  { k: "ph", flag: "ph", slug: "philippines", img: "/img/v2/ig-ph.jpg", pos: "50% 25%" },
  { k: "ae", flag: "ae", slug: "united-arab-emirates", img: "/img/v2/ig-ae.jpg", pos: "50% 25%" },
  { k: "sg", flag: "sg", slug: "singapore", img: "/img/v2/ig-sg.jpg", pos: "50% 20%" },
  { k: "eg", flag: "eg", slug: "egypt", img: "/img/v2/ig-eg.jpg", pos: "50% 30%" },
];

const SIZES_BIG = "(max-width: 639px) 92vw, (max-width: 1080px) 92vw, 600px";
const SIZES_SMALL = "(max-width: 639px) 92vw, (max-width: 1080px) 46vw, 300px";

export async function IntlGrid() {
  const t = (await copy(SECTIONS)).intlGrid;

  return (
    <section className="wrap ig" aria-labelledby="ig-h">
      <div className="sec-head ig-head">
        <h2 className="h2" id="ig-h">{t.heading}</h2>
        <p className="lede">{t.lede}</p>
      </div>
      <ul className="ig-grid">
        {CARDS.map(({ k, flag, slug, img, pos, big }) => {
          const it = t.items[k];
          const c = getCountry(slug);
          return (
            <li key={k} className={big ? "ig-card ig-big" : "ig-card"}>
              <AppLink href={`/countries/${slug}`} className="ig-link">
                <span className="ig-ph" style={{ background: tint(img) }}>
                  <Image className="pimg" src={img} alt="" fill sizes={big ? SIZES_BIG : SIZES_SMALL} style={{ objectPosition: pos }} />
                </span>
                <span className="ig-scrim" aria-hidden="true" />
                <span className="ig-body">
                  <span className="ig-title">
                    <span className="ig-flag">
                      <Image src={`/flags/${flag}.svg`} alt="" width={40} height={30} unoptimized />
                    </span>
                    <b>{it.name}</b>
                  </span>
                  <span className="ig-p">{it.p}</span>
                  {c && (
                    <span className="ig-tat">
                      <i>{t.turnK}</i>
                      {c.turnaround}
                    </span>
                  )}
                </span>
                <span className="ig-go" aria-hidden="true">
                  <Arrow />
                </span>
              </AppLink>
            </li>
          );
        })}
      </ul>
      <div className="ig-foot">
        <AppLink href="/resources/countries" className="btn btn-ghost ig-more">
          <span>{t.cta}</span>
          <Arrow />
        </AppLink>
      </div>
    </section>
  );
}
