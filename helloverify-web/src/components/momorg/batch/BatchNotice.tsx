import { fill } from "@/components/momapply/fill";
import { AlertIcon, CrossIcon, TickIcon } from "@/components/momapply/icons";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { Candidate } from "@/lib/mom/org/batch";
import type { ImportReport } from "@/lib/mom/org/sheet";

export type Notice =
  | { kind: "import"; report: ImportReport }
  | { kind: "removed"; ids: string[]; before: Candidate[] }
  | { kind: "error"; text: string };

/** What the last import or removal did, with its one follow-up. */
export function BatchNotice({
  notice,
  toFix,
  onShow,
  onUndo,
  onDismiss,
  t,
}: {
  notice: Notice | null;
  /** Imported candidates still flagged. */
  toFix: number;
  onShow: () => void;
  onUndo: () => void;
  onDismiss: () => void;
  t: MomOrgCopy;
}) {
  const b = t.batch;
  let text = "";
  if (notice?.kind === "import") {
    const r = notice.report;
    text = [
      r.added ? fill(b.added, { n: r.added }) : "",
      r.updated ? fill(b.updated, { n: r.updated }) : "",
      r.skipped ? fill(b.skipped, { n: r.skipped }) : "",
      toFix ? fill(b.toFix, { n: toFix }) : "",
    ]
      .filter(Boolean)
      .join(" · ");
  } else if (notice?.kind === "removed") text = fill(b.removed, { n: notice.ids.length });
  else if (notice) text = notice.text;

  return (
    <div className="mo-note-w" aria-live="polite">
      {notice ? (
        <p className={`mo-note${notice.kind === "error" ? " is-bad" : ""}`}>
          {notice.kind === "error" ? <AlertIcon /> : <TickIcon />}
          <span>{text}</span>
          {notice.kind === "import" && toFix ? (
            <button type="button" className="mo-link" onClick={onShow}>
              {b.show}
            </button>
          ) : null}
          {notice.kind === "removed" ? (
            <button type="button" className="mo-link" onClick={onUndo}>
              {b.undo}
            </button>
          ) : null}
          <button type="button" className="ma-icon-btn" aria-label={b.dismiss} onClick={onDismiss}>
            <CrossIcon />
          </button>
        </p>
      ) : null}
    </div>
  );
}
