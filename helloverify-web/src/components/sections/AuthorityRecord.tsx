/** One authority's record — the challenge, what HelloVerify is to it, the
    facts and a call to action per audience. It used to
    open under the homepage seals (`./GovSeals`); since 30 Sep 2026 each seal
    links to its authority's own page, and that page renders this. The
    record itself is `RecordBody`, shared with the homepage stage.
    Server-only; the entrances are CSS (`govseals.css`) and play on load. */
import "@/app/v2/govseals.css";
import { RecordBody, type RecordLabels, type SealItem } from "./GovSealParts";

export function AuthorityRecord({ g, stamp, labels }: { g: SealItem; stamp: string; labels: RecordLabels }) {
  return (
    <div className="sv-recs sv-recs-page">
      <div className="sv-rec">
        <RecordBody g={g} stampId="svst-page" stamp={stamp} labels={labels} />
      </div>
    </div>
  );
}
