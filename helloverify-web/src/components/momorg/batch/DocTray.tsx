"use client";

import { fileSize } from "@/components/momapply/flow/DocSlot";
import { Select } from "@/components/momapply/flow/Fields";
import { fill } from "@/components/momapply/fill";
import { CrossIcon, FileIcon } from "@/components/momapply/icons";
import { FieldError } from "@/components/momapply/PasswordField";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { candidateSlots, type Candidate } from "@/lib/mom/org/batch";

import { qualName } from "./DocCard";
import type { TrayItem } from "./useBulkUpload";

function slotLabel(c: Candidate, key: string, s: MomStepsCopy, t: MomOrgCopy): string {
  if (key === "passport") return s.docs.passport;
  const [qid, kind] = key.split(":") as [string, keyof MomStepsCopy["docs"]["hints"]];
  const i = c.quals.findIndex((q) => q.id === qid);
  return `${s.docs[kind]} · ${i >= 0 ? qualName(c.quals[i], i + 1, s, t) : ""}`;
}

/** Files the names didn't place. Choose whose and what, then place. */
export function DocTray({
  items,
  candidates,
  onEdit,
  onPlace,
  onDiscard,
  t,
  s,
  locale,
}: {
  items: readonly TrayItem[];
  candidates: readonly Candidate[];
  onEdit: (id: string, patch: Partial<Pick<TrayItem, "candidate" | "slot">>) => void;
  onPlace: (id: string) => void;
  onDiscard: (id: string) => void;
  t: MomOrgCopy;
  s: MomStepsCopy;
  locale: string;
}) {
  const d = t.docs;
  return (
    <section className="mo-tray" aria-labelledby="mo-tray-t">
      <p className="ma-l mo-tray-t" id="mo-tray-t">
        {d.tray}
        <span>{items.length}</span>
      </p>
      <ul>
        {items.map((item) => {
          const c = candidates.find((x) => x.id === item.candidate);
          const id = `mo-tr-${item.id}`;
          return (
            <li key={item.id} className="mo-tray-i">
              <span className="mf-doc-ic" aria-hidden="true">
                <FileIcon />
              </span>
              <p className="mo-tray-f">
                <bdi>{item.file.name}</bdi>
                <small>{fileSize(item.file.size, locale)}</small>
              </p>
              <div className="mo-tray-sel">
                <Select
                  id={`${id}-c`}
                  label={d.candidate}
                  placeholder={d.candidate}
                  value={item.candidate}
                  onChange={(v) => onEdit(item.id, { candidate: v, slot: "" })}
                >
                  {candidates.map((x, i) => (
                    <option key={x.id} value={x.id}>
                      {`${String(i + 1).padStart(2, "0")} · ${x.fullName.trim() || t.batch.unnamed}`}
                    </option>
                  ))}
                </Select>
                <Select
                  id={`${id}-s`}
                  label={d.document}
                  placeholder={d.document}
                  value={c ? item.slot : ""}
                  onChange={(v) => onEdit(item.id, { slot: v })}
                >
                  {c
                    ? candidateSlots(c).map((slot) => {
                        const label = slotLabel(c, slot.key, s, t);
                        return (
                          <option key={slot.key} value={slot.key}>
                            {c.docs[slot.key] ? fill(d.replaces, { doc: label }) : label}
                          </option>
                        );
                      })
                    : null}
                </Select>
              </div>
              <div className="mo-tray-a">
                <button type="button" className="btn btn-ink btn-sm" disabled={!c || !item.slot} onClick={() => onPlace(item.id)}>
                  {d.place}
                </button>
                <button type="button" className="ma-icon-btn" aria-label={fill(d.discard, { name: item.file.name })} onClick={() => onDiscard(item.id)}>
                  <CrossIcon />
                </button>
              </div>
              {item.error ? <FieldError id={`${id}-err`}>{item.error}</FieldError> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
