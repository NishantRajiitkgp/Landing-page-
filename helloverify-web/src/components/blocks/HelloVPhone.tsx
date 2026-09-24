/** HelloV WhatsApp phone — lifted verbatim from the canvas CONSUMER artboard
 *  so the consumer pages and the homepage show the identical device.
 *  Every class here is a canvas class, defined at both breakpoints — checked.
 *  lint-collisions: canvas-verbatim */
import { Tick } from "@/components/brand/Tick";
import { copy } from "@/lib/copy/request";
import { BLOCKS } from "@/lib/copy/blocks";

/** The lines that change when the phone verifies someone other than a
 *  driver (homepage v2's storefront, `sections/ConsumerShop.tsx`). Same
 *  bubbles, same timing; omitted, the phone plays the driver chat above. */
export type PhoneScript = {
  ask: string;
  request: string;
  doc: string;
  read: { lead: string; plate: string; tail: string };
  rows: string[];
  elapsed: string;
};

export async function HelloVPhone({ script }: { script?: PhoneScript } = {}) {
  const t = (await copy(BLOCKS)).helloVPhone;
  const r = t.report.rows;
  const s = script ?? {
    ask: t.msgs.m2.text,
    request: t.msgs.m3.text,
    doc: t.licence.title,
    read: t.msgs.m5,
    rows: [r.licence, r.criminal, r.address],
    elapsed: t.report.elapsed,
  };

  return (
    <div className="phone2">
      {' '}
      <div className="scr">
        {' '}
        <div className="chd">
          {' '}
          <div className="cav">
            <Tick tone="inverse" />
          </div>
          {' '}
          <div>
            <div className="cnm">
              {t.name}
            </div>
            <div className="cst2">
              <span className="dot live">
              </span>
              {t.status}
            </div>
          </div>
          {' '}
        </div>
        {' '}
        <div className="cmsgs">
          {' '}
          <div className="b in" style={{ animation: 'm1 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            {t.msgs.m1.text}
            <span className="ts">
              {t.msgs.m1.ts}
            </span>
          </div>
          {' '}
          <div className="b out" style={{ animation: 'm2 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            {s.ask}
            <span className="ts">
              {t.msgs.m2.ts}
            </span>
          </div>
          {' '}
          <div className="b in" style={{ animation: 'm3 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            {s.request}
            <span className="ts">
              {t.msgs.m3.ts}
            </span>
          </div>
          {' '}
          <div className="b out img" style={{ animation: 'm4 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            <div className="lic chat" style={{  }}>
              <span className="lt">
                {s.doc}
              </span>
              <span className="lr">
                {t.licence.region}
              </span>
              <div className="face">
              </div>
              <div className="ln1">
              </div>
              <div className="ln2">
              </div>
              <div className="ln3">
              </div>
              <div className="ln4">
              </div>
              <div className="holo">
              </div>
            </div>
            <span className="ts">
              {t.msgs.m4.ts}
            </span>
          </div>
          {' '}
          <div className="typing" style={{ animation: 'ty1 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            <i>
            </i>
            <i>
            </i>
            <i>
            </i>
          </div>
          {' '}
          <div className="b in" style={{ animation: 'm5 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            {s.read.lead}{' '}
            <b>
              {s.read.plate}
            </b>
            {s.read.tail}
            <span className="ts">
              {t.msgs.m5.ts}
            </span>
          </div>
          {' '}
          <div className="typing" style={{ animation: 'ty2 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            <i>
            </i>
            <i>
            </i>
            <i>
            </i>
          </div>
          {' '}
          <div className="b in rep" style={{ animation: 'm6 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            {' '}
            <div className="rh">
              <span className="rv">
                {t.report.verdict}
              </span>
              <span className="rt">
                {s.elapsed}
              </span>
            </div>
            {' '}
            <div className="rr">
              <Tick />
              {s.rows[0]}
            </div>
            {' '}
            <div className="rr">
              <Tick />
              {s.rows[1]}
            </div>
            {' '}
            <div className="rr">
              <Tick />
              {s.rows[2]}
            </div>
            {' '}
            <div className="rf">
              {t.report.file}
            </div>
            {' '}
            <span className="ts">
              {t.msgs.m6.ts}
            </span>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </div>
      {' '}
    </div>
  );
}
