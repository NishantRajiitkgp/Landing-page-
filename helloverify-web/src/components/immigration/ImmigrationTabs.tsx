/** Old Authorities / Applicant pair, with the old hero's tab labels. The two
 *  bodies live on this host as separate pages; the tabs are links. */
import { AppLink } from "@/components/chrome/AppLink";
import { GOVERNMENTS } from "@/lib/copy/governments";
import { copy } from "@/lib/copy/request";
import {
  IMMIGRATION_APPLICANT_HREF,
  IMMIGRATION_AUTHORITIES_HREF,
  type ImmigrationTab,
} from "@/lib/immigration/tab";

export async function ImmigrationTabs({ selected }: { selected: ImmigrationTab }) {
  const { authorities, applicant } = (await copy(GOVERNMENTS)).immigration.tabs;

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
