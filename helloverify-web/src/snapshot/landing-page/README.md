# Frozen homepage snapshot: `/landing-page`

A frozen copy of the homepage taken on **28 Sep 2026**: commit `187daec` plus
the uncommitted Enterprises edits from that day. It is served at
`/landing-page`, so the live homepage (`/en`) can be reworked without losing
this version.

**Do not edit these files** unless you want to change the snapshot itself.

## What is copied (and so frozen)

- `components/`: every section, plus the nav, footer, consent bar, forms,
  brand marks and blocks.
- `lib/copy/`: the sections, chrome, blocks and root copy (all the text).
- `lib/content/` and the art and animation helpers in `lib/*.ts`.
- `app/*.css` and `app/v2/*.css`: every stylesheet, globals included.
- `public/snapshot-landing-page/img/`: the 51 photographs the page uses.

## What is still shared with the live site

These files are infrastructure rather than page design:

- i18n routing
- the copy loader (`lib/copy/index.ts` and `request.ts`)
- SEO and schema
- analytics consent
- the contact-form server action and the lead pipeline
- the font files

## Wiring

- `src/app/landing-page/`: a separate root layout, so that navigating to or
  from the live site does a full reload and the two sets of CSS never mix. The
  page is marked `noindex`.
- `src/proxy.ts`: the `landing-page` path is excluded from locale redirects.

## Removing it

Delete `src/app/landing-page/`, `src/snapshot/landing-page/` and
`public/snapshot-landing-page/`, then remove `landing-page` from the matcher in
`src/proxy.ts`.
