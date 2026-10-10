/** "What Our Client Speak" on `/about`: the heading over the featured quote
    card (`./AboutVoicesTabs`). */
import { Reveal } from "./AboutMotion";
import { AboutVoicesTabs, type Voice } from "./AboutVoicesTabs";

const LOGOS = {
  hcl: { src: "/img/clients/hcl.png", alt: "HCL", w: 300, h: 43 },
  cognizant: { src: "/img/clients/cognizant.png", alt: "Cognizant", w: 300, h: 54 },
  heroFincorp: { src: "/img/clients/herofincorp.png", alt: "Hero Fincorp", w: 270, h: 104 },
} as const;

type Item = { role: string; company: string; quote: string };

export function AboutVoices({ h, items }: { h: string; items: Record<keyof typeof LOGOS, Item> }) {
  const voices: Voice[] = (Object.keys(LOGOS) as (keyof typeof LOGOS)[]).map((key) => ({
    key,
    ...items[key],
    logo: LOGOS[key],
  }));
  return (
    <Reveal as="section" className="wrap ab-voice">
      <div className="ab-head">
        <h2 className="h2">{h}</h2>
      </div>
      <AboutVoicesTabs items={voices} />
    </Reveal>
  );
}
