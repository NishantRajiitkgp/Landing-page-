"use client";

/** The old applicant "Information Guide" (`ImmigrationApplicantInfoGuide`):
 *  How to Apply, Documents Required and FAQs. As on the old page, Applying To
 *  lists the visa back office's embassies (the CMS names until it answers),
 *  Applying From and Visa Type come from it alone, and a choice resets the
 *  ones after it; switching tabs resets the lot. How to Apply opens the old
 *  step-by-step PDF for a matching visa type and shows the embassy's
 *  accordions; Documents Required adds Application Category when the visa
 *  type has sub-categories and shows the matching checklist; Latvia adds the
 *  Premium Service packages on both. FAQ categories, panels and answers stay
 *  in the DOM (`hidden` / closed `<details>`). */
import { useEffect, useRef, useState } from "react";
import type { Checklist } from "@/lib/immigration/checklists";
import {
  EMBASSY_ID,
  GUIDE_PDFS,
  GUIDE_PDF_BASE,
  type GuideEmbassy,
  type GuideOffice,
  type GuideVisa,
} from "@/lib/immigration/guide";
import { Accordions, Check, Linkify, Premium, type Guide } from "@/components/immigration/GuideParts";

type Tab = keyof Guide["tabs"];
type Nav = keyof Guide["faqNav"];
type Mode = "how" | "docs";

async function lookup<T>(path: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(`/api/visa-guide/${path}`, { signal });
  if (!res.ok) throw new Error(String(res.status));
  return (await res.json()) as T;
}

const num = (v: string) => (v ? Number(v) : 0);

function Selectors({
  g,
  mode,
  embassies,
  checklists,
  ctaHref,
}: {
  g: Guide;
  mode: Mode;
  embassies: readonly GuideEmbassy[];
  checklists: readonly Checklist[];
  ctaHref: string;
}) {
  const [embassy, setEmbassy] = useState("");
  const [country, setCountry] = useState("");
  const [visa, setVisa] = useState("");
  const [subtype, setSubtype] = useState("");
  const [offices, setOffices] = useState<readonly GuideOffice[] | null>(null);
  const [visas, setVisas] = useState<readonly GuideVisa[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const pending = useRef<AbortController | null>(null);

  useEffect(() => () => pending.current?.abort(), []);

  const load = <T,>(path: string | null, failed: string, done: (r: T) => void) => {
    pending.current?.abort();
    pending.current = null;
    setErr(null);
    setBusy(path != null);
    if (path == null) return;
    const ac = new AbortController();
    pending.current = ac;
    lookup<T>(path, ac.signal)
      .then(done)
      .catch(() => !ac.signal.aborted && setErr(failed))
      .finally(() => pending.current === ac && setBusy(false));
  };

  const e = num(embassy);
  const c = num(country);
  const v = num(visa);
  const sub = num(subtype);
  const subtypes = visas?.find((x) => x.id === v)?.subtypes ?? [];
  const matched =
    mode === "docs" && e && c && v
      ? checklists.filter(
          (x) => x.embassy === e && x.country === c && (x.subtype != null ? sub !== 0 && x.subtype === sub : x.visa === v),
        )
      : [];

  return (
    <>
      <div className="gd3-fields">
        <label>
          <span>{g.fields.applyingTo}</span>
          <select
            required
            aria-required="true"
            value={embassy}
            onChange={(ev) => {
              const id = ev.target.value;
              setEmbassy(id);
              setOffices(null);
              setCountry("");
              setVisas(null);
              setVisa("");
              setSubtype("");
              load<GuideOffice[]>(id ? `countries?id=${id}` : null, g.errors.countries, setOffices);
            }}
          >
            <option value="">{g.placeholders.embassy}</option>
            {embassies.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{g.fields.applyingFrom}</span>
          <select
            value={country}
            disabled={!embassy || !offices?.length}
            onChange={(ev) => {
              const id = ev.target.value;
              setCountry(id);
              setVisas(null);
              setVisa("");
              setSubtype("");
              load<GuideVisa[]>(id ? `visa-types?id=${id}` : null, g.errors.visas, setVisas);
            }}
          >
            <option value="">{g.placeholders.country}</option>
            {offices?.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{g.fields.visaType}</span>
          <select
            value={visa}
            disabled={!embassy || !country || !visas?.length}
            onChange={(ev) => {
              setVisa(ev.target.value);
              setSubtype("");
              const id = num(ev.target.value);
              const pdf = mode === "how" && GUIDE_PDFS.find(([pe, pc, pv]) => pe === e && pc === c && pv === id);
              if (pdf) window.open(`${GUIDE_PDF_BASE}${pdf[3]}`, "_blank", "noopener,noreferrer");
            }}
          >
            <option value="">{g.placeholders.visaType}</option>
            {visas?.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        {mode === "docs" && subtypes.length > 0 && (
          <label>
            <span>{g.fields.category}</span>
            <select value={subtype} onChange={(ev) => setSubtype(ev.target.value)}>
              <option value="">{g.placeholders.visaChild}</option>
              {subtypes.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {err && <p className="gd3-note err">{err}</p>}
      {busy && <p className="gd3-note">{g.loading}</p>}
      <div className="gd3-cta">
        <a href={ctaHref} className="btn btn-ink">
          {g.cta}
        </a>
      </div>

      {mode === "how" && e > 0 && <Accordions g={g} embassy={e} />}

      {matched.length > 0 && (
        <div className="gd3-docs">
          <p className="hd">{g.docsHeading}</p>
          {matched.map((x) => (
            <div key={`${x.t}-${x.visa ?? x.subtype}`} className="it">
              <p className="t">
                <Check />
                <span>{x.t}</span>
              </p>
              <ul>
                {x.b.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {e === EMBASSY_ID.latvia && <Premium g={g} href={ctaHref} />}
    </>
  );
}

export function ImmigrationGuide({ g, checklists, ctaHref }: { g: Guide; checklists: readonly Checklist[]; ctaHref: string }) {
  const [tab, setTab] = useState<Tab>("how");
  const [nav, setNav] = useState<Nav>("process");
  const [round, setRound] = useState(0);
  const fallback = Object.values(g.destinations).map((d, i) => ({ id: i + 1, name: d.name }));
  const [embassies, setEmbassies] = useState<readonly GuideEmbassy[] | null>(null);
  const [embassyErr, setEmbassyErr] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    lookup<GuideEmbassy[]>("embassies", ac.signal)
      .then(setEmbassies)
      .catch(() => !ac.signal.aborted && setEmbassyErr(true));
    return () => ac.abort();
  }, []);

  const pick = (k: Tab) => {
    setTab(k);
    setRound((n) => n + 1);
  };

  return (
    <div className="body3 gd3">
      <div className="gd3-tabs" role="tablist">
        {(Object.keys(g.tabs) as Tab[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            id={`gd-tab-${k}`}
            aria-selected={tab === k}
            aria-controls={`gd-panel-${k}`}
            className={`seg${tab === k ? " on" : ""}`}
            onClick={() => pick(k)}
          >
            {g.tabs[k]}
          </button>
        ))}
      </div>

      {(["how", "docs"] as const).map((m) => (
        <div key={m} id={`gd-panel-${m}`} role="tabpanel" aria-labelledby={`gd-tab-${m}`} className="gd3-panel" hidden={tab !== m}>
          <h3>{g[m].t}</h3>
          <p>{g[m].p}</p>
          {embassyErr && <p className="gd3-note err">{g.errors.embassies}</p>}
          <Selectors key={`${m}-${round}`} g={g} mode={m} embassies={embassies ?? fallback} checklists={checklists} ctaHref={ctaHref} />
        </div>
      ))}

      <div id="gd-panel-faq" role="tabpanel" aria-labelledby="gd-tab-faq" className="gd3-panel" hidden={tab !== "faq"}>
        <div className="gd3-nav">
          {(Object.keys(g.faqNav) as Nav[]).map((k) => (
            <button key={k} type="button" aria-pressed={nav === k} className={nav === k ? "on" : undefined} onClick={() => setNav(k)}>
              {g.faqNav[k]}
            </button>
          ))}
        </div>
        {(Object.keys(g.faqNav) as Nav[]).map((k) => (
          <div key={nav === k ? `${k}-on` : k} className="gd3-faqs" hidden={nav !== k}>
            {g.faqs[k].map((f, i) => (
              <details key={f.q} name={`gd-faq-${k}`} open={i === 0}>
                <summary>{f.q}</summary>
                <p>
                  <Linkify text={f.a} />
                </p>
                {"b" in f && f.b && (
                  <ul>
                    {f.b.map((b) => (
                      <li key={b}>
                        <Linkify text={b} />
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
