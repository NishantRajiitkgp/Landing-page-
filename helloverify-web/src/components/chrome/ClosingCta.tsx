import Image from "next/image";
import { SIZES_FULL } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";

/**
 * Closing CTA band for inner pages (the homepage keeps its full contact section).
 * One photo, one claim, one primary action — DESIGN.md §7 chrome.
 */
export function ClosingCta({
  heading = (
    <>
      Every great journey deserves a <em>verified</em> beginning.
    </>
  ),
  sub = "Take the first step. We'll handle the rest.",
  ctaLabel = "Talk to sales",
  ctaHref = "/contact",
  img = "/img/23-closing.jpg",
}: {
  heading?: React.ReactNode;
  sub?: string;
  ctaLabel?: string;
  ctaHref?: string;
  img?: string;
}) {
  return (
    <div className="wrap" style={{ paddingTop: 40, paddingBottom: 96 }}>
      <div className="close2 ph">
        <Image className="pimg" src={img} alt="" fill sizes={SIZES_FULL} />
        <div className="scrim" />
        <div className="body">
          <h2 className="h">{heading}</h2>
          <p className="p">{sub}</p>
          <div className="hrow">
            <AppLink href={ctaHref} className="btn btn-paper">{ctaLabel}</AppLink>
            <AppLink href="/business/smb" className="btn btn-ghost ghost-w">
              <span>See plans &amp; pricing</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </AppLink>
          </div>
        </div>
      </div>
    </div>
  );
}
