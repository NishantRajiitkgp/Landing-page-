import Image from "next/image";
import { SIZES_FULL } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";

/**
 * Closing CTA band for inner pages (the homepage keeps its full contact section).
 * One photo, one claim, one primary action — DESIGN.md §7 chrome.
 *
 * The wrapper is <aside>, not <div>. `PageShell` renders this band as a
 * sibling of <main>, so without a landmark every heading and paragraph in it
 * belongs to none — axe's `region` rule, 516 nodes across 56 pages, which was
 * the bulk of the site's advisory findings. `aside` is the accurate element:
 * the band is complementary to the page's main content, not part of it.
 * Wrapping rather than moving it inside <main> keeps DOM order and every CSS
 * selector untouched.
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
    <aside className="wrap" aria-label="Get started" style={{ paddingTop: 40, paddingBottom: 96 }}>
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
              <Arrow />
            </AppLink>
          </div>
        </div>
      </div>
    </aside>
  );
}
