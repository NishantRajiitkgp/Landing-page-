import os, re

DST = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'src', 'components', 'sections') + os.sep
NL = "\n"

def swap_brand(j):
    """Replace the inline HelloVerify / YC SVGs with the shared brand components."""
    used = set()
    def rep(m):
        vb, svg = m.group(1), m.group(0)
        wm = re.search(r'width="(\d+)" height="(\d+)"', svg)
        w, h = (wm.group(1), wm.group(2)) if wm else ("0", "0")
        if vb == '0 0 172 50':
            used.add('Logo')
            return '<Logo width={%s} height={%s} />' % (w, h)
        used.add('YCBadge')
        return '<YCBadge width={%s} height={%s} />' % (w, h)
    j = re.sub(r'<svg [^>]*viewBox="(0 0 172 50|0 0 82 16)"[^>]*>.*?</svg>', rep, j, flags=re.S)
    return j, used

def indent(j, n):
    return NL.join((" " * n + l if l.strip() else l) for l in j.splitlines())

def build(path, name, parts, doc="", img_used=()):
    """parts: [(label, jsx-file)]. Labels 'desktop'/'mobile' get the .dsk/.mob wrapper.
    img_used: src/lib/img.ts identifiers the <Image> transform emitted."""
    chunks, used = [], set()
    for label, f in parts:
        j, u = swap_brand(open('jsx/%s.txt' % f, encoding='utf-8').read())
        used |= u
        cls = {"desktop": "dsk", "mobile": "mob"}.get(label)
        if cls:
            chunks.append('      <div className="%s">' % cls)
            chunks.append(indent(j, 2))
            chunks.append('      </div>')
        else:
            chunks.append('      {/* %s */}' % label)
            chunks.append(j)
    head = []
    if img_used:
        head.append('import Image from "next/image";')
        head.append('import { %s } from "@/lib/img";' % ", ".join(sorted(img_used)))
    if doc:
        head.append('/** %s */' % doc)
    if 'Logo' in used:
        head.append('import { Logo } from "@/components/brand/Logo";')
    if 'YCBadge' in used:
        head.append('import { YCBadge } from "@/components/brand/YCBadge";')
    src = NL.join(head + ['', 'export function %s() {' % name, '  return (', '    <>'] +
                  chunks + ['    </>', '  );', '}', ''])
    open(DST + path, 'w', encoding='utf-8').write(src)
    print('wrote', path, len(src))
