"""HTML fragment -> JSX. Faithful, mechanical; no layout decisions.

The one transform that is not a pure rename is <img> -> next/image <Image>,
required by BUILD-SPEC §9.2. It stays mechanical because the props come from a
measured table keyed on the image's container, not from a judgement call here —
see imgprops.py.
"""
import re, sys
from html.parser import HTMLParser

import imgprops

SPACE = "{' '}"

VOID = {"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"}

ATTR = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex",
    "colspan": "colSpan", "rowspan": "rowSpan", "maxlength": "maxLength",
    "autocomplete": "autoComplete", "readonly": "readOnly", "srcset": "srcSet",
    "crossorigin": "crossOrigin", "datetime": "dateTime", "enctype": "encType",
    "novalidate": "noValidate", "usemap": "useMap", "contenteditable": "contentEditable",
    "spellcheck": "spellCheck", "accesskey": "accessKey",
}
# SVG attributes that are camelCase in the source but arrive lowercased from HTMLParser
for _n in ("viewBox preserveAspectRatio gradientUnits gradientTransform patternUnits "
           "patternContentUnits patternTransform spreadMethod stopColor stopOpacity "
           "clipPath clipPathUnits clipRule fillRule fillOpacity markerWidth markerHeight "
           "markerUnits refX refY baseFrequency numOctaves stitchTiles filterUnits "
           "primitiveUnits maskUnits maskContentUnits textLength lengthAdjust startOffset "
           "xChannelSelector yChannelSelector tableValues surfaceScale specularConstant "
           "specularExponent diffuseConstant kernelMatrix edgeMode pathLength "
           "strokeWidth strokeLinecap strokeLinejoin strokeDasharray strokeDashoffset "
           "strokeMiterlimit strokeOpacity stdDeviation").split():
    ATTR[_n.lower()] = _n
# svg / css-ish hyphenated attributes -> camelCase, except data-*/aria-*/xml*
def attr_name(n):
    if n in ATTR: return ATTR[n]
    if n.startswith(("data-", "aria-")): return n
    if ":" in n: return n  # xlink:href etc — rare; keep
    if "-" in n:
        head, *rest = n.split("-")
        return head + "".join(w[:1].upper() + w[1:] for w in rest)
    return n

def camel(p):
    if p.startswith("--"): return None  # handled separately
    if p.startswith("-"):  # -webkit-x -> WebkitX
        head, *rest = p[1:].split("-")
        return head[:1].upper() + head[1:] + "".join(w[:1].upper() + w[1:] for w in rest)
    head, *rest = p.split("-")
    return head + "".join(w[:1].upper() + w[1:] for w in rest)

def split_decls(s):
    out, depth, buf = [], 0, ""
    for ch in s:
        if ch == "(": depth += 1
        elif ch == ")": depth -= 1
        if ch == ";" and depth == 0:
            out.append(buf); buf = ""
        else:
            buf += ch
    if buf.strip(): out.append(buf)
    return out

def style_obj(s):
    parts = []
    for decl in split_decls(s):
        if ":" not in decl: continue
        p, v = decl.split(":", 1)
        p, v = p.strip(), v.strip()
        if not p: continue
        key = camel(p)
        if key is None:
            key = "'%s'" % p            # CSS custom property
        elif not re.fullmatch(r"[A-Za-z][A-Za-z0-9]*", key):
            key = "'%s'" % key
        parts.append("%s: %s" % (key, js_str(v)))
    return "{ " + ", ".join(parts) + " }"

def js_str(v):
    return "'" + v.replace("\\", "\\\\").replace("'", "\'") + "'"

class Conv(HTMLParser):
    def __init__(self, indent=0, component=None):
        super().__init__(convert_charrefs=False)
        self.out = []
        self.depth = indent
        # component name enables the <img> -> <Image> transform; None keeps this
        # module a pure HTML->JSX converter (its standalone __main__ use).
        self.component = component
        self.stack = []          # ancestor (class, rendered-attrs) pairs
        self.used = set()         # src/lib/img.ts identifiers emitted

    def pad(self): return "  " * self.depth

    def image(self, a, attrs):
        """Emit <Image> for a canvas <img>, using the measured props table."""
        d = dict(attrs)
        parent_cls, parent_attrs = self.stack[-1] if self.stack else ('', '')
        kind, sizes, box, eager = imgprops.resolve(self.component, parent_cls, parent_attrs)
        keep = [x for x in a if not x.startswith(('src=', 'alt=', 'className='))]
        props = ['className="%s"' % d['class'] if d.get('class') else None,
                 'src="%s"' % d.get('src', ''),
                 'alt="%s"' % d.get('alt', '').replace('"', "&quot;")]
        if kind is imgprops.FILL:
            props += ['fill', 'sizes={%s}' % sizes]
            self.used.add(sizes)
        else:
            props += ['width={%s}' % box, 'height={%s}' % box]
            if sizes:
                props.append('sizes="%s"' % sizes)
            self.used.add(box)
        if eager:
            props.append('loading="eager"')
        props = [x for x in props if x] + keep
        self.out.append("%s<Image %s />" % (self.pad(), " ".join(props)))

    def handle_starttag(self, tag, attrs, self_closing=False):
        a = []
        for k, v in attrs:
            if v is None:
                a.append("%s" % attr_name(k)); continue
            if k == "style":
                a.append("style={%s}" % style_obj(v))
            else:
                a.append('%s="%s"' % (attr_name(k), v.replace('"', "&quot;")))
        if tag == "img" and self.component:
            self.image(a, attrs)
            return
        s = tag + ("" if not a else " " + " ".join(a))
        if tag in VOID or self_closing:
            self.out.append("%s<%s />" % (self.pad(), s))
        else:
            self.out.append("%s<%s>" % (self.pad(), s))
            self.stack.append((dict(attrs).get('class', ''), " ".join(a)))
            self.depth += 1

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs, self_closing=True)

    def handle_endtag(self, tag):
        if tag in VOID: return
        self.depth -= 1
        if self.stack: self.stack.pop()
        self.out.append("%s</%s>" % (self.pad(), tag))

    def handle_data(self, data):
        # HTML collapses runs of whitespace to one space, and that space is
        # significant between inline elements ("source, " + <em>in minutes.</em>).
        # JSX drops whitespace around newlines, so any kept space is emitted
        # explicitly as {' '}.
        t = re.sub(r"\s+", " ", data)
        if not t:
            return
        if not t.strip():
            self.out.append(self.pad() + SPACE)
            return
        lead = SPACE if t[0] == " " else ""
        trail = SPACE if t[-1] == " " else ""
        core = t.strip()
        core = "{%s}" % js_str(core) if ("{" in core or "}" in core) else core
        self.out.append(self.pad() + lead + core + trail)

    def handle_entityref(self, name):
        self.out.append(self.pad() + "&" + name + ";")

    def handle_charref(self, name):
        self.out.append(self.pad() + "&#" + name + ";")

    def handle_comment(self, data):
        self.out.append("%s{/* %s */}" % (self.pad(), data.strip().replace("*/", "* /")))

def convert(html, indent=0, component=None):
    """-> jsx, or (jsx, used-identifiers) when a component name is given."""
    c = Conv(indent, component)
    c.feed(html)
    jsx = "\n".join(c.out)
    return (jsx, c.used) if component else jsx

if __name__ == "__main__":
    src = sys.stdin.read()
    print(convert(src, int(sys.argv[1]) if len(sys.argv) > 1 else 0))
