/** Old Authorities / Applicant pair. The two bodies already live on this
 *  host as separate VerticalPages; the tabs are links, not a restyle. */
import { AppLink } from "@/components/chrome/AppLink";
import { CHROME } from "@/lib/copy/chrome";
import { copy } from "@/lib/copy/request";
import {
  IMMIGRATION_APPLICANT_HREF,
  IMMIGRATION_AUTHORITIES_HREF,
  type ImmigrationTab,
} from "@/lib/immigration/tab";

export async function ImmigrationTabs({ selected }: { selected: ImmigrationTab }) {
  const t = await copy(CHROME);
  const authorities = t.footer.links["/solutions/immigration-authorities"];
  const applicant = t.footer.links["/products/immigration"];

  return (
    <div className="imm-tabs" role="tablist" aria-label={`${authorities} / ${applicant}`}>
      <AppLink
        href={IMMIGRATION_AUTHORITIES_HREF}
        role="tab"
        aria-selected={selected === "authorities"}
        className={`seg${selected === "authorities" ? " on" : ""}`}
      >
        {authorities}
      </AppLink>
      <AppLink
        href={IMMIGRATION_APPLICANT_HREF}
        role="tab"
        aria-selected={selected === "applicant"}
        className={`seg${selected === "applicant" ? " on" : ""}`}
      >
        {applicant}
      </AppLink>
    </div>
  );
}
