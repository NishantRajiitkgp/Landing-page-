import Image from "next/image";

import { HelloVPhone } from "@/components/blocks/HelloVPhone";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { HELLOV_WHATSAPP } from "@/lib/hellov";
import "@/app/v2/consumer.css";

import { HelloVAskPhone } from "./HelloVAskPhone";

/** The landing page's WhatsApp ask: the sentence, the QR steps, and the
 *  phone. On the homepage it sits under Individual Checks, in the brand red. */
const QR = [
  "111111101101110010100010001111111",
  "100000101011011000011000001000001",
  "101110101011111100001101001011101",
  "101110100110001010010110001011101",
  "101110101111010111111010101011101",
  "100000100111111110100011101000001",
  "111111101010101010101010101111111",
  "000000000111110110010000000000000",
  "100111111001001011010000010010111",
  "110000011000010101111011000011100",
  "111010100000110101101001101011111",
  "111010011010010101100000010100111",
  "111110111001110010010010011000000",
  "101011001110011001100011100001000",
  "101101100011010111010110101110000",
  "101000011011001100001001110111101",
  "010000100001011100010011111111000",
  "000111011110011101111000101010101",
  "101011100010100101011111001101101",
  "001111011000101010011010101011111",
  "010010101000111101011011010001011",
  "101100010001001101110011110011100",
  "101001111010110111000111001000111",
  "100111001101100101001011110011111",
  "111000101010001010110000111110010",
  "000000001100010111100010100010110",
  "111111101111010100011001101010100",
  "100000101100111110101011100011101",
  "101110101000111100001011111110001",
  "101110101101001100111001110100011",
  "101110100010000110011011100110111",
  "100000100011111010010011001110111",
  "111111101101100001010000101111000",
];

function qrPath(rows: string[]) {
  let d = "";
  rows.forEach((row, y) => {
    let x = -1;
    for (const m of row.matchAll(/1+/g)) {
      const n = m[0].length;
      d += x < 0 ? `M${m.index} ${y}.5h${n}` : `m${m.index - x} 0h${n}`;
      x = m.index + n;
    }
  });
  return d;
}

/** Two sentences, same words: the first is the heading, the second the red italic line. */
function splitLede(text: string) {
  const cut = text.search(/[.।](?=\s)/);
  if (cut < 0) return { lead: text, rest: "" };
  return { lead: text.slice(0, cut + 1), rest: text.slice(cut + 1).trim() };
}

export async function HelloVAsk() {
  const all = (await copy(SECTIONS)).consumer;
  const t = all.shop;
  const n = QR.length + 4;
  const { lead, rest } = splitLede(all.lede);

  return (
    <section className="hv-wa" aria-labelledby="hv-wa-h">
      <div className="wrap hv-wa-row">
        <div className="hv-wa-copy">
          <h2 className="h2" id="hv-wa-h">
            {lead}
            {rest ? (
              <>
                <br />
                <em className="hv-wa-it">{rest}</em>
              </>
            ) : null}
          </h2>
          <div className="hv-wa-panel">
            <a className="fm-qr" href={HELLOV_WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label={t.qr}>
              <svg viewBox={`-2 -2 ${n} ${n}`} aria-hidden="true">
                <rect x="-2" y="-2" width={n} height={n} fill="var(--white)" />
                <path d={qrPath(QR)} fill="none" stroke="var(--ink)" strokeWidth="1" />
              </svg>
            </a>
            <div className="hv-wa-side">
              <ol className="fm-steps">
                {Object.values(t.steps).map((step) => (
                  <li key={step.k}>
                    <b>{step.k}</b>
                    {step.t}
                  </li>
                ))}
              </ol>
              <a className="hv-wa-cta" href={HELLOV_WHATSAPP} target="_blank" rel="noopener noreferrer">
                <span className="wa">
                  <Image src="/img/hellov/whatsapp.png" alt="" width={68} height={68} sizes="22px" />
                </span>
                <span className="lbl">{t.cta}</span>
                <svg className="go" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <HelloVAskPhone pause={t.motion.pause} play={t.motion.play}>
          <HelloVPhone />
        </HelloVAskPhone>
      </div>
    </section>
  );
}
