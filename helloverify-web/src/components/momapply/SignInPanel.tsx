"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import type { MomApplyCopy } from "@/lib/copy/momApply";
import { DEMO_CODE } from "@/lib/mom/account/demo";
import { isEmail, normalizeEmail } from "@/lib/mom/account/policy";
import type { AccountResult, ForgotBody, SignInBody, SignInVerifyBody } from "@/lib/mom/account/types";

import { failureText, fill } from "./fill";
import { AlertIcon, ArrowIcon, TickIcon } from "./icons";
import { FieldError, PasswordField } from "./PasswordField";
import { SignInCode } from "./SignInCode";

type View = "credentials" | "code" | "forgot" | "sent";

export type SignInCopy = Pick<MomApplyCopy, "signIn" | "forgot" | "verify" | "demo" | "errors" | "password"> & {
  register: Pick<MomApplyCopy["register"], "emailPlaceholder">;
};

export type SignInApi = {
  signIn: (body: SignInBody) => Promise<AccountResult<{ challenge: string; sentTo: string; expiresIn: number }>>;
  signInVerify: (body: SignInVerifyBody) => Promise<AccountResult>;
  forgotPassword: (body: ForgotBody) => Promise<AccountResult<{ sentTo: string }>>;
};

const noop = () => () => {};
/** `?email=` from "already registered? Sign in" on the register page. */
function presetEmail(): string {
  const raw = new URLSearchParams(window.location.search).get("email") ?? "";
  return isEmail(raw) ? normalizeEmail(raw) : "";
}

/** Password, then an emailed code. `home` is where a signed-in visitor lands. */
export function SignInPanel({
  t,
  tabs,
  api,
  signedIn,
  demo,
  seed,
  home,
}: {
  t: SignInCopy;
  tabs: ReactNode;
  api: SignInApi;
  signedIn: boolean;
  demo: boolean;
  seed: { email: string; password: string };
  home: string;
}) {
  const router = useRouter();
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
    if (signedIn) router.replace(home);
  }, [signedIn, router, home]);

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
      document.getElementById(emailError ? "ma-si-email" : "ma-si-password")?.focus();
      return;
    }
    setBusy(true);
    const res = await api.signIn({ email: normalizeEmail(email), password });
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
    const res = await api.signInVerify({ challenge, code: value });
    if (res.ok) {
      router.replace(home);
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
      document.getElementById("ma-fp-email")?.focus();
      return;
    }
    setBusy(true);
    const res = await api.forgotPassword({ email: normalizeEmail(email) });
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
          placeholder={t.register.emailPlaceholder}
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
        {demo ? <span className="ma-demo">{fill(t.demo.code, { code: DEMO_CODE })}</span> : null}
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
          {demo ? (
            <button
              type="button"
              className="ma-demo-fill"
              onClick={() => {
                setEmail(seed.email);
                setPassword(seed.password);
              }}
            >
              {fill(t.demo.account, { email: seed.email, password: seed.password })}
            </button>
          ) : null}
          {emailField("ma-si-email")}
          <PasswordField
            id="ma-si-password"
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
        <SignInCode
          key="code"
          t={t}
          titleRef={titleRef}
          sentTo={sentTo}
          code={code}
          onCode={setCode}
          onComplete={(value) => void verify(value)}
          error={codeError}
          busy={busy}
          left={left}
          onResend={() => void start()}
          onOther={() => {
            setPassword("");
            go("credentials");
          }}
        />
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
          {emailField("ma-fp-email")}
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
