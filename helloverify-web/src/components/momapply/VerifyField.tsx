"use client";

import type { ReactNode } from "react";

import type { MomApplyCopy } from "@/lib/copy/momApply";

import { fill } from "./fill";
import { TickIcon } from "./icons";
import { OtpInput } from "./OtpInput";
import { FieldError } from "./PasswordField";
import type { Verification } from "./useVerification";

/** A field that proves itself in place: Verify sits inside the control, the
 *  code opens underneath and checks itself on the sixth digit. */
export function VerifyField({
  id,
  label,
  t,
  v,
  error,
  sentTo,
  onSend,
  onVerify,
  duplicateAction,
  children,
}: {
  id: string;
  label: string;
  t: MomApplyCopy["verify"];
  v: Verification;
  error: string | null;
  sentTo: string;
  onSend: () => void;
  onVerify: (code: string) => void;
  duplicateAction?: ReactNode;
  children: ReactNode;
}) {
  const open = v.status === "sent" || v.status === "checking";
  const shownError = open ? null : (v.error ?? error);

  return (
    <div className="ma-field">
      <label className="ma-l" htmlFor={id}>
        {label}
      </label>
      <div
        className={[
          "ma-ctl",
          v.status === "verified" ? "is-ok" : "",
          v.status !== "idle" && v.status !== "sending" ? "is-locked" : "",
          shownError ? "is-bad" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
        {v.status === "verified" ? (
          <span className="ma-ok" aria-live="polite">
            <TickIcon />
            <span className="ma-ok-t">{t.verified}</span>
          </span>
        ) : null}
        {v.status === "idle" || v.status === "sending" ? (
          <button type="button" className="ma-act" disabled={v.status === "sending"} onClick={onSend}>
            {v.status === "sending" ? <span className="ma-spin" aria-hidden="true" /> : null}
            {t.send}
          </button>
        ) : (
          <button type="button" className="ma-change" onClick={v.reset}>
            {t.change}
          </button>
        )}
      </div>

      {open ? (
        <div className="ma-code" role="group" aria-labelledby={`${id}-sent`}>
          <p className="ma-code-top" id={`${id}-sent`} aria-live="polite">
            {fill(t.sentTo, { to: sentTo })}
          </p>
          <OtpInput
            id={`${id}-code`}
            label={t.code}
            value={v.code}
            onChange={v.setCode}
            onComplete={onVerify}
            invalid={Boolean(v.error)}
            disabled={v.status === "checking"}
            describedBy={v.error ? `${id}-code-err` : undefined}
            autoFocus
          />
          <div className="ma-code-foot">
            {v.status === "checking" ? (
              <span className="ma-mono" role="status">
                <span className="ma-spin" aria-hidden="true" />
                {t.checking}
              </span>
            ) : v.error ? (
              <FieldError id={`${id}-code-err`}>{v.error}</FieldError>
            ) : (
              <span />
            )}
            {v.cooldown > 0 ? (
              <span className="ma-mono">{fill(t.resendIn, { s: v.cooldown })}</span>
            ) : (
              <button type="button" className="ma-link" onClick={onSend}>
                {t.resend}
              </button>
            )}
          </div>
        </div>
      ) : null}

      {shownError ? (
        <FieldError id={`${id}-err`}>
          {shownError}
          {v.duplicate && duplicateAction ? <> {duplicateAction}</> : null}
        </FieldError>
      ) : null}
    </div>
  );
}
