"use client";

import type { Cell } from "@/lib/mom/org/cells";
import { parseDelimited, templateCsv } from "@/lib/mom/org/sheet";

export const TABLE_MAX_MB = 5;
const TABLE_MAX_BYTES = TABLE_MAX_MB * 1024 * 1024;
export const TABLE_ACCEPT =
  ".csv,.tsv,.txt,.xlsx,text/csv,text/tab-separated-values,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export type TableResult = { ok: true; rows: Cell[][] } | { ok: false; code: "bad_file" | "too_large" };

/** The first sheet of an `.xlsx`, or a CSV / TSV. The Excel reader loads on
 *  first use, without a worker, so the page's script policy is untouched. */
export async function readTable(file: File): Promise<TableResult> {
  if (file.size > TABLE_MAX_BYTES) return { ok: false, code: "too_large" };
  const name = file.name.toLowerCase();
  try {
    if (name.endsWith(".xlsx")) {
      const { readSheet } = await import("read-excel-file/universal");
      return { ok: true, rows: (await readSheet(file)) as Cell[][] };
    }
    if (/\.(csv|tsv|txt)$/.test(name) || file.type.startsWith("text/")) {
      return { ok: true, rows: parseDelimited(await file.text()) };
    }
  } catch {
    /* unreadable: same answer as the wrong kind of file */
  }
  return { ok: false, code: "bad_file" };
}

export function downloadTemplate(filename: string) {
  const url = URL.createObjectURL(new Blob([templateCsv()], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
