/** `/employee-verification` — one line mark per check, keyed by the check's
 *  copy key (`business.employeeVerification.{white,blue}.checks`). Drawn on
 *  a 24 grid; stroke, width and caps come from the stylesheet. */
import type { ReactNode } from "react";

const DOC = "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z";
const GAVEL = (
  <>
    <path d="M12.6 5.9l3.5-3.5 5.5 5.5-3.5 3.5Z" />
    <path d="M15.3 8.7 4.6 19.4" />
    <path d="M3 21h8" />
  </>
);

const MARKS: Record<string, ReactNode> = {
  education: (
    <>
      <path d="M2 9.5 12 4.5l10 5-10 5Z" />
      <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
      <path d="M22 9.5v5" />
    </>
  ),
  identity: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10.5" r="2" />
      <path d="M5.8 15.8c.6-1.4 1.8-2.1 3.2-2.1s2.6.7 3.2 2.1" />
      <path d="M14.5 10h4M14.5 13.5h3" />
    </>
  ),
  employment: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M3 12.5h18" />
      <path d="M12 11.5v2" />
    </>
  ),
  criminalRecords: GAVEL,
  reference: (
    <>
      <path d="M3 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8l-3.5 2.8V13A2 2 0 0 1 3 11Z" />
      <path d="M18 8.5h1a2 2 0 0 1 2 2v5a2 2 0 0 1-1.5 1.9V20L16 17.5h-4a2 2 0 0 1-2-2" />
    </>
  ),
  drugTest: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6.5l-5.2 8.7A1.8 1.8 0 0 0 6.3 21h11.4a1.8 1.8 0 0 0 1.5-2.8L14 9.5V3" />
      <path d="M7.4 15h9.2" />
    </>
  ),
  globalDatabase: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.6 3.7 5.6 3.7 9s-1.3 6.4-3.7 9c-2.4-2.6-3.7-5.6-3.7-9S9.6 5.6 12 3Z" />
    </>
  ),
  address: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  company: (
    <>
      <path d="M4.5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
      <path d="M14.5 9h4a1 1 0 0 1 1 1v11" />
      <path d="M2.5 21h19" />
      <path d="M8 8h3M8 12h3M8 16h3" />
    </>
  ),
  credit: (
    <>
      <path d="M3.5 17a8.5 8.5 0 0 1 17 0" />
      <path d="M12 17l4.2-4.6" />
      <circle cx="12" cy="17" r="1.3" />
      <path d="M6 11l1.1 1.1M12 8.5v1.6" />
    </>
  ),
  criminalLawFirm: (
    <>
      <path d="M12 4v16M8.5 20h7M5 7.5h14" />
      <path d="M5 7.5 2.5 13.5a2.5 2.5 0 0 0 5 0Z" />
      <path d="M19 7.5l-2.5 6a2.5 2.5 0 0 0 5 0Z" />
    </>
  ),
  directorship: (
    <>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 21c.6-4 3.4-6.5 7-6.5s6.4 2.5 7 6.5" />
      <path d="M12 14.5l-1.2 1.8L12 19.5l1.2-3.2Z" />
    </>
  ),
  form16: (
    <>
      <path d={DOC} />
      <path d="M14 3v5h5" />
      <path d="M9.5 17.5l5-6" />
      <circle cx="10" cy="12.2" r=".9" />
      <circle cx="14" cy="16.8" r=".9" />
    </>
  ),
  resume: (
    <>
      <path d={DOC} />
      <path d="M14 3v5h5" />
      <circle cx="12" cy="11.5" r="2" />
      <path d="M8.5 17.2c.6-1.4 1.9-2.2 3.5-2.2s2.9.8 3.5 2.2" />
    </>
  ),
  pan: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M6.5 9.5h6M6.5 13h5M6.5 16h3" />
      <rect x="14.5" y="9" width="3.5" height="4.5" rx=".8" />
    </>
  ),
  registration: (
    <>
      <path d="M3.5 16v-3.5l2.1-4.9a1.8 1.8 0 0 1 1.7-1.1h9.4a1.8 1.8 0 0 1 1.7 1.1l2.1 4.9V16a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1Z" />
      <path d="M3.5 12.5h17" />
      <path d="M6 17v2M18 17v2" />
      <path d="M7 14.7h1.5M15.5 14.7H17" />
    </>
  ),
  drivingLicense: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M3.5 12h6.3M14.2 12h6.3M12 14.2v6.3" />
    </>
  ),
  pennyDrop: (
    <>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M4.5 9.5h15" />
      <path d="M6.5 12v5M10 12v5M14 12v5M17.5 12v5" />
      <path d="M3 20h18" />
    </>
  ),
  liveness: (
    <>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M9.5 10v1M14.5 10v1" />
      <path d="M9.5 14.5a3.5 3.5 0 0 0 5 0" />
    </>
  ),
};

export function CheckIcon({ k }: { k: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {MARKS[k] ?? <path d="M5 12.5l4.5 4.5L19 7.5" />}
    </svg>
  );
}
