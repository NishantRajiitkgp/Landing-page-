/**
 * Template 3 — the vertical/solution workhorse (DESIGN.md §7, IA §6).
 * Anatomy is fixed so every vertical reads the same and each H2 block stays a
 * self-contained, citable unit; only the content varies.
 */
import { PageShell } from "@/components/chrome/PageShell";
import type { ClosingCta } from "@/components/chrome/ClosingCta";
import Image from "next/image";
import { CERT_BOX } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export type Pill = { n: string; t: string; fast?: boolean };
export type Lane = { gt: string; gh: string; pills: Pill[] };
export type Step = { n: string; t: string; p: string };
export type Row = { nm: string; sub: string; tm: string; fast?: boolean; src: string };
export type Faq = { q: string; a: string };

export type VerticalContent = {
  crumbs: { label: string; href?: string }[];
  eyebrow: string;
  h1: React.ReactNode;
  sub: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  strip: React.ReactNode[];
  verifyHead: React.ReactNode;
  verifyLede: string;
  lanes: Lane[];
  laneCols?: number;
  stepsHead: React.ReactNode;
  stepsLede?: string;
  steps: Step[];
  tableHead: React.ReactNode;
  tableLede: string;
  rows: Row[];
  tableNote?: React.ReactNode;
  complianceHead?: React.ReactNode;
  complianceLede?: string;
  faqHead: React.ReactNode;
  faqs: Faq[];
  closing: React.ComponentProps<typeof ClosingCta>;
};

const CERTS = [
  { img: "/img/iso.jpg", alt: "ISO 27001", h: "ISO 27001 certified", p: "Information security management, independently audited." },
  { img: "/img/gdpr.jpg", alt: "GDPR", h: "GDPR-aligned data handling", p: "Consent, retention limits and the right to be forgotten, in every workflow." },
  { img: "/img/pbsa.jpg", alt: "PBSA", h: "PBSA member", p: "Member of the global standards body for the screening industry." },
  { img: "/img/nsr.jpg", alt: "NSR", h: "National Skills Registry", p: "India's registry of verified IT and ITeS professionals." },
];

export function VerticalPage(c: VerticalContent) {
  return (
    <PageShell crumbs={c.crumbs} closing={c.closing}>
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">{c.eyebrow}</div>
        <h1 className="h1">{c.h1}</h1>
        <p className="sub">{c.sub}</p>
        <div className="hrow">
          <AppLink href={c.primary?.href ?? "/contact"} className="btn btn-ink">{c.primary?.label ?? "Talk to sales"}</AppLink>
          {c.secondary && (
            <AppLink href={c.secondary.href} className="btn btn-ghost">
              <span>{c.secondary.label}</span>
              <Arrow />
            </AppLink>
          )}
        </div>
      </div>

      {/* trust strip */}
      <div className="wrap">
        <div className="strip3">
          {c.strip.map((s, i) => (
            <span className="it" key={i}>{s}</span>
          ))}
        </div>
      </div>

      {/* what we verify */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">What we verify</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{c.verifyHead}</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>{c.verifyLede}</p>
        </div>
        <div
          className="body3 lanes3"
          style={c.laneCols ? { gridTemplateColumns: `repeat(${c.laneCols}, minmax(0, 1fr))` } : undefined}
        >
          {c.lanes.map((l) => (
            <div key={l.gt}>
              <div className="lgt">{l.gt}</div>
              <div className="lgh">{l.gh}</div>
              <div className="cloud3">
                {l.pills.map((p) => (
                  <span key={p.n} className={`pl3${p.fast ? " fast" : ""}`}>
                    <span className="d" />
                    {p.n}
                    <span className="t">{p.t}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* how it works */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">How it works</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{c.stepsHead}</h2>
          </div>
          {c.stepsLede && <p className="lede" style={{ marginBottom: 8 }}>{c.stepsLede}</p>}
        </div>
        <div
          className="body3 steps3"
          style={c.steps.length !== 4 ? { gridTemplateColumns: `repeat(${c.steps.length}, minmax(0, 1fr))` } : undefined}
        >
          {c.steps.map((s) => (
            <div key={s.t}>
              <div className="n">{s.n}</div>
              <div className="t">{s.t}</div>
              <p className="p">{s.p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* turnaround & coverage */}
      <div className="wrap sec3" id="turnaround">
        <div className="sec-head">
          <div>
            <div className="k">Turnaround &amp; coverage</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{c.tableHead}</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>{c.tableLede}</p>
        </div>
        <div className="body3 tbl3">
          <div className="hd">
            <span>Check</span>
            <span>Turnaround</span>
            <span>Confirmed with</span>
          </div>
          {c.rows.map((r) => (
            <div className="r" key={r.nm}>
              <span className="nm">{r.nm}<small>{r.sub}</small></span>
              <span className={`tm${r.fast ? " fast" : ""}`}>{r.tm}</span>
              <span className="src">{r.src}</span>
            </div>
          ))}
          {c.tableNote && <div className="note">{c.tableNote}</div>}
        </div>
      </div>

      {/* compliance & security */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">Compliance &amp; security</div>
            <h2 className="h2" style={{ marginTop: 12 }}>
              {c.complianceHead ?? (<>The unexciting part,<br />done properly.</>)}
            </h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            {c.complianceLede ??
              "Every check involves someone's most personal documents. Consent comes first, retention has limits, and all of it is auditable."}
          </p>
        </div>
        <div className="body3 certs3">
          {CERTS.map((x) => (
            <div className="cert" key={x.alt}>
              <Image src={x.img} alt={x.alt} width={CERT_BOX} height={CERT_BOX} />
              <div>
                <div className="h">{x.h}</div>
                <p className="p">{x.p}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/platform/security-compliance" className="btn btn-ghost btn-sm">
            <span>Security &amp; compliance, in full — DPA, residency, conformance</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* FAQ */}
      <div className="wrap sec3" style={{ paddingBottom: 30 }}>
        <div className="sec-head" style={{ marginBottom: 44 }}>
          <div>
            <div className="k">Questions</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{c.faqHead}</h2>
          </div>
        </div>
        <div className="faq3">
          {c.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}<span className="m">+</span></summary>
              <p className="a">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
