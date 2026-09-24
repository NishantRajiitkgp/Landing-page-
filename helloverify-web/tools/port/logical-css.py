"""Physical -> logical CSS properties, for RTL (BUILD-SPEC §12, §7).

    python tools/port/logical-css.py            # report only
    python tools/port/logical-css.py --write    # rewrite in place

§12 requires "CSS logical properties only, lint-enforced", because §7 ships an
Arabic locale and a stylesheet written in left/right cannot be mirrored: every
`margin-left` stays on the left when the document direction flips, so the
layout comes apart rather than reflecting.

IT IS NOW WIRED INTO build-css.py, and that closes the longest-standing open
question in TASKS.md. Two earlier versions of this paragraph were wrong in
opposite directions - one claimed the import already existed (it did not), the
next recorded that it did not and that this script was missing Part 9's rules
so a regeneration could not be reproduced. Both are now out of date:
`build-css.py` imports `convert()` below and applies it to the assembled
stylesheet, the three Part 9 classes are implemented here, and the proof is
that `python tools/port/build-css.py` reproduces `src/app/design.css`
byte for byte - 112,058 bytes in, 112,058 bytes out, `git diff` empty.

`pages.css` was never generated; it is hand-written for everything built after
the port. Same transform, different provenance, so this still runs over both.

EVERYTHING HERE IS IDEMPOTENT, and that is load-bearing rather than tidy:
`build-css.py` pipes generated output through `convert()`, `--write` is run
over files that are already logical, and the two must agree. Measured on the
current tree: `convert()` over `design.css` and `pages.css` returns them
unchanged, zero declarations.

THREE PART 9 CLASSES THAT PROPERTY RENAMING CANNOT SEE (TASKS.md, 22 Sep 2026):

1. Asymmetric four-value `padding`/`margin` (16 in the canvas output). There is
   no `padding-left` token in `padding: 0 12px 0 10px`, so PROPERTY_MAP is
   blind to it; `.pin`'s was one of the two declarations that pushed four boxes
   off the homepage at both breakpoints under `dir="rtl"`. Symmetric
   shorthands are left alone - if right equals left it already mirrors, and
   rewriting them would be churn on correct code.

2. `transform-origin: left` (5). This was in the PAINT exemption below until
   Part 9 and should not have been: all five are `scaleX` growth animations
   anchored to the inline start, not artwork placement. `background-position`
   and `object-position` stay exempt for the original reason - mirroring a
   photograph's focal point is usually wrong.

3. Inline-axis `translateX` (13). THIS IS A PATCH TABLE, NOT A REGEX, and the
   reason is that the population is mixed. `check-logical-css.mjs` inventories
   every unflipped `translateX` and caps it at 10; the cap started at 13, three
   of those turned out to be layout and were flipped, and the remaining 10 -
   `shimmer`, `sheen`, `.lic::after` - are sweeps across a surface where the
   direction a highlight travels in Arabic is a design call. A regex over
   `translateX` cannot tell a centring offset from a sheen. Rejected
   alternative: flip all of them and raise nothing - that changes ten motion
   designs nobody asked to change, and `tools/e2e/rtl.spec.ts` would not catch
   it because geometry does not know which way a thing is travelling.

ONLY THE INLINE AXIS IS CONVERTED, and that is the point rather than laziness.
In a horizontal writing mode RTL flips the INLINE axis only; `margin-top` means
the same thing in Arabic as in English. Converting the 156 block-axis
properties would be churn across a design-complete stylesheet with no
behavioural effect and a real chance of a typo. Measured in this repo:

    inline axis (must convert):  left/right insets 123, margin 18,
                                 border 13, padding 5, keywords 6
    block axis (left alone):     margin-top/bottom 113, padding-top/bottom 43

VALUES ARE NOT TOUCHED except for `text-align`, `float` and `clear`, whose
`left`/`right` keywords are themselves directional, and the three classes
above. Paint positioning is listed by the report so the decision stays visible
rather than implied.
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TARGETS = [
    os.path.join(HERE, '..', '..', 'src', 'app', 'design.css'),
    os.path.join(HERE, '..', '..', 'src', 'app', 'pages.css'),
    os.path.join(HERE, '..', '..', 'src', 'app', 'inner.css'),
]

# Property renames. Longest first so `border-left-width` is not half-matched by
# `border-left`.
PROPERTY_MAP = [
    ('margin-left', 'margin-inline-start'),
    ('margin-right', 'margin-inline-end'),
    ('padding-left', 'padding-inline-start'),
    ('padding-right', 'padding-inline-end'),
    ('border-left-width', 'border-inline-start-width'),
    ('border-right-width', 'border-inline-end-width'),
    ('border-left-color', 'border-inline-start-color'),
    ('border-right-color', 'border-inline-end-color'),
    ('border-left-style', 'border-inline-start-style'),
    ('border-right-style', 'border-inline-end-style'),
    ('border-left', 'border-inline-start'),
    ('border-right', 'border-inline-end'),
    ('scroll-margin-left', 'scroll-margin-inline-start'),
    ('scroll-padding-left', 'scroll-padding-inline-start'),
]

# Bare `left:` / `right:` are the inset properties. Matched only at property
# position - after `{`, `;`, or line start - so `border-left:` (preceded by a
# hyphen) and any value containing the word are untouched.
INSET = re.compile(r'(^|[;{]|\n)(\s*)(left|right)(\s*:)', re.M)
INSET_MAP = {'left': 'inset-inline-start', 'right': 'inset-inline-end'}

# Directional KEYWORDS, where the value is the thing that flips.
VALUE_RULES = [
    (re.compile(r'(text-align\s*:\s*)left\b'), r'\1start'),
    (re.compile(r'(text-align\s*:\s*)right\b'), r'\1end'),
    (re.compile(r'(float\s*:\s*)left\b'), r'\1inline-start'),
    (re.compile(r'(float\s*:\s*)right\b'), r'\1inline-end'),
    (re.compile(r'(clear\s*:\s*)left\b'), r'\1inline-start'),
    (re.compile(r'(clear\s*:\s*)right\b'), r'\1inline-end'),
]

# Part 9, class 1. Four-value shorthands; the split must respect parentheses
# because `padding: 15px clamp(24px, 8.334vw, 120px)` is TWO values and a naive
# split reads it as four with an asymmetric pair. Same trap that
# check-logical-css.mjs documents, and the same `values()` implementation, so
# the gate's suggested replacement and this rewrite cannot drift apart.
SHORTHAND = re.compile(r'\b(padding|margin)\s*:\s*([^;{}]+);')

# Part 9, class 2. `var(--origin-x)` is declared in globals.css, which is
# hand-written and not generated.
ORIGIN = re.compile(r'(transform-origin\s*:\s*)(?:left|right)\b')

# Part 9, class 3. Anchored on enough surrounding text to name the rule, with
# the expected occurrence count as a staleness check - the same discipline as
# build-css.py's `assert a in css`, one step stricter because a silently
# doubled match here would flip a sheen. Count 2 means desktop and mobile.
# `.axis span` is deliberately a separate entry from `.dayaxis span`: the
# mobile board has no `.axis`, so a shared anchor would have the wrong count.
FLIP = [
    ('transform: translateX(-50%); } }',
     'transform: translateX(calc(var(--flip) * -50%)); } }', 2),
    ('.dayaxis span { position: absolute; top: 0; transform: translateX(-50%);',
     '.dayaxis span { position: absolute; top: 0; transform: translateX(calc(var(--flip) * -50%));', 2),
    ('.dayaxis span:last-child { transform: translateX(-100%); }',
     '.dayaxis span:last-child { transform: translateX(calc(var(--flip) * -100%)); }', 2),
    ('.axis span { position: absolute; top: 0; transform: translateX(-50%);',
     '.axis span { position: absolute; top: 0; transform: translateX(calc(var(--flip) * -50%));', 1),
    ('bottom: -22px; left: 50%; transform: translateX(-50%);',
     'bottom: -22px; left: 50%; transform: translateX(calc(var(--flip) * -50%));', 2),
    ('white-space: nowrap; transform: translateX(-13px);',
     'white-space: nowrap; transform: translateX(calc(var(--flip) * -13px));', 1),
    ('.pin.r { transform: translateX(calc(-100% + 13px));',
     '.pin.r { transform: translateX(calc(var(--flip) * -100% + var(--flip) * 13px));', 1),
    ('.stlbl { position: absolute; top: 474px; transform: translateX(-50%);',
     '.stlbl { position: absolute; top: 474px; transform: translateX(calc(var(--flip) * -50%));', 2),
]

# Reported, never rewritten - see the module docstring. `transform-origin` was
# in this list until Part 9 and is now converted instead.
PAINT = re.compile(r'(background-position|object-position)\s*:[^;}]*\b(left|right)\b')


def values(text):
    """Split a shorthand on whitespace, but never inside parentheses."""
    out, depth, cur = [], 0, ''
    for ch in text:
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        if depth == 0 and ch.isspace():
            if cur:
                out.append(cur)
            cur = ''
            continue
        cur += ch
    if cur:
        out.append(cur)
    return out


def convert(css):
    """Returns (converted, counts). Idempotent: logical input is unchanged."""
    counts = {}

    for physical, logical, expected in FLIP:
        # Zero is the idempotent case (already flipped), not a stale anchor.
        found = css.count(physical)
        if not found:
            continue
        assert found == expected, (
            'stale flip anchor, %d occurrence(s) where %d expected: %s'
            % (found, expected, physical[:60]))
        css = css.replace(physical, logical)
        counts['translateX via --flip'] = counts.get('translateX via --flip', 0) + found

    css, n = ORIGIN.subn(lambda m: m.group(1) + 'var(--origin-x)', css)
    if n:
        counts['transform-origin'] = n

    shorthands = [0]

    def shorthand(m):
        parts = values(m.group(2))
        # Symmetric (or non-four-value) shorthands already mirror.
        if len(parts) != 4 or parts[1] == parts[3]:
            return m.group(0)
        top, right, bottom, left = parts
        block = top if top == bottom else '%s %s' % (top, bottom)
        shorthands[0] += 1
        return '%s-block: %s; %s-inline: %s %s;' % (m.group(1), block, m.group(1), left, right)

    css = SHORTHAND.sub(shorthand, css)
    if shorthands[0]:
        counts['asymmetric four-value shorthands'] = shorthands[0]

    for physical, logical in PROPERTY_MAP:
        pattern = re.compile(r'(^|[;{\s])' + re.escape(physical) + r'(\s*:)', re.M)
        css, n = pattern.subn(lambda m: m.group(1) + logical + m.group(2), css)
        if n:
            counts[physical] = n

    def inset(m):
        return m.group(1) + m.group(2) + INSET_MAP[m.group(3)] + m.group(4)

    css, n = INSET.subn(inset, css)
    if n:
        counts['left/right insets'] = n

    for pattern, repl in VALUE_RULES:
        css, n = pattern.subn(repl, css)
        if n:
            counts['keywords'] = counts.get('keywords', 0) + n

    return css, counts


def main():
    write = '--write' in sys.argv
    total = 0
    for path in TARGETS:
        with open(path, encoding='utf-8') as f:
            before = f.read()
        after, counts = convert(before)
        name = os.path.basename(path)

        if counts:
            print('%s:' % name)
            for k, v in sorted(counts.items(), key=lambda x: -x[1]):
                print('    %4d  %s' % (v, k))
            total += sum(counts.values())
        else:
            print('%s: already logical' % name)

        painted = PAINT.findall(before)
        if painted:
            print('    (%d paint-positioning value(s) left alone by design)' % len(painted))

        if write and after != before:
            # newline='\n' for the reason build-css.py documents: without it
            # Python rewrites every line ending and one run flips these files
            # from LF to CRLF.
            with open(path, 'w', encoding='utf-8', newline='\n') as f:
                f.write(after)

    print('')
    if write:
        print('rewrote %d declaration(s)' % total)
    else:
        print('%d declaration(s) would change; pass --write to apply' % total)


if __name__ == '__main__':
    main()
