/** `/partner-with-us`: "Partner with a name trusted by …". Three panels of
 *  marks — four authorities, then the first five enterprise and first five
 *  small-business clients of the programme sheet — under tabs that rotate
 *  the heading's last word. Every mark is a file the site already ships. */
import Image from "next/image";
import { smbLogo, type SmbClientId } from "@/lib/smbClients";
import { d, type PartnerCopy } from "./partnerParts";
import { TrustTabs } from "./TrustTabs";

type T = PartnerCopy["trust"];
type Mark<K extends string> = readonly [K, string, number, number];

const GOV: readonly Mark<keyof T["governments"]["logos"]>[] = [
  ["mom", "/img/partners/mom.png", 152, 152],
  ["latvia", "/img/latvia-coat-of-arms.png", 197, 158],
  ["italy", "/img/italy-emblem.png", 180, 200],
  ["mohesr", "/img/mohesr-emblem.png", 220, 264],
];

const ENT: readonly Mark<keyof T["enterprises"]["logos"]>[] = [
  ["cognizant", "/img/clients/cognizant.png", 300, 54],
  ["infosys", "/img/clients/infosys.png", 204, 80],
  ["accenture", "/img/clients/accenture.png", 300, 79],
  ["wipro", "/img/clients/wipro.png", 102, 80],
  ["hcl", "/img/clients/hcl.png", 300, 43],
];

const SMB: readonly Mark<keyof T["smb"]["logos"] & SmbClientId>[] = [
  ["akcelerator", smbLogo("akcelerator"), 1477, 120],
  ["aidenai", smbLogo("aidenai"), 339, 120],
  ["lucid", smbLogo("lucid"), 824, 120],
  ["midfin", smbLogo("midfin"), 471, 120],
  ["lnp", smbLogo("lnp"), 248, 120],
];

function Panel<K extends string>({
  i,
  marks,
  names,
  note,
  named,
}: {
  i: number;
  marks: readonly Mark<K>[];
  names: Record<K, string>;
  note: string;
  named?: boolean;
}) {
  return (
    <div className={named ? "pw-panel pw-panel-gov" : "pw-panel"} data-i={i}>
      <ul>
        {marks.map(([k, src, w, h], n) => (
          <li key={k} style={d(n)}>
            <Image src={src} alt={named ? "" : names[k]} width={w} height={h} sizes="180px" />
            {named ? <span>{names[k]}</span> : null}
          </li>
        ))}
      </ul>
      <p className="pw-panel-note">{note}</p>
    </div>
  );
}

export function PartnerTrust({ c }: { c: T }) {
  const [before, after = ""] = c.h.split("{w}");
  const labels = [c.tabs.governments, c.tabs.enterprises, c.tabs.smb];
  return (
    <section className="wrap pw-sec pw-trust" aria-labelledby="pw-trust-h">
      <TrustTabs labels={labels} aria={c.aria} head={{ id: "pw-trust-h", before, after }}>
        <Panel i={0} marks={GOV} names={c.governments.logos} note={c.governments.note} named />
        <Panel i={1} marks={ENT} names={c.enterprises.logos} note={c.enterprises.note} />
        <Panel i={2} marks={SMB} names={c.smb.logos} note={c.smb.note} />
      </TrustTabs>
    </section>
  );
}
