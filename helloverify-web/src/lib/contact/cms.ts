/** Contact page copy from `contactUs.base.json`. The enquiry form renders
 *  these strings. Office titles on the page use the live CMS ("New Delhi"),
 *  not the local file's Noida line. */
import en from "./cms/en.json";
import hi from "./cms/hi.json";
import ar from "./cms/ar.json";

export type ContactCms = typeof en;

const DOCS: Record<string, ContactCms> = {
  en,
  hi: hi as ContactCms,
  ar: ar as ContactCms,
};

export function contactCms(locale: string): ContactCms {
  return DOCS[locale] ?? en;
}

/** Live education-authority inbox. The local CMS still says "(add email)". */
export const MOHESR_EMAIL = "MOHESR@helloverify.ae";

export function contactEmail(email: string): string {
  return email === "(add email)" ? MOHESR_EMAIL : email;
}
