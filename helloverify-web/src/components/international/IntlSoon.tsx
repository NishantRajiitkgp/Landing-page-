/** The band under the check builder: coverage still opening, said as type. */

export function IntlSoon({
  kicker,
  before,
  n,
  after,
  lede,
}: {
  kicker: string;
  before: string;
  n: string;
  after: string;
  lede: string;
}) {
  return (
    <section className="ics" aria-labelledby="ics-h">
      <div className="wrap">
        <p className="ics-k">{kicker}</p>
        <h2 id="ics-h">
          {before ? <span className="ics-pre">{before}</span> : null}
          <span className="ics-n" dir="ltr">{n}</span>
          <span className="ics-w">{after}</span>
        </h2>
        <p className="ics-p">{lede}</p>
      </div>
    </section>
  );
}
