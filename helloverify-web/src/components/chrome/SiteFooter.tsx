/**
 * Site footer — the canvas footer regrouped to the audience-first IA.
 * Coverage rule: every destination the current site exposes keeps a home here
 * (IA §9 migration map). Nothing from the old footer is dropped, only re-filed.
 */
import { Logo } from "@/components/brand/Logo";
import Image from "next/image";
import { CERTLINE_BOX } from "@/lib/img";

const COLS: { h: string; links: { label: string; href: string }[] }[] = [
  {
    h: "Governments",
    links: [
      { label: "Health authorities", href: "/governments/health" },
      { label: "Immigration authorities", href: "/governments/immigration" },
      { label: "Manpower & education", href: "/governments/manpower-education" },
      { label: "Trade & business", href: "/governments/trade" },
      { label: "Ministry of Manpower story", href: "/governments/manpower-education/ministry-of-manpower" },
    ],
  },
  {
    h: "Business",
    links: [
      { label: "Enterprise BGV", href: "/business/enterprise" },
      { label: "Small & medium business", href: "/business/smb" },
      { label: "Employee verification", href: "/business/employee-verification" },
      { label: "Customer KYC · Trust & Safety", href: "/business/customer-kyc" },
      { label: "Vendor due diligence · Certifier", href: "/business/certifier" },
    ],
  },
  {
    h: "Individuals",
    links: [
      { label: "HelloV — verify anyone", href: "/individuals/hellov" },
      { label: "Visa & immigration screening", href: "/individuals/immigration" },
      { label: "Home & family checks", href: "/individuals/home-family" },
    ],
  },
  {
    h: "Platform",
    links: [
      { label: "Technology & APIs", href: "/platform/technology" },
      { label: "Security & compliance", href: "/platform/security-compliance" },
      { label: "Global coverage — 120+ countries", href: "/platform/coverage" },
    ],
  },
  {
    h: "Resources",
    links: [
      { label: "All 33 checks", href: "/resources/checks" },
      { label: "Identity", href: "/checks/identity" },
      { label: "Employment", href: "/checks/employment" },
      { label: "Education", href: "/checks/education" },
      { label: "Criminal record", href: "/checks/criminal" },
      { label: "Global database", href: "/checks/global-database" },
      { label: "Country guides", href: "/resources/countries" },
      { label: "Glossary", href: "/resources/glossary" },
      { label: "Blog", href: "/resources/blog" },
    ],
  },
];

const CERTS = [
  { img: "/img/iso.jpg", alt: "ISO 27001" },
  { img: "/img/gdpr.jpg", alt: "GDPR" },
  { img: "/img/pbsa.jpg", alt: "PBSA" },
  { img: "/img/nsr.jpg", alt: "NSR" },
  { img: "/img/mom.jpg", alt: "Ministry of Manpower, Singapore" },
];

export function SiteFooter() {
  return (
    <footer className="foot2 hair-top">
      <div className="wrap">
        <div className="cols">
          <div className="fcol2 brandcol">
            <a href="/" aria-label="HelloVerify — home"><Logo width={103} height={30} /></a>
            <p className="blurb">
              Background verification at the primary source — for enterprises, governments and families.
            </p>
            <div className="socials">
              <a href="#" className="soc" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.2 6.2v6.3M3.2 3.5v.1M6.3 12.5V6.2m0 2.6c0-1.6 1.1-2.7 2.6-2.7s2.6 1 2.6 2.7v3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#" className="soc" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M9.2 13.5V8.7h1.7l.3-2H9.2V5.5c0-.6.2-1 1-1h1.1V2.7c-.2 0-.9-.1-1.6-.1-1.6 0-2.7 1-2.7 2.8v1.3H5.2v2H7v4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#" className="soc" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="2.5" y="2.5" width="11" height="11" rx="3.2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="11.2" cy="4.8" r="0.7" fill="currentColor" />
                </svg>
              </a>
            </div>
            <div className="co">
              <a href="/about">About us</a>
              <a href="/contact">Contact &amp; support</a>
              <a href="#" className="lang" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M1.75 8h12.5M8 1.75c2 2 2 10.5 0 12.5M8 1.75c-2 2-2 10.5 0 12.5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                <span>English</span>
              </a>
            </div>
          </div>
          {COLS.map((c) => (
            <div className="fcol2" key={c.h}>
              <div className="h">{c.h}</div>
              {c.links.map((l) => (
                <a key={l.href + l.label} href={l.href}>{l.label}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="certline">
          {CERTS.map((c) => (
            <Image key={c.alt} src={c.img} alt={c.alt} width={CERTLINE_BOX} height={CERTLINE_BOX} />
          ))}
          <span className="t">ISO 27001 · GDPR · PBSA · NSR · Ministry of Manpower (SG)</span>
        </div>
        <div className="base">
          <span className="cr">© 2026 All rights reserved. Hello Verify India Private Ltd.</span>
          <span className="lg">
            <a href="/legal/privacy-policy">Privacy Policy</a>
            <a href="/legal/terms-of-service">Terms of Service</a>
            <a href="/legal/cookie-policy">Cookie Policy</a>
          </span>
          <span className="offices">India · UAE · Singapore · Philippines · Egypt · United States</span>
        </div>
      </div>
    </footer>
  );
}
