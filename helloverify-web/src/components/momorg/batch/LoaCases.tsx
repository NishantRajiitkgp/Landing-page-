"use client";

import { useEffect, useRef, useState } from "react";

import { fill, fillNodes } from "@/components/momapply/fill";
import { LoaLetter } from "@/components/momapply/flow/LoaLetter";
import { formatDate, localDay } from "@/components/momapply/flow/format";
import { TickIcon } from "@/components/momapply/icons";
import { FieldError } from "@/components/momapply/PasswordField";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { localise } from "@/lib/i18n/href";
import { FILE_ACCEPT, FILE_MAX_MB, reportDay } from "@/lib/mom/apply/policy";
import type { ApplyFailure } from "@/lib/mom/apply/types";
import { sendLoaLinks, uploadSignedLoa } from "@/lib/mom/org/batchClient";
import type { PaidBatch, PaidCase } from "@/lib/mom/org/checkout";
import { signedCount } from "@/lib/mom/org/loa";
import { MOM_LOA_PATH } from "@/lib/mom/paths";

import { printOnly } from "./printOnly";
import { useLoaStatus } from "./useLoaStatus";

/** One row per case: signed or not, and the ways to get it signed: the
 *  emailed link (opened directly in the demo), or a printed letter signed on
 *  paper and uploaded back. */
export function LoaCases({ batch, receipt, t, s, locale }: { batch: PaidBatch; receipt: string; t: MomOrgCopy; s: MomStepsCopy; locale: string }) {
  const c = t.cases;
  const { status, links, mark } = useLoaStatus(receipt, batch.demo);
  const [sent, setSent] = useState<ReadonlySet<string>>(new Set());
  const [faults, setFaults] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [sheet, setSheet] = useState<PaidCase | null>(null);
  const [sentAll, setSentAll] = useState<number | null>(null);
  const picking = useRef<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const total = batch.cases.length;
  const n = signedCount(batch.cases, status);
  const unsigned = batch.cases.filter((x) => !status[x.id]);

  useEffect(() => {
    if (sheet) printOnly(sheetRef.current);
  }, [sheet]);

  const message = (f: ApplyFailure) =>
    f.code === "too_large"
      ? fill(s.issues.too_large, { mb: FILE_MAX_MB })
      : f.code === "bad_type"
        ? s.issues.bad_type
        : f.code === "rate_limited"
          ? fill(t.errors.rate_limited, { s: f.retryAfter ?? 30 })
          : t.errors[f.code];
  const fault = (id: string, text: string | null) =>
    setFaults((m) => {
      const next = { ...m };
      if (text) next[id] = text;
      else delete next[id];
      return next;
    });

  async function resend(ids?: string[]) {
    setBusy(ids?.[0] ?? "all");
    const res = await sendLoaLinks(receipt, ids);
    setBusy(null);
    if (!res.ok) {
      fault(ids?.[0] ?? "all", message(res));
      return;
    }
    fault(ids?.[0] ?? "all", null);
    if (ids) setSent((v) => new Set([...v, ...ids]));
    else setSentAll(res.sent);
  }

  async function upload(file: File) {
    const id = picking.current;
    if (!id) return;
    setBusy(id);
    fault(id, null);
    const res = await uploadSignedLoa(receipt, id, file);
    setBusy(null);
    if (res.ok) mark(id, res.mark);
    else fault(id, message(res));
  }

  const day = (at: string) => formatDate(localDay(at), locale);
  const link = (id: string) => (links[id] ? `${localise(MOM_LOA_PATH, locale)}#${links[id]}` : null);

  return (
    <section className="mo-loa" aria-labelledby="mo-loa-t">
      <header className="mo-loa-h">
        <h3 id="mo-loa-t">{c.title}</h3>
        <p className="mo-loa-n" role="status">
          {n === total ? c.allSigned : fill(c.signed, { n, total })}
        </p>
      </header>
      <span className="mf-sum-bar mo-loa-bar" aria-hidden="true">
        <i style={{ inlineSize: `${(n / Math.max(total, 1)) * 100}%` }} />
      </span>
      {batch.demo ? (
        <p className="ma-demo mo-loa-demo">{c.demo}</p>
      ) : unsigned.length ? (
        <div className="mo-loa-all">
          <button type="button" className="btn btn-line btn-sm" disabled={busy !== null} onClick={() => void resend()}>
            {sentAll !== null ? fill(c.sentAll, { n: sentAll }) : fill(c.resendAll, { n: unsigned.length })}
          </button>
          {faults.all ? <FieldError id="mo-loa-all-err">{faults.all}</FieldError> : null}
        </div>
      ) : null}

      <ol className="mo-loa-l">
        {batch.cases.map((x, i) => {
          const m = status[x.id];
          const href = link(x.id);
          return (
            <li key={x.id} className={`mo-loa-r${m ? " is-signed" : ""}`}>
              <span className="mf-qual-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="mo-man-who">
                <b>{x.name}</b>
                <small>
                  <bdi dir="ltr">{x.email}</bdi>
                  {" · "}
                  <bdi dir="ltr">{x.id}</bdi>
                </small>
              </span>
              <span className="mo-loa-st">
                <span className={`mo-loa-chip${m ? " is-on" : ""}`}>
                  {m ? <TickIcon /> : null}
                  {m ? fill(m.by === "upload" ? c.uploaded : c.esigned, { date: day(m.at) }) : c.awaiting}
                </span>
                {m ? <small>{fill(c.report, { date: formatDate(reportDay(localDay(m.at), x.express), locale) })}</small> : null}
              </span>
              {m ? null : (
                <span className="mo-loa-a" role="group" aria-label={fill(c.actions, { name: x.name })}>
                  {batch.demo ? (
                    href ? (
                      <a className="ma-link ma-link-sm" href={href} target="_blank" rel="noopener">
                        {c.open}
                      </a>
                    ) : null
                  ) : (
                    <button type="button" className="ma-link ma-link-sm" disabled={busy !== null || sent.has(x.id)} onClick={() => void resend([x.id])}>
                      {sent.has(x.id) ? c.sent : c.resend}
                    </button>
                  )}
                  <button
                    type="button"
                    className="ma-link ma-link-sm"
                    disabled={busy !== null}
                    aria-describedby={faults[x.id] ? `mo-loa-${x.id}-err` : undefined}
                    onClick={() => {
                      picking.current = x.id;
                      input.current?.click();
                    }}
                  >
                    {busy === x.id ? c.uploading : c.upload}
                  </button>
                  <button type="button" className="ma-link ma-link-sm" onClick={() => (sheet?.id === x.id ? printOnly(sheetRef.current) : setSheet(x))}>
                    {c.print}
                  </button>
                </span>
              )}
              {faults[x.id] ? <FieldError id={`mo-loa-${x.id}-err`}>{faults[x.id]}</FieldError> : null}
            </li>
          );
        })}
      </ol>

      <input
        ref={input}
        type="file"
        className="mo-loa-file"
        accept={FILE_ACCEPT}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void upload(file);
        }}
      />
      <div className="mo-loa-sheet" ref={sheetRef}>
        {sheet ? (
          <>
            <LoaLetter
              draft={{ about: { fullName: sheet.name, passportNo: sheet.passportNo, nationality: sheet.nationality, passType: sheet.passType }, quals: sheet.quals, sign: { name: "" } }}
              s={s}
              locale={locale}
              now=""
              wet
              id="mo-loa-sheet-t"
            />
            <p className="mo-loa-ref">{fillNodes(c.ref, { id: <bdi dir="ltr">{sheet.id}</bdi>, batch: <bdi dir="ltr">{batch.id}</bdi> })}</p>
          </>
        ) : null}
      </div>
    </section>
  );
}
