"use client";
// Client for `useActionState` and the timing signal, as `forms/ContactForm`.
// Validation before submit is the browser's own, from the same limits the
// server schema is built from.

import { useActionState, useEffect, useRef, type ReactNode } from "react";

import { submitPartner } from "@/app/[locale]/partner-with-us/actions";
import { Tick } from "@/components/brand/Tick";
import { PhoneField } from "@/components/forms/PhoneField";
import type { PartnerFormUi, PartnerTypeKey } from "@/lib/copy/partner";
import {
  COMPANY_PATTERN,
  ELAPSED_FIELD,
  EMAIL_PATTERN,
  HONEYPOT_FIELD,
  LIMITS,
  NAME_PATTERN,
} from "@/lib/leads/constraints";
import { CITY_MAX, INITIAL_PARTNER_FORM_STATE } from "@/lib/partner/state";

const ID = "pf-";

function Err({ id, message }: { id: string; message?: string }) {
  return message ? <p className="err" id={`${ID}${id}-error`}>{message}</p> : null;
}

const bad = (id: string, message?: string) =>
  message ? { "aria-invalid": true as const, "aria-describedby": `${ID}${id}-error` } : {};

/** Swaps the browser's generic message for the copy's, and clears it again
 *  on the next keystroke so a fixed field is not held invalid. */
const say = (message: string) => ({
  onInvalid: (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => e.currentTarget.setCustomValidity(message),
  onInput: (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => e.currentTarget.setCustomValidity(""),
});

export function PartnerForm({
  locale,
  t,
  types,
  notice,
  talk,
}: {
  locale: string;
  t: PartnerFormUi;
  types: readonly PartnerTypeKey[];
  /** The consent notice's second paragraph, with its links. */
  notice: ReactNode;
  /** "Would rather talk? Call …", with the phone link. */
  talk: ReactNode;
}) {
  const [state, action, pending] = useActionState(submitPartner, INITIAL_PARTNER_FORM_STATE);
  const v = state.values ?? {};
  const x = state.extra ?? {};
  const fe = state.fieldErrors ?? {};
  const xe = state.extraErrors ?? {};

  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  const elapsed = useRef<HTMLInputElement>(null);
  const stamp = () => {
    if (elapsed.current && mountedAt.current) elapsed.current.value = String(Date.now() - mountedAt.current);
  };

  if (state.status === "success") {
    return (
      <div className="pf pf-done" role="status">
        <span className="pf-seal"><Tick tone="inverse" /></span>
        <h2 className="pf-h">{t.h}</h2>
        <p className="pf-ok">{state.message}</p>
        <p className="pf-talk">{talk}</p>
      </div>
    );
  }

  const company = fe.company ?? xe.company;
  return (
    <form className="pf form" action={action} onInput={stamp} onFocus={stamp} aria-labelledby={`${ID}h`}>
      <h2 className="pf-h" id={`${ID}h`}>{t.h}</h2>
      <p className="pf-sub">{t.sub}</p>

      <div className="pf-grid">
        <div className="pf-wide">
          <label className="fld-l" htmlFor={`${ID}company`}>{t.business.label} *</label>
          <input className="inp" id={`${ID}company`} name="company" type="text" autoComplete="organization"
            placeholder={t.business.placeholder} required minLength={2} maxLength={LIMITS.company.max} pattern={COMPANY_PATTERN}
            defaultValue={v.company ?? ""} {...say(t.checks.business)} {...bad("company", company)} />
          <Err id="company" message={company} />
        </div>
        <div>
          <label className="fld-l" htmlFor={`${ID}name`}>{t.person.label} *</label>
          <input className="inp" id={`${ID}name`} name="name" type="text" autoComplete="name"
            placeholder={t.person.placeholder} required minLength={LIMITS.name.min} maxLength={LIMITS.name.max} pattern={NAME_PATTERN}
            defaultValue={v.name ?? ""} {...say(t.checks.person)} {...bad("name", fe.name)} />
          <Err id="name" message={fe.name} />
        </div>
        <PhoneField
          idPrefix={ID}
          required
          label={t.mobile.label}
          countryLabel={t.countryCode}
          placeholder={t.mobile.placeholder}
          dialDefault={v.countryCode ?? ""}
          numberDefault={v.mobile ?? ""}
          numberError={fe.mobile}
          countryError={fe.countryCode}
          missingMessage={t.checks.phoneMissing}
          invalidMessage={t.checks.phoneInvalid}
          countryMessage={t.checks.countryMissing}
        />
        <div>
          <label className="fld-l" htmlFor={`${ID}email`}>{t.email.label} *</label>
          <input className="inp" id={`${ID}email`} name="email" type="email" autoComplete="email"
            placeholder={t.email.placeholder} required maxLength={LIMITS.email.max} pattern={EMAIL_PATTERN}
            defaultValue={v.email ?? ""} {...say(t.checks.email)} {...bad("email", fe.email)} />
          <Err id="email" message={fe.email} />
        </div>
        <div>
          <label className="fld-l" htmlFor={`${ID}city`}>{t.city.label} *</label>
          <input className="inp" id={`${ID}city`} name="city" type="text" autoComplete="address-level2"
            placeholder={t.city.placeholder} required minLength={2} maxLength={CITY_MAX}
            defaultValue={x.city ?? ""} {...say(t.checks.city)} {...bad("city", xe.city)} />
          <Err id="city" message={xe.city} />
        </div>
        <div className="pf-wide">
          <label className="fld-l" htmlFor={`${ID}type`}>{t.type.label} *</label>
          {/* Keyed on the submission: a <select>'s default applies at mount
              only, so React's post-action reset would otherwise clear it. */}
          <select key={state.token ?? 0} className="inp" id={`${ID}type`} name="partnerType" required
            defaultValue={x.partnerType ?? ""} {...say(t.checks.type)} {...bad("partnerType", xe.partnerType)}>
            <option value="" disabled>{t.type.placeholder}</option>
            {types.map((k) => <option key={k} value={k}>{t.type.options[k]}</option>)}
          </select>
          <Err id="partnerType" message={xe.partnerType} />
        </div>
      </div>

      <label className="pf-consent" htmlFor={`${ID}consent`}>
        <input id={`${ID}consent`} name="consent" type="checkbox" required {...say(t.checks.consent)} {...bad("consent", xe.consent)} />
        <span>{t.consent}</span>
      </label>
      <Err id="consent" message={xe.consent} />
      <details className="pf-notice">
        <summary>{t.notice.summary}<span className="m" aria-hidden="true">+</span></summary>
        <div className="pf-notice-b">
          <p>{t.notice.p1}</p>
          <p>{notice}</p>
        </div>
      </details>

      <input className="vh" id={`${ID}${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" defaultValue="" />
      <input ref={elapsed} type="hidden" name={ELAPSED_FIELD} defaultValue="" />
      <input type="hidden" name="locale" value={locale} />

      {state.status !== "idle" && state.message ? (
        <div key={state.token} className="pf-status" role="status" aria-live="polite">{state.message}</div>
      ) : null}

      <button type="submit" className="btn pf-go" disabled={pending}>{pending ? t.sending : t.submit}</button>
      <p className="pf-talk">{talk}</p>
    </form>
  );
}
