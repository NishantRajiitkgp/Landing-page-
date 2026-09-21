"use client";
// Client because the form needs `useActionState` for the pending state and the
// server's per-field errors, and because the timing signal is measured in the
// browser. Nothing else here is interactive.
//
// Note what is NOT imported: no react-hook-form, no client-side zod. Validation
// before submit is the browser's own constraint validation, driven by the same
// limits the server schema is built from (`@/lib/leads/constraints`), which
// costs zero bytes. Shipping a second validator would put /contact roughly
// 20 KB further over the §9.1 script budget to duplicate a check the server has
// to do anyway.

import { useActionState, useEffect, useRef } from "react";

import { submitLead } from "@/app/[locale]/contact/actions";
import {
  ELAPSED_FIELD,
  HONEYPOT_FIELD,
  INTEREST_LABELS,
  INTEREST_VALUES,
  type InterestValue,
  LIMITS,
  SEGMENT_LABELS,
  SEGMENT_VALUES,
  type LeadField,
} from "@/lib/leads/constraints";
import { Field, TEXT_FIELDS } from "@/components/forms/LeadFields";
import { INITIAL_LEAD_FORM_STATE } from "@/lib/leads/state";
import { localise } from "@/lib/i18n/href";

/** `locale` is a prop rather than a hook: reading it from next-intl on the
 *  client would require NextIntlClientProvider at the root, which ships
 *  next-intl's client runtime to every page for the sake of three hrefs. */
export function ContactForm({ locale }: { locale: string }) {
  const L = (path: string) => localise(path, locale);

  const [state, formAction, pending] = useActionState(submitLead, INITIAL_LEAD_FORM_STATE);

  /** Set in an effect, not as `useRef(Date.now())`.
   *
   *  A `useRef` initialiser is evaluated on EVERY render even though only the
   *  first value is kept, so reading the clock there is an impure render -
   *  which `react-hooks/purity` flags and React's compiler is entitled to
   *  reorder. An effect runs once, after mount, on the client only, which is
   *  also exactly what "how long has this form been on screen" means. */
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  const elapsed = useRef<HTMLInputElement>(null);

  /** Stamps how long the form has been on screen, on first interaction rather
   *  than on a timer. Left empty if nobody ever touches a field, and an empty
   *  value reads as "no signal" server-side — so a visitor with JavaScript
   *  disabled submits a perfectly valid form and is never judged on timing. */
  const stampElapsed = () => {
    // `mountedAt` is 0 until the mount effect runs. Stamping a bogus 56-year
    // elapsed time would read as a signal server-side, so nothing is written -
    // which is the same "no signal" the no-JavaScript path produces.
    if (elapsed.current && mountedAt.current) {
      elapsed.current.value = String(Date.now() - mountedAt.current);
    }
  };

  /** `/contact?interest=certifier` from a vertical page arrives pre-selected.
   *
   *  Applied in an effect against the DOM rather than through `defaultValue`,
   *  because the page is statically prerendered: deriving the default during
   *  render would make the server's HTML and the client's first render
   *  disagree and trip a hydration mismatch. Reading `searchParams` in the
   *  Server Component is not an option either — it would opt /contact into
   *  dynamic rendering and cost the build its zero-dynamic-routes property.
   *
   *  Runs once, and never overwrites a value, so it cannot clobber what the
   *  user picked or the value echoed back after a failed submit. */
  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current) return;
    prefilled.current = true;

    const requested = new URLSearchParams(window.location.search).get("interest");
    if (!requested) return;
    if (!(INTEREST_VALUES as readonly string[]).includes(requested)) return;

    const select = document.getElementById("interest");
    if (select instanceof HTMLSelectElement && !select.value) {
      select.value = requested as InterestValue;
    }
  }, []);

  const errorFor = (field: LeadField) => state.fieldErrors?.[field];

  const invalidProps = (field: LeadField) =>
    errorFor(field) ? { "aria-invalid": true as const, "aria-describedby": `${field}-error` } : {};


  if (state.status === "success") {
    return (
      <div className="form">
        <div className="fld-l" style={{ marginBottom: 10 }}>
          Talk to sales
        </div>
        <div className="status ok" role="status">
          {state.message}
        </div>
        <p className="consent">
          In the meantime, the <a href={L("/platform/security-compliance")}>compliance pack</a> lists
          what we can send before a call, and <a href={L("/resources/checks")}>the check library</a>{" "}
          covers turnaround times per check.
        </p>
      </div>
    );
  }

  return (
    <form className="form" action={formAction} onInput={stampElapsed} onFocus={stampElapsed}>
      <div className="fld-l" style={{ marginBottom: 10 }}>
        Talk to sales
      </div>

      <div className="segs" role="radiogroup" aria-label="Who is asking">
        {SEGMENT_VALUES.map((value) => (
          <label className="seg" key={value}>
            <input
              type="radio"
              name="segment"
              value={value}
              className="vh"
              defaultChecked={(state.values?.segment ?? "business") === value}
            />
            {SEGMENT_LABELS[value]}
          </label>
        ))}
      </div>

      <div className="fgrid" style={{ marginTop: 22 }}>
        {TEXT_FIELDS.map((f) => (
          <Field key={f.id} id={f.id} label={f.label} message={errorFor(f.id)}>
            <input
              className="inp"
              id={f.id}
              name={f.id}
              type={f.type}
              placeholder={f.placeholder}
              autoComplete={f.autoComplete}
              required={f.required}
              minLength={f.minLength}
              pattern={f.pattern}
              maxLength={f.maxLength}
              defaultValue={state.values?.[f.id] ?? ""}
              {...invalidProps(f.id)}
            />
          </Field>
        ))}

        <Field id="interest" label="Services of interest" wide message={errorFor("interest")}>
          {/* `key` forces a remount on each submission, and it is doing real
              work. React resets the form once the action resolves; for an
              <input> that is harmless because `defaultValue` becomes the value
              attribute and the reset restores it. A <select> has no such
              attribute — React applies `defaultValue` by marking an option
              selected at MOUNT only — so without a remount a failed submission
              silently cleared the service the user had picked. Measured, not
              theorised: it was the one field that came back empty. */}
          <select
            key={state.token ?? 0}
            className="inp"
            id="interest"
            name="interest"
            defaultValue={state.values?.interest ?? ""}
            {...invalidProps("interest")}
          >
            <option value="" disabled>
              Employee verification, KYC, Certifier, Consumer…
            </option>
            {INTEREST_VALUES.map((value) => (
              <option key={value} value={value}>
                {INTEREST_LABELS[value]}
              </option>
            ))}
          </select>
        </Field>

        <Field id="message" label="Message" wide message={errorFor("message")}>
          <textarea
            className="inp"
            id="message"
            name="message"
            rows={3}
            placeholder="How many checks a month, and where?"
            maxLength={LIMITS.message.max}
            defaultValue={state.values?.message ?? ""}
            style={{
              height: "auto",
              paddingTop: 14,
              paddingBottom: 14,
              alignItems: "flex-start",
              resize: "vertical",
            }}
            {...invalidProps("message")}
          />
        </Field>
      </div>

      {/* A field no human can see: anything in it came from automation. One
          bare input rather than a labelled pair inside a wrapper — a `.vh`
          wrapper clips its children visually but they still report their own
          layout boxes, which put two phantom elements into the page's DOM map.
          `tabIndex={-1}` keeps it off the keyboard path and `autoComplete="off"`
          keeps a password manager from filling it and locking out a real
          person. */}
      <input
        className="vh"
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        defaultValue=""
      />
      <input ref={elapsed} type="hidden" name={ELAPSED_FIELD} defaultValue="" />

      {state.status !== "idle" && state.message ? (
        <div key={state.token} className="status" role="status" aria-live="polite">
          {state.message}
        </div>
      ) : null}

      <p className="consent">
        By submitting, you consent to HelloVerify processing your data for lead generation and
        related communications, per our <a href={L("/legal/privacy-policy")}>Privacy Policy</a>. We&apos;ll
        never share your brand.
      </p>

      <div style={{ marginTop: 18 }}>
        <button type="submit" className="btn btn-ink" disabled={pending}>
          {pending ? "Sending…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
