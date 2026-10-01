/** Consumer — homepage v2's HelloV storefront (the canvas "Consumer —
    who's coming into your home", Sep 2026), at every width; on the phone the
    panels stack as an accordion (`consumer.css`). Replaced the two plan
    cards and service chips, desktop first and then the phone.

    Eight full-height photo panels, one open at a time with its price card.
    The words are rendered here on the server; `./ConsumerShopStage` owns
    the state. The statement, QR steps and WhatsApp phone that sat under the
    panels came off on 30 Sep 2026; `blocks/HelloVPhone` still plays on
    `/individuals/hellov`. */
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { localise } from "@/lib/i18n/href";
import { tint } from "@/lib/img";
import { getLocale } from "next-intl/server";
import "@/app/v2/consumer.css";
import { ConsumerShopStage, type ShopService } from "./ConsumerShopStage";

type ServiceKey = "driver" | "homeStaff" | "tenant" | "nanny" | "verifyAnyone" | "cyberIdentity" | "knowIdentity" | "knowContact";

/** Order, photograph and focal point — layout, not copy. The first four are
 *  "In your home", the rest "Online".
 *
 *  THE PHOTOGRAPHS (Higgsfield, 1 Oct 2026) each act out their panel's line,
 *  across eight countries: a chauffeur in cap and tie at the wheel, the
 *  family buckling in behind him (Lagos), a new cook in a family kitchen (Dubai), a tenant taking the keys
 *  (Seoul), a nanny at play (Mexico City), a home tutor (Bengaluru), a man
 *  weighing a message he doubts (Berlin), a card photographed for checking
 *  (Cairo) and a woman holding up a contact's photo to match him (Jakarta).
 *  `pos` is the face: a closed panel is a 100px slice of the photograph, so
 *  it shows the face rather than a wall. `posOn` is where the open panel
 *  looks on desktop, where the price card covers the photograph's right
 *  half: it pans the picture (at most a fifth of its width, all `cover`
 *  allows) so the thing the line is about — the card being photographed,
 *  the profile photo on the phone — stays clear of the card. The `cs-*` set
 *  they replaced stays for the `/landing-page` snapshot. */
const SERVICES: { id: ServiceKey; src: string; pos: string; posOn?: string }[] = [
  { id: "driver", src: "/img/v2/cx-driver.jpg", pos: "20% 35%", posOn: "45% 35%" },
  { id: "homeStaff", src: "/img/v2/cx-staff.jpg", pos: "41% 25%" },
  { id: "tenant", src: "/img/v2/cx-tenant.jpg", pos: "45% 35%", posOn: "100% 35%" },
  { id: "nanny", src: "/img/v2/cx-nanny.jpg", pos: "32% 35%" },
  { id: "verifyAnyone", src: "/img/v2/cx-anyone.jpg", pos: "30% 45%", posOn: "100% 45%" },
  { id: "cyberIdentity", src: "/img/v2/cx-cyber.jpg", pos: "43% 30%", posOn: "100% 30%" },
  { id: "knowIdentity", src: "/img/v2/cx-identity.jpg", pos: "27% 35%", posOn: "85% 35%" },
  { id: "knowContact", src: "/img/v2/cx-contact.jpg", pos: "45% 40%", posOn: "100% 40%" },
];

export async function ConsumerShop() {
  const all = (await copy(SECTIONS)).consumer;
  const t = all.shop;
  const locale = await getLocale();

  const services: ShopService[] = SERVICES.map(({ id, src, pos, posOn }, i) => {
    const s = t.services[id];
    const price = "price" in s ? s.price : undefined;
    return {
      id,
      short: s.short,
      title: s.title,
      line: s.line,
      group: i < 4 ? t.groups.home : t.groups.online,
      tag: price ? `${t.from} ${price}` : t.eta,
      basic: s.basic,
      advanced: s.advanced,
      price,
      popular: id === "driver",
      src,
      bg: tint(src),
      pos,
      posOn: posOn ?? pos,
    };
  });

  return (
    <div className="wrap hair-top fm">
      <div className="fm-mast">
        <span className="k">{all.k}</span>
        <span className="fm-sheet">{t.sheet}</span>
      </div>
      <div className="sec-head fm-sh">
        <h2 className="h2">
          {all.headingA}
          <br />
          <em className="fm-it">{all.headingB}</em>
        </h2>
        <p className="lede">{t.lede}</p>
      </div>
      <ConsumerShopStage
        services={services}
        labels={{
          whatsapp: t.whatsapp,
          eta: t.eta,
          tiers: t.tiers,
          tierNames: t.tierNames,
          popular: t.popular,
          currency: t.currency,
          tbc: t.tbc,
          buy: t.buy,
          pick: t.steps.s2.t,
        }}
        buyHref={localise("/individuals/hellov", locale)}
      />
    </div>
  );
}
