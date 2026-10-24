/** The trust road's first four stops (`./TechRoad`), one person's own
    trust: crossing a border, an identity, a bank account, their papers.
    Drawn from `./TechRoadKit`. */
import type { CSSProperties } from "react";
import { Glyph, HASH, PERSON, n, type TechArt } from "./TechPillarKit";
import { Board, Box, Chip, Coins, FINGER, Person, Pin, S, Tick, face, iso, line, on, poly, run } from "./TechRoadKit";

/* 01 · Workforce mobility. A professional and their credential fly from
   one country over the border into the next, past a turning globe, and
   the credential lands verified. */
export function Mobility({ a }: { a: TechArt }) {
  return (
    <Board
      id="mob"
      floor={<path className="tk-rd-abroad" d={poly(iso(-S, -S), iso(S, -S), iso(S, S))} />}
      chips={
        <>
          <Chip x={196} y={336} at={0.08}>{a.globe.singapore}</Chip>
          <Chip x={404} y={336} at={0.12}>{a.globe.london}</Chip>
          <Chip x={478} y={196} at={0.66} tone="ok">{a.story.verified}</Chip>
        </>
      }
    >
      <path className="tk-rd-p tk-rd-fade tk-rd-border" style={on(0.02)} d={line(iso(-S, -S), iso(S, S))} />
      <g className="tk-rd-p tk-rd-drop" style={on(0.02)}>
        <ellipse className="tk-rd-shade" cx="300" cy="226" rx="40" ry="11" />
        <circle className="tk-rd-globe" cx="300" cy="106" r="54" />
        <ellipse className="tk-rd-gl" cx="300" cy="80" rx="47" ry="11" />
        <ellipse className="tk-rd-gl" cx="300" cy="106" rx="54" ry="14" />
        <ellipse className="tk-rd-gl" cx="300" cy="132" rx="47" ry="11" />
        <g className="tk-rd-t" style={run(0.02, 0.9)}>
          {[0, 60, 120].map((ph) => (
            <ellipse key={ph} className="tk-rd-gl tk-rd-mer" cx="300" cy="106" rx="54" ry="54" style={{ "--ph": `${ph}deg` } as CSSProperties} />
          ))}
        </g>
      </g>
      <Pin x={210} y={262} at={0.06} />
      <Pin x={390} y={262} at={0.1} />
      <path className="tk-rd-p tk-rd-fade tk-rd-route" style={on(0.14)} d="M210 226Q300 36 390 226" />
      <path className="tk-rd-t tk-rd-flown" style={run(0.22, 0.4)} d="M210 226Q300 36 390 226" pathLength={1} />
      <g className="tk-rd-p tk-rd-rise" style={on(0.03)}>
        <g className="tk-rd-t tk-rd-leave" style={run(0.22, 0.4)}>
          <Person x={168} y={286} bag />
        </g>
      </g>
      <g className="tk-rd-t tk-rd-arrive" style={run(0.6, 0.1)}>
        <Person x={432} y={286} bag />
      </g>
      <g className="tk-rd-t tk-rd-fly" style={run(0.22, 0.4, { "--x0": 210, "--y0": 210, "--x1": 300, "--y1": 20, "--x2": 390, "--y2": 210 })}>
        <rect className="tk-rd-card" x="-19" y="-12.5" width="38" height="25" rx="4" />
        <circle className="tk-rd-paperc" cx="-9" cy="0" r="6" />
        <path className="tk-rd-ln" d="M1-4h11M1 2.5h8" />
        <Tick x={17} y={-12} r={6.5} />
      </g>
    </Board>
  );
}

/* 02 · Digital identity. The physical ID is scanned on the slab, its data
   carried up into a phone with the holder's fingerprint, matched to the
   face and confirmed: a digital ID, verified. */
export function Identity({ a }: { a: TechArt }) {
  return (
    <Board
      id="id"
      chips={
        <>
          <Chip x={346} y={44} at={0.44}>{a.road.digitalId}</Chip>
          <Chip x={474} y={236} at={0.74} tone="ok">{a.story.verified}</Chip>
        </>
      }
    >
      <g className="tk-rd-p tk-rd-drop" style={on(0.03)}>
        <g transform={face("t", -118, -45, 0)}>
          <rect className="tk-rd-card" width="80" height="50" rx="5" />
          <path className="tk-rd-tint" d="M5 0h70a5 5 0 0 1 5 5v6H0V5a5 5 0 0 1 5-5z" />
          <rect className="tk-rd-paperc" x="7" y="17" width="18" height="25" rx="2" />
          <rect className="tk-rd-inkbar" x="31" y="19" width="38" height="4" rx="2" />
          <rect className="tk-rd-bar" x="31" y="28" width="28" height="3" rx="1.5" />
          <rect className="tk-rd-bar" x="31" y="35" width="33" height="3" rx="1.5" />
          <g className="tk-rd-t tk-rd-scan" style={run(0.06, 0.24, { "--sd": 50 })}>
            <rect className="tk-rd-ray-g" x="-3" y="-12" width="86" height="12" />
            <rect className="tk-rd-ray" x="-3" y="-1" width="86" height="2" />
          </g>
        </g>
      </g>
      <path className="tk-rd-p tk-rd-draw tk-rd-link" style={on(0.3)} d="M246 238C256 198 270 168 298 160" pathLength={1} />
      <g className="tk-rd-p tk-rd-rise" style={on(0.12)}>
        <Box x={-60} y={-70} w={80} d={10} h={170} l="tk-rd-dark" r="tk-rd-dark2" t="tk-rd-dark2" />
        <g transform={face("l", -60, -60, 170)}>
          <rect className="tk-rd-screen" x="5" y="11" width="70" height="152" rx="7" />
          <rect className="tk-rd-notch" x="31" y="4" width="18" height="3" rx="1.5" />
          <g className="tk-rd-p tk-rd-fade" style={on(0.4)}>
            <circle className="tk-rd-paperc" cx="40" cy="48" r="17" />
            <Glyph g={PERSON} x={40} y={48} s={1} cls="tk-ic tk-ic-m" />
            <rect className="tk-rd-inkbar" x="18" y="77" width="44" height="5" rx="2.5" />
            <rect className="tk-rd-bar" x="25" y="88" width="30" height="4" rx="2" />
            <rect className="tk-rd-field" x="13" y="101" width="54" height="12" rx="3" />
            <rect className="tk-rd-field" x="13" y="117" width="54" height="12" rx="3" />
          </g>
          <path className="tk-rd-p tk-rd-pop tk-rd-frame" style={on(0.46)} d="M18 32v-6h6M56 26h6v6M62 64v6h-6M24 70h-6v-6" />
          <g className="tk-rd-t tk-rd-scan" style={run(0.48, 0.22, { "--sd": 140 })}>
            <rect className="tk-rd-ray-g" x="5" y="2" width="70" height="14" />
            <rect className="tk-rd-ray" x="5" y="15" width="70" height="2" />
          </g>
          <g className="tk-rd-p tk-rd-pop" style={on(0.72)}>
            <rect className="tk-rd-okpill" x="14" y="138" width="52" height="16" rx="8" />
            <Tick x={24} y={146} r={5} />
            <rect className="tk-rd-okbar" x="33" y="144" width="25" height="4" rx="2" />
          </g>
        </g>
      </g>
      <g className="tk-rd-p tk-rd-pop" style={on(0.52)}>
        <circle className="tk-rd-ring" cx="190" cy="128" r="36" />
        <circle className="tk-rd-node" cx="190" cy="128" r="27" />
        <Glyph g={FINGER} x={190} y={128} s={1.25} cls="tk-ic tk-ic-r" />
      </g>
      <path className="tk-rd-p tk-rd-draw tk-rd-link" style={on(0.56)} d="M218 122C250 114 274 112 298 112" pathLength={1} />
      <Tick x={212} y={104} r={7} at={0.64} />
    </Board>
  );
}

/* 03 · Financial onboarding. The verified identity rides in along the
   road, the bank's KYC checks tick off one by one, the vault's dial turns
   and unlocks, and the account opens. */
const SPOKES = Array.from({ length: 6 }, (_, i) => {
  const t = (i * Math.PI) / 3;
  return `M${n(53 + Math.cos(t) * 9)} ${n(60 + Math.sin(t) * 9)}L${n(53 + Math.cos(t) * 24)} ${n(60 + Math.sin(t) * 24)}`;
}).join("");

export function Finance({ a }: { a: TechArt }) {
  return (
    <Board
      id="fin"
      chips={
        <>
          <Chip x={442} y={130} at={0.3}>{a.story.kyc}</Chip>
          <Chip x={376} y={366} at={0.8} tone="ok">{a.road.account}</Chip>
        </>
      }
    >
      <g className="tk-rd-p tk-rd-rise" style={on(0.03)}>
        <Box x={-115} y={-115} w={105} d={95} h={120} />
        <g transform={face("l", -115, -20, 120)}>
          <rect className="tk-rd-seam" x="7" y="7" width="91" height="106" rx="4" />
          <circle className="tk-rd-door0" cx="53" cy="60" r="40" />
          <circle className="tk-rd-door1" cx="53" cy="60" r="31" />
          {Array.from({ length: 8 }, (_, i) => {
            const t = (i * Math.PI) / 4;
            return <circle key={i} className="tk-rd-bolt" cx={n(53 + Math.cos(t) * 35.5)} cy={n(60 + Math.sin(t) * 35.5)} r="2" />;
          })}
          <g className="tk-rd-t tk-rd-dial" style={run(0.3, 0.36)}>
            <path className="tk-rd-spoke" d={SPOKES} />
            <circle className="tk-rd-hub" cx="53" cy="60" r="9" />
          </g>
          <circle className="tk-rd-red" cx="92" cy="15" r="4.5" />
          <circle className="tk-rd-p tk-rd-pop tk-rd-okdot" style={on(0.7)} cx="92" cy="15" r="4.5" />
        </g>
      </g>
      <Coins x={164} y={262} k={4} at={0.82} />
      <Coins x={198} y={284} k={3} at={0.86} />
      <g className="tk-rd-t tk-rd-slide" style={run(0.02, 0.26)}>
        <rect className="tk-rd-card" x="-17" y="-11" width="34" height="22" rx="3.5" />
        <circle className="tk-rd-paperc" cx="-8" cy="0" r="5" />
        <path className="tk-rd-ln" d="M0-3.5h10M0 2.5h7" />
      </g>
      <g className="tk-rd-p tk-rd-rise" style={on(0.12)}>
        <Box x={20} y={-100} w={55} d={7} h={110} l="tk-rd-dark" r="tk-rd-dark2" t="tk-rd-dark2" />
        <g transform={face("l", 20, -93, 110)}>
          <rect className="tk-rd-screen" x="4" y="8" width="47" height="97" rx="5" />
          <rect className="tk-rd-tint" x="10" y="16" width="22" height="5" rx="2.5" />
          {[38, 55, 72].map((v, i) => (
            <g key={v}>
              <circle className="tk-rd-paperc" cx="13" cy={v} r="4.5" />
              <rect className="tk-rd-bar" x="21" y={v - 2} width="24" height="4" rx="2" />
              <Tick x={13} y={v} r={4.5} at={0.36 + i * 0.12} />
            </g>
          ))}
          <g className="tk-rd-p tk-rd-pop" style={on(0.78)}>
            <rect className="tk-rd-okpill" x="8" y="86" width="39" height="12" rx="6" />
            <rect className="tk-rd-okbar" x="15" y="90" width="25" height="4" rx="2" />
          </g>
        </g>
      </g>
    </Board>
  );
}

/* 04 · Verified credentials. A degree, a licence and a letter stand up
   one by one, are bound into one hash chain and sealed; a forged copy
   lying beside them is struck through and flagged. */
const CERTS = [-110, -42, 26];

export function Credentials({ a }: { a: TechArt }) {
  return (
    <Board
      id="cred"
      chips={
        <>
          <Chip x={232} y={148} at={0.1}>{a.story.degree}</Chip>
          <Chip x={500} y={124} at={0.46}>{a.road.tamper}</Chip>
          <Chip x={194} y={398} at={0.78} tone="bad">{a.story.flagged}</Chip>
        </>
      }
    >
      {CERTS.map((x, k) => (
        <g key={x} className="tk-rd-p tk-rd-rise" style={on(0.04 + k * 0.08)}>
          <Box x={x} y={-113} w={58} d={5} h={96} />
          <g transform={face("l", x, -108, 96)}>
            <rect className="tk-rd-seam" x="4" y="4" width="50" height="88" rx="2" />
            <path className={k === 0 ? "tk-rd-red" : "tk-rd-inkfill"} d="M23 13h12v7.5l-6 5-6-5z" />
            <rect className="tk-rd-inkbar" x="12" y="33" width="34" height="4" rx="2" />
            <rect className="tk-rd-bar" x="16" y="43" width="26" height="3" rx="1.5" />
            <rect className="tk-rd-bar" x="10" y="52" width="38" height="3" rx="1.5" />
            <rect className="tk-rd-bar" x="14" y="60" width="30" height="3" rx="1.5" />
            <path className="tk-rd-sign" d="M9 82c4-7 7 2 10-2s5-6 8 0" />
            <circle className="tk-rd-sealc" cx="44" cy="80" r="6" />
          </g>
        </g>
      ))}
      {[0, 1].map((k) => (
        <path key={k} className="tk-rd-p tk-rd-draw tk-rd-chain" style={on(0.36 + k * 0.08)} d={line(iso(CERTS[k] + 29, -108, 114), iso(CERTS[k + 1] + 29, -108, 114))} pathLength={1} />
      ))}
      {CERTS.map((x, k) => {
        const [X, Y] = iso(x + 29, -108, 114);
        return (
          <g key={x} className="tk-rd-p tk-rd-pop" style={on(0.32 + k * 0.08)}>
            <path className="tk-rd-ln" d={`M${n(X)} ${n(Y + 11)}v7`} />
            <circle className="tk-rd-node tk-rd-node-r" cx={n(X)} cy={n(Y)} r="11" />
            <Glyph g={HASH} x={X} y={Y} s={0.62} cls="tk-ic tk-ic-r" />
          </g>
        );
      })}
      <g className="tk-rd-p tk-rd-stamp" style={on(0.54)}>
        <circle className="tk-rd-red" cx="406" cy="223" r="13" />
        <circle className="tk-rd-sealring" cx="406" cy="223" r="9" />
        <path className="tk-rd-wline tk-uf" d="M401.5 223.3l3 3 6-6.3" />
      </g>
      <g className="tk-rd-p tk-rd-fade" style={on(0.62)}>
        <g transform={face("t", -15, 55, 0)}>
          <rect className="tk-rd-card" width="62" height="46" rx="3" />
          <path className="tk-rd-inkfill" d="M25 7h12v6l-6 4-6-4z" />
          <rect className="tk-rd-bar" x="12" y="22" width="38" height="3.5" rx="1.75" />
          <rect className="tk-rd-bar" x="16" y="30" width="30" height="3" rx="1.5" />
          <path className="tk-rd-p tk-rd-draw tk-rd-strike" style={on(0.7)} d="M6 27c4-4 8 4 12 0s8 4 12 0 8 4 12 0 8 4 12 0" pathLength={1} />
        </g>
      </g>
      <Tick x={296} y={336} r={9} at={0.76} bad />
    </Board>
  );
}
