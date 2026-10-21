"use client";

import { useState } from "react";

import { fill } from "@/components/momapply/fill";
import { ArrowIcon, FileIcon, TickIcon } from "@/components/momapply/icons";
import type { HellostaffCopy } from "@/lib/copy/hellostaff";
import { OCR_FIELDS, type HsService } from "@/lib/hellostaff/catalog";
import { hsApi } from "@/lib/hellostaff/client";
import type { HsCase } from "@/lib/hellostaff/types";

import { Alert } from "./Alert";
import { DigilockerPanel } from "./DigilockerPanel";
import { failText } from "./failText";

type Mode = "okyc" | "upload" | "digilocker";
type Slot = "front" | "back" | "dl";

const FILE_MAX = 5 * 1024 * 1024;

/** `dd-mm-yyyy` or `dd/mm/yyyy` from OCR, as a date input can show it. */
function asDateInput(v: string): string {
  const m = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(v);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : v;
}

/** Hello Staff's document check: Aadhaar (OKYC, upload, DigiLocker) or the
 *  driving licence (upload, DigiLocker). Upload runs the backend's OCR and
 *  pre-fills the check's own questions. */
export function DocumentStep({
  t,
  service,
  check,
  onSubmitted,
}: {
  t: HellostaffCopy;
  service: HsService;
  check: NonNullable<HsCase["check"]>;
  onSubmitted: () => void;
}) {
  const d = t.doc;
  const slots: Slot[] = service.doc === "aadhaar" ? ["front", "back"] : ["dl"];
  const modes: Mode[] = service.doc === "aadhaar" ? ["okyc", "upload", "digilocker"] : ["upload", "digilocker"];

  const [mode, setMode] = useState<Mode | "">("");
  const [files, setFiles] = useState<Partial<Record<Slot, File>>>({});
  const [answers, setAnswers] = useState<Record<string, string>>(check.answers);
  const [ocr, setOcr] = useState<"" | "reading" | "read" | "failed">("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pickFile(slot: Slot, file: File | null) {
    setError("");
    if (file && file.size > FILE_MAX) return setError(t.errors.too_large);
    const next = { ...files, [slot]: file ?? undefined };
    setFiles(next);
    const ready = slots.map((s) => next[s]).filter((f): f is File => Boolean(f));
    if (ready.length !== slots.length) return;
    setOcr("reading");
    const r = await hsApi.extract(service.slug, ready);
    if (!r.ok) return setOcr("failed");
    const allowed = new Set(OCR_FIELDS[service.doc]);
    setAnswers((prev) => ({
      ...prev,
      ...Object.fromEntries(Object.entries(r.fields).filter(([k, v]) => allowed.has(k) && v)),
    }));
    setOcr("read");
  }

  async function submit() {
    if (!check.filled && slots.some((s) => !files[s])) return setError(t.errors.files);
    const missing = check.questions.find((q) => q.mandatory && !answers[String(q.id)]?.trim());
    if (missing && !check.filled) return setError(fill(d.enter, { name: missing.name }));
    setBusy(true);
    setError("");
    const r = await hsApi.saveCheck(service.slug, "upload", answers);
    setBusy(false);
    if (!r.ok) return setError(failText(t, r));
    onSubmitted();
  }

  return (
    <div className="mf-step-b">
      {check.filled ? <p className="mf-status is-listed">{d.filled}</p> : null}

      <fieldset className="mf-set ma-field">
        <legend className="ma-l">{d.mode}</legend>
        <div className="mf-pills">
          {modes.map((m) => (
            <label key={m} className={mode === m ? "is-on" : undefined}>
              <input
                type="radio"
                name="hs-mode"
                value={m}
                checked={mode === m}
                onChange={() => {
                  setMode(m);
                  setError("");
                }}
              />
              <span>{d.modes[m]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {mode ? (
        <div className="hs-howto">
          <p className="ma-l">{d.howTo[mode]}</p>
          <ol>
            {d.steps[mode].map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      ) : null}

      {mode === "okyc" ? <Alert text={d.okycOff} /> : null}

      {mode === "upload" ? (
        <>
          <div className="mf-docs">
            {slots.map((slot) => {
              const f = files[slot];
              return (
                <div key={slot} className="mf-doc-w">
                  <label className={`mf-doc${f ? " is-done" : ""}`}>
                    <span className="mf-doc-ic">{f ? <TickIcon /> : <FileIcon />}</span>
                    <span className="mf-doc-b">
                      <span className="mf-doc-t">{d.slots[slot]} *</span>
                      <span className="mf-doc-m">{f ? <span className="mf-doc-fn">{f.name}</span> : d.fileHint}</span>
                    </span>
                    <span className="mf-doc-acts">
                      <span className="btn btn-line btn-sm">{f ? d.replace : d.pick}</span>
                    </span>
                    <input
                      type="file"
                      className="hs-file"
                      accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                      disabled={check.filled}
                      onChange={(e) => void pickFile(slot, e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          {ocr === "reading" ? (
            <p className="mf-status">
              <span className="ma-spin" aria-hidden="true" />
              {d.reading}
            </p>
          ) : ocr === "read" ? (
            <p className="mf-status is-listed">{d.read}</p>
          ) : ocr === "failed" ? (
            <p className="mf-status">{d.readFail}</p>
          ) : null}

          {check.questions.length ? (
            <fieldset className="mf-set mf-docs">
              <legend className="ma-l">{d.fields}</legend>
              {check.questions.map((q) => {
                const id = `hs-q-${q.id}`;
                const v = answers[String(q.id)] ?? "";
                const date = q.control === "date";
                return (
                  <div key={q.id} className="ma-field">
                    <label className="ma-l" htmlFor={id}>
                      {q.name}
                      {q.mandatory ? " *" : ""}
                    </label>
                    <div className={`ma-ctl${check.filled ? " is-locked" : ""}`}>
                      <input
                        id={id}
                        type={date ? "date" : "text"}
                        value={date ? asDateInput(v) : v}
                        placeholder={date ? undefined : fill(d.enter, { name: q.name })}
                        readOnly={check.filled}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [String(q.id)]: e.target.value }))}
                      />
                    </div>
                  </div>
                );
              })}
            </fieldset>
          ) : null}

          {error ? <Alert text={error} /> : null}
          <button type="button" className="btn btn-ink ma-submit" disabled={busy || ocr === "reading"} onClick={() => void submit()}>
            {busy ? <span className="ma-spin ma-spin-light" aria-hidden="true" /> : null}
            {d.submit}
            {busy ? null : <ArrowIcon />}
          </button>
        </>
      ) : null}

      {mode === "digilocker" ? <DigilockerPanel t={t} service={service} answers={answers} onSubmitted={onSubmitted} /> : null}

      {!mode && error ? <Alert text={error} /> : null}
    </div>
  );
}
