"""Regenerate src/app/design.css from the artboard stylesheets.

    python tools/port/build-css.py

IT IS SAFE TO RUN, AND THAT IS NEW. This docstring has been wrong twice: first
it said the script could not run at all (design-src/artboards/ was said to be
absent - measured 22 Sep 2026, the directory is present and git-tracked with
all nine boards and canvas.json, so every input sheet() opens), then it said
running it would silently undo work. TASKS.md carried the consequence as an
open question for days: re-run the script reproducibly, or delete it. This is
the first half, done, and the evidence is byte-level.

    python tools/port/build-css.py   ->   src/app/design.css unchanged
    112,058 bytes in, 112,058 bytes out, `git diff src/app/design.css` empty

WHAT IT TOOK, because the gap was wider than the open question recorded. A
regeneration used to lose five classes of work, not one:

 1. The logical-CSS conversion (163 declarations). Recoverable before today,
    but only by remembering to run a second script; `check:logical` failing
    afterwards is a gate, not a safeguard. Now applied here - this module
    imports logical_css.convert() below, which is the import that two
    docstrings claimed already existed.

 2. Part 9's asymmetric four-value padding/margin shorthands (16 of them,
    emitted as 32 -block/-inline declarations). Taught to logical-css.py.

 3. Part 9's inline-axis translateX (13), as a patch table there rather than a
    regex, because 10 more translateX in the same file are sheen sweeps that
    were deliberately left unflipped.

 4. Part 9's transform-origin: left (5). Taught to logical-css.py.

 5. FOUR DESIGN TOKENS AND FIVE COMMENTS THAT EXIST NOWHERE ELSE, which is the
    part no gate covered and no note had recorded. --white, --green-light,
    --tick-off and --ink-soft are declared only in design.css - not in the
    boards, not in globals.css - and 20 var() references across src/ resolve
    through them, including three in globals.css itself. A regeneration
    deleted all eight declarations (both breakpoints) and every reference
    silently fell back to the initial value. check:logical cannot see it;
    check:css-color walks the token table, so a token that has stopped
    existing is out of its scope. They are restored by POST below, and the
    five WCAG rationale comments (79 lines, on --faint, .inp at both
    breakpoints, and .typing i) with them.

Rejected alternative: delete this script and logical-css.py and treat the nine
boards as a historical capture. That was the other half of the open question
and it is the cheaper answer - nothing imports either script (grep over the
tree outside node_modules finds only docstrings, TASKS.md prose and the
generated-file header), so deleting them costs nothing today. It was rejected
because it costs the ability to re-import a canvas revision at all, and
because the same tree already twice chose to push a fix back into the boards
(the --faint collapse, the .inp contrast literal) on the argument that a fix
living only in the generated file is one regeneration from gone. Deleting the
generator makes that argument unrunnable rather than settling it.

WHAT THIS COSTS EVERY FUTURE EDITOR. design.css and the three tables below are
now one artefact. A hand edit to design.css that is not mirrored into PATCHES
or POST is reverted by the next run, and the run will not warn - the assert
staleness checks fire on an anchor that has MOVED, not on a change made
downstream of them. Edit the tables and re-run; do not edit the output.

The desktop (Main/Desktop2-4) and mobile (Mobile1-5) boards each carry one
complete stylesheet. Both are copied verbatim except for the edits listed in
PATCHES, which are what turn two fixed-width canvases into one fluid page.
"""
import importlib.util
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.join(HERE, '..', '..', 'design-src', 'artboards')
OUT = os.path.join(HERE, '..', '..', 'src', 'app', 'design.css')

# `logical-css.py` has a hyphen, so it is not importable by name. Rejected
# alternative: rename it to logical_css.py - the name is referenced by TASKS.md,
# BUILD-SPEC, both check scripts' failure messages and the README, and a rename
# to satisfy an import is churn measured in more files than this one.
_spec = importlib.util.spec_from_file_location(
    'logical_css', os.path.join(HERE, 'logical-css.py'))
logical_css = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(logical_css)

# The canvas hardcodes the webfont stacks; the app loads them through next/font.
FONTS = [
    ('"Newsreader", "Times New Roman", Georgia, serif',
     'var(--font-newsreader), "Times New Roman", Georgia, serif'),
    ('"Instrument Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
     'var(--font-instrument), "Helvetica Neue", Helvetica, Arial, sans-serif'),
    ('"Geist Mono", "SF Mono", Menlo, Consolas, monospace',
     'var(--font-geist-mono), "SF Mono", Menlo, Consolas, monospace'),
]

# Fixed artboard geometry -> fluid page. Everything else is untouched.
PATCHES = {
    'desktop': [
        ('.page { width: 1440px; min-height: 100%; background: var(--paper); overflow: hidden; }',
         '.page { width: 100%; max-width: 1440px; margin: 0 auto; min-height: 100%; background: var(--paper); overflow: hidden; }'),
        ('.wrap { padding-left: 120px; padding-right: 120px; }',
         '.wrap { padding-left: clamp(24px, 8.334vw, 120px); padding-right: clamp(24px, 8.334vw, 120px); }'),
    ],
    'mobile': [
        ('.page { width: 390px; min-height: 100%; background: var(--paper); overflow: hidden; }',
         '.page { width: 100%; margin: 0 auto; min-height: 100%; background: var(--paper); overflow: hidden; }'),
    ],
}

# ---- POST: what design.css carries that the boards do not ----
#
# PATCHES above is per-board and runs before indent(); these run once over the
# assembled, already-converted stylesheet, so the strings below are verbatim
# design.css text at its final indentation. That is deliberate: it makes each
# entry diffable by eye against the file it produces, which a de-indented
# variant of the same 79 comment lines would not be.

FAINT_NOTE = """\
        /* There is no third text tier. --faint (#A29E94) was one until
           22 Sep 2026 and it could not be made to pass WCAG 2.2 AA 1.4.3 on
           this paper: 2.43:1 on --paper and 2.67:1 on --white, where AA body
           text needs 4.5:1 and AA large text needs 3:1 - so it failed BOTH,
           and enlarging the labels (the other option TASKS.md Part 2a weighed)
           could never have closed it. The lightest colour on that hue which
           does pass 4.5:1 is #726F68, and that measures 1.06:1 against
           --muted (#6F6B62) - the same colour to the eye. A tier nobody can
           distinguish is not a tier, so the token is gone and its 180 rendered
           nodes on the homepage now take --muted (4.83:1 on paper, 5.31:1 on
           white). DESIGN.md 2.1; BUILD-SPEC 12.
           The nine artboards in design-src/artboards/ were changed to match,
           so re-running tools/port/build-css.py cannot reintroduce it - unlike
           the .inp fix below, which the boards still contradict. */
"""

INP_NOTE_DESKTOP = """\
      /* .inp's placeholder colour is var(--muted), NOT the canvas's #7D796F.
         That literal measures 3.95:1 on --paper where AA requires 4.5:1 - found
         by the axe-in-a-browser sweep (TASKS.md Part 6) on five homepage nodes,
         and invisible to every static gate: check:contrast walks the TOKEN
         table, so a colour that is not a token cannot be in its scope.
         --muted (#6F6B62) is the same text tier to the eye and measures 4.83:1.
         Rejected alternative: enlarge the field text past the large-text
         threshold where 3:1 applies - a 16px form field cannot become 24px
         without redrawing the form. For --faint, which TASKS.md Part 2a
         weighed the same alternative for, it was not awkward but impossible:
         2.43:1 is below 3:1 as well, so no type size could have passed it.
         That token was collapsed into --muted on 22 Sep 2026.
         Hand-edited despite the generated-file header at the top of this file,
         which is what the project already does for every other change here.
         All nine artboards still carry `color: #7D796F` on .inp, so re-running
         tools/port/build-css.py WOULD reintroduce this failure - the same
         hazard as its undoing of the logical-CSS conversion, and unlike that
         one, no gate catches it. Fix the artboards too if they are ever the
         source again. */
"""

INP_NOTE_MOBILE = """\
      /* var(--muted) rather than the canvas's #7D796F - see the .inp comment in
         the desktop block above. Both breakpoints carried the literal, and the
         sweep runs at 390px as well as 1440px, so fixing one would have left
         the failure on the tree that mobile actually paints. */
"""

TYPING_NOTE = (
    '/* was #A29E94, the old --faint value written longhand; the token is gone '
    '(see :root) and DESIGN.md 2.1 forbids a hex that is not in its table. '
    'A background, so 1.4.3 never applied to it either way. */ ')

# The four tokens the boards never had. Both :root blocks get them: the desktop
# board writes :root one declaration per line, the mobile board writes it on
# one line, which is why this is two entries and not one.
EXTRA_TOKENS = ' --white: #FFFFFF; --green-light: #8FD3B3; --tick-off: #CFCAC0; --ink-soft: #3D3B35;'

POST = [
    ('--muted: #6F6B62;\n        --hair:',
     '--muted: #6F6B62;\n' + FAINT_NOTE + '        --hair:', 1),
    ('--green: #1B6B4A;\n        --red: #EC2E21;',
     '--green: #1B6B4A;' + EXTRA_TOKENS + '\n        --red: #EC2E21;', 1),
    ('--green: #1B6B4A; --serif:',
     '--green: #1B6B4A;' + EXTRA_TOKENS + ' --serif:', 1),
    # The desktop and mobile .fld-l differ only in font-size (11px / 10.5px),
    # which is what makes this anchor breakpoint-specific.
    ('      /* Form */\n      .fld-l { font-family: var(--mono); font-size: 11px;',
     '      /* Form */\n' + INP_NOTE_DESKTOP + '      .fld-l { font-family: var(--mono); font-size: 11px;', 1),
    ('\n      .inp { margin-top: 6px; height: 48px;',
     '\n' + INP_NOTE_MOBILE + '      .inp { margin-top: 6px; height: 48px;', 1),
    ('background: var(--muted); animation: bounce 1.2s ease-in-out infinite; }',
     'background: var(--muted); ' + TYPING_NOTE + 'animation: bounce 1.2s ease-in-out infinite; }', 2),
]


def sheet(board, which):
    s = open(os.path.join(ART, board + '.dc.html'), encoding='utf-8').read()
    css = re.search(r'<style>(.*?)</style>', s, re.S).group(1).strip()
    for a, b in FONTS + PATCHES[which]:
        assert a in css, 'stale patch, not found in %s: %s' % (board, a[:60])
        css = css.replace(a, b)
    return css


indent = lambda t: '\n'.join(('  ' + l if l.strip() else l) for l in t.splitlines())

css = """/* HelloVerify - design system, ported verbatim from the Claude Design canvas.
   Generated by tools/port/build-css.py. Regenerate rather than hand-tuning.

   The two artboard stylesheets are kept in DISJOINT media queries on purpose.
   The mobile board is a complete stylesheet, not an override layer: where its
   rules omit a property the desktop rule declares (say .role's letter-spacing),
   letting desktop cascade underneath would apply a value that board never had. */

/* ============ DESKTOP - artboards Main / Desktop2-4 ============ */
@media (min-width: 1081px) {
%s
}

/* ============ MOBILE - artboards Mobile1-5 ============ */
@media (max-width: 1080px) {
%s
}

/* ============ RESPONSIVE SWITCH ============
   Desktop and mobile artboards have different element trees, not just different
   sizes. Both are rendered and one is swapped out here. */
.dsk { display: block; }
.mob { display: none; }
@media (max-width: 1080px) {
  .dsk { display: none; }
  .mob { display: block; }
  /* No tablet artboard exists. Below the desktop gutters the mobile board is the
     honest layout, so it is held to a phone-ish column and centred. */
  .page { max-width: 720px; }
}

/* ============ FIXES ON TOP OF THE CANVAS ============
   Deliberate deviations, each traceable to a review note. */

/* The numbers reveal clips its own digits: at 176px/0.9 line-height the glyph
   em box is ~9px taller than the line box, and .big's overflow:hidden (needed
   for the rise animation) shaves the tops of 20M+/2,000+/120+/33+. Give the
   clip box headroom the same way the canvas already does at the bottom
   (padding offset by an equal negative margin), so layout does not move. */
.big { padding-top: 0.1em; margin-top: -0.1em; }
""" % (indent(sheet('Main', 'desktop')), indent(sheet('Mobile', 'mobile')))

# BUILD-SPEC 12/7: the canvas is written in left/right and cannot mirror.
css, counts = logical_css.convert(css)

for physical, logical, expected in POST:
    found = css.count(physical)
    assert found == expected, (
        'stale POST anchor, %d occurrence(s) where %d expected: %s'
        % (found, expected, physical[:60]))
    css = css.replace(physical, logical)

# newline='\n' is load-bearing on Windows: without it Python rewrites every
# line ending and one run flips design.css from LF to CRLF. Line endings
# measurably change the emitted HTML here (TASKS.md Part 11, .gitattributes),
# and logical-css.py already writes with newline='\n' for the same reason.
open(OUT, 'w', encoding='utf-8', newline='\n').write(css)
print('wrote', os.path.relpath(OUT, os.path.join(HERE, '..', '..')))
print('  logical conversion: %d declaration(s)' % sum(counts.values()))
print('  POST: %d patch(es), %d occurrence(s)' % (len(POST), sum(n for _, _, n in POST)))
