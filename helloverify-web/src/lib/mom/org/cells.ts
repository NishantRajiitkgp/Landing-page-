/** Spreadsheet cells to batch fields. Lenient on the way in: whatever the
 *  sheet's author typed is read when it is unambiguous and left empty when it
 *  is not, so the row is flagged rather than guessed. Dates are day-first, as
 *  written in Singapore, India and the Philippines. */
import { COUNTRY_CODES } from "../apply/countries";
import { LEVELS, PASS_TYPES, type Level, type PassType } from "../apply/types";

export type Cell = string | number | boolean | Date | null | undefined;

const p2 = (n: number) => String(n).padStart(2, "0");

export const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const isoDay = (d: Date) => `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`;

export function text(cell: Cell): string {
  if (cell === null || cell === undefined) return "";
  if (cell instanceof Date) return Number.isNaN(cell.getTime()) ? "" : isoDay(cell);
  if (typeof cell === "boolean") return cell ? "yes" : "no";
  return String(cell).replace(/\s+/g, " ").trim();
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const monthOf = (word: string) => MONTHS.indexOf(word.slice(0, 3).toLowerCase()) + 1;

function ymd(y: number, m: number, d: number): string {
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d ? isoDay(date) : "";
}

/** Excel stores dates as days since 1899-12-30 when the cell isn't formatted as one. */
const serial = (n: number) => (n > 0 && n < 100000 ? isoDay(new Date(Date.UTC(1899, 11, 30) + Math.round(n) * 86400000)) : "");

/** 90 → 1990, 05 → 2005. Sheets from this region still write the year short. */
const yearOf = (yy: number) => (yy >= 100 ? yy : yy >= 50 ? 1900 + yy : 2000 + yy);

export function toDay(cell: Cell): string {
  if (cell instanceof Date) return text(cell);
  if (typeof cell === "number") return serial(cell);
  const s = text(cell).replace(/(\d)(?:st|nd|rd|th)\b/gi, "$1");
  let m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T ].*)?$/.exec(s);
  if (m) return ymd(+m[1], +m[2], +m[3]);
  m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/.exec(s);
  if (m) return ymd(yearOf(+m[3]), +m[2], +m[1]);
  m = /^(\d{1,2})[-\s]([a-z]{3,9})\.?[-,\s]*(\d{2,4})$/i.exec(s);
  if (m && monthOf(m[2])) return ymd(yearOf(+m[3]), monthOf(m[2]), +m[1]);
  m = /^([a-z]{3,9})\.? (\d{1,2}),? (\d{2,4})$/i.exec(s);
  if (m && monthOf(m[1])) return ymd(yearOf(+m[3]), monthOf(m[1]), +m[2]);
  return "";
}

const month = (y: number, m: number) => (m >= 1 && m <= 12 ? `${y}-${p2(m)}` : "");

/** `YYYY-MM`. A bare year comes back as `YYYY-`, so the month is asked for. */
export function toMonth(cell: Cell): string {
  if (cell instanceof Date) return text(cell).slice(0, 7);
  if (typeof cell === "number") return cell >= 1900 && cell <= 2100 ? `${Math.trunc(cell)}-` : serial(cell).slice(0, 7);
  const s = text(cell);
  let m = /^(\d{4})[-/.](\d{1,2})$/.exec(s);
  if (m) return month(+m[1], +m[2]);
  m = /^(\d{1,2})[-/.](\d{4})$/.exec(s);
  if (m) return month(+m[2], +m[1]);
  m = /^([a-z]{3,9})\.?[ -,']*(\d{4})$/i.exec(s);
  if (m && monthOf(m[1])) return month(+m[2], monthOf(m[1]));
  if (/^\d{4}$/.test(s)) return `${s}-`;
  return toDay(cell).slice(0, 7);
}

/** Demonyms, short forms and passport (ICAO) codes for where most candidates come from. */
const COUNTRY_ALIASES: Record<string, string> = {
  indian: "IN", ind: "IN", filipino: "PH", filipina: "PH", philippine: "PH", phl: "PH", chinese: "CN", chn: "CN",
  malaysian: "MY", mys: "MY", indonesian: "ID", idn: "ID", vietnamese: "VN", vnm: "VN", vietnam: "VN", "viet nam": "VN",
  bangladeshi: "BD", bgd: "BD", "sri lankan": "LK", lka: "LK", burmese: "MM", myanmar: "MM", burma: "MM", mmr: "MM",
  pakistani: "PK", pak: "PK", nepali: "NP", nepalese: "NP", npl: "NP", thai: "TH", tha: "TH",
  singaporean: "SG", sgp: "SG", british: "GB", uk: "GB", gbr: "GB", england: "GB", "great britain": "GB",
  american: "US", usa: "US", "united states of america": "US", australian: "AU", aus: "AU",
  "hong kong": "HK", uae: "AE", emirati: "AE", "south korea": "KR", korean: "KR", japanese: "JP",
};

let byName: Map<string, string> | null = null;

function countryIndex(): Map<string, string> {
  if (byName) return byName;
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  byName = new Map(Object.entries(COUNTRY_ALIASES));
  for (const code of COUNTRY_CODES) {
    const name = names.of(code);
    if (!name) continue;
    byName.set(fold(name), code);
    const short = fold(name.replace(/\s*\(.*\)$/, "").replace(/ SAR China$/, ""));
    if (!byName.has(short)) byName.set(short, code);
  }
  return byName;
}

export function toCountry(cell: Cell): string {
  const s = text(cell);
  if (!s) return "";
  const compact = fold(s).replace(/ /g, "");
  if (compact === "usa" || compact === "us") return "US";
  if (compact === "uk") return "GB";
  if (compact === "prc") return "CN";
  if (COUNTRY_CODES.has(s.toUpperCase())) return s.toUpperCase();
  const index = countryIndex();
  const bare = fold(s).replace(/^(republic of( the)?|the) /, "");
  return index.get(fold(s)) ?? index.get(bare) ?? "";
}

const PASS_NAMES: Record<string, PassType> = {
  "employment pass": "EP",
  "s pass": "SP",
  "one pass": "ONE",
  "overseas networks expertise pass": "ONE",
  "personalised employment pass": "PEP",
  "personalized employment pass": "PEP",
  "training employment pass": "TEP",
};

export function toPass(cell: Cell): PassType | "" {
  const s = fold(text(cell));
  if (!s) return "";
  const code = s.replace(/ /g, "").toUpperCase();
  if ((PASS_TYPES as readonly string[]).includes(code)) return code as PassType;
  if (PASS_NAMES[s]) return PASS_NAMES[s];
  if (/\btraining employment pass\b/.test(s) || code === "TEP") return "TEP";
  if (/\bpersonalised employment pass\b|\bpersonalized employment pass\b/.test(s) || code === "PEP") return "PEP";
  if (/\bone pass\b|\boverseas networks expertise pass\b/.test(s)) return "ONE";
  if (/\bs pass\b/.test(s) || code === "SPASS") return "SP";
  if (/\bemployment pass\b/.test(s)) return "EP";
  return "";
}

const LEVEL_WORDS: [RegExp, Level][] = [
  [/\b(phd|ph d|doctor(ate)?|dphil|edd)\b/, "doctorate"],
  [/\b(post ?graduate diploma|pg ?diploma|pgd|pgdm)\b/, "pgDiploma"],
  [/\badvanced diploma\b/, "advancedDiploma"],
  [/\b(masters?|m sc|msc|mba|m tech|mtech|ma|mcom|mca|m eng|meng|llm)\b/, "master"],
  [/\b(bachelors?|degree|undergraduate|b sc|bsc|ba|b tech|btech|be|b e|bcom|bca|beng|b eng|llb|bba)\b/, "bachelor"],
  [/\bdiploma\b/, "diploma"],
  [/\b(professional|certification|chartered)\b/, "professional"],
];

export function toLevel(cell: Cell): Level | "" {
  const s = fold(text(cell));
  if (!s) return "";
  const key = LEVELS.find((l) => l.toLowerCase() === s.replace(/ /g, ""));
  if (key) return key;
  return LEVEL_WORDS.find(([re]) => re.test(s))?.[1] ?? "";
}

/** Empty reads as yes: most certificates are issued in English. */
export function toEnglish(cell: Cell): boolean {
  if (typeof cell === "boolean") return cell;
  const s = fold(text(cell));
  return !["no", "n", "false", "0", "non english", "not english"].includes(s);
}
