# Higgsfield image prompts: "What we do for governments" card deck

There are 8 images, one per card, in the "Why governments work with us" section (Desktop2).

## Delivery specs (same for all 8)

| Item | Value |
|---|---|
| Slot on the page | 653 × 310 px, the top of each card, with image `object-fit: cover` |
| Aspect to generate | **21:9**, or 16:9 if 21:9 isn't offered. Either way we crop to about 2.1:1 |
| Resolution | The highest available, at least **2560 px wide** |
| Safe area | Keep the subject inside the **central 60% horizontally and 70% vertically**. Keep the **bottom-left quarter calm** (soft background only), because a small UI label sits there |
| Format | JPG, sRGB, quality 85. No upscaling artefacts, no watermark |
| File names | `card-01-health.jpg` … `card-08-integration.jpg` |
| Model | Higgsfield's most photoreal still model (e.g. **Soul**), with no stylised preset |
| Consistency | Generate card 01 first, then use it as the **style/reference image** for cards 02–08 so light, grain and palette match |

## Shared style block (append to every prompt)

> Editorial still-life photograph, shot on a full-frame camera with a 50mm lens at f/2.8, natural soft window daylight from the upper left, gentle falloff, shallow depth of field. Light warm paper-toned set, matte surfaces, low contrast, lifted shadows. Subtle Kodak Portra 400 film grain, faint lens vignetting, real paper fibres and dust specks, slight imperfections, true-to-life colour. Calm, premium, minimal, in the style of Kinfolk / Cereal magazine product photography. Lots of negative space. No people.

## Shared negative prompt (use on every image)

> text, letters, numbers, words, logos, watermark, signature, readable writing, fake handwriting, government emblem, national crest, flag, brand marks, faces, people, hands, fingers, CGI, 3D render, plastic look, glossy, oversaturated, HDR, neon, dark moody lighting, black background, heavy shadows, lens flare, bokeh balls, fantasy, illustration, cartoon, vector, symmetrical perfect composition, smooth AI skin texture, over-sharpened, chromatic aberration, duplicate objects, warped geometry, melted edges

### Why these rules (so it doesn't look AI-generated)
- **No readable text anywhere.** AI text comes out garbled and gives the image away instantly. Documents show only soft grey placeholder lines or out-of-focus type.
- **No hands or faces.** These are the most common AI tells.
- **No real emblems, flags or passports of a specific country.** Everything is generic and unbranded, so nothing imitates an official document.
- **Real-camera cues:** grain, slight vignetting, paper fibre, slightly imperfect placement and natural light falloff.
- **Low contrast and matte,** not glossy.

---

## 01 · Health Authorities (tint: mint `#E2F2E9`)
> A folded pale-mint cotton lab coat sleeve resting beside a closed cream credential folder and a silver stethoscope loosely coiled on top, on a warm off-white linen tablecloth. A small sprig of eucalyptus at the edge. Top-down 30° angle, subject slightly right of centre, soft mint-tinted shadows. The folder is plain and unlabelled. + *shared style block*

## 02 · Immigration Authorities (tint: sky `#E1ECF8`)
> A plain unbranded dusty-blue passport-style booklet, closed, with a blank embossed cover, lying at a slight angle on pale sky-blue textured paper, a soft-focus boarding pass shape behind it with no printing, and a thin white ribbon bookmark. Morning daylight, airy and calm, gentle blue-grey shadows. No emblem, no country name, no text. + *shared style block*

## 03 · Manpower & Education (tint: sand `#F2E8D6`)
> A rolled cream parchment diploma tied with a thin sand-coloured silk ribbon and a small blank deep-green wax seal, resting on warm sand-beige handmade paper next to a brass fountain pen cap. Low side light raking across the paper texture, warm golden hour tone. Diploma surface blank or with only faint out-of-focus lines. + *shared style block*

## 04 · Business & Trade (tint: lilac `#EAE3F5`)
> A neat stack of three heavyweight cream certificate papers with deckled edges, slightly fanned, a blank blind-embossed circular seal pressed into the top sheet (no text in the seal), a matte brass paperclip, on soft lilac-grey paper. Clean studio daylight, pale lavender shadows, precise and orderly. + *shared style block*

## 05 · Clear Fraud Alerts (tint: rose `#F7E3E0`)
> A single cream document sheet with faint grey placeholder lines, and a round vintage magnifying glass lying on it so one small area under the lens is enlarged and softly tinted warm red, on pale blush-rose paper. The rest of the sheet stays calm and neutral. Soft diffused daylight, gentle rose shadows. No readable text, just abstract lines. + *shared style block*

## 06 · Real-time Dashboards (tint: teal `#DFF0EC`)
> A slim matte tablet lying flat at an angle on a pale teal-grey desk, its screen showing a soft, blurred, out-of-focus light-green bar chart glow (no numbers, no UI text), a ceramic cup edge just in frame, a thin shadow of a window frame falling across the desk. Calm morning light, minimal. + *shared style block*

## 07 · Insightful and Informative Reports (tint: warm paper `#EEEAE1`)
> A bound report with a plain cream cover and a single forest-green ink stamp mark shaped like a simple circle with a check inside (no letters), slightly off-centre, resting on warm stone-coloured paper with a second report stacked askew underneath, a graphite pencil beside it. Soft top light, archival and trustworthy feel. + *shared style block*

## 08 · Scalable Integration (tint: slate `#E2E8F0`)
> Three thin frosted-glass panels standing upright and slightly overlapping on a pale slate-blue surface, with a fine thread of soft green light passing through all three and continuing out of frame, subtle refraction, minimalist architectural still life. Cool morning daylight, airy. Not sci-fi, no glow effects beyond the one thread, no circuitry. + *shared style block*

---

## Checklist before handing back
- [ ] No readable text, logos, emblems or flags in any image
- [ ] No hands, faces or people
- [ ] Each image's background matches its card tint (mint, sky, sand, lilac, rose, teal, paper, slate)
- [ ] The subject is inside the safe area and the bottom-left quarter is calm
- [ ] Grain and light look consistent across all 8 (use card 01 as reference)
- [ ] 21:9 (or 16:9), at least 2560 px wide, JPG sRGB, named `card-0N-name.jpg`
