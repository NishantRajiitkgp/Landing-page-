import Image from "next/image";
import { SIZES_FULL } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";
import { CHROME } from "@/lib/copy/chrome";
import { copy } from "@/lib/copy/request";

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
 *
 * THE THREE COPY PROPS LOST THEIR DEFAULT VALUES AND KEPT THEIR DEFAULTS. A
 * parameter default cannot be awaited, so `heading`, `sub` and `ctaLabel` are
 * now plain optionals resolved with `??` against `lib/copy/chrome`. Same
 * behaviour for every caller — an omitted prop and an explicit `undefined`
 * both fall through, exactly as a parameter default does, and `null` is not
 * in the prop types. `ctaHref` and `img` keep their defaults: a path is not
 * copy.
 */
export async function ClosingCta({
  heading,
  sub,
  ctaLabel,
  ctaHref = "/contact",
  img = "/img/23-closing.jpg",
}: {
  heading?: React.ReactNode;
  sub?: string;
  ctaLabel?: string;
  ctaHref?: string;
  img?: string;
}) {
  const t = (await copy(CHROME)).closingCta;

  return (
    <aside className="wrap" aria-label={t.region} style={{ paddingTop: 40, paddingBottom: 96 }}>
      <div className="close2 ph">
        <Image className="pimg" src={img} alt="" fill sizes={SIZES_FULL} />
        <div className="scrim" />
        <div className="body">
          <h2 className="h">{heading ?? t.heading}</h2>
          <p className="p">{sub ?? t.sub}</p>
          <div className="hrow">
            <AppLink href={ctaHref} className="btn btn-paper">{ctaLabel ?? t.cta}</AppLink>
            <AppLink href="/business/smb" className="btn btn-ghost ghost-w">
              <span>{t.plans}</span>
              <Arrow />
            </AppLink>
          </div>
        </div>
      </div>
    </aside>
  );
}
