"use client";

import { useRef, useState } from "react";

import type { MomErrors } from "@/lib/copy/momApply";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { uploadDocument, type Upload } from "@/lib/mom/apply/client";
import { FILE_ACCEPT, FILE_MAX_MB, type Slot } from "@/lib/mom/apply/policy";
import type { ApplyFailure, DocRef } from "@/lib/mom/apply/types";

import { fill } from "../fill";
import { CrossIcon, FileIcon, TickIcon } from "../icons";
import { FieldError } from "../PasswordField";
import { docId } from "./steps";

type Phase = { k: "idle" } | { k: "up"; p: number } | { k: "bad"; msg: string };

export function fileSize(bytes: number, locale: string): string {
  const mb = bytes / (1024 * 1024);
  const unit = mb >= 1 ? "megabyte" : "kilobyte";
  const n = mb >= 1 ? mb : Math.max(1, bytes / 1024);
  return new Intl.NumberFormat(`${locale}-u-nu-latn`, { style: "unit", unit, maximumFractionDigits: mb >= 1 ? 1 : 0 }).format(n);
}

/** One document: pick or drop a file, watch it upload, replace or remove it. */
export function DocSlot({
  slot,
  doc,
  onChange,
  t,
  optional,
  issues,
  errors,
  error,
  locale,
  upload = uploadDocument,
  fieldId,
}: {
  slot: Slot;
  doc: DocRef | undefined;
  onChange: (doc: DocRef | null) => void;
  t: MomStepsCopy["docs"];
  optional: string;
  issues: MomStepsCopy["issues"];
  errors: MomErrors;
  error?: string | null;
  locale: string;
  upload?: (file: File, slot: string, onProgress: (fraction: number) => void) => Upload;
  /** When several people's slots share a page. */
  fieldId?: string;
}) {
  const [phase, setPhase] = useState<Phase>({ k: "idle" });
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const job = useRef<Upload | null>(null);
  const id = fieldId ?? docId(slot.key);

  const message = (f: ApplyFailure) =>
    f.code === "too_large"
      ? fill(issues.too_large, { mb: FILE_MAX_MB })
      : f.code === "bad_type"
        ? issues.bad_type
        : f.code === "rate_limited"
          ? fill(errors.rate_limited, { s: f.retryAfter ?? 30 })
          : errors[f.code];

  async function start(file: File) {
    job.current?.abort();
    const current = upload(file, slot.key, (f) => setPhase({ k: "up", p: Math.round(f * 100) }));
    job.current = current;
    setPhase({ k: "up", p: 0 });
    const res = await current.done;
    if (job.current !== current) return;
    job.current = null;
    if (res.ok) {
      onChange(res.doc);
      setPhase({ k: "idle" });
    } else setPhase({ k: "bad", msg: message(res) });
  }

  function cancel() {
    const upload = job.current;
    job.current = null;
    upload?.abort();
    setPhase({ k: "idle" });
  }

  const up = phase.k === "up" ? phase : null;
  const shownError = phase.k === "bad" ? phase.msg : doc ? null : error;
  const rule = fill(t.rule, { mb: FILE_MAX_MB });
  const meta = up ? (
    fill(t.uploading, { p: up.p })
  ) : drag ? (
    t.drop
  ) : doc ? (
    <>
      <span className="mf-doc-fn">{doc.name}</span>
      <span className="mf-doc-sz">{fileSize(doc.size, locale)}</span>
    </>
  ) : (
    `${t.hints[slot.kind]} · ${rule}`
  );

  return (
    <div className="mf-doc-w">
      <div
        className={`mf-doc${doc && !up ? " is-done" : ""}${drag ? " is-drag" : ""}${shownError ? " is-bad" : ""}${up ? " is-up" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!drag) setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void start(file);
        }}
      >
        <span className="mf-doc-ic" aria-hidden="true">
          {doc && !up ? <TickIcon /> : <FileIcon />}
        </span>
        <div className="mf-doc-b">
          <p className="mf-doc-t" id={`${id}-t`}>
            {t[slot.kind]}
            {slot.required ? null : <span className="mf-opt">{optional}</span>}
          </p>
          <p className="mf-doc-m" id={`${id}-m`} aria-live="polite">
            {meta}
          </p>
          {up ? (
            <span className="mf-doc-bar" aria-hidden="true">
              <i style={{ inlineSize: `${Math.max(4, up.p)}%` }} />
            </span>
          ) : null}
        </div>
        <div className="mf-doc-acts">
          {up ? (
            <button type="button" className="ma-link" onClick={cancel}>
              {t.cancel}
            </button>
          ) : (
            <>
              <button
                type="button"
                id={id}
                className={`btn btn-sm ${doc ? "btn-line" : "btn-ink"}`}
                aria-describedby={[`${id}-t`, `${id}-m`, shownError ? `${id}-err` : ""].filter(Boolean).join(" ")}
                onClick={() => input.current?.click()}
              >
                {doc ? t.replace : t.choose}
              </button>
              {doc ? (
                <button type="button" className="ma-icon-btn" aria-label={fill(t.remove, { name: doc.name })} onClick={() => onChange(null)}>
                  <CrossIcon />
                </button>
              ) : null}
            </>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept={FILE_ACCEPT}
          hidden
          tabIndex={-1}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void start(file);
          }}
        />
      </div>
      {shownError ? <FieldError id={`${id}-err`}>{shownError}</FieldError> : null}
    </div>
  );
}
