"use client";

import type { Ref } from "react";

import { clock, fill } from "./fill";
import { OtpInput } from "./OtpInput";
import { FieldError } from "./PasswordField";
import type { SignInCopy } from "./SignInPanel";

/** The second sign-in screen: the emailed code, its clock, resend. */
export function SignInCode({
  t,
  titleRef,
  sentTo,
  code,
  onCode,
  onComplete,
  error,
  busy,
  left,
  onResend,
  onOther,
}: {
  t: SignInCopy;
  titleRef: Ref<HTMLHeadingElement>;
  sentTo: string;
  code: string;
  onCode: (code: string) => void;
  onComplete: (code: string) => void;
  error: string | null;
  busy: boolean;
  left: number;
  onResend: () => void;
  onOther: () => void;
}) {
  return (
    <div className="ma-view">
      <h1 className="ma-title" ref={titleRef} tabIndex={-1}>
        {t.signIn.codeTitle}
      </h1>
      <p className="ma-lede">{fill(t.signIn.codeSent, { to: sentTo })}</p>
      <OtpInput
        id="ma-si-code"
        label={t.verify.code}
        value={code}
        onChange={onCode}
        onComplete={onComplete}
        invalid={Boolean(error)}
        disabled={busy || left <= 0}
        describedBy={error ? "ma-si-code-err" : undefined}
        autoFocus
      />
      <div className="ma-code-foot">
        {busy ? (
          <span className="ma-mono" role="status">
            <span className="ma-spin" aria-hidden="true" />
            {t.verify.checking}
          </span>
        ) : error ? (
          <FieldError id="ma-si-code-err">{error}</FieldError>
        ) : left > 0 ? (
          <span className="ma-mono">{fill(t.signIn.expiresIn, { t: clock(left) })}</span>
        ) : (
          <FieldError id="ma-si-code-err">{t.signIn.expired}</FieldError>
        )}
        <button type="button" className="ma-link" disabled={busy} onClick={onResend}>
          {t.signIn.resend}
        </button>
      </div>
      <button type="button" className="ma-back" onClick={onOther}>
        {t.signIn.other}
      </button>
    </div>
  );
}
