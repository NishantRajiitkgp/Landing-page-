"use client";

import { useRef, useState } from "react";

import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { searchInstitutions } from "@/lib/mom/apply/client";
import { countryName } from "@/lib/mom/apply/countries";
import { INSTITUTION_MAX } from "@/lib/mom/apply/policy";
import type { ApplyResult, Institution } from "@/lib/mom/apply/types";

import { PlusIcon, TickIcon } from "../icons";
import { FieldError } from "../PasswordField";

type Phase = "idle" | "searching" | "done";

/** ARIA 1.2 combobox over the institution search. Picking a result records
 *  whether it is on MOM's list; typed text stays unconfirmed, which prices
 *  in the Accreditation Check. */
export function InstitutionField({
  id,
  t,
  locale,
  value,
  listed,
  onType,
  onPick,
  onBlur,
  error,
  search: lookup = searchInstitutions,
}: {
  id: string;
  t: MomStepsCopy["quals"];
  locale: string;
  value: string;
  listed: boolean | null;
  onType: (value: string) => void;
  onPick: (inst: Institution) => void;
  onBlur: () => void;
  error?: string | null;
  search?: (q: string, signal: AbortSignal) => Promise<ApplyResult<{ items: Institution[] }>>;
}) {
  const [items, setItems] = useState<Institution[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const timer = useRef<number | undefined>(undefined);
  const request = useRef<AbortController | null>(null);
  const listId = `${id}-list`;

  function search(q: string) {
    window.clearTimeout(timer.current);
    request.current?.abort();
    if (q.trim().length < 2) {
      setItems([]);
      setPhase("idle");
      setOpen(false);
      return;
    }
    setPhase("searching");
    setOpen(true);
    timer.current = window.setTimeout(async () => {
      const ctrl = new AbortController();
      request.current = ctrl;
      const res = await lookup(q.trim(), ctrl.signal);
      if (ctrl.signal.aborted) return;
      setItems(res.ok ? res.items : []);
      setActive(-1);
      setPhase("done");
    }, 180);
  }

  function pick(inst: Institution) {
    onPick(inst);
    setOpen(false);
    setItems([]);
    setPhase("idle");
  }

  const showList = open && phase !== "idle";
  const status = value.trim() && !showList ? (listed ? "listed" : "unlisted") : null;

  return (
    <div className="ma-field">
      <div className="ma-lrow">
        <label className="ma-l" htmlFor={id}>
          {t.institution}
        </label>
      </div>
      <div className="mf-combo">
        <div className={`ma-ctl${error ? " is-bad" : ""}`}>
          <input
            id={id}
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={showList && active >= 0 ? `${id}-o${active}` : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={[status ? `${id}-st` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined}
            autoComplete="off"
            maxLength={INSTITUTION_MAX}
            placeholder={t.institutionPlaceholder}
            value={value}
            onChange={(e) => {
              onType(e.target.value);
              search(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && items.length) {
                e.preventDefault();
                setOpen(true);
                setActive((a) => Math.min(items.length - 1, a + 1));
              } else if (e.key === "ArrowUp" && items.length) {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter" && showList && active >= 0 && items[active]) {
                e.preventDefault();
                pick(items[active]);
              } else if (e.key === "Escape" && showList) {
                e.preventDefault();
                setOpen(false);
              }
            }}
            onBlur={() => {
              setOpen(false);
              onBlur();
            }}
          />
          {phase === "searching" ? <span className="ma-spin mf-combo-spin" aria-hidden="true" /> : null}
        </div>
        <ul id={listId} role="listbox" aria-label={t.institution} className="mf-list" hidden={!showList}>
          {items.map((inst, i) => (
            <li
              key={inst.name}
              id={`${id}-o${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? "is-on" : undefined}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(inst);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="mf-opt-n">{inst.name}</span>
              <span className="mf-opt-m">
                {countryName(inst.country, locale)}
                {inst.listed ? <span className="mf-tag">{t.listed}</span> : null}
              </span>
            </li>
          ))}
          {showList && !items.length ? (
            <li className="mf-list-note" role="presentation">
              {phase === "searching" ? t.searching : t.noMatch}
            </li>
          ) : null}
        </ul>
      </div>
      {status ? (
        <p className={`mf-status${status === "listed" ? " is-listed" : ""}`} id={`${id}-st`}>
          {status === "listed" ? <TickIcon /> : <PlusIcon />}
          {status === "listed" ? t.listed : t.unlisted}
        </p>
      ) : null}
      {error ? <FieldError id={`${id}-err`}>{error}</FieldError> : null}
    </div>
  );
}
