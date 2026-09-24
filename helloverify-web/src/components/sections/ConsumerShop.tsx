/** Consumer, desktop — homepage v2's HelloV storefront (the canvas
    "Consumer — who's coming into your home", Sep 2026). Replaces the two
    plan cards and service chips on desktop; the phone keeps `Consumer.tsx`'s
    generated tree, since the v2 boards have no 390px artboard.

    Eight full-height photo panels, one open at a time with its price card;
    under them the statement, the QR with its three steps, and the WhatsApp
    phone playing that service's chat. The words, the QR and the five phones
    are rendered here on the server; `./ConsumerShopStage` owns the state. */
import { HelloVPhone } from "@/components/blocks/HelloVPhone";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { localise } from "@/lib/i18n/href";
import { tint } from "@/lib/img";
import { getLocale } from "next-intl/server";
import "@/app/v2/consumer.css";
import { ConsumerShopStage, type ShopService } from "./ConsumerShopStage";

type ServiceKey = "driver" | "homeStaff" | "tenant" | "nanny" | "verifyAnyone" | "cyberIdentity" | "knowIdentity" | "knowContact";

/** Order, photograph, focal point and which chat plays — layout, not copy.
 *  The first four are "In your home", the rest "Online"; every online
 *  service plays the same chat, as on the board. */
const SERVICES: { id: ServiceKey; src: string; pos: string; chat: number }[] = [
  { id: "driver", src: "/img/v2/cs-driver.jpg", pos: "50% 40%", chat: 0 },
  { id: "homeStaff", src: "/img/v2/cs-staff.jpg", pos: "50% 30%", chat: 1 },
  { id: "tenant", src: "/img/v2/cs-tenant.jpg", pos: "50% 35%", chat: 2 },
  { id: "nanny", src: "/img/v2/cs-nanny.jpg", pos: "45% 40%", chat: 3 },
  { id: "verifyAnyone", src: "/img/v2/cs-anyone.jpg", pos: "45% 40%", chat: 4 },
  { id: "cyberIdentity", src: "/img/v2/cs-cyber.jpg", pos: "45% 40%", chat: 4 },
  { id: "knowIdentity", src: "/img/v2/cs-identity.jpg", pos: "55% 40%", chat: 4 },
  { id: "knowContact", src: "/img/v2/cs-contact.jpg", pos: "60% 40%", chat: 4 },
];

/** The canvas's QR, one string per row of the 33×33 module grid. Drawn as
 *  one path of horizontal runs (≈3.8 KB) rather than the board's one square
 *  per module (7.7 KB), which paints the same pixels; it is sent twice, in
 *  the HTML and in the RSC payload, so the halving counts twice. */
const QR = [
  "111111101101110010100010001111111",
  "100000101011011000011000001000001",
  "101110101011111100001101001011101",
  "101110100110001010010110001011101",
  "101110101111010111111010101011101",
  "100000100111111110100011101000001",
  "111111101010101010101010101111111",
  "000000000111110110010000000000000",
  "100111111001001011010000010010111",
  "110000011000010101111011000011100",
  "111010100000110101101001101011111",
  "111010011010010101100000010100111",
  "111110111001110010010010011000000",
  "101011001110011001100011100001000",
  "101101100011010111010110101110000",
  "101000011011001100001001110111101",
  "010000100001011100010011111111000",
  "000111011110011101111000101010101",
  "101011100010100101011111001101101",
  "001111011000101010011010101011111",
  "010010101000111101011011010001011",
  "101100010001001101110011110011100",
  "101001111010110111000111001000111",
  "100111001101100101001011110011111",
  "111000101010001010110000111110010",
  "000000001100010111100010100010110",
  "111111101111010100011001101010100",
  "100000101100111110101011100011101",
  "101110101000111100001011111110001",
  "101110101101001100111001110100011",
  "101110100010000110011011100110111",
  "100000100011111010010011001110111",
  "111111101101100001010000101111000",
];

function qrPath(rows: string[]) {
  let d = "";
  rows.forEach((row, y) => {
    for (const m of row.matchAll(/1+/g)) {
      const n = m[0].length;
      d += `M${m.index} ${y}h${n}v1h-${n}z`;
    }
  });
  return d;
}

export async function ConsumerShop() {
  const all = (await copy(SECTIONS)).consumer;
  const t = all.shop;
  const locale = await getLocale();

  const services: ShopService[] = SERVICES.map(({ id, src, pos, chat }, i) => {
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
      chat,
    };
  });

  const c = t.chats;
  const phones = [
    <HelloVPhone key="driver" />,
    <HelloVPhone key="homeStaff" script={c.homeStaff} />,
    <HelloVPhone key="tenant" script={c.tenant} />,
    <HelloVPhone key="nanny" script={c.nanny} />,
    <HelloVPhone key="online" script={c.online} />,
  ];

  const n = QR.length + 4;
  const how = (
    <div className="cx-howw">
      <p className="cx-send">{all.lede}</p>
      <div className="fm-how">
        <div className="fm-qr">
          <svg viewBox={`-2 -2 ${n} ${n}`} role="img" aria-label={t.qr}>
            <rect x="-2" y="-2" width={n} height={n} fill="#FFFFFF" />
            <path d={qrPath(QR)} fill="#15140F" />
          </svg>
        </div>
        <ol className="fm-steps">
          {Object.values(t.steps).map((s) => (
            <li key={s.k}><b>{s.k}</b>{s.t}</li>
          ))}
        </ol>
      </div>
    </div>
  );

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
          motion: t.motion,
        }}
        buyHref={localise("/individuals/hellov", locale)}
        phones={phones}
        how={how}
      />
    </div>
  );
}
