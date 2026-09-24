"use client";

/** The HelloV storefront's interactive part (homepage v2, desktop;
    `sections/ConsumerShop.tsx` renders the rest). Two pieces of state, as on
    the canvas board: which of the eight services is open, and whether its
    price card shows Basic or Advanced — one switch shared by all eight, so
    flipping to Basic and opening another service keeps Basic.

    ACCESSIBILITY, where the board had none to copy:
    - Each photo panel opens through a real `<button>` laid over it
      (`aria-pressed`), because the panel itself holds the price card's own
      controls and a button cannot contain buttons.
    - A closed panel's caption and card, and the tier that is not showing,
      are `visibility: hidden` rather than only transparent, so they leave
      the tab order and the accessibility tree (`consumer.css`).
    - The phone replays its chat on a 14 s loop, so it has a pause (WCAG
      2.2.2). Paused, it holds the finished conversation rather than stopping
      mid-message; `consumer.css` does it with a negative delay.

    The phone for each service is server-rendered (`blocks/HelloVPhone`) and
    arrives as `phones`; switching remounts it by key, which restarts its CSS
    animations — the board's `sc-if` did the same. */

import Image from "next/image";
import { useState, type ReactNode } from "react";

export type ShopService = {
  id: string;
  short: string;
  title: string;
  line: string;
  group: string;
  /** "from ₹1799" on a closed panel, or the turnaround when unpriced. */
  tag: string;
  basic: string[];
  advanced: string[];
  price?: string;
  popular: boolean;
  src: string;
  bg: string;
  /** The photo's focal point, as the board set it. */
  pos: string;
  /** Which of `phones` plays for this service. */
  chat: number;
};

export type ShopLabels = {
  whatsapp: string;
  eta: string;
  tiers: { basic: string; advanced: string };
  tierNames: { basic: string; advanced: string };
  popular: string;
  currency: string;
  tbc: { mark: string; note: string };
  buy: string;
  pick: string;
  motion: { pause: string; play: string };
};

/** The open panel is ~636px wide by 600px tall at 1440 and the photos are
 *  4:3, so `cover` scales them to 800px wide, 864px with the 1.08 zoom a
 *  closed panel carries: 60vw. Closed panels show the same file, grey. */
const SIZES_CX = "(max-width: 1080px) 90vw, 60vw";

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 9.5c.3 1.7 1.8 3.4 3.6 4.1l1.1-1 1.6.8-.4 1.3c-2.9.3-6.1-2.6-6.4-5.4l1.3-.5.8 1.5-1 .9" fill="currentColor" />
    </svg>
  );
}

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="cx-checks">
      {items.map((c) => (
        <li key={c}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.6 8.4l2.9 2.9 5.9-6.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {c}
        </li>
      ))}
    </ul>
  );
}

function Price({ value, l }: { value?: string; l: ShopLabels }) {
  if (!value) {
    return (
      <div className="cx-price cx-tbc">
        <b>{l.tbc.mark}</b>
        <span>{l.tbc.note}</span>
      </div>
    );
  }
  return (
    <div className="cx-price">
      <span className="cx-cur">{l.currency}</span>
      <b>{value}</b>
    </div>
  );
}

export function ConsumerShopStage({
  services,
  labels: l,
  buyHref,
  phones,
  how,
}: {
  services: ShopService[];
  labels: ShopLabels;
  buyHref: string;
  phones: ReactNode[];
  how: ReactNode;
}) {
  const [open, setOpen] = useState(0);
  const [tier, setTier] = useState<0 | 1>(1);
  const [paused, setPaused] = useState(false);
  // Bumped on "play", so the chat restarts from its first message.
  const [run, setRun] = useState(0);
  const chat = services[open].chat;

  return (
    <>
      <div className="cx-stage" role="group" aria-label={l.pick}>
        {services.map((s, i) => {
          const on = i === open;
          return (
            <div key={s.id} className={on ? "cx-p cx-on" : "cx-p"} style={{ background: s.bg }}>
              <Image className="cx-img" src={s.src} alt="" fill sizes={SIZES_CX} style={{ objectPosition: s.pos }} />
              <div className="cx-shade" />
              <button
                type="button"
                className="cx-open"
                aria-pressed={on}
                aria-label={`${s.title}, ${s.tag}`}
                onClick={() => setOpen(i)}
              />
              <div className="cx-v" aria-hidden="true">
                <span className="cx-vn">{s.short}</span>
                <span className="cx-from">{s.tag}</span>
              </div>
              <div className="cx-cap">
                <span className="cx-grp">{s.group}</span>
                <h3>{s.title}</h3>
                <p>{s.line}</p>
              </div>
              <div className="cx-card">
                <div className="cx-ck">
                  <span className="cx-wa"><WhatsAppIcon />{l.whatsapp}</span>
                  <span className="cx-eta">{l.eta}</span>
                </div>
                <div className={`cx-seg cx-s${tier}`}>
                  <button type="button" aria-pressed={tier === 0} onClick={() => setTier(0)}>{l.tiers.basic}</button>
                  <button type="button" aria-pressed={tier === 1} onClick={() => setTier(1)}>{l.tiers.advanced}</button>
                  <i aria-hidden="true" />
                </div>
                <div className={`cx-tiers cx-v${tier}`}>
                  <div className="cx-tier cx-t0">
                    <div className="cx-tn">{l.tierNames.basic}</div>
                    <Price l={l} />
                    <Checks items={s.basic} />
                  </div>
                  <div className="cx-tier cx-t1">
                    {s.popular && <span className="cx-pop">{l.popular}</span>}
                    <div className="cx-tn">{l.tierNames.advanced}</div>
                    <Price value={s.price} l={l} />
                    <Checks items={s.advanced} />
                  </div>
                </div>
                <a href={buyHref} className="cx-buy"><WhatsAppIcon />{l.buy}</a>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cx-row">
        {how}
        <div className="cx-phonecol">
          <div className={paused ? "fm-phone cx-paused" : "fm-phone"} key={`${chat}-${run}`}>
            {phones[chat]}
          </div>
          <button
            type="button"
            className="cx-motion"
            aria-pressed={paused}
            onClick={() => {
              if (paused) setRun((r) => r + 1);
              setPaused((p) => !p);
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              {paused ? (
                <path d="M2.5 1.5v7l6-3.5z" fill="currentColor" />
              ) : (
                <path d="M2.5 1.5v7M7.5 1.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
            <span>{paused ? l.motion.play : l.motion.pause}</span>
          </button>
        </div>
      </div>
    </>
  );
}
