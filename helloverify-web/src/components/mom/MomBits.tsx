import Image from "next/image";

import { localise } from "@/lib/i18n/href";

/** Decorative mark from the old `/assets/ministryOfManpower` set. */
export function MomIcon({ src }: { src: string }) {
  const file = src.split("/").pop() ?? "";
  return <Image src={`/img/mom/${file}`} alt="" width={28} height={28} />;
}

export function MomLink({
  href,
  locale,
  className,
  children,
}: {
  href: string;
  locale: string;
  className?: string;
  children: React.ReactNode;
}) {
  const external = !href.startsWith("/") || href.startsWith("//");
  return (
    <a
      className={className}
      href={localise(href, locale)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function MomRich({ segments }: { segments: readonly { type: string; text: string }[] }) {
  return segments.map((segment, i) =>
    segment.type === "bold" ? <strong key={i}>{segment.text}</strong> : <span key={i}>{segment.text}</span>,
  );
}
