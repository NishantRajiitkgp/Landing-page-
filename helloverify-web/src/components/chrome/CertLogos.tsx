/** The old SPA's "Certifications & Compliance" logo row (`globals.base.json`
 *  `certificationsCompliance`): NSR and PBSA, a divider, then ISO 9001 twice
 *  and GDPR, as the old CMS lists them. */
import Image from "next/image";

type Alts = { nsr: string; pbsa: string; iso9001: string; gdpr: string };

const LOGOS = {
  nsr: { src: "/img/certs/nsr.png", w: 231, h: 144 },
  pbsa: { src: "/img/certs/pbsa.png", w: 195, h: 146 },
  iso9001: { src: "/img/certs/iso-9001.png", w: 206, h: 208 },
  gdpr: { src: "/img/certs/gdpr.png", w: 612, h: 612 },
} as const;

const BEFORE = ["nsr", "pbsa"] as const;
const AFTER = ["iso9001", "iso9001", "gdpr"] as const;

function Logo({ id, alt }: { id: keyof typeof LOGOS; alt: string }) {
  const l = LOGOS[id];
  return (
    <li>
      <Image src={l.src} alt={alt} width={l.w} height={l.h} sizes="96px" />
    </li>
  );
}

export function CertLogos({ alts }: { alts: Alts }) {
  return (
    <div className="body3 clg3">
      <ul>
        {BEFORE.map((id) => (
          <Logo key={id} id={id} alt={alts[id]} />
        ))}
      </ul>
      <span className="dv" aria-hidden="true" />
      <ul>
        {AFTER.map((id, i) => (
          <Logo key={`${id}-${i}`} id={id} alt={alts[id]} />
        ))}
      </ul>
    </div>
  );
}
