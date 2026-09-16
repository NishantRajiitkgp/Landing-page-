import os, re, sys
BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'design-src', 'artboards') + os.sep

def body(f):
    s = open(BASE + f, encoding='utf-8').read()
    i = s.index('</style>')
    b = s[i + len('</style>'):]
    b = b[b.index('<div class="page">') + len('<div class="page">'):]
    return b.rsplit('</div>', 1)[0]

def sections(f):
    b = body(f)
    marks = [(m.start(), m.end(), m.group(1).strip()) for m in re.finditer(r'<!--\s*(.*?)\s*-->', b)]
    out = {}
    for i, (s0, e0, name) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else len(b)
        out[name] = b[e0:end].strip()
    return out

if __name__ == '__main__':
    f, name = sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None
    secs = sections(f)
    if name is None:
        for k, v in secs.items(): print(k, len(v))
    else:
        sys.stdout.write(secs[name])
