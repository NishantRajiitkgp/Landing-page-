import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { legacyRedirects } from "./src/lib/seo/redirects";

/** Points next-intl at the per-request config module (BUILD-SPEC §7). */
const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  /** §6.1: one URL form, never two. Next's default, set explicitly because the
   *  old site served `/en`, `/en/` AND `/en/index.html` as three live URLs for
   *  the same page and nobody had written down which one was real (AUDIT A2). */
  trailingSlash: false,

  /** Legacy URL consolidation (§6.2, IA §9). The table and the reasoning about
   *  match order live in `src/lib/seo/legacy-urls.ts`; it is a data module with
   *  no app imports, so the sitemap (item 4) and the §6.3 probe share it. */
  async redirects() {
    return legacyRedirects();
  },

  /** BUILD-SPEC §13 and §8.4. One `headers()`, defined once — §13's "Single CSP
   *  source … No duplicated copies" (AUDIT E3). Everything below applies to
   *  every path, documents and subresources alike: a policy that holds for the
   *  HTML but not its assets is not a policy.
   *
   *  THE NONCE §13 ASKS FOR CANNOT BE USED HERE, and this is the one place the
   *  spec asks for something that contradicts itself rather than something
   *  merely hard.
   *
   *  §13 says "CSP with nonce — generated per request in `proxy.ts` … removes
   *  `'unsafe-inline'` from `script-src`". Next's own documentation
   *  (`node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`,
   *  line 181) is explicit: *"To use a nonce, your page must be dynamically
   *  rendered. … Static pages are generated at build time, when no request or
   *  response headers exist — so no nonce can be injected."*
   *
   *  Every page on this site is statically prerendered, and that is not
   *  incidental: §5 requires it, §17 requires `next build` to emit zero dynamic
   *  routes, and all nine build-output gates read the prerendered HTML. Adding
   *  a nonce would turn 56 static pages into 56 per-request renders and blind
   *  every one of those checks — to remove `'unsafe-inline'` from a site that
   *  ships no third-party script and no inline handler of its own.
   *
   *  SO THE HASHES COME FROM THE BUILD INSTEAD, and this header is no longer
   *  the whole policy. `tools/ci/inject-csp.mjs` runs after `next build`,
   *  computes the SHA-256 of every inline script on every page, and writes a
   *  per-page `<meta http-equiv>` carrying `script-src 'self'` plus exactly
   *  those hashes. `npm run check:csp` then proves each page lists the right
   *  ones, and `tools/e2e/csp.spec.ts` proves a browser agrees — including that
   *  an unlisted inline script is actually refused.
   *
   *  Measured in a real browser, because it is the load-bearing claim: with
   *  this header at `'unsafe-inline'` and a document meta at `script-src
   *  'self'`, an inline script does NOT run. Multiple policies are each
   *  enforced and a script must satisfy all of them, so the EFFECTIVE policy is
   *  the intersection — hash-only.
   *
   *  `'unsafe-inline'` therefore stays HERE, and the reason is not inertia: the
   *  hashes are per page and change on every build, and this function is
   *  evaluated before any page is rendered. Removing the token from the header
   *  would block the build's own scripts, whose hashes the header cannot know.
   *  The union across 58 pages is 258 distinct hashes, roughly 14 KB on every
   *  response.
   *
   *  §17 condition 11 reads "CSP has no 'unsafe-inline' in script-src". The
   *  enforced policy has no inline latitude; this header still contains the
   *  token. That distinction is recorded rather than rounded off — closing it
   *  literally needs per-request headers from middleware over a build-time
   *  manifest, which cannot exist before the build that produces the hashes.
   *
   *  WHAT IS INLINE, measured rather than assumed — 7 blocks on a typical page:
   *  4 are Next's own `self.__next_f.push(...)` flight payload and 3 are the
   *  §8.2 JSON-LD graph. All are first-party and emitted by the build. There
   *  are no inline event handlers and no third-party scripts anywhere (§9.4
   *  measures zero third-party origins), so the residual risk `'unsafe-inline'`
   *  carries here is an injected `<script>` — which is what `object-src`,
   *  `base-uri` and `form-action` below are set against.
   */
  async headers() {
    /** `headers()` applies in development as well as production, and React Fast
     *  Refresh compiles with `eval`. Without this, `npm run dev` loads a page
     *  that never hydrates and logs a CSP violation instead — a footgun that
     *  costs an afternoon because the production build is fine. Next's own CSP
     *  guide does the same thing
     *  (`docs/01-app/02-guides/content-security-policy.md:52`).
     *
     *  `NODE_ENV` rather than a custom flag: `next build` sets it to
     *  "production", so `'unsafe-eval'` cannot reach a deployed policy by
     *  someone forgetting an env var. */
    const dev = process.env.NODE_ENV !== "production";

    const csp = [
      "default-src 'self'",
      // See the long note above. Everything else in this policy is strict.
      `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
      // Stylesheets come from this origin only. The 30 `style=` attributes the
      // ported canvas uses are governed by `style-src-attr`, which is relaxed
      // separately so that the stylesheet directive itself stays tight.
      /** 'self' plus two hashes, no 'unsafe-inline'. The hashes are Next's own
       *  inline <style> on /_not-found and /_global-error — the only inline
       *  styles the build emits (measured: 2 blocks across 58 pages).
       *  Relaxing this directive site-wide to style two error pages would be
       *  the wrong trade; 'unsafe-inline' on style-src is what enables
       *  CSS-based exfiltration and UI redressing on the 56 real pages.
       *   fails the build if a Next upgrade changes these
       *  bytes, which would otherwise show up only as an unstyled 404. */
      "style-src 'self' 'sha256-Wwucq8eX2r0YFymkQhDXm5hN0+FfSvI3s4JSSaqa4iw=' 'sha256-Z5XTK23DFuEMs0PwnyZDO9SWxemQ5HxcpVaBNuUJyWY='",
      "style-src-attr 'unsafe-inline'",
      // `data:` is for the inlined blur placeholders `next/image` emits.
      "img-src 'self' data:",
      "font-src 'self'",
      // The lead form posts to a Server Action on this origin. Nothing else
      // makes a network call — §9.4 measures zero third-party origins. In
      // development the HMR websocket needs `ws:` on the same origin.
      `connect-src 'self'${dev ? " ws:" : ""}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      // §13: frame-ancestors 'none'. The modern spelling of X-Frame-Options,
      // which is also sent below for older agents that ignore this.
      "frame-ancestors 'none'",
      "frame-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },

          /** §8.4, AUDIT C2. The old site sent `no-referrer` globally, which
           *  strips the referrer from HelloVerify's own analytics and from
           *  partners' inbound attribution — the audit's words: "over-tight;
           *  breaks first-party attribution" (`AUDIT.md:446`).
           *
           *  `strict-origin-when-cross-origin` is the modern browser default:
           *  same-origin navigations keep the full path, cross-origin ones send
           *  only the origin, and an HTTPS→HTTP downgrade sends nothing. A
           *  partner learns traffic came from helloverify.com without learning
           *  which candidate's page it came from. */
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          /** Two years, subdomains included, preload-eligible. Only meaningful
           *  over HTTPS; browsers ignore it on plain HTTP, so it is harmless in
           *  local development. `preload` is a standing request to be added to
           *  the browser preload lists — do not submit until the apex and every
           *  subdomain genuinely serve HTTPS, because removal is slow. */
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },

          /** Stops a browser second-guessing a Content-Type — the attack being
           *  an uploaded file served as `text/plain` and sniffed as HTML. */
          { key: "X-Content-Type-Options", value: "nosniff" },

          /** Superseded by `frame-ancestors` above, sent for agents that do not
           *  implement it. Clickjacking on a verification vendor's site is a
           *  credible phishing primitive, so both spellings are worth the bytes. */
          { key: "X-Frame-Options", value: "DENY" },

          /** §13. Nothing here uses a camera, a microphone or a location, and
           *  saying so explicitly stops an embedded frame or a future
           *  dependency asking on this origin's behalf. */
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          /** §13: COOP/CORP `same-origin`. COOP severs the window reference an
           *  opener would otherwise keep (the `window.opener` class of attack);
           *  CORP stops other origins embedding this one's subresources. */
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },

  images: {
    // AVIF first, WebP fallback. Without this Next serves WebP only, even to a
    // browser advertising `Accept: image/avif` (measured: identical bytes for
    // both Accept headers before this was set). BUILD-SPEC §9.2.
    formats: ["image/avif", "image/webp"],

    // Abuse protection (BUILD-SPEC §9.2): the optimizer may only be asked for
    // widths this design actually renders, so it cannot be driven to generate
    // arbitrary dimensions. Both ladders are derived from a measured census of
    // every visible <img> box at 1440px and 390px — see tools/port/imgsizes.ts.
    //
    // deviceSizes serves the `fill` photo cards (rendered 168–1185 CSS px).
    // 1080 is the ceiling on purpose: the largest source file is 960px wide, so
    // w=1200/1600/2048 all return that same 960px image under three more cache
    // keys. Capping here also keeps each srcset to 4–6 candidates instead of 15
    // (measured: ~1,540 bytes of HTML per image before the cap).
    deviceSizes: [384, 640, 828, 1080],

    // imageSizes serves the fixed-size images at DPR 1 and 2: cert logos
    // (72 desktop / 56 mobile → 144), footer cert line (34), avatars (36/40/44),
    // inline mark (52). Three entries cover all of them, and every entry here
    // also leaks into the fill srcsets — so the set stays minimal deliberately.
    imageSizes: [48, 96, 144],

    // No remote images on this site; keep the loader closed rather than open.
    remotePatterns: [],

    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default withNextIntl(nextConfig);
