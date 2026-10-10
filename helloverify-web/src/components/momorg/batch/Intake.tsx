"use client";

import { useRef, useState } from "react";

import { fill } from "@/components/momapply/fill";
import { DownloadIcon, FileIcon, PlusIcon } from "@/components/momapply/icons";
import { FieldError } from "@/components/momapply/PasswordField";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import { BATCH_MAX } from "@/lib/mom/org/batch";

import { downloadTemplate, TABLE_ACCEPT } from "./readTable";

export type Busy = "reading" | "checking" | null;
export const ADD_ID = "mo-add";

/** The three ways in: one at a time, pasted cells, or a file. An empty batch
 *  leads with the drop zone; a filled one keeps the actions in a row. */
export function Intake({
  t,
  count,
  busy,
  missing,
  onAdd,
  onFile,
  onPaste,
}: {
  t: MomOrgCopy;
  count: number;
  busy: Busy;
  missing: boolean;
  onAdd: () => void;
  onFile: (file: File) => void;
  onPaste: (text: string) => void;
}) {
  const b = t.batch;
  const input = useRef<HTMLInputElement>(null);
  const [pasting, setPasting] = useState(false);
  const [text, setText] = useState("");
  const full = count >= BATCH_MAX;
  const pick = () => input.current?.click();

  return (
    <div className="mo-in">
      <input
        ref={input}
        type="file"
        accept={TABLE_ACCEPT}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onFile(file);
        }}
      />
      {count ? null : (
        <button type="button" className="mo-zone" onClick={pick} disabled={busy !== null}>
          <span className="mo-zone-i">
            <FileIcon />
          </span>
          <span className="mo-zone-t">{b.drop}</span>
          <span className="mo-zone-m">{fill(b.formats, { max: BATCH_MAX })}</span>
          <span className="btn btn-line btn-sm mo-zone-b">{b.choose}</span>
        </button>
      )}

      <div className="mo-acts">
        <button
          type="button"
          id={ADD_ID}
          className="btn btn-ink btn-sm"
          disabled={full}
          aria-describedby={missing ? `${ADD_ID}-err` : undefined}
          onClick={onAdd}
        >
          <PlusIcon />
          {b.add}
        </button>
        <button
          type="button"
          className={`btn btn-line btn-sm${pasting ? " is-on" : ""}`}
          disabled={full || busy !== null}
          aria-expanded={pasting}
          aria-controls="mo-paste"
          onClick={() => setPasting(!pasting)}
        >
          {b.paste}
        </button>
        {count ? (
          <button type="button" className="btn btn-line btn-sm" disabled={full || busy !== null} onClick={pick}>
            <FileIcon />
            {b.import}
          </button>
        ) : null}
        <button type="button" className="btn btn-line btn-sm mo-tpl" onClick={() => downloadTemplate(b.templateFile)}>
          <DownloadIcon />
          {b.template}
        </button>
      </div>

      {missing ? <FieldError id={`${ADD_ID}-err`}>{b.empty}</FieldError> : null}
      {full ? <p className="mf-hint">{fill(b.full, { max: BATCH_MAX })}</p> : null}

      {busy ? (
        <p className="mo-busy" role="status">
          <span className="ma-spin" aria-hidden="true" />
          {busy === "reading" ? b.reading : b.checking}
        </p>
      ) : null}

      <div className="mo-paste" id="mo-paste" hidden={!pasting}>
        {pasting ? (
          <>
            <label className="ma-l" htmlFor="mo-paste-t">
              {b.pasteLabel}
            </label>
            <div className="ma-ctl mo-paste-ctl">
              <textarea
                id="mo-paste-t"
                dir="ltr"
                rows={6}
                spellCheck={false}
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="mo-paste-f">
              <button
                type="button"
                className="btn btn-ink btn-sm"
                disabled={!text.trim()}
                onClick={() => {
                  onPaste(text);
                  setText("");
                  setPasting(false);
                }}
              >
                {b.pasteAdd}
              </button>
              <button type="button" className="btn btn-line btn-sm" onClick={() => setPasting(false)}>
                {b.cancel}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
