"""How a canvas <img> becomes a next/image <Image>.

The canvas boards contain plain <img> tags. G2 (BUILD-SPEC §9.2) requires
next/image everywhere, so the port has to decide two things per image that the
HTML does not carry: whether it is a `fill` image or a fixed-size one, and what
`sizes` to declare.

Both answers come from measurement, not judgement, which is what keeps this
generator "faithful, mechanical; no layout decisions" (h2jsx's own docstring):
every visible <img> box on the site was measured at 1440px and 390px via CDP,
and the table below records the container each one sits in. The `sizes` strings
themselves live in src/lib/img.ts next to their measurements.

Keyed by (component, container class) because the same container class means two
different things in two sections: Contact's <div class="ph"> holds a 672x760
photo, CustomerStory's holds a 52x52 mark.

If a canvas change moves an image into a new container, the build fails loudly
rather than guessing — see resolve().
"""

FILL, FIXED = 'fill', 'fixed'

# (component, container class) -> (kind, sizes-or-box, extra)
TABLE = {
    ('PeopleStrip',   'person ph'): (FILL,  'SIZES_PERSON',  None),
    ('International', 'ccard ph'):  (FILL,  'SIZES_CCARD',   None),
    ('Why',           'whyv ph'):   (FILL,  'SIZES_WHY',     None),
    ('HowItWorks',    'ph av'):     (FILL,  'SIZES_AVATAR',  None),
    ('Contact',       'ph'):        (FILL,  'SIZES_FEATURE', None),
    ('CustomerStory', 'ph'):        (FILL,  'SIZES_MARK',    None),
    # the bento cell is 783px wide when it spans two grid columns, 382px otherwise
    ('WhoItsFor',     'cell ph'):   (FILL,  ('SIZES_BENTO_WIDE', 'SIZES_BENTO_NARROW'), 'gridColumn'),
    # FIXED entries carry no `sizes`: with width/height and no sizes, Next emits
    # just `?w=<1x> 1x, ?w=<2x> 2x`. A px-only `sizes` would instead disable the
    # srcset filter and point the fallback src at w=1080 for a 36px avatar.
    ('Compliance',    'cert'):      (FIXED, 'CERT_BOX',      None),
    ('Presence',      'gt'):        (FIXED, 'AVATAR_GT',     None),
}


# Containers whose images must not be lazy. The people strip duplicates its
# track for a seamless drift loop; the copy sits outside the viewport
# horizontally, so lazy loading never fetches it and the loop's second half
# paints blank. It also holds the homepage's first image content.
EAGER = {
    ('PeopleStrip', 'person ph'),
}


def resolve(component, parent_cls, parent_attrs):
    """-> (kind, sizes_expr, box_const, eager) for an <img> in this container.

    Raises on an unknown container: a silent fallback would ship a `sizes` that
    does not match the layout, which is the one failure mode that makes
    next/image heavier than the raw <img> it replaced.
    """
    key = (component, (parent_cls or '').strip())
    if key not in TABLE:
        raise SystemExit(
            'imgprops: no measured entry for <img> inside '
            'class="%s" in %s.\n'
            'A canvas change moved an image into a new container. Measure the '
            'new box at 1440px and 390px (tools/port/imgcensus.mjs), add a '
            'sizes constant to src/lib/img.ts, then add it to TABLE here.'
            % (parent_cls, component))
    kind, sizes, extra = TABLE[key]
    eager = key in EAGER
    if kind is FILL:
        if isinstance(sizes, tuple):
            wide, narrow = sizes
            sizes = wide if extra and extra in (parent_attrs or '') else narrow
        return FILL, sizes, None, eager
    return FIXED, extra, sizes, eager


def identifiers():
    """Every src/lib/img.ts export this module can emit, for import injection."""
    out = set()
    for kind, sizes, extra in TABLE.values():
        if isinstance(sizes, tuple):
            out.update(sizes)
        else:
            out.add(sizes)
    return out
