/** What every `/partner-with-us` section shares: the copy's type, the
 *  partner line, the stagger index, the section head whose words rise in
 *  once on screen, and the line icons the cards carry. */
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Reveal } from "@/components/about/AboutMotion";
import type { PartnerCopy } from "@/lib/copy/partner";

export type { PartnerCopy };

export const TEL = "tel:+919289627622";
export const JOIN = "#join";
export const SALES = "/contact?tab=enquiry";
/** Served from `public/docs/`; a path with an extension skips the locale
 *  proxy, so it is a plain `<a>`, not an `AppLink`. */
export const AGREEMENT_PDF = "/docs/helloverify-partner-agreement.pdf";

/** The stagger index the entrances in `app/v2/partner.css` multiply by. */
export const d = (i: number) => ({ "--i": i }) as CSSProperties;

export function Words({ text }: { text: string }) {
  return text.split(" ").map((w, i) => (
    <Fragment key={i}>
      {i > 0 ? " " : null}
      <span className="pw-w" style={d(i)}>{w}</span>
    </Fragment>
  ));
}

export function Head({ k, h, id, sub }: { k?: string; h: string; id: string; sub?: ReactNode }) {
  return (
    <Reveal className="pw-head">
      {k ? <p className="k">{k}</p> : null}
      <h2 className="h2" id={id}>
        <Words text={h} />
      </h2>
      {sub ? <p className="lede">{sub}</p> : null}
    </Reveal>
  );
}

/** The partner line, written once so every mention dials the same number. */
export function Phone({ c, className }: { c: PartnerCopy["phone"]; className?: string }) {
  return (
    <a href={TEL} className={className ?? "pw-tel"} dir="ltr">{c.display}</a>
  );
}

const P = {
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  plane: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
  pulse: "M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7zM3.2 12h6.3l.5-1 2 4.5 2-7 1.5 3.5h5.3",
  cap: "M22 10 12 5 2 10l10 5 10-5zM6 12v5c3 3 9 3 12 0v-5",
  globe: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  face: "M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
  building: "M3 21h18M5 21V7l7-4 7 4v14M10 12h4M10 16h4",
  home: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  bolt: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  repeat: "M17 2l4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3",
  trend: "m22 7-8.5 8.5-5-5L2 17M16 7h6v6",
  wallet: "M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM2 10h20M16 15h2",
  check: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM8 12l3 3 5-6",
  doc: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6",
  download: "M12 3v12M7 10l5 5 5-5M4 21h16",
  case: "M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  medal: "M12 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM8.5 14.2 7 22l5-3 5 3-1.5-7.8",
  userPlus: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM19 8v6M22 11h-6",
  pen: "M12 20h9M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4z",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
  lock: "M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM8 10V7a4 4 0 1 1 8 0v3",
  info: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 8h.01M11 12h1v4h1",
  clock: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7v5l3 2",
  chat: "M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z",
  megaphone: "M3 11v3a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15 9a3 3 0 0 1 0 6M18 6a7 7 0 0 1 0 12",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
} as const;

export type IconName = keyof typeof P;

export function Icon({ n, className }: { n: IconName; className?: string }) {
  return (
    <svg className={className ?? "pw-ic"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={P[n]} />
    </svg>
  );
}
