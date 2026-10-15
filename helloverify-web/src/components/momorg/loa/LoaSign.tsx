"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { clock, failureText, fill, fillNodes } from "@/components/momapply/fill";
import { formatDate, localDay } from "@/components/momapply/flow/format";
import { AlertIcon, ArrowIcon, TickIcon } from "@/components/momapply/icons";
import { OtpInput } from "@/components/momapply/OtpInput";
import { FieldError } from "@/components/momapply/PasswordField";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { DEMO_CODE } from "@/lib/mom/account/demo";
import type { AccountFailure } from "@/lib/mom/account/types";
import { reportDay } from "@/lib/mom/apply/policy";
import { LOA_TOKEN_RE, type LoaMark, type LoaView } from "@/lib/mom/org/loa";
import { openLoa, sendLoaCode, verifyLoaCode } from "@/lib/mom/org/loaClient";

import { LoaDetails } from "./LoaDetails";
import { LoaSignStep } from "./LoaSignStep";

type Step = "confirm" | "code" | "check" | "sign";
type Opened = { token: string; demo: boolean; view: LoaView } | { token: string; fail: AccountFailure };

const onHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const readHash = () => window.location.hash.slice(1);

/** The candidate's side of an employer's batch: prove the email is theirs,
 *  check what the letter names, sign it. The link's token is the fragment. */
export function LoaSign({ t, s, locale }: { t: MomOrgCopy; s: MomStepsCopy; locale: string }) {
  const token = useSyncExternalStore(onHash, readHash, () => null);
  const valid = token !== null && LOA_TOKEN_RE.test(token);
  const [opened, setOpened] = useState<Opened | null>(null);
  const [step, setStep] = useState<Step>("confirm");
  const [signed, setSigned] = useState<LoaMark | null>(null);
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState("");
  const [left, setLeft] = useState(0);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [proof, setProof] = useState("");
  const [wrong, setWrong] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const l = t.loa;

  useEffect(() => {
    if (!valid || token === null) return;
    let live = true;
    void openLoa(token).then((res) => {
      if (live) setOpened(res.ok ? { token, demo: res.demo, view: res.view } : { token, fail: res });
    });
    return () => {
      live = false;
    };
  }, [token, valid]);

  useEffect(() => {
    if (step !== "code" || left <= 0) return;
    const id = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [step, left]);

  const current = opened && opened.token === token ? opened : null;

  if (token === null || (valid && !current)) {
    return (
      <p className="ma-loading" role="status">
        <span className="ma-spin" aria-hidden="true" />
        {t.apply.loading}
      </p>
    );
  }
  if (!current || "fail" in current) {
    const expired = !current || current.fail.code === "invalid_input";
    return (
      <div className="ma-card ma-card-narrow">
        <div className="ma-view">
          <h1 className="ma-title">{expired ? l.badTitle : t.errors.upstream}</h1>
          <p className="ma-lede">{expired ? l.bad : current ? failureText(t.errors, current.fail) : null}</p>
        </div>
      </div>
    );
  }

  const { view, demo, token: link } = current;
  const done = signed ?? view.signed;
  const org = <b>{view.org}</b>;

  function go(next: Step) {
    setStep(next);
    setAlert(null);
    window.requestAnimationFrame(() => titleRef.current?.focus());
  }

  async function send() {
    setBusy(true);
    setAlert(null);
    const res = await sendLoaCode(link);
    setBusy(false);
    if (!res.ok) {
      setAlert(failureText(t.errors, res));
      return;
    }
    setSentTo(res.sentTo);
    setLeft(res.expiresIn);
    setCode("");
    setCodeError(null);
    if (step !== "code") go("code");
  }

  async function verify(value: string) {
    setBusy(true);
    setCodeError(null);
    const res = await verifyLoaCode(link, value);
    setBusy(false);
    if (res.ok) {
      setProof(res.proof);
      setOpened((prev) =>
        prev && !("fail" in prev) && prev.token === token
          ? { ...prev, view: { ...prev.view, passportNo: res.passportNo, dob: res.dob } }
          : prev,
      );
      go("check");
      return;
    }
    setCode("");
    setCodeError(failureText(t.errors, res));
  }

  const at = done ? l.steps.length : step === "sign" ? 2 : step === "check" ? 1 : 0;

  return (
    <div className="ma-card mo-sign">
      <div className="ma-head">
        <ol className="mo-sign-steps">
          {l.steps.map((label, i) => (
            <li key={label} className={i < at ? "is-done" : i === at ? "is-now" : undefined} aria-current={i === at ? "step" : undefined}>
              <span aria-hidden="true">{i < at ? <TickIcon /> : i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        {demo && !done ? <span className="ma-demo">{fill(t.demo.code, { code: DEMO_CODE })}</span> : null}
      </div>
      <p className="k mo-sign-k">{fillNodes(l.from, { org: <bdi>{view.org}</bdi> })}</p>

      {done ? (
        <div key="done" className="ma-view">
          <span className="ma-seal" aria-hidden="true">
            <TickIcon />
          </span>
          <h1 className="ma-title" ref={titleRef} tabIndex={-1}>
            {l.doneTitle}
          </h1>
          <p className="ma-lede">
            {signed
              ? fillNodes(l.doneLede, { org })
              : fillNodes(done.by === "upload" ? l.uploaded : l.already, { org, date: formatDate(localDay(done.at), locale) })}
          </p>
          <div className="mo-sign-done">
            <p className="k">{l.case}</p>
            <p className="mo-sign-id">
              <bdi dir="ltr">{view.id}</bdi>
            </p>
            <p className="ma-mono">{fill(l.eta, { date: formatDate(reportDay(localDay(done.at), view.express), locale) })}</p>
          </div>
        </div>
      ) : step === "confirm" ? (
        <div key="confirm" className="ma-view">
          <h1 className="ma-title" ref={titleRef} tabIndex={-1}>
            {l.confirmTitle}
          </h1>
          <p className="ma-lede">{fillNodes(l.confirmLede, { org, to: <bdi dir="ltr">{view.sentTo}</bdi> })}</p>
          {alert ? (
            <p className="ma-alert" role="alert">
              <AlertIcon />
              {alert}
            </p>
          ) : null}
          <button type="button" className="btn btn-ink ma-submit" disabled={busy} onClick={() => void send()}>
            {busy ? <span className="ma-spin ma-spin-light" aria-hidden="true" /> : null}
            {l.send}
            {busy ? null : <ArrowIcon />}
          </button>
        </div>
      ) : step === "code" ? (
        <div key="code" className="ma-view">
          <h1 className="ma-title" ref={titleRef} tabIndex={-1}>
            {t.signIn.codeTitle}
          </h1>
          <p className="ma-lede">{fillNodes(t.signIn.codeSent, { to: <bdi dir="ltr">{sentTo}</bdi> })}</p>
          <OtpInput
            id="mo-loa-code"
            label={t.verify.code}
            value={code}
            onChange={setCode}
            onComplete={(v) => void verify(v)}
            invalid={Boolean(codeError)}
            disabled={busy || left <= 0}
            describedBy={codeError ? "mo-loa-code-err" : undefined}
            autoFocus
          />
          <div className="ma-code-foot">
            {busy ? (
              <span className="ma-mono" role="status">
                <span className="ma-spin" aria-hidden="true" />
                {t.verify.checking}
              </span>
            ) : codeError ? (
              <FieldError id="mo-loa-code-err">{codeError}</FieldError>
            ) : left > 0 ? (
              <span className="ma-mono">{fill(t.signIn.expiresIn, { t: clock(left) })}</span>
            ) : (
              <FieldError id="mo-loa-code-err">{t.signIn.expired}</FieldError>
            )}
            <button type="button" className="ma-link" disabled={busy} onClick={() => void send()}>
              {t.signIn.resend}
            </button>
          </div>
          {alert ? (
            <p className="ma-alert" role="alert">
              <AlertIcon />
              {alert}
            </p>
          ) : null}
        </div>
      ) : step === "check" ? (
        <div key="check" className="ma-view">
          <h1 className="ma-title" ref={titleRef} tabIndex={-1}>
            {l.checkTitle}
          </h1>
          <p className="ma-lede">{l.checkLede}</p>
          <LoaDetails view={view} s={s} locale={locale} />
          {wrong ? (
            <p className="ma-alert" role="status">
              <AlertIcon />
              <span>{fillNodes(l.wrongNote, { org })}</span>
            </p>
          ) : null}
          <button type="button" className="btn btn-ink ma-submit" onClick={() => go("sign")}>
            {l.right}
            <ArrowIcon />
          </button>
          {wrong ? null : (
            <button type="button" className="ma-back" onClick={() => setWrong(true)}>
              {l.wrong}
            </button>
          )}
        </div>
      ) : (
        <LoaSignStep key="sign" token={link} proof={proof} view={view} t={t} s={s} locale={locale} titleRef={titleRef} onSigned={setSigned} onLost={() => go("confirm")} />
      )}
    </div>
  );
}
