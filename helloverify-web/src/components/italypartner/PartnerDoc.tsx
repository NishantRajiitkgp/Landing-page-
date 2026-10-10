"use client";

import { useRef, useState } from "react";

import { fill } from "@/components/momapply/fill";
import { CrossIcon, FileIcon, TickIcon } from "@/components/momapply/icons";
import { FieldError } from "@/components/momapply/PasswordField";
import { fileSize } from "@/components/momapply/flow/DocSlot";
import type { ItalyPartnerCopy } from "@/lib/copy/italyPartner";
import { uploadPartnerDoc, type Upload, type UploadFailure } from "@/lib/italy/partner/upload";
import { FILE_ACCEPT, FILE_MAX_MB } from "@/lib/mom/apply/policy";

import type { PartnerDoc as SavedDoc } from "./agency";

type Phase = { k: "idle" } | { k: "up"; p: number } | { k: "bad"; msg: string };

function explain(t: ItalyPartnerCopy, failure: UploadFailure): string {
  if (failure.code === "too_large") return fill(t.docs.tooLarge, { mb: FILE_MAX_MB });
  if (failure.code === "bad_type") return t.docs.badType;
  if (failure.code === "rate_limited") return fill(t.errors.rate_limited, { s: failure.retryAfter ?? 30 });
  return t.errors[failure.code];
}

export function PartnerDoc({
  slot,
  doc,
  label,
  hint,
  optional,
  error,
  locale,
  t,
  onChange,
}: {
  slot: string;
  doc: SavedDoc | null;
  label: string;
  hint: string;
  optional?: string;
  error: string | null;
  locale: string;
  t: ItalyPartnerCopy;
  onChange: (doc: SavedDoc | null) => void;
}) {
  const [phase, setPhase] = useState<Phase>({ k: "idle" });
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const job = useRef<Upload | null>(null);
  const id = `ip-doc-${slot}`;

  async function start(file: File) {
    job.current?.abort();
    const upload = uploadPartnerDoc(file, slot, (f) => setPhase({ k: "up", p: Math.round(f * 100) }));
    job.current = upload;
    setPhase({ k: "up", p: 0 });
    const res = await upload.done;
    if (job.current !== upload) return;
    job.current = null;
    if (res.ok) {
      onChange(res.doc);
      setPhase({ k: "idle" });
    } else setPhase({ k: "bad", msg: explain(t, res) });
  }

  const up = phase.k === "up" ? phase : null;
  const shown = phase.k === "bad" ? phase.msg : doc ? null : error;
  const rule = fill(t.docs.rule, { mb: FILE_MAX_MB });

  return (
    <div className="mf-doc-w">
      <div
        className={`mf-doc${doc && !up ? " is-done" : ""}${drag ? " is-drag" : ""}${shown ? " is-bad" : ""}${up ? " is-up" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!drag) setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
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
            {label}
            {optional ? <span className="mf-opt">{optional}</span> : null}
          </p>
          <p className="mf-doc-m" id={`${id}-m`} aria-live="polite">
            {up ? (
              fill(t.docs.uploading, { p: up.p })
            ) : drag ? (
              t.docs.drop
            ) : doc ? (
              <>
                <span className="mf-doc-fn">{doc.name}</span>
                <span className="mf-doc-sz">{fileSize(doc.size, locale)}</span>
              </>
            ) : (
              `${hint} · ${rule}`
            )}
          </p>
          {up ? (
            <span className="mf-doc-bar" aria-hidden="true">
              <i style={{ inlineSize: `${Math.max(4, up.p)}%` }} />
            </span>
          ) : null}
        </div>
        <div className="mf-doc-acts">
          {up ? (
            <button
              type="button"
              className="ma-link"
              onClick={() => {
                job.current?.abort();
                job.current = null;
                setPhase({ k: "idle" });
              }}
            >
              {t.docs.cancel}
            </button>
          ) : (
            <>
              <button
                type="button"
                id={id}
                className={`btn btn-sm ${doc ? "btn-line" : "btn-ink"}`}
                aria-describedby={[`${id}-t`, `${id}-m`, shown ? `${id}-err` : ""].filter(Boolean).join(" ")}
                onClick={() => input.current?.click()}
              >
                {doc ? t.docs.replace : t.docs.choose}
              </button>
              {doc ? (
                <button type="button" className="ma-icon-btn" aria-label={fill(t.docs.remove, { name: doc.name })} onClick={() => onChange(null)}>
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
      {shown ? <FieldError id={`${id}-err`}>{shown}</FieldError> : null}
    </div>
  );
}
