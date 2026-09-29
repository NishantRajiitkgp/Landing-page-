# Specimen documents (homepage v2)

The documents on the homepage's evidence table (`sections/OneInEightTable.tsx`)
and in the "How we know" case file (`sections/HowWeKnowDocs.tsx`) are
**synthetic scans**. The institutions and holders are fictional, there are no
state emblems, and the licence and the nursing degree say SPECIMEN on the
document itself. The table's top bar says "illustrative, synthetic documents".

Made 29 Sep 2026 with Higgsfield, model `nano_banana_pro` at 2k. Each prompt
described the document and its exact wording, and ended with: *"Flatbed scan of
the whole document, straight, filling the frame edge to edge with the paper's
edges just visible, true colours, fine paper texture, faint scanner noise. All
text sharp, legible and correctly spelled. Fictional institution: an
illustrative specimen for a background-verification company's website demo."*

| File (`public/img/docs/`) | Document | Aspect |
|---|---|---|
| `ev-01-be-in` | B.E. degree, "Deccan Technological University", Belagavi | 4:3 |
| `ev-02-transcript-ae` | Grade 12 transcript in Arabic and English, "Al Waha Private School", Abu Dhabi | 3:4 |
| `ev-03-tor-ph` | Transcript of records, BS Nursing, "Colegio de San Rafael", Iloilo | 3:4 |
| `ev-04-pharmacy-eg` | Pharmacy graduation certificate in Arabic, "Middle Nile University" | 4:3 |
| `ev-05-mba-uk` | MBA parchment, "University of Aldermoor" | 4:3 |
| `ev-06-marksheet-in` | Class XII statement of marks, "Deccan Board", Chennai: **the forgery** | 3:4 |
| `ev-07-diploma-sg` | Diploma, "Harbourline Polytechnic", Singapore | 4:3 |
| `ev-08-mbbs-pk` | MBBS degree, "Margalla University of Health Sciences", Islamabad | 3:4 |
| `hw-licence-ka` | Karnataka driving-licence card, holder "A. RAMESH", marked SPECIMEN | 3:2, cut out |
| `hw-degree-kl` | B.Sc. Nursing degree, "Malabar University of Health Sciences", marked SPECIMEN | 3:2 |

The Egyptian certificate's first render put Egypt's eagle emblem in its round
stamp. An edit pass replaced the emblem with an open book and left the rest
untouched.

## The pipeline (sharp)

1. **`forge.cjs <dir>`** alters the marksheet three ways, the way a forger
   alters a genuine sheet. Each way leaves its own trace:
   - *scrape*: Mathematics 062 → 092. The 6 is scraped off (paper cloned in,
     a touch soft) and a 9 is typed in Menlo, a size smaller and 1.5px low.
   - *wash*: Physics 058 → 088. A feathered halo of bleached guilloche
     surrounds the retyped 8.
   - *slip*: Total 415 → 475. A slip of plain paper, a shade paler and without
     guilloche, is "glued" over the figure with a faint edge.

   The marks in words ("SIXTY TWO", "FIFTY EIGHT", "FOUR HUNDRED FIFTEEN") are
   left alone, so the findings in the case file are true of the image. It
   writes `d6-forged.png`, one mask per technique and their union
   `d6-mask.png`.
2. **`pipeline.cjs <dir> <out>`** exports the eight table scans. It also
   writes a `-uv` photograph of each at the same size: paper deep violet, ink
   near-black, and fluorescent fibres from a seeded PRNG so reruns match. The
   genuine sheets get a UV-ink rosette, and so does the forgery (its paper is
   genuine). The forgery's alterations each fluoresce their own way:
   - the scrape glows soft blue-white;
   - the wash is a dark halo with a bright tide line;
   - the slip glows white, with brighter glue at its edges.

   Last, it writes `ev-06-marksheet-in-heat.jpg`: the union mask, blurred, over
   the sheet's own high-frequency energy.
3. **`card2.cjs <src> <out>`** cuts the licence card off the scanner bed with
   its rounded corners and centres it on a transparent 470:300 canvas. The
   stage's drop shadow then follows the card. The card-edge constants were
   measured from that one render.

The loupe crop (`ev-06-marksheet-in-zoom.jpg`) is x 846–966, y 1098–1303 of
the forged scan, enlarged 3×.

If a scan is regenerated, re-measure what is placed on it:

- the field boxes in `HowWeKnowStage.tsx` (`BOXES`);
- the finding marks in `OneInEightCase.tsx` (`MARKS`);
- the lens callouts and emblem positions in `OneInEightDocs.tsx`
  (`FORGED_TAGS`, `DOCS[].emblem`).

They were read from the ink with a column- and row-run scan of each value.

**If you regenerate a published file, give it a new name.** The image
optimizer and browsers cache `/_next/image` by URL for 30 days
(`minimumCacheTTL`). A changed file under the same name keeps showing the old
picture. In dev, deleting `.next/dev/cache/images` clears the optimizer's copy.
