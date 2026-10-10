/** Vision and mission on `/about`: the team photograph beside the two
    statements, numbered as the story's first two chapters. The photograph
    opens out of a smaller frame and the statements rise after it. */
import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "./AboutMotion";

type Block = { h: string; p: string };

export function AboutStory({ vision, mission, imgAlt }: { vision: Block; mission: Block; imgAlt: string }) {
  return (
    <Reveal as="section" className="wrap ab-story">
      <figure className="ab-photo">
        <Image
          src="/img/about-helloverify.png"
          alt={imgAlt}
          width={1337}
          height={1122}
          sizes="(max-width: 1080px) 100vw, 560px"
        />
      </figure>
      <div className="ab-story-tx">
        {[vision, mission].map((b, i) => (
          <article key={b.h} className="ab-st" style={{ "--d": `${0.3 + i * 0.2}s` } as CSSProperties}>
            <span className="ab-st-n" aria-hidden="true">
              {`0${i + 1}`}
            </span>
            <h2 className="ab-st-h">{b.h}</h2>
            <p className="ab-st-p">{b.p}</p>
          </article>
        ))}
      </div>
    </Reveal>
  );
}
