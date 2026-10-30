/** What every `/products/customer-kyc` section shares: the copy's type, the
 *  step order, the sales link, and the section head whose words rise in
 *  one by one once it is on screen. */
import { Fragment, type CSSProperties } from "react";
import { Reveal } from "@/components/about/AboutMotion";
import type { BusinessCopy } from "@/lib/copy/business";

export type KycCopy = BusinessCopy["customerKyc"];

export const SALES = "/contact?tab=enquiry";

export const STEPS = ["consent", "name", "selfie", "pan", "face", "digilocker"] as const satisfies readonly (keyof KycCopy["how"]["steps"])[];

/** The stagger index the entrances in `app/v2/kyc.css` multiply by. */
export const d = (i: number) => ({ "--i": i }) as CSSProperties;

export function Words({ text }: { text: string }) {
  return text.split(" ").map((w, i) => (
    <Fragment key={i}>
      {i > 0 ? " " : null}
      <span className="kz-w" style={d(i)}>{w}</span>
    </Fragment>
  ));
}

export function Head({ k, h, id, sub }: { k?: string; h: string; id: string; sub?: string }) {
  return (
    <Reveal className="kz-head">
      {k ? <p className="k">{k}</p> : null}
      <h2 className="h2" id={id}>
        <Words text={h} />
      </h2>
      {sub ? <p className="lede">{sub}</p> : null}
    </Reveal>
  );
}

export function Source({ lead, name, href, tail }: { lead: string; name: string; href: string; tail?: string }) {
  return (
    <p className="src">
      {lead}{" "}
      <a href={href} target="_blank" rel="noopener noreferrer">{name}</a>
      {tail}
    </p>
  );
}
