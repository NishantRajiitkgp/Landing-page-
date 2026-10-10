/** Country calling codes for the sales form.
 *
 *  One row per flag in `public/flags/` (flag-icons, MIT). India leads, then the
 *  countries we operate from, then the rest A–Z. Dial values are unique in
 *  this set, so the posted value can be the code itself (`+91`).
 */

export type DialCode = {
  readonly iso: string;
  readonly name: string;
  readonly dial: string;
};

const ALL: readonly DialCode[] = [
  { iso: "AF", name: "Afghanistan", dial: "+93" },
  { iso: "DZ", name: "Algeria", dial: "+213" },
  { iso: "AO", name: "Angola", dial: "+244" },
  { iso: "AG", name: "Antigua and Barbuda", dial: "+1268" },
  { iso: "AR", name: "Argentina", dial: "+54" },
  { iso: "AM", name: "Armenia", dial: "+374" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "AT", name: "Austria", dial: "+43" },
  { iso: "BH", name: "Bahrain", dial: "+973" },
  { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "BR", name: "Brazil", dial: "+55" },
  { iso: "CM", name: "Cameroon", dial: "+237" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "EG", name: "Egypt", dial: "+20" },
  { iso: "FI", name: "Finland", dial: "+358" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "IL", name: "Israel", dial: "+972" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "KW", name: "Kuwait", dial: "+965" },
  { iso: "LV", name: "Latvia", dial: "+371" },
  { iso: "MY", name: "Malaysia", dial: "+60" },
  { iso: "MV", name: "Maldives", dial: "+960" },
  { iso: "MU", name: "Mauritius", dial: "+230" },
  { iso: "MX", name: "Mexico", dial: "+52" },
  { iso: "NP", name: "Nepal", dial: "+977" },
  { iso: "NZ", name: "New Zealand", dial: "+64" },
  { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "NO", name: "Norway", dial: "+47" },
  { iso: "OM", name: "Oman", dial: "+968" },
  { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "PL", name: "Poland", dial: "+48" },
  { iso: "QA", name: "Qatar", dial: "+974" },
  { iso: "RU", name: "Russia", dial: "+7" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "SK", name: "Slovakia", dial: "+421" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "ES", name: "Spain", dial: "+34" },
  { iso: "LK", name: "Sri Lanka", dial: "+94" },
  { iso: "SD", name: "Sudan", dial: "+249" },
  { iso: "SE", name: "Sweden", dial: "+46" },
  { iso: "CH", name: "Switzerland", dial: "+41" },
  { iso: "SY", name: "Syria", dial: "+963" },
  { iso: "TH", name: "Thailand", dial: "+66" },
  { iso: "UA", name: "Ukraine", dial: "+380" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "VE", name: "Venezuela", dial: "+58" },
  { iso: "VN", name: "Vietnam", dial: "+84" },
  { iso: "ZW", name: "Zimbabwe", dial: "+263" },
];

/** India, then the offices, then everyone else by name. */
const PINNED = ["IN", "AE", "SG", "PH", "EG", "US", "GB"];

const byIso = new Map(ALL.map((row) => [row.iso, row]));

export const DIAL_CODES: readonly DialCode[] = [
  ...PINNED.map((iso) => byIso.get(iso)!),
  ...ALL.filter((row) => !PINNED.includes(row.iso)).sort((a, b) => a.name.localeCompare(b.name)),
];

export const DEFAULT_DIAL = "+91";

const KNOWN = new Set(DIAL_CODES.map((row) => row.dial));

export function isDialCode(value: string): boolean {
  return KNOWN.has(value);
}

export function dialCountry(dial: string): DialCode | undefined {
  return DIAL_CODES.find((row) => row.dial === dial);
}

export function flagSrc(iso: string): string {
  return `/flags/${iso.toLowerCase()}.svg`;
}
