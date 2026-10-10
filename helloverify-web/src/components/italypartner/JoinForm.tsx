"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { ConsentField } from "@/components/momapply/ConsentField";
import { DialSelect } from "@/components/momapply/DialSelect";
import { failureText, fill } from "@/components/momapply/fill";
import { AlertIcon, ArrowIcon } from "@/components/momapply/icons";
import { FieldError, PasswordField } from "@/components/momapply/PasswordField";
import { VerifyField } from "@/components/momapply/VerifyField";
import type { ItalyPartnerCopy } from "@/lib/copy/italyPartner";
import { localise } from "@/lib/i18n/href";
import { italyPartner } from "@/lib/italy/partner/client";
import { DEMO_CODE } from "@/lib/italy/partner/demo";
import { ITALY_PARTNERS_PATH, ITALY_SIGN_IN_PATH } from "@/lib/italy/paths";
import { DEFAULT_DIAL } from "@/lib/leads/dial-codes";
import {
  isEmail,
  isName,
  isPhone,
  isStrongPassword,
  maskEmail,
  maskPhone,
  NAME_MAX,
  normalizeEmail,
  normalizeName,
  PHONE_MAX,
} from "@/lib/mom/account/policy";

import { usePartnerSession } from "./usePartnerSession";
import { usePartnerVerification } from "./usePartnerVerification";

const FIELDS = ["first", "last", "email", "phone", "password", "consent"] as const;
type Field = (typeof FIELDS)[number];
const SILENT_UNTIL_SUBMIT = new Set<Field>(["consent"]);

function nationalDigits(raw: string, dial: string): string {
  const dialDigits = dial.replace(/\D/g, "");
  let digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+") && digits.startsWith(dialDigits)) digits = digits.slice(dialDigits.length);
  return digits.slice(0, PHONE_MAX);
}

export function JoinForm({ t, locale, tabs }: { t: ItalyPartnerCopy; locale: string; tabs: ReactNode }) {
  const router = useRouter();
  const session = usePartnerSession();
  const homeHref = localise(ITALY_PARTNERS_PATH, locale);

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [dial, setDial] = useState(DEFAULT_DIAL);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const ev = usePartnerVerification(t.errors);
  const pv = usePartnerVerification(t.errors);

  useEffect(() => {
    if (session.partner) router.replace(homeHref);
  }, [session.partner, router, homeHref]);

  const name = `${normalizeName(first)} ${normalizeName(last)}`;
  const nameError = (v: string) => (isName(v) ? null : v.trim() ? t.errors.name : t.errors.required);
  const errs: Record<Field, string | null> = {
    first: nameError(first),
    last: nameError(last),
    email: !email.trim() ? t.errors.required : !isEmail(email) ? t.errors.email : ev.status !== "verified" ? t.errors.verifyEmail : null,
    phone: !phone ? t.errors.required : !isPhone(phone) ? t.errors.phone : pv.status !== "verified" ? t.errors.verifyPhone : null,
    password: isStrongPassword(password) ? null : password ? t.errors.password : t.errors.required,
    consent: consent ? null : t.errors.consent,
  };
  const pending = (f: Field) =>
    (f === "email" && isEmail(email) && ev.status !== "verified") || (f === "phone" && isPhone(phone) && pv.status !== "verified");
  const shown = (f: Field) => {
    if (submitted) return errs[f];
    if (!touched[f] || SILENT_UNTIL_SUBMIT.has(f) || pending(f)) return null;
    return errs[f];
  };
  const touch = (f: Field) => setTouched((s) => ({ ...s, [f]: true }));

  function sendEmail() {
    if (errs.first || errs.last) {
      setTouched((s) => ({ ...s, first: true, last: true }));
      ev.setError(t.errors.nameFirst);
      return;
    }
    if (!isEmail(email)) return touch("email");
    void ev.send({ channel: "email", email: normalizeEmail(email), name });
  }

  function sendPhone() {
    if (errs.first || errs.last) {
      setTouched((s) => ({ ...s, first: true, last: true }));
      pv.setError(t.errors.nameFirst);
      return;
    }
    if (!isPhone(phone)) return touch("phone");
    void pv.send({ channel: "phone", dial, phone, name });
  }

  async function submit() {
    setSubmitted(true);
    setAlert(null);
    const bad = FIELDS.find((f) => errs[f]);
    if (bad) {
      document.getElementById(`ip-${bad}`)?.focus();
      return;
    }
    setBusy(true);
    const res = await italyPartner.register({
      first: normalizeName(first),
      last: normalizeName(last),
      email: normalizeEmail(email),
      dial,
      phone,
      password,
      consent: true,
      emailProof: ev.proof,
      phoneProof: pv.proof,
    });
    if (res.ok) {
      router.replace(homeHref);
      return;
    }
    setBusy(false);
    if (res.code === "duplicate") ev.invalidate(t.errors.duplicate, true);
    else if (res.code === "unverified") (res.field === "phone" ? pv : ev).invalidate(t.errors.unverified);
    else setAlert(failureText(t.errors, res));
  }

  const signInHref = `${localise(ITALY_SIGN_IN_PATH, locale)}?email=${encodeURIComponent(normalizeEmail(email))}`;

  return (
    <div className="ma-card">
      <div className="ma-head">
        {tabs}
        {session.demo ? <span className="ma-demo">{fill(t.demo.code, { code: DEMO_CODE })}</span> : null}
      </div>
      <h1 className="ma-title">{t.join.title}</h1>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <div className="ma-row2">
          {(["first", "last"] as const).map((f) => (
            <div className="ma-field" key={f}>
              <label className="ma-l" htmlFor={`ip-${f}`}>
                {t.join[f]}
              </label>
              <div className={`ma-ctl${shown(f) ? " is-bad" : ""}`}>
                <input
                  id={`ip-${f}`}
                  autoComplete={f === "first" ? "given-name" : "family-name"}
                  maxLength={NAME_MAX}
                  placeholder={t.join.namePlaceholder}
                  value={f === "first" ? first : last}
                  aria-invalid={shown(f) ? true : undefined}
                  aria-describedby={shown(f) ? `ip-${f}-err` : undefined}
                  onChange={(e) => (f === "first" ? setFirst : setLast)(e.target.value)}
                  onBlur={() => touch(f)}
                />
              </div>
              {shown(f) ? <FieldError id={`ip-${f}-err`}>{shown(f)}</FieldError> : null}
            </div>
          ))}
        </div>

        <VerifyField
          id="ip-email"
          label={t.join.email}
          t={t.verify}
          v={ev}
          error={shown("email")}
          sentTo={maskEmail(normalizeEmail(email))}
          onSend={sendEmail}
          onVerify={(code) =>
            void ev.verify({ channel: "email", email: normalizeEmail(email), code }).then((ok) => {
              if (ok) document.getElementById("ip-phone")?.focus();
            })
          }
          duplicateAction={
            <Link className="ma-link" href={signInHref}>
              {t.errors.duplicateAction}
            </Link>
          }
        >
          <input
            id="ip-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            dir="ltr"
            placeholder={t.join.emailPlaceholder}
            value={email}
            readOnly={ev.status !== "idle" && ev.status !== "sending"}
            aria-invalid={shown("email") ? true : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              if (ev.error) ev.setError(null);
            }}
            onBlur={() => touch("email")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && ev.status === "idle") {
                e.preventDefault();
                sendEmail();
              }
            }}
          />
        </VerifyField>

        <VerifyField
          id="ip-phone"
          label={t.join.phone}
          t={t.verify}
          v={pv}
          error={shown("phone")}
          sentTo={maskPhone(dial, phone)}
          onSend={sendPhone}
          onVerify={(code) =>
            void pv.verify({ channel: "phone", dial, phone, code }).then((ok) => {
              if (ok) document.getElementById("ip-password")?.focus();
            })
          }
        >
          <DialSelect value={dial} onChange={setDial} label={t.join.dial} disabled={pv.status !== "idle"} />
          <input
            id="ip-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            dir="ltr"
            placeholder={t.join.phonePlaceholder}
            value={phone}
            readOnly={pv.status !== "idle" && pv.status !== "sending"}
            aria-invalid={shown("phone") ? true : undefined}
            onChange={(e) => {
              setPhone(nationalDigits(e.target.value, dial));
              if (pv.error) pv.setError(null);
            }}
            onBlur={() => touch("phone")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && pv.status === "idle") {
                e.preventDefault();
                sendPhone();
              }
            }}
          />
        </VerifyField>

        <PasswordField
          id="ip-password"
          label={t.join.password}
          placeholder={t.join.passwordPlaceholder}
          value={password}
          onChange={setPassword}
          onBlur={() => touch("password")}
          error={shown("password")}
          t={t.password}
          autoComplete="new-password"
          rules
        />

        <ConsentField t={t.join} locale={locale} checked={consent} onChange={setConsent} error={shown("consent")} />

        {alert ? (
          <p className="ma-alert" role="alert">
            <AlertIcon />
            {alert}
          </p>
        ) : null}

        <button type="submit" className="btn btn-ink ma-submit" disabled={busy}>
          {busy ? <span className="ma-spin ma-spin-light" aria-hidden="true" /> : null}
          {t.join.submit}
          {busy ? null : <ArrowIcon />}
        </button>
        <p className="ma-lede">
          {t.join.call}{" "}
          <a className="ma-link" href={`tel:${t.join.tel}`} dir="ltr">
            {t.join.phoneDisplay}
          </a>
        </p>
      </form>
    </div>
  );
}
