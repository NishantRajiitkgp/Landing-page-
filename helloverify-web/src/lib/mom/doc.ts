/** Ministry of Manpower page copy: `hero` + `screening` from
 *  `ministryOfManpower.base.json`, one file per locale. The page renders
 *  these strings; it does not paraphrase them. */
import en from "./en.json";
import hi from "./hi.json";
import ar from "./ar.json";

export type MomDoc = typeof en;

const DOCS: Record<string, MomDoc> = {
  en,
  hi: hi as MomDoc,
  ar: ar as MomDoc,
};

export function momDoc(locale: string): MomDoc {
  return DOCS[locale] ?? en;
}
