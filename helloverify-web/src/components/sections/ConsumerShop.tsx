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
 *  "In your home", the rest "Online". */
const SERVICES: { id: ServiceKey; src: string; pos: string }[] = [
  { id: "driver", src: "/img/v2/cs-driver.jpg", pos: "50% 40%" },
  { id: "homeStaff", src: "/img/v2/cs-staff.jpg", pos: "50% 30%" },
  { id: "tenant", src: "/img/v2/cs-tenant.jpg", pos: "50% 35%" },
  { id: "nanny", src: "/img/v2/cs-nanny.jpg", pos: "45% 40%" },
  { id: "verifyAnyone", src: "/img/v2/cs-anyone.jpg", pos: "45% 40%" },
  { id: "cyberIdentity", src: "/img/v2/cs-cyber.jpg", pos: "45% 40%" },
  { id: "knowIdentity", src: "/img/v2/cs-identity.jpg", pos: "55% 40%" },
  { id: "knowContact", src: "/img/v2/cs-contact.jpg", pos: "60% 40%" },
];

export async function ConsumerShop() {
  const all = (await copy(SECTIONS)).consumer;
  const t = all.shop;
  const locale = await getLocale();

  const services: ShopService[] = SERVICES.map(({ id, src, pos }, i) => {
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
