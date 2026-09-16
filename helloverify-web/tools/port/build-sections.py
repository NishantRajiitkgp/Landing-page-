"""Regenerate every section component from the design canvas artboards.

    python tools/port/build-sections.py

Artboard HTML is transformed mechanically (h2jsx) rather than retyped, so a
change on the canvas is re-applied by re-exporting design-src/artboards and
running this. Anything hand-edited in src/components/sections will be lost.
"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(HERE)

from extract import sections          # noqa: E402
from h2jsx import convert             # noqa: E402
from mkcomp import build              # noqa: E402

# component -> (desktop board, desktop section, mobile board, mobile section, doc)
# Retired from generation (approved deviations from the canvas, see DESIGN.md §7):
#   Nav    -> chrome/SiteNav (audience-first IA nav)
#   Demo   -> sections/Demo2 (demo redesign, Sep 2026)
#   Footer -> chrome/SiteFooter (footer regrouped to the IA)
SECTIONS = [
    ('Hero',          'Main',     'HERO',               'Mobile',  'HERO',         'Hero - Verified at the source, in minutes.'),
    ('PeopleStrip',   'Main',     'PEOPLE STRIP',       'Mobile',  'PEOPLE STRIP', 'Drifting strip of verified people; the track is duplicated so the loop is seamless.'),
    ('Numbers',       'Main',     'NUMBERS',            'Mobile',  'NUMBERS',      'Built on trust. Proven by numbers.'),
    ('Presence',      'Main',     'PRESENCE',           'Mobile',  'PRESENCE',     'Where HelloVerify operates, and who vouches for it.'),
    ('Why',           'Main',     'WHY',                'Mobile',  'WHY',          'Why governments work with us.'),
    ('Checks',        'Desktop2', 'CHECKS CATALOGUE',   'Mobile2', 'CHECKS',       'The 33-check catalogue, plotted against turnaround time.'),
    ('Packages',      'Desktop2', 'PACKAGES (receipts)','Mobile2', 'PACKAGES',     'Packages, drawn as receipts.'),
    ('HowItWorks',    'Desktop2', 'HOW IT WORKS (stage)','Mobile3','HOW IT WORKS', 'How a verification runs, end to end.'),
    ('WhoItsFor',     'Desktop3', "WHO IT'S FOR",       'Mobile3', 'WHO',          'Who it is for - the audience bento.'),
    ('International', 'Desktop3', 'INTERNATIONAL',      'Mobile4', 'INTERNATIONAL','International coverage.'),
    ('Consumer',      'Desktop3', 'CONSUMER / HELLOV',  'Mobile4', 'CONSUMER',     'HelloV - the consumer side.'),
    ('CustomerStory', 'Desktop4', 'CUSTOMER STORY',     'Mobile4', 'STORY',        'Customer story.'),
    ('Compliance',    'Desktop4', 'COMPLIANCE',         'Mobile5', 'COMPLIANCE',   'Certifications and compliance.'),
    ('Contact',       'Desktop4', 'CONTACT',            'Mobile5', 'CONTACT',      'Contact form.'),
]

os.makedirs('jsx', exist_ok=True)
def emit(board, name, out, comp):
    html = sections(board + '.dc.html')[name]
    # artboard images are published flat; the app serves them from /img
    html = re.sub(r'src="([^"/][^"]*\.(?:jpg|png|webp))"', r'src="/img/\1"', html)
    # <img> becomes a next/image <Image>. The props are not invented here:
    # they come from the measured table in imgprops.py, keyed on the
    # image's container. `used` is the set of src/lib/img.ts imports to inject.
    jsx, used = convert(html, 3, comp)
    open('jsx/%s.txt' % out, 'w', encoding='utf-8').write(jsx)
    return used

for comp, dboard, dname, mboard, mname, doc in SECTIONS:
    used = emit(dboard, dname, 'd-' + comp, comp)
    used |= emit(mboard, mname, 'm-' + comp, comp)
    build(comp + '.tsx', comp, [('desktop', 'd-' + comp), ('mobile', 'm-' + comp)], doc, used)

print('\n%d sections regenerated.' % len(SECTIONS))
