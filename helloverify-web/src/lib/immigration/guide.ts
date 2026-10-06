/** The old applicant Information Guide's wiring, as the old SPA had it: the
 *  visa back office it read embassies, offices and visa types from, the
 *  embassies with extra How to Apply content, the step-by-step PDFs it opened
 *  when a visa type was picked on How to Apply, and the Latvia links. Ids are
 *  the back office's. */
import type { FeatureIconId } from "@/components/immigration/ApplicantIcons";

export const VISA_GUIDE_UPSTREAM = "https://hello.helloverify.com/";

export const VISA_GUIDE_PATHS = {
  embassies: "CasesInformations/getClientList_WithGeorgiaEmbassy",
  countries: "CasesInformations/getCountrEmbassyAdmin_v2",
  "visa-types": "CasesInformations/getVisaTypecategory",
} as const;

export type VisaGuideAction = keyof typeof VISA_GUIDE_PATHS;

export const EMBASSY_ID = { latvia: 1321272, italy: 1399617 } as const;

/** `[embassy, office, visa type, file]`, the old `showPdf()` table as it was. */
export const GUIDE_PDFS: readonly (readonly [number, number, number, string])[] = [
  [1399617, 464410, 1013, "ItalianCompanyCheck.pdf"],
  [1399617, 464410, 1011, "ItalianGeneralVisa.pdf"],
  [1399617, 464410, 1002, "ItalianStudentVisa.pdf"],
  [1399617, 464410, 1012, "ItalianWorkVisa.pdf"],
  [1321272, 279135, 1015, "LatviaWorkVisa.pdf"],
  [1321272, 279135, 1002, "LatviaStudentVisa.pdf"],
];

export const GUIDE_PDF_BASE = "/docs/immigration/";

export const LATVIA_LINKS = {
  indian: "https://www2.mfa.gov.lv/en/newdelhi/consular-section/applying-for-a-long-stay-visa/students/indian-nationals",
  srilankan: "https://www2.mfa.gov.lv/en/newdelhi/consular-section/applying-for-a-long-stay-visa/students/sri-lankan-nationals",
  nepalese: "https://www2.mfa.gov.lv/en/newdelhi/consular-section/applying-for-a-long-stay-visa/students/nepalese-nationals",
  bangladeshi: "https://www2.mfa.gov.lv/en/newdelhi/consular-section/applying-for-a-long-stay-visa",
} as const;

/** Premium Service feature icons, in the old package order. */
export const PREMIUM_FEATURE_ICONS = {
  clearance: ["clock", "formEdit", "clipboard", "phone"],
  premium: ["clock", "formEdit", "clipboard", "dedicatedSupport", "phone", "video", "calendar"],
} as const satisfies Record<string, readonly FeatureIconId[]>;

export type GuideEmbassy = { id: number; name: string };
export type GuideOffice = { id: number; name: string };
export type GuideSubtype = { id: number; name: string };
export type GuideVisa = { id: number; name: string; subtypes: readonly GuideSubtype[] };
