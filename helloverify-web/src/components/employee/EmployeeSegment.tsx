/** `/employee-verification` — one workforce segment: its number and title
 *  across the page, then the intro and "Talk to Sales" beside the photo,
 *  which carries the first checks as verified tags; the clients when it has
 *  them; then every check it covers, each with its definition. */
import Image from "next/image";
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";
import { EmployeeChecks } from "./EmployeeChecks";

export type SegmentClients = { h: string; items: readonly { id: string; fit?: string; src: string; alt: string }[] };
type SegmentCopy = { h: string; p: string; cta: string; alt: string; checks: Record<string, { n: string; p: string }> };

export function EmployeeSegment({
  id,
  no,
  of,
  tone,
  c,
  img: [file, w, h],
  href,
  clients,
}: {
  id: string;
  no: number;
  of: number;
  tone: "white" | "blue";
  c: SegmentCopy;
  img: readonly [string, number, number];
  href: string;
  clients?: SegmentClients;
}) {
  const checks = Object.entries(c.checks).map(([k, x]) => ({ k, n: x.n, p: x.p }));
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <section className={`wrap sec3 emp4-seg emp4-seg-${tone}`} id={id} aria-labelledby={`${id}-h`}>
      <p className="emp4-no" aria-hidden="true">
        <span>
          <b>{pad(no)}</b> / {pad(of)}
        </span>
      </p>
      <h2 className="h2 emp4-seg-h" id={`${id}-h`}>{c.h}</h2>
      <div className="emp4-mast">
        <div className="tx">
          <p className="lede">{c.p}</p>
          <div className="hrow">
            <AppLink href={href} className="btn btn-ink">
              {c.cta}
              <Arrow />
            </AppLink>
          </div>
        </div>
        <figure className="fig">
          <span className="ph">
            <Image src={`/img/employee/${file}`} alt={c.alt} width={w} height={h} sizes="(max-width: 1080px) 92vw, 640px" />
          </span>
          <ul className="emp4-tags" aria-hidden="true">
            {checks.slice(0, 3).map((x) => (
              <li key={x.k}>
                <span className="tk">
                  <svg viewBox="0 0 16 16">
                    <path d="M3.5 8.5l3 3 6-7" />
                  </svg>
                </span>
                {x.n}
              </li>
            ))}
          </ul>
        </figure>
      </div>
      {clients ? (
        <div className="emp4-clients">
          <p className="emp4-clients-k">{clients.h}</p>
          <ul>
            {clients.items.map((m) => (
              <li key={m.id} className={m.fit ? `emp4-cl-${m.fit}` : undefined}>
                <Image src={m.src} alt={m.alt} width={160} height={48} sizes="160px" unoptimized={m.src.endsWith(".svg")} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <EmployeeChecks
        items={checks}
        cta={
          checks.length % 3 === 2 ? (
            <AppLink href={href} className="emp4-cta-cell">
              <span className="t">{c.cta}</span>
              <span className="go" aria-hidden="true">
                <Arrow />
              </span>
            </AppLink>
          ) : undefined
        }
      />
    </section>
  );
}
