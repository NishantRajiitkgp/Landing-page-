/** A candidate list from a sheet: CSV, pasted cells or an Excel sheet's rows.
 *  One row per qualification; rows that share a passport number are one
 *  candidate. Headings are matched loosely, in any order; a sheet without
 *  them is read in the template's order. */
import { normalizeEmail, normalizeName } from "../account/policy";
import { blankQual, COURSE_MAX, FULL_NAME_MAX, INSTITUTION_MAX, MAX_QUALS, normalizePassport, STUDENT_ID_MAX } from "../apply/policy";
import type { Qual } from "../apply/types";

import { BATCH_MAX, blankCandidate, type Candidate } from "./batch";
import { fold, text, toCountry, toDay, toEnglish, toLevel, toMonth, toPass, type Cell } from "./cells";

export const COLUMNS = [
  "fullName",
  "email",
  "passportNo",
  "nationality",
  "dob",
  "passportExpiry",
  "passType",
  "level",
  "course",
  "institution",
  "country",
  "start",
  "end",
  "studentId",
  "english",
] as const;
type Column = (typeof COLUMNS)[number];
type Row = Partial<Record<Column, Cell>>;

/** The template's headings. English on every locale: they are read back by machine. */
export const HEADINGS: Record<Column, string> = {
  fullName: "Full name",
  email: "Email",
  passportNo: "Passport number",
  nationality: "Nationality",
  dob: "Date of birth",
  passportExpiry: "Passport expiry",
  passType: "Work pass",
  level: "Level",
  course: "Course",
  institution: "Institution",
  country: "Institution country",
  start: "Started",
  end: "Completed",
  studentId: "Student ID",
  english: "Documents in English",
};

const ALIASES: Record<Column, string[]> = {
  fullName: ["name", "candidate", "candidate name", "applicant name", "passport name", "name as per passport", "name as in passport"],
  email: ["email address", "e mail", "candidate email", "email id", "mail"],
  passportNo: ["passport", "passport no", "passport num", "passport #", "pp no"],
  nationality: ["citizenship", "passport country"],
  dob: ["dob", "birth date", "birthday", "d o b"],
  passportExpiry: ["passport expiry date", "expiry", "expiry date", "date of expiry", "passport valid until", "valid until"],
  passType: ["pass", "pass type", "work pass type"],
  level: ["qualification level", "qualification", "education level", "degree level"],
  course: ["course and specialisation", "specialisation", "specialization", "programme", "program", "degree", "major", "subject"],
  institution: ["university", "college", "school", "institute", "institution name", "university name"],
  country: ["country", "country of study", "study country", "institution country"],
  start: ["start", "start date", "start month", "from", "commenced"],
  end: ["end", "end date", "to", "graduated", "graduation", "completion", "completion date", "year of passing", "passing year"],
  studentId: ["roll number", "roll no", "student or roll number", "enrolment number", "enrollment number", "student number"],
  english: ["english", "in english", "english documents"],
};

const compact = (s: string) => fold(s).replace(/ /g, "");
const LOOKUP = new Map<string, Column>();
for (const c of COLUMNS) for (const name of [HEADINGS[c], ...ALIASES[c]]) LOOKUP.set(compact(name), c);

/** RFC 4180. The delimiter is read off the first line: an Excel `sep=` hint,
 *  otherwise whichever of tab, semicolon, pipe or comma appears most. */
export function parseDelimited(input: string): string[][] {
  let src = input.replace(/^\uFEFF/, "");
  const breakAt = src.search(/\r?\n/);
  const first = breakAt === -1 ? src : src.slice(0, breakAt);
  const hinted = /^sep=\s*([,;\t|])/i.exec(first.trim());
  let delim = hinted?.[1] ?? "";
  if (hinted) src = breakAt === -1 ? "" : src.slice(breakAt).replace(/^\r?\n/, "");
  if (!delim) {
    const line = hinted ? "" : first;
    const count = (ch: string) => line.split(ch).length - 1;
    let best = 0;
    for (const ch of ["\t", ";", "|", ","]) {
      const n = count(ch);
      if (n > best) {
        best = n;
        delim = ch;
      }
    }
    if (!delim) delim = ",";
  }
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"' && field === "") quoted = true;
    else if (ch === delim) {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function templateCsv(): string {
  return `\uFEFF${COLUMNS.map((c) => HEADINGS[c]).join(",")}\r\n`;
}

const empty = (cells: readonly Cell[]) => cells.every((c) => text(c) === "");

function columnsOf(table: readonly (readonly Cell[])[]): { start: number; map: (Column | null)[] } {
  for (let r = 0; r < Math.min(table.length, 5); r++) {
    const seen = new Set<Column>();
    const map = table[r].map((cell) => {
      const col = LOOKUP.get(compact(text(cell)));
      if (!col || seen.has(col)) return null;
      seen.add(col);
      return col;
    });
    if (seen.size >= 2) return { start: r + 1, map };
  }
  return { start: 0, map: [...COLUMNS] };
}

const clip = (s: string, max: number) => s.slice(0, max);

function qualOf(row: Row): Qual | null {
  const q: Qual = {
    ...blankQual(),
    level: toLevel(row.level),
    course: clip(text(row.course), COURSE_MAX),
    institution: clip(text(row.institution), INSTITUTION_MAX),
    country: toCountry(row.country),
    start: toMonth(row.start),
    end: toMonth(row.end),
    studentId: clip(text(row.studentId), STUDENT_ID_MAX),
    english: toEnglish(row.english),
  };
  return q.level || q.course || q.institution || q.country || q.start || q.end ? q : null;
}

const sameQual = (a: Qual, b: Qual) =>
  fold(a.institution) === fold(b.institution) && fold(a.course) === fold(b.course) && a.level === b.level;

const blankQualOnly = (c: Candidate) =>
  c.quals.length === 1 && !c.quals[0].level && !c.quals[0].course && !c.quals[0].institution;

/** Fills what the candidate is missing; a later row never overwrites. True
 *  when something was filled. */
function absorb(c: Candidate, row: Row): boolean {
  const read = {
    fullName: () => clip(normalizeName(text(row.fullName)), FULL_NAME_MAX),
    email: () => normalizeEmail(text(row.email).replace(/^mailto:/i, "").replace(/ /g, "")),
    passportNo: () => normalizePassport(text(row.passportNo)),
    nationality: () => toCountry(row.nationality),
    dob: () => toDay(row.dob),
    passportExpiry: () => toDay(row.passportExpiry),
    passType: () => toPass(row.passType),
  };
  let changed = false;
  for (const [field, value] of Object.entries(read) as [keyof typeof read, () => string][]) {
    if (c[field]) continue;
    const next = value();
    if (!next) continue;
    Object.assign(c, { [field]: next });
    changed = true;
  }
  return changed;
}

export type ImportReport = { added: number; updated: number; skipped: number; ids: string[] };

export function importRows(
  table: readonly (readonly Cell[])[],
  existing: readonly Candidate[],
): { candidates: Candidate[]; report: ImportReport } {
  const { start, map } = columnsOf(table);
  const list = existing.map((c) => ({ ...c, quals: [...c.quals] }));
  const byPassport = new Map(list.filter((c) => c.passportNo).map((c) => [c.passportNo, c]));
  const known = new Set(existing.map((c) => c.id));
  const added = new Set<string>();
  const updated = new Set<string>();
  let skipped = 0;

  for (const cells of table.slice(start)) {
    if (empty(cells)) continue;
    const row: Row = {};
    map.forEach((col, i) => {
      if (col) row[col] = cells[i];
    });
    const passport = normalizePassport(text(row.passportNo));
    const named = text(row.fullName) || text(row.email);
    let c = passport ? byPassport.get(passport) : undefined;
    /** A following row with only a qualification belongs to the candidate above it. */
    if (!c && !passport && !named && list.length) c = list[list.length - 1];
    if (!c) {
      if (list.length >= BATCH_MAX) {
        skipped++;
        continue;
      }
      c = { ...blankCandidate(), quals: [] };
      list.push(c);
      added.add(c.id);
      if (passport) byPassport.set(passport, c);
    }
    let changed = absorb(c, row);
    const q = qualOf(row);
    if (q && !c.quals.some((x) => sameQual(x, q))) {
      if (blankQualOnly(c)) c.quals = [q];
      else if (c.quals.length < MAX_QUALS) c.quals.push(q);
      else skipped++;
      changed ||= c.quals.includes(q);
    }
    if (changed && known.has(c.id)) updated.add(c.id);
  }

  for (const c of list) if (!c.quals.length) c.quals.push(blankQual());
  return { candidates: list, report: { added: added.size, updated: updated.size, skipped, ids: [...added, ...updated] } };
}

/** Typed institution names whose place on MOM's list is still unknown. */
export function unresolved(candidates: readonly Candidate[], ids: ReadonlySet<string>): string[] {
  const names = new Map<string, string>();
  for (const c of candidates) {
    if (!ids.has(c.id)) continue;
    for (const q of c.quals) if (q.institution && q.listed === null) names.set(fold(q.institution), q.institution);
  }
  return [...names.values()];
}
