import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/** Points next-intl at the per-request config module (BUILD-SPEC §7). */
const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
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
