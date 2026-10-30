import { fill } from "@/components/momapply/fill";
import { ArrowIcon, TickIcon } from "@/components/momapply/icons";
import type { HellostaffCopy } from "@/lib/copy/hellostaff";
import { FIR_ADDON, type HsService } from "@/lib/hellostaff/catalog";

/** Hello Staff's step 1: the package's checks, the FIR add-on that makes it
 *  Advanced, and the verification method (online; home visit is "coming
 *  soon" there too). */
export function PackageBody({ t, service, fir, onFir }: { t: HellostaffCopy; service: HsService; fir: boolean; onFir: (on: boolean) => void }) {
  const p = t.package;
  return (
    <>
      <h2 id="hs-step-t" className="mf-step-t" tabIndex={-1}>
        {p.title}
      </h2>
      <p className="ma-lede">{p.sub}</p>
      <div className="ma-field">
        <p className="ma-l">{p.checks}</p>
        <ul className="mf-plan-c hs-checks">
          {t.services[service.slug].checks.map((c) => (
            <li key={c}>
              <span className="mf-plan-i">
                <TickIcon className="" />
              </span>
              <span className="mf-plan-cb">
                <b>{c}</b>
              </span>
              <span />
            </li>
          ))}
        </ul>
      </div>
      <label className="ma-check">
        <input type="checkbox" checked={fir} onChange={(e) => onFir(e.target.checked)} />
        <span>
          <span className="mf-opt">{p.addon}</span> {p.fir}
        </span>
      </label>
      <fieldset className="mf-set ma-field">
        <legend className="ma-l">{p.method}</legend>
        <div className="mf-speed">
          <label className="mf-speed-o is-on">
            <input type="radio" name="hs-method" defaultChecked />
            <span className="mf-speed-top">
              <span className="mf-speed-dot" />
              <span className="mf-speed-n">{p.online}</span>
            </span>
            <span className="mf-speed-x">{p.onlineD}</span>
          </label>
          <label className="mf-speed-o hs-off" aria-disabled="true">
            <input type="radio" name="hs-method" disabled />
            <span className="mf-speed-top">
              <span className="mf-speed-dot" />
              <span className="mf-speed-n">{p.visit}</span>
              <span className="mf-tag">{p.soon}</span>
            </span>
            <span className="mf-speed-x">{p.visitD}</span>
          </label>
        </div>
      </fieldset>
    </>
  );
}

export function InstructionsBody({ t }: { t: HellostaffCopy }) {
  return (
    <>
      <h2 id="hs-step-t" className="mf-step-t" tabIndex={-1}>
        {t.instructions.title}
      </h2>
      <ul className="hs-list">
        {t.instructions.items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </>
  );
}

export function PaymentBody({
  t,
  service,
  fir,
  total,
  paid,
  paying,
  demo,
  onPay,
}: {
  t: HellostaffCopy;
  service: HsService;
  fir: boolean;
  total: number;
  paid: boolean;
  paying: boolean;
  demo: boolean;
  onPay: () => void;
}) {
  const p = t.pay;
  return (
    <>
      <h2 id="hs-step-t" className="mf-step-t" tabIndex={-1}>
        {p.title}
      </h2>
      <div className="mf-receipt">
        <p className="ma-l">{p.summary}</p>
        <ul>
          <li>
            <span>{t.services[service.slug].pkg}</span>
            <span>₹{service.price}</span>
          </li>
          {fir ? (
            <li>
              <span>{p.firLine}</span>
              <span>₹{FIR_ADDON}</span>
            </li>
          ) : null}
        </ul>
        <p className="mf-sum-tot">
          <span>{p.total}</span>
          <b>₹{total}</b>
        </p>
      </div>
      <div className="hs-howto">
        <p className="ma-l">{p.via}</p>
        <p>{p.info}</p>
        <ul className="hs-list">
          {p.options.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
      {paid ? (
        <p className="mf-status is-listed">
          <TickIcon /> {p.paid}
        </p>
      ) : (
        <button type="button" className="btn btn-ink ma-submit" disabled={paying} onClick={onPay}>
          {paying ? <span className="ma-spin ma-spin-light" aria-hidden="true" /> : null}
          {paying ? p.opening : fill(p.button, { amount: total })}
          {paying ? null : <ArrowIcon />}
        </button>
      )}
      {demo && !paid ? <p className="mf-hint">{p.demoNote}</p> : null}
    </>
  );
}

export function Done({ t, caseId, mobile, hellovHref }: { t: HellostaffCopy; caseId: string; mobile: string; hellovHref: string }) {
  return (
    <section className="mf-done" aria-labelledby="hs-step-t">
      <div className="ma-seal">
        <TickIcon />
      </div>
      <h2 id="hs-step-t" className="mf-step-t" tabIndex={-1}>
        {t.done.title}
      </h2>
      <p className="mf-done-h">{t.done.k}</p>
      <p className="mf-id">{caseId}</p>
      <p className="mf-done-who">{fill(t.done.body, { mobile: `+91 ${mobile}` })}</p>
      <p className="mf-hint">{t.done.note}</p>
      <a href={hellovHref} className="btn btn-line ma-submit">
        {t.done.back}
      </a>
    </section>
  );
}

export function Summary({ t, service, fir, total }: { t: HellostaffCopy; service: HsService; fir: boolean; total: number }) {
  const sv = t.services[service.slug];
  return (
    <aside className="mf-sum">
      <p className="k">{t.pay.summary}</p>
      <dl className="mf-sum-dl">
        <div>
          <dt>{sv.pkg}</dt>
          <dd>
            <ul className="hs-list hs-list-sm">
              {sv.checks.map((c) => (
                <li key={c}>{c}</li>
              ))}
              {fir ? <li>{t.package.fir}</li> : null}
            </ul>
          </dd>
        </div>
      </dl>
      <p className="mf-sum-tot">
        <span>{t.pay.total}</span>
        <b>₹{total}</b>
      </p>
    </aside>
  );
}

/** `momapply/flow/StepRail`'s markup, with the way back closed once paid. */
export function Rail({ t, steps, at, canGo, onGo }: { t: HellostaffCopy; steps: string[]; at: number; canGo: (i: number) => boolean; onGo: (i: number) => void }) {
  return (
    <nav className="ma-rail" aria-label={t.rail.progress}>
      <p className="ma-rail-m">
        <span>{fill(t.rail.step, { n: at + 1, total: steps.length })}</span>
        <b>{steps[at]}</b>
      </p>
      <div className="ma-rail-bar" aria-hidden="true">
        {steps.map((s, i) => (
          <i key={s} className={i === at ? "is-now" : i < at ? "is-done" : undefined} />
        ))}
      </div>
      <ol>
        {steps.map((s, i) => {
          const now = i === at;
          const done = i < at;
          const body = (
            <>
              <span className="ma-rail-dot">{done ? <TickIcon /> : i + 1}</span>
              <span className="ma-rail-lab">{s}</span>
            </>
          );
          return (
            <li key={s} className={[now ? "is-now" : done ? "is-done" : "", i <= at ? "is-reached" : ""].filter(Boolean).join(" ") || undefined} aria-current={now ? "step" : undefined}>
              <span className="ma-rail-line ma-rail-in" aria-hidden="true" />
              <span className="ma-rail-line ma-rail-out" aria-hidden="true" />
              {canGo(i) ? (
                <button type="button" className="ma-rail-go" onClick={() => onGo(i)}>
                  {body}
                </button>
              ) : (
                <span className="ma-rail-go">{body}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
