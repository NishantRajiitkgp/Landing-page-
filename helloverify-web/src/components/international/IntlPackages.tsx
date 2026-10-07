import { DriverIcon, HomeStaffIcon, TenantIcon } from "@/components/international/icons";
import { enquiryHref, type CmsCountryId } from "@/lib/international/catalog";

const ICONS = { homeStaff: HomeStaffIcon, driver: DriverIcon, tenant: TenantIcon } as const;
const CARDS = ["homeStaff", "driver", "tenant"] as const;

type CardCopy = {
  t: string;
  tags: readonly string[];
  p: Record<CmsCountryId, string>;
};

/** Regional packages, shown for the CMS `uk` bundle. Country choice lives in
 *  the checks table below, so this band has no picker. No prices — the live
 *  cards don't either. */
export function IntlPackages({
  locale,
  includes,
  buy,
  cards,
}: {
  locale: string;
  includes: string;
  buy: string;
  cards: Record<(typeof CARDS)[number], CardCopy>;
}) {
  const href = enquiryHref(locale);

  return (
    <ul className="intl3-cards">
      {CARDS.map((key, i) => {
        const card = cards[key];
        const Icon = ICONS[key];
        return (
          <li className="intl3-card" key={key}>
            <div className="intl3-hd">
              <span className="intl3-disc" aria-hidden="true">
                <Icon />
              </span>
              <span className="intl3-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3>{card.t}</h3>
            <p>{card.p.uk}</p>
            <p className="intl3-inc">{includes}</p>
            <ul className="intl3-tags">
              {card.tags.map((tag) => (
                <li key={tag}>
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M4 8.5l2.5 2.5L12 5.5" />
                  </svg>
                  {tag}
                </li>
              ))}
            </ul>
            <a className="intl3-buy" href={href}>
              <span>{buy}</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
