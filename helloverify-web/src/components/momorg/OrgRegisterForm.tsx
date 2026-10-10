"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";

import { ConsentField } from "@/components/momapply/ConsentField";
import { DialSelect } from "@/components/momapply/DialSelect";
import { failureText, fill } from "@/components/momapply/fill";
import { AlertIcon, ArrowIcon } from "@/components/momapply/icons";
import { FieldError, PasswordField } from "@/components/momapply/PasswordField";
import { useVerification } from "@/components/momapply/useVerification";
import { VerifyField } from "@/components/momapply/VerifyField";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import { localise } from "@/lib/i18n/href";
import { DEFAULT_DIAL } from "@/lib/leads/dial-codes";
import { isEmail, isName, isPhone, isStrongPassword, maskEmail, maskPhone, NAME_MAX, normalizeEmail, normalizeName, PHONE_MAX } from "@/lib/mom/account/policy";
import { momOrg } from "@/lib/mom/org/client";
import { DEMO_CODE } from "@/lib/mom/org/demo";
import { isOrgName, isRegNo, tidy } from "@/lib/mom/org/policy";
import type { OrgKind } from "@/lib/mom/org/types";
import { MOM_ORG_PATH, MOM_ORG_SIGN_IN_PATH, MOM_REGISTER_PATH } from "@/lib/mom/paths";

import { OrgFields } from "./OrgFields";
import { useOrgSession } from "./useOrgSession";

const FIELDS = ["org", "reg", "kind", "first", "last", "email", "phone", "password", "consent"] as const;
type Field = (typeof FIELDS)[number];
const SILENT_UNTIL_SUBMIT = new Set<Field>(["consent", "kind"]);
const focusId = (f: Field) => (f === "consent" ? "ma-consent" : `mo-${f}`);

function nationalDigits(raw: string, dial: string): string {
  const dialDigits = dial.replace(/\D/g, "");
  let digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+") && digits.startsWith(dialDigits)) digits = digits.slice(dialDigits.length);
  return digits.slice(0, PHONE_MAX);
}

export function OrgRegisterForm({ t, locale, tabs }: { t: MomOrgCopy; locale: string; tabs: ReactNode }) {
  const router = useRouter();
  const session = useOrgSession();
  const homeHref = localise(MOM_ORG_PATH, locale);

  const [org, setOrg] = useState("");
  const [reg, setReg] = useState("");
  const [kind, setKind] = useState<OrgKind | null>(null);
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
  const ev = useVerification(t.errors, momOrg);
  const pv = useVerification(t.errors, momOrg);

  useEffect(() => {
    if (session.user) router.replace(homeHref);
  }, [session.user, router, homeHref]);

  const name = `${normalizeName(first)} ${normalizeName(last)}`;
  const nameError = (v: string) => (isName(v) ? null : v.trim() ? t.errors.name : t.errors.required);
  const errs: Record<Field, string | null> = {
    org: isOrgName(org) ? null : org.trim() ? t.errors.org : t.errors.required,
    reg: isRegNo(reg) ? null : t.errors.reg,
    kind: kind ? null : t.errors.required,
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

  function needName(v: typeof ev): boolean {
    if (!errs.first && !errs.last) return false;
    setTouched((s) => ({ ...s, first: true, last: true }));
    v.setError(t.errors.nameFirst);
    return true;
  }

  function sendEmail() {
    if (needName(ev)) return;
    if (!isEmail(email)) return touch("email");
    void ev.send({ channel: "email", email: normalizeEmail(email), name });
  }

  function sendPhone() {
    if (needName(pv)) return;
    if (!isPhone(phone)) return touch("phone");
    void pv.send({ channel: "phone", dial, phone, name });
  }

  async function submit() {
    setSubmitted(true);
    setAlert(null);
    const bad = FIELDS.find((f) => errs[f]);
    if (bad || !kind) {
      document.getElementById(focusId(bad ?? "kind"))?.focus();
      return;
    }
    setBusy(true);
    const res = await momOrg.register({
      org: tidy(org),
      reg: tidy(reg),
      kind,
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

  const signInHref = `${localise(MOM_ORG_SIGN_IN_PATH, locale)}?email=${encodeURIComponent(normalizeEmail(email))}`;
  const enter = (v: typeof ev, send: () => void) => (e: KeyboardEvent) => {
    if (e.key === "Enter" && v.status === "idle") {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="ma-card">
      <div className="ma-head">
        {tabs}
        {session.demo ? <span className="ma-demo">{fill(t.demo.code, { code: DEMO_CODE })}</span> : null}
      </div>
      <h1 className="ma-title">{t.register.title}</h1>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <OrgFields t={t.register} org={org} reg={reg} kind={kind} onOrg={setOrg} onReg={setReg} onKind={setKind} shown={shown} touch={touch} />

        <div className="ma-row2">
          {(["first", "last"] as const).map((f) => (
            <div className="ma-field" key={f}>
              <label className="ma-l" htmlFor={`mo-${f}`}>
                {t.register[f]}
              </label>
              <div className={`ma-ctl${shown(f) ? " is-bad" : ""}`}>
                <input
                  id={`mo-${f}`}
                  autoComplete={f === "first" ? "given-name" : "family-name"}
                  maxLength={NAME_MAX}
                  placeholder={t.register.namePlaceholder}
                  value={f === "first" ? first : last}
                  aria-invalid={shown(f) ? true : undefined}
                  aria-describedby={shown(f) ? `mo-${f}-err` : undefined}
                  onChange={(e) => (f === "first" ? setFirst : setLast)(e.target.value)}
                  onBlur={() => touch(f)}
                />
              </div>
              {shown(f) ? <FieldError id={`mo-${f}-err`}>{shown(f)}</FieldError> : null}
            </div>
          ))}
        </div>

        <VerifyField
          id="mo-email"
          label={t.register.email}
          t={t.verify}
          v={ev}
          error={shown("email")}
          sentTo={maskEmail(normalizeEmail(email))}
          onSend={sendEmail}
          onVerify={(code) =>
            void ev.verify({ channel: "email", email: normalizeEmail(email), code }).then((ok) => {
              if (ok) document.getElementById("mo-phone")?.focus();
            })
          }
          duplicateAction={
            <Link className="ma-link" href={signInHref}>
              {t.errors.duplicateAction}
            </Link>
          }
        >
          <input
            id="mo-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            dir="ltr"
            placeholder={t.register.emailPlaceholder}
            value={email}
            readOnly={ev.status !== "idle" && ev.status !== "sending"}
            aria-invalid={shown("email") ? true : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              if (ev.error) ev.setError(null);
            }}
            onBlur={() => touch("email")}
            onKeyDown={enter(ev, sendEmail)}
          />
        </VerifyField>

        <VerifyField
          id="mo-phone"
          label={t.register.phone}
          t={t.verify}
          v={pv}
          error={shown("phone")}
          sentTo={maskPhone(dial, phone)}
          onSend={sendPhone}
          onVerify={(code) =>
            void pv.verify({ channel: "phone", dial, phone, code }).then((ok) => {
              if (ok) document.getElementById("mo-password")?.focus();
            })
          }
        >
          <DialSelect value={dial} onChange={setDial} label={t.register.dial} disabled={pv.status !== "idle"} />
          <input
            id="mo-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            dir="ltr"
            placeholder={t.register.phonePlaceholder}
            value={phone}
            readOnly={pv.status !== "idle" && pv.status !== "sending"}
            aria-invalid={shown("phone") ? true : undefined}
            onChange={(e) => {
              setPhone(nationalDigits(e.target.value, dial));
              if (pv.error) pv.setError(null);
            }}
            onBlur={() => touch("phone")}
            onKeyDown={enter(pv, sendPhone)}
          />
        </VerifyField>

        <PasswordField
          id="mo-password"
          label={t.register.password}
          placeholder={t.register.passwordPlaceholder}
          value={password}
          onChange={setPassword}
          onBlur={() => touch("password")}
          error={shown("password")}
          t={t.password}
          autoComplete="new-password"
          rules
        />

        <ConsentField t={t.register} locale={locale} checked={consent} onChange={setConsent} error={shown("consent")} />

        {alert ? (
          <p className="ma-alert" role="alert">
            <AlertIcon />
            {alert}
          </p>
        ) : null}

        <button type="submit" className="btn btn-ink ma-submit" disabled={busy}>
          {busy ? <span className="ma-spin ma-spin-light" aria-hidden="true" /> : null}
          {t.register.submit}
          {busy ? null : <ArrowIcon />}
        </button>
        <p className="ma-lede">
          {t.register.solo}{" "}
          <Link className="ma-link" href={localise(MOM_REGISTER_PATH, locale)}>
            {t.register.soloLink}
          </Link>
        </p>
      </form>
    </div>
  );
}
