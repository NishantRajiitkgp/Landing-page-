/** `BlogPosting` for the editorial posts (BUILD-SPEC §8.2 — "New — AUDIT C2",
 *  §11a.3).
 *
 *  AUDIT.md:314 records the gap this closes: "Five blog routes exist; none emit
 *  article-level structured data." §11a.3 says why it is worth more than the
 *  usual rich-result argument — "Perplexity weights recency heavily; undated
 *  content is deprioritised". `datePublished` is the field that earns its keep,
 *  and it comes from `lib/content/posts.ts`, the same record the visible byline
 *  renders from, so a post cannot be dated one way to a reader and another to a
 *  crawler.
 *
 *  AUTHOR IS AN ORGANISATION, not a Person, and that is a fact rather than a
 *  simplification: both posts carry `author: { name: "HelloVerify", role:
 *  "Verification operations" }`. Emitting `{ "@type": "Person", name:
 *  "HelloVerify" }` would assert a human being who does not exist, so the
 *  builder branches on the name and refers to the organisation node by `@id`
 *  when they match. The day a post is bylined to a real person it becomes a
 *  `Person` automatically, with the role as `jobTitle` — no edit here.
 *
 *  `image` IS OMITTED, deliberately. `Post` has no hero image field — only
 *  `author.img`, a byline portrait, which would be a lie as the article image.
 *  The other candidate is the page's own generated OG card at
 *  `/${locale}/opengraph-image`, and that is rejected for the reason
 *  `lib/seo/metadata.ts` gives for not restating `images`: it hardcodes a Next
 *  file-convention route into a second place that silently 404s the day the
 *  file moves. `image` is recommended for Article rich results, not required,
 *  and the OG card already reaches every scraper through `og:image`.
 *
 *  `dateModified` is omitted for the same reason — `Post` has no such field, so
 *  any value would be `datePublished` copied under a different name, which
 *  tells a recency-weighting engine something untrue the first time a post is
 *  edited.
 */
import type { BlogPosting, WithContext } from "schema-dts";

import type { Post } from "@/lib/content/posts";
import { canonicalOf } from "@/lib/seo/canonical";
import { SITE_NAME } from "@/lib/seo/site";
import { ORG_ID, WEBSITE_ID } from "@/lib/seo/schema/organization";

export function blogPosting(locale: string, post: Post): WithContext<BlogPosting> {
  /** Derived from the slug, not stated again. `lib/seo/routes.ts` builds the
   *  route the same way from the same array, so `canonicalOf` throwing here
   *  would mean the post exists and its route does not — which the manifest
   *  makes impossible. */
  const url = canonicalOf(locale, `/resources/blog/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,

    /** The visible `<h1>` is `{p.title}`, so this is the same string by
     *  construction — and `check-schema.mjs` re-reads both out of the emitted
     *  HTML and compares them, because Google treats a headline that does not
     *  match the page as a policy violation rather than a mismatch. */
    headline: post.title,
    description: post.standfirst,
    datePublished: post.date,
    articleSection: post.category,
    inLanguage: locale,

    mainEntityOfPage: url,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },

    author:
      post.author.name === SITE_NAME
        ? { "@id": ORG_ID }
        : { "@type": "Person", name: post.author.name, jobTitle: post.author.role },
  };
}
