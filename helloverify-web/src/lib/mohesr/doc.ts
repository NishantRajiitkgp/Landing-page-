/** MOHESR page copy from the live `mohesr.base.json`. The local repo's
 *  copy is an older shell; the page the education card opens is this one. */
import en from "./en.json";
import hi from "./hi.json";
import ar from "./ar.json";

export type MohesrDoc = typeof en;

const DOCS: Record<string, MohesrDoc> = {
  en,
  hi: hi as MohesrDoc,
  ar: ar as MohesrDoc,
};

export function mohesrDoc(locale: string): MohesrDoc {
  return DOCS[locale] ?? en;
}
