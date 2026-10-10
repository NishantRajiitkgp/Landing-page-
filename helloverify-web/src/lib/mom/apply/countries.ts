/** Countries for nationality and institution pickers. Names come from
 *  `Intl.DisplayNames`, so every locale reads its own. The leaders are where
 *  most MOM applicants hold passports and degrees. */

const LEADERS = ["IN", "PH", "CN", "MY", "ID", "VN", "BD", "LK", "MM", "PK", "NP", "TH", "SG", "GB", "US", "AU"];

const ALL = (
  "AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC " +
  "CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA " +
  "GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IQ IR IS IT JE JM JO JP KE KG " +
  "KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT " +
  "MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS " +
  "RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW " +
  "TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW"
).split(" ");

export const COUNTRY_CODES: ReadonlySet<string> = new Set(ALL);

export type CountryOption = { code: string; name: string };

const cache = new Map<string, { leaders: CountryOption[]; rest: CountryOption[] }>();

export function countryOptions(locale: string) {
  const hit = cache.get(locale);
  if (hit) return hit;
  const names = new Intl.DisplayNames([locale, "en"], { type: "region" });
  const option = (code: string) => ({ code, name: names.of(code) ?? code });
  const collator = new Intl.Collator(locale);
  const leaders = LEADERS.map(option);
  const rest = ALL.filter((c) => !LEADERS.includes(c))
    .map(option)
    .sort((a, b) => collator.compare(a.name, b.name));
  const built = { leaders, rest };
  cache.set(locale, built);
  return built;
}

export function countryName(code: string, locale: string): string {
  if (!code) return "";
  return new Intl.DisplayNames([locale, "en"], { type: "region" }).of(code) ?? code;
}
