/** `serialiseJsonLd` — the one part of the §8.2 graph that cannot be checked
 *  from the build output, because the copy that would break it is not on the
 *  site yet.
 *
 *  `check-schema.mjs` proves every emitted block parses. That passes today with
 *  the escaping removed, because no page contains the string `</script`. This
 *  is the test for the day one does — a FAQ answer about markup, a legal policy
 *  quoting a tag, a blog post about this very file.
 */
import { serialiseJsonLd } from "../../src/lib/seo/schema/json-ld.ts";

import { check } from "./harness.ts";

/** What the browser's HTML parser does with a raw text element: everything up
 *  to the first `</script` is the body, and nothing in it is entity-decoded. */
function scriptBody(html: string): string {
  const open = html.indexOf(">") + 1;
  const end = html.toLowerCase().indexOf("</script", open);
  return html.slice(open, end === -1 ? undefined : end);
}

console.log("1. the hazard is real");
{
  const hostile = { "@type": "FAQPage", text: "Close it with </script> and carry on" };
  const naive = `<script type="application/ld+json">${JSON.stringify(hostile)}</script>`;
  check("unescaped JSON ends the script element early", scriptBody(naive) !== JSON.stringify(hostile));
  let threw = false;
  try {
    JSON.parse(scriptBody(naive));
  } catch {
    threw = true;
  }
  check("and what the parser hands the JSON reader is not valid JSON", threw);
}

console.log("2. the escape closes it");
{
  const hostile = { "@type": "FAQPage", text: "Close it with </script> and carry on" };
  const safe = `<script type="application/ld+json">${serialiseJsonLd(hostile)}</script>`;
  check("no </script sequence survives inside the body", !serialiseJsonLd(hostile).toLowerCase().includes("</script"));
  const body = scriptBody(safe);
  check("the whole graph is the script body", body === serialiseJsonLd(hostile), body);
  check("and it round-trips to the same object", JSON.parse(body).text === hostile.text, JSON.parse(body));
}

console.log("3. the escape changes nothing else");
{
  const node = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HelloVerify",
    description: "AI reads the documents — the university, the employer, the registry.",
    foundingDate: "2018",
  };
  const out = serialiseJsonLd(node);
  check("identical to JSON.stringify when no < is present", out === JSON.stringify(node), out);
  check("em dash is not escaped", out.includes("—"), out);
  check("round-trips", JSON.parse(out).description === node.description);
}

console.log("4. every `<`, not only the closing tag");
{
  const out = serialiseJsonLd({ a: "a < b", b: "<b>bold</b>" });
  check("no literal < remains", !out.includes("<"), out);
  check("round-trips to the original characters", JSON.parse(out).b === "<b>bold</b>", JSON.parse(out));
}

