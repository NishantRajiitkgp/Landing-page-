/** Draft dates for display. Draft dates are calendar dates with no zone, so
 *  they are read and formatted as UTC to keep the day the applicant picked. */
const format = (locale: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(`${locale}-u-nu-latn`, { timeZone: "UTC", ...options });

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;

/** The calendar day of a timestamp, in the applicant's own time zone. */
export function localDay(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

/** `2026-10-09` → `9 Oct 2026` */
export const formatDate = (iso: string, locale: string) =>
  DATE_RE.test(iso) ? format(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${iso}T00:00:00Z`)) : "—";

/** `2026-10-09` → `Fri, 9 Oct` */
export const formatDay = (iso: string, locale: string) =>
  DATE_RE.test(iso) ? format(locale, { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${iso}T00:00:00Z`)) : "—";

/** `2026-10` → `Oct 2026` */
export const formatMonth = (ym: string, locale: string) =>
  MONTH_RE.test(ym) ? format(locale, { month: "short", year: "numeric" }).format(new Date(`${ym}-01T00:00:00Z`)) : "—";
