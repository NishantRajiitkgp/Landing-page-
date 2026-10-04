/** The six pictures of "Why governments … work with HelloVerify"
    (`./GovWhy`), one per reason, each a 280×140 line drawing on a light
    plate. Decorative: every one is `aria-hidden`, because the reason's title
    and body beside it say the same thing in words.

    EACH PICTURE SHOWS ITS REASON LITERALLY (1 Oct 2026, on the founder's
    review: the portico, the gates and the empty page were "just for the
    sake of having it"). Trust infrastructure is one verified record that
    every agency relies on; scale is the company's own numbers; the
    governments are their own official marks, untouched; the long term is
    the checks piling up since 2018. The platform (03) and the report (06)
    were redrawn the same day to be read without their words: pictograms
    going in unknown and coming out ticked, and result rows wired to the
    proofs behind them.

    EACH ONE LOOPS on a 6 s cycle, or keeps flowing. `govwhy.css` owns every
    keyframe; this file only places the parts and hands each its stagger on
    `--i`. STATIC BY DEFAULT: the resting markup is the finished drawing; the
    loops exist only under `.gw-go` (`./GovWhyStage`), pause with the band's
    control and off screen, and give way to this final frame under
    `prefers-reduced-motion`.

    `pathLength={1}` on every drawn stroke so one dash rule draws any of
    them, whatever its real length.

    01–06 are no longer here: they became full motion graphics, chapters
    of one story (3–4 Oct 2026), in `./GovWhyTrust`, `./GovWhyScale`,
    `./GovWhyPlatform`, `./GovWhyGovs`, `./GovWhyYears` and
    `./GovWhyReport`. What stays is the tick those chapters share. */

export function Tick({ x, y }: { x: number; y: number }) {
  return (
    <g className="gw-tickmark">
      <circle cx={x} cy={y} r="5.5" />
      <path d={`M${x - 2.4} ${y + 0.2}l1.6 1.6 3.2-3.4`} />
    </g>
  );
}
