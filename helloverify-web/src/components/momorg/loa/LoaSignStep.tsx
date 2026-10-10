"use client";

import { useState, type Ref } from "react";

import { failureText, fillNodes } from "@/components/momapply/fill";
import { TextField } from "@/components/momapply/flow/Fields";
import { LoaLetter } from "@/components/momapply/flow/LoaLetter";
import { AlertIcon, ArrowIcon } from "@/components/momapply/icons";
import { FieldError } from "@/components/momapply/PasswordField";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { FULL_NAME_MAX, signatureMatches, today } from "@/lib/mom/apply/policy";
import type { LoaMark, LoaView } from "@/lib/mom/org/loa";
import { signLoa } from "@/lib/mom/org/loaClient";

/** The letter itself, signed by typing the passport name. */
export function LoaSignStep({
  token,
  proof,
  view,
  t,
  s,
  locale,
  titleRef,
  onSigned,
  onLost,
}: {
  token: string;
  proof: string;
  view: LoaView;
  t: MomOrgCopy;
  s: MomStepsCopy;
  locale: string;
  titleRef: Ref<HTMLHeadingElement>;
  onSigned: (mark: LoaMark) => void;
  onLost: () => void;
}) {
  const l = t.loa;
  const [now] = useState(today);
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [tried, setTried] = useState(false);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);

  const signIssue = !name.trim() ? s.issues.required : signatureMatches(name, view.name) ? null : s.issues.signMatch;
  const signError = signIssue && (tried || touched) ? signIssue : null;
  const agreeError = !agreed && tried ? s.issues.agree : null;

  async function submit() {
    setTried(true);
    setAlert(null);
    if (signIssue || !agreed) {
      document.getElementById(signIssue ? "mo-loa-name" : "mo-loa-agree")?.focus();
      return;
    }
    setBusy(true);
    const res = await signLoa(token, proof, name);
    setBusy(false);
    if (res.ok) return onSigned(res.signed);
    if (res.code === "unverified") return onLost();
    setAlert(failureText(t.errors, res));
  }

  return (
    <form
      className="ma-view"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <h1 className="ma-title" ref={titleRef} tabIndex={-1}>
        {l.signTitle}
      </h1>
      <LoaLetter
        draft={{ about: { fullName: view.name, passportNo: view.passportNo, nationality: view.nationality, passType: view.passType }, quals: view.quals, sign: { name } }}
        s={s}
        locale={locale}
        now={now}
      />
      <div className="mf-sign">
        <TextField
          id="mo-loa-name"
          label={s.review.sign}
          value={name}
          autoComplete="off"
          spellCheck={false}
          maxLength={FULL_NAME_MAX}
          hint={fillNodes(s.review.signHint, { name: <b>{view.name}</b> })}
          error={signError}
          onChange={setName}
          onBlur={() => setTouched(true)}
        />
        <div className="ma-field">
          <label className={`ma-check${agreeError ? " is-bad" : ""}`}>
            <input
              id="mo-loa-agree"
              type="checkbox"
              checked={agreed}
              aria-invalid={agreeError ? true : undefined}
              aria-describedby={agreeError ? "mo-loa-agree-err" : undefined}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>{l.agree}</span>
          </label>
          {agreeError ? <FieldError id="mo-loa-agree-err">{agreeError}</FieldError> : null}
        </div>
      </div>
      {alert ? (
        <p className="ma-alert" role="alert">
          <AlertIcon />
          {alert}
        </p>
      ) : null}
      <button type="submit" className="btn btn-ink ma-submit" disabled={busy}>
        {busy ? <span className="ma-spin ma-spin-light" aria-hidden="true" /> : null}
        {l.submit}
        {busy ? null : <ArrowIcon />}
      </button>
    </form>
  );
}
