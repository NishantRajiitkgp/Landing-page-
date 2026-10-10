"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { clock, failureText, fill } from "@/components/momapply/fill";
import { AlertIcon, ArrowIcon, TickIcon } from "@/components/momapply/icons";
import { OtpInput } from "@/components/momapply/OtpInput";
import { FieldError, PasswordField } from "@/components/momapply/PasswordField";
import type { ItalyPartnerCopy } from "@/lib/copy/italyPartner";
import { localise } from "@/lib/i18n/href";
import { italyPartner } from "@/lib/italy/partner/client";
import { DEMO_CODE, DEMO_SEED } from "@/lib/italy/partner/demo";
import { ITALY_PARTNERS_PATH } from "@/lib/italy/paths";
import { isEmail, normalizeEmail } from "@/lib/mom/account/policy";

import { usePartnerSession } from "./usePartnerSession";

type View = "credentials" | "code" | "forgot" | "sent";

const noop = () => () => {};
function presetEmail(): string {
  const raw = new URLSearchParams(window.location.search).get("email") ?? "";
  return isEmail(raw) ? normalizeEmail(raw) : "";
}

export function SignInForm({ t, locale, tabs }: { t: ItalyPartnerCopy; locale: string; tabs: ReactNode }) {
  const router = useRouter();
  const session = usePartnerSession();
  const homeHref = localise(ITALY_PARTNERS_PATH, locale);

  const [view, setView] = useState<View>("credentials");
  const preset = useSyncExternalStore(noop, presetEmail, () => "");
  const [typed, setEmail] = useState<string | null>(null);
  const email = typed ?? preset;
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [challenge, setChallenge] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [left, setLeft] = useState(0);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (session.partner) router.replace(homeHref);
  }, [session.partner, router, homeHref]);

  useEffect(() => {
    if (view !== "code" || left <= 0) return;
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [view, left]);

  function go(next: View) {
    setView(next);
    setAlert(null);
    setSubmitted(false);
    window.requestAnimationFrame(() => titleRef.current?.focus());
  }

  const emailError = !email.trim() ? t.errors.required : isEmail(email) ? null : t.errors.email;
  const passwordError = password ? null : t.errors.required;

  async function start() {
    setSubmitted(true);
    setAlert(null);
    if (emailError || passwordError) {
      document.getElementById(emailError ? "ip-si-email" : "ip-si-password")?.focus();
      return;
    }
    setBusy(true);
    const res = await italyPartner.signIn({ email: normalizeEmail(email), password });
    setBusy(false);
    if (!res.ok) {
      setAlert(failureText(t.errors, res));
      return;
    }
    setChallenge(res.challenge);
    setSentTo(res.sentTo);
    setLeft(res.expiresIn);
    setCode("");
    setCodeError(null);
    go("code");
  }

  async function verify(value: string) {
    setBusy(true);
    setCodeError(null);
    const res = await italyPartner.signInVerify({ challenge, code: value });
    if (res.ok) {
      router.replace(homeHref);
      return;
    }
    setBusy(false);
    setCode("");
    if (res.code === "code_expired") setLeft(0);
    setCodeError(failureText(t.errors, res));
  }

  async function forgot() {
    setSubmitted(true);
    setAlert(null);
    if (emailError) {
      document.getElementById("ip-fp-email")?.focus();
      return;
    }
    setBusy(true);
    const res = await italyPartner.forgotPassword({ email: normalizeEmail(email) });
    setBusy(false);
    if (!res.ok) {
      setAlert(failureText(t.errors, res));
      return;
    }
    setSentTo(res.sentTo);
    go("sent");
  }

  const submitLabel = (label: string) => (
    <button type="submit" className="btn btn-ink ma-submit" disabled={busy}>
      {busy ? <span className="ma-spin ma-spin-light" aria-hidden="true" /> : null}
      {label}
      {busy ? null : <ArrowIcon />}
    </button>
  );

  const alertBox = alert ? (
    <p className="ma-alert" role="alert">
      <AlertIcon />
      {alert}
    </p>
  ) : null;

  const emailField = (id: string) => (
    <div className="ma-field">
      <label className="ma-l" htmlFor={id}>
        {t.signIn.email}
      </label>
      <div className={`ma-ctl${submitted && emailError ? " is-bad" : ""}`}>
        <input
          id={id}
          type="email"
          autoComplete="username"
          inputMode="email"
          dir="ltr"
          placeholder={t.join.emailPlaceholder}
          value={email}
          aria-invalid={submitted && emailError ? true : undefined}
          aria-describedby={submitted && emailError ? `${id}-err` : undefined}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {submitted && emailError ? <FieldError id={`${id}-err`}>{emailError}</FieldError> : null}
    </div>
  );

  return (
    <div className="ma-card ma-card-narrow">
      <div className="ma-head">
        {view === "credentials" ? tabs : <span />}
        {session.demo ? <span className="ma-demo">{fill(t.demo.code, { code: DEMO_CODE })}</span> : null}
      </div>

      {view === "credentials" ? (
        <form
          key="credentials"
          className="ma-view"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void start();
          }}
        >
          <h1 className="ma-title" ref={titleRef} tabIndex={-1}>
            {t.signIn.title}
          </h1>
          {session.demo ? (
            <button
              type="button"
              className="ma-demo-fill"
              onClick={() => {
                setEmail(DEMO_SEED.email);
                setPassword(DEMO_SEED.password);
              }}
            >
              {fill(t.demo.account, { email: DEMO_SEED.email, password: DEMO_SEED.password })}
            </button>
          ) : null}
          {emailField("ip-si-email")}
          <PasswordField
            id="ip-si-password"
            label={t.signIn.password}
            placeholder={t.signIn.passwordPlaceholder}
            value={password}
            onChange={setPassword}
            error={submitted ? passwordError : null}
            t={t.password}
            autoComplete="current-password"
            aside={
              <button type="button" className="ma-link ma-link-sm" onClick={() => go("forgot")}>
                {t.signIn.forgot}
              </button>
            }
          />
          {alertBox}
          {submitLabel(t.signIn.submit)}
        </form>
      ) : null}

      {view === "code" ? (
        <div key="code" className="ma-view">
          <h1 className="ma-title" ref={titleRef} tabIndex={-1}>
            {t.signIn.codeTitle}
          </h1>
          <p className="ma-lede">{fill(t.signIn.codeSent, { to: sentTo })}</p>
          <OtpInput
            id="ip-si-code"
            label={t.verify.code}
            value={code}
            onChange={setCode}
            onComplete={(value) => void verify(value)}
            invalid={Boolean(codeError)}
            disabled={busy || left <= 0}
            describedBy={codeError ? "ip-si-code-err" : undefined}
            autoFocus
          />
          <div className="ma-code-foot">
            {busy ? (
              <span className="ma-mono" role="status">
                <span className="ma-spin" aria-hidden="true" />
                {t.verify.checking}
              </span>
            ) : codeError ? (
              <FieldError id="ip-si-code-err">{codeError}</FieldError>
            ) : left > 0 ? (
              <span className="ma-mono">{fill(t.signIn.expiresIn, { t: clock(left) })}</span>
            ) : (
              <FieldError id="ip-si-code-err">{t.signIn.expired}</FieldError>
            )}
            <button type="button" className="ma-link" disabled={busy} onClick={() => void start()}>
              {t.signIn.resend}
            </button>
          </div>
          <button
            type="button"
            className="ma-back"
            onClick={() => {
              setPassword("");
              go("credentials");
            }}
          >
            {t.signIn.other}
          </button>
        </div>
      ) : null}

      {view === "forgot" ? (
        <form
          key="forgot"
          className="ma-view"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void forgot();
          }}
        >
          <h1 className="ma-title" ref={titleRef} tabIndex={-1}>
            {t.forgot.title}
          </h1>
          <p className="ma-lede">{t.forgot.lede}</p>
          {emailField("ip-fp-email")}
          {alertBox}
          {submitLabel(t.forgot.submit)}
          <button type="button" className="ma-back" onClick={() => go("credentials")}>
            {t.forgot.back}
          </button>
        </form>
      ) : null}

      {view === "sent" ? (
        <div key="sent" className="ma-view">
          <span className="ma-seal" aria-hidden="true">
            <TickIcon />
          </span>
          <h1 className="ma-title" ref={titleRef} tabIndex={-1}>
            {t.forgot.sentTitle}
          </h1>
          <p className="ma-lede">{fill(t.forgot.sent, { to: sentTo })}</p>
          <button type="button" className="btn btn-line ma-submit" onClick={() => go("credentials")}>
            {t.forgot.back}
          </button>
        </div>
      ) : null}
    </div>
  );
}
