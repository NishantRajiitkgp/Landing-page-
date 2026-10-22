/** The third pillar drawing on the `/technology` stage (`./TechPillars`).

    One case leaves the queue, the engine sends it, and it arrives abroad.
    The only words on the board are Routed and Abroad.

      0s    a queue of different cases; one of them is the case we follow
      0.7s  HelloVerify takes it. The decision ticks itself: Routed
      1.6s  the case crosses the border
      2.2s  it reaches the institution on the other side: Abroad */
import { Logo } from "@/components/brand/Logo";
import { CAP, CASE, Glyph, GLOBE, ID, INST, Label, Ok, SHIELD, d, type TechArt } from "./TechPillarKit";

export function RouteArt({ l }: { l: TechArt }) {
  return (
    <svg className="tk-art tk-mirror" viewBox="0 0 560 360" fill="none">
      {/* The other country */}
      <rect className="tk-abroad tk-a-fade" x="412" y="48" width="128" height="236" rx="18" style={d(1.6)} />
      <path className="tk-border tk-a-fade" d="M400 36V312" style={d(1.6)} />
      <g className="tk-a-pop" style={d(1.75)}>
        <circle className="tk-node" cx="400" cy="48" r="13" />
        <Glyph g={GLOBE} x={400} y={48} s={0.52} />
      </g>

      {/* Two other cases wait. They stay quiet so the eye follows one. */}
      <g className="tk-dim tk-a-in" style={d(0)}>
        <rect className="tk-sheet" x="24" y="40" width="148" height="72" rx="14" />
        <rect className="tk-paperfill" x="36" y="56" width="32" height="32" rx="9" />
        <Glyph g={CAP} x={52} y={72} s={0.62} />
        <rect className="tk-inkbar" x="78" y="62" width="72" height="6" rx="3" />
        <rect className="tk-soft" x="78" y="76" width="48" height="5" rx="2.5" />
      </g>
      <g className="tk-dim tk-a-in" style={d(0.08)}>
        <rect className="tk-sheet" x="24" y="248" width="148" height="72" rx="14" />
        <rect className="tk-paperfill" x="36" y="264" width="32" height="32" rx="9" />
        <Glyph g={ID} x={52} y={280} s={0.62} />
        <rect className="tk-inkbar" x="78" y="270" width="72" height="6" rx="3" />
        <rect className="tk-soft" x="78" y="284" width="48" height="5" rx="2.5" />
      </g>

      {/* The case the engine routes */}
      <g className="tk-a-in" style={d(0.16)}>
        <rect className="tk-sheet" x="36" y="108" width="176" height="116" rx="16" />
        <rect className="tk-paperfill" x="52" y="128" width="40" height="40" rx="12" />
        <Glyph g={CASE} x={72} y={148} s={0.78} />
        <rect className="tk-inkbar" x="104" y="132" width="84" height="7" rx="3.5" />
        <rect className="tk-soft" x="104" y="148" width="60" height="5" rx="2.5" />
        <rect className="tk-bar" x="52" y="184" width="140" height="6" rx="3" />
        <rect className="tk-bar" x="52" y="198" width="108" height="6" rx="3" />
      </g>
      <rect className="tk-flag tk-a-fade" x="36" y="108" width="176" height="116" rx="16" style={d(0.7)} />

      {/* Into the engine, then across the border */}
      <path className="tk-p-link tk-a-draw" d="M212 166H248" pathLength="1" style={d(0.85, { "--t": ".35s" })} />
      <path className="tk-p-link tk-a-draw" d="M344 166C378 166 396 140 424 148" pathLength="1" style={d(1.55, { "--t": ".55s" })} />

      <g className="tk-a-pop" style={d(0.7)} transform="translate(296 166)">
        <g className="tk-uf">
          <rect className="tk-sheet" x="-48" y="-18" width="96" height="36" rx="12" />
          <g transform="translate(-35 -10)">
            <Logo width={70} height={20} />
          </g>
        </g>
      </g>
      <Ok x={332} y={134} r={7} at={1.15} />
      <Label x={296} y={212} at={1.05}>{l.routed}</Label>

      {/* It arrives at the institution in that country */}
      <g className="tk-a-in" style={d(2.05)}>
        <rect className="tk-sheet" x="424" y="96" width="104" height="120" rx="14" />
        <rect className="tk-paperfill" x="440" y="114" width="40" height="40" rx="12" />
        <Glyph g={INST} x={460} y={134} s={0.78} />
        <rect className="tk-inkbar" x="440" y="166" width="72" height="6" rx="3" />
        <rect className="tk-soft" x="440" y="180" width="48" height="5" rx="2.5" />
        <Glyph g={SHIELD} x={500} y={122} s={0.5} cls="tk-ic tk-ic-r" />
      </g>
      <Ok x={512} y={108} r={8} at={2.5} />
      <Label x={476} y={244} at={2.65}>{l.abroad}</Label>
    </svg>
  );
}
