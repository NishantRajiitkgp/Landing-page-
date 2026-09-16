/** Standard inner-page frame: nav → breadcrumb → content → closing CTA → footer. */
import { SiteNav } from "@/components/chrome/SiteNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Breadcrumb } from "@/components/chrome/Breadcrumb";
import { ClosingCta } from "@/components/chrome/ClosingCta";

export function PageShell({
  crumbs,
  children,
  closing,
}: {
  crumbs: { label: string; href?: string }[];
  children: React.ReactNode;
  closing?: React.ComponentProps<typeof ClosingCta>;
}) {
  return (
    <div className="page">
      <SiteNav />
      <Breadcrumb items={crumbs} />
      <main>{children}</main>
      <ClosingCta {...closing} />
      <SiteFooter />
    </div>
  );
}
