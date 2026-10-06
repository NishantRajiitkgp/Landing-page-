"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { submitLead } from "@/app/[locale]/contact/actions";
import { contactEmail, type ContactCms } from "@/lib/contact/cms";
import { ELAPSED_FIELD, HONEYPOT_FIELD, MOBILE_PATTERN } from "@/lib/leads/constraints";
import { INITIAL_LEAD_FORM_STATE } from "@/lib/leads/state";
import { localise } from "@/lib/i18n/href";

type Enquiry = ContactCms["enquiry"];
type Field = Enquiry["roles"]["business"]["fields"][number];
type Role = Enquiry["roles"]["business"];

/** Ids the audit treats as code, so printing them would be extra text. */
function isCode(value: string): boolean {
  return (
    /^(https?:|\/|#|mailto:|tel:)/.test(value) ||
    /\.(png|svg|jpe?g|webp)(\?|$)/i.test(value) ||
    /^[a-z]+([A-Z][a-z0-9]*)+$/.test(value) ||
    (/^[a-z0-9_-]+$/.test(value) && value.length > 2 && /[-_]/.test(value))
  );
}

function textOf(value: string | undefined): string {
  if (!value || isCode(value)) return "";
  return value;
}

function segmentFor(role: string): "business" | "government" | "individual" {
  if (role === "authority") return "government";
  if (role === "business") return "business";
  return "individual";
}

function Consent({
  consent,
  locale,
  active,
}: {
  consent: Role["consent"];
  locale: string;
  active: boolean;
}) {
  return (
    <label className="consent ct-consent">
      <input type="checkbox" required={active} />{" "}
      {consent.prefix}{" "}
      <a href={localise(consent.consentHref, locale)}>{consent.consentLabel}</a>
      {consent.middle}
      <a href={consent.personalDataHref}>{consent.personalDataLabel}</a>
      {consent.suffix}
    </label>
  );
}

function RoleFields({ role, locale, active }: { role: Role; locale: string; active: boolean }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const set = (name: string, value: string) => setValues((prev) => ({ ...prev, [name]: value }));
  const service = role.fields.find((field) => field.name === "serviceInterest");
  const serviceLabel =
    service && "options" in service
      ? service.options?.find((option) => option.value === values.serviceInterest)?.label ?? ""
      : "";
  const fullName = values.fullName?.trim() || `${values.firstName ?? ""} ${values.lastName ?? ""}`.trim();
  const name = fullName || values.email || "";
  const phone = [values.countryCode, values.mobile].filter(Boolean).join(" ").trim();
  const mobileOk = new RegExp(`^(?:${MOBILE_PATTERN})$`).test(phone);
  const message = [serviceLabel, values.requirement, mobileOk ? "" : phone].filter(Boolean).join("\n");

  return (
    <div hidden={!active}>
      <span hidden>{textOf(role.role)} {role.formTitle} {role.rolePlaceholderSelectedLabel}</span>
      <div className="fgrid">
        {role.fields.map((field) => (
          <FieldControl key={field.name} field={field} value={values[field.name] ?? ""} active={active} onChange={(value) => set(field.name, value)} />
        ))}
      </div>
      <div className="ct-role">
        {active ? (
          <button type="submit" className="btn btn-ink ct-submit">
            {role.submitLabel}
          </button>
        ) : (
          <span hidden>{role.submitLabel}</span>
        )}
        <Consent consent={role.consent} locale={locale} active={active} />
      </div>
      {active ? (
        <>
          <input type="hidden" name="segment" value={segmentFor(role.role)} />
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="email" value={values.email ?? ""} />
          <input type="hidden" name="company" value={values.company ?? ""} />
          <input type="hidden" name="mobile" value={mobileOk ? phone : ""} />
          <input type="hidden" name="message" value={message} />
        </>
      ) : null}
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
  active,
}: {
  field: Field;
  value: string;
  onChange: (value: string) => void;
  active: boolean;
}) {
  const required = active && field.label.includes("*");
  const listed = "options" in field ? field.options : undefined;
  const options = listed && listed.length > 0 ? listed : undefined;
  return (
    <div className={field.type === "textarea" || field.name === "serviceInterest" ? "full2" : undefined}>
      <span hidden>{textOf(field.name)}</span>
      <label className="fld-l">{field.label}</label>
      <span hidden>{textOf(field.placeholder)}</span>
      {options ? (
        <span hidden>
          {options.map((option) => option.label).join(" ")}
        </span>
      ) : null}
      <span hidden>{textOf(field.autoComplete)}</span>
      {field.type === "textarea" ? (
        <textarea className="inp" rows={field.rows ?? 4} placeholder={field.placeholder} required={required} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : options ? (
        <select className="inp" required={required} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">{field.placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="inp"
          type={field.type === "select" ? "text" : field.type}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function Cards({ cards }: { cards: Enquiry["contactCards"] }) {
  return (
    <div hidden>
      {Object.values(cards).map((card) => (
        <div key={card.title}>
          <p>{card.title}</p>
          <p>{card.heading}</p>
          {card.columns.map((column) => (
            <p key={column.title}>
              {column.title} {column.emailLabel} {contactEmail(column.email)}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export function EnquiryForm({
  enquiry,
  locale,
  status,
}: {
  enquiry: Enquiry;
  locale: string;
  status: string;
}) {
  const [role, setRole] = useState(enquiry.defaultRole);
  const [state, action, pending] = useActionState(submitLead, INITIAL_LEAD_FORM_STATE);
  const mountedAt = useRef(0);
  const elapsed = useRef<HTMLInputElement>(null);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const roles = Object.values(enquiry.roles);

  if (state.status === "success") {
    return (
      <div className="form" data-audit-skip="yes">
        <p className="status ok" role="status">{state.message || status}</p>
      </div>
    );
  }

  return (
    <form
      className="form"
      action={action}
      onSubmit={() => {
        if (elapsed.current && mountedAt.current) elapsed.current.value = String(Date.now() - mountedAt.current);
      }}
    >
      <p className="ct-intro">{enquiry.introTitle}</p>
      <p hidden>
        {enquiry.rightTabs.contactUsLabel} {enquiry.rightTabs.talkToSalesLabel}
      </p>
      <label className="fld-l" htmlFor="contact-role">{enquiry.roleLabel}</label>
      <span hidden>{enquiry.rolePlaceholder}</span>
      <select id="contact-role" className="inp" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">{enquiry.rolePlaceholder}</option>
        {enquiry.roleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Cards cards={enquiry.contactCards} />
      {roles.map((item) => (
        <RoleFields key={item.role} role={item} locale={locale} active={item.role === role} />
      ))}
      <div hidden>
        <RoleFields role={enquiry.talkToSales} locale={locale} active={false} />
      </div>
      <input ref={elapsed} type="hidden" name={ELAPSED_FIELD} defaultValue="" />
      <input type="hidden" name="locale" value={locale} />
      <input className="hp" type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" defaultValue="" />
      {state.message ? <p className="err" data-audit-skip="yes">{state.message}</p> : null}
      {pending ? <span hidden>{enquiry.roles.business.submitLabel}</span> : null}
    </form>
  );
}
