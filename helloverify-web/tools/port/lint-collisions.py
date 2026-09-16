"""Fail if any class used in post-canvas code collides with a BARE canvas class.

The canvas stylesheet (design.css) defines many short bare classes (.row, .gt,
.bar ...). New chrome/page markup must not reuse those names outside their
canvas context. A file whose markup is lifted verbatim from an artboard may opt out with the
comment marker "lint-collisions: canvas-verbatim".

Run: python tools/port/lint-collisions.py
"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))

css = open(os.path.join(ROOT, 'src', 'app', 'design.css'), encoding='utf-8').read()
bare = set()
for sel in re.findall(r'(?:^|[}{])\s*([^{}@]+?)\s*\{', css):
    for part in sel.split(','):
        m = re.fullmatch(r'\.([a-zA-Z0-9_-]+)(::?[a-z-]+(\(.*\))?)?', part.strip())
        if m:
            bare.add(m.group(1))

# canvas classes that post-canvas code MAY use on purpose (shared vocabulary)
ALLOWED = {
    'page', 'wrap', 'k', 'h2', 'lede', 'sec-head', 'hair-top', 'serif', 'mono',
    'btn', 'btn-ink', 'btn-line', 'btn-ghost', 'btn-sm', 'full',
    'ph', 'pimg', 'scrim', 'cell', 'rz', 'cert', 'svc', 'rc', 'hn', 'tick', 'dot',
    'lic', 'beam', 'soc', 'fcol', 'dring', 'dtabs', 'rise', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6',
    # form vocabulary (DESIGN.md §3) — defined at both breakpoints, reused on purpose
    'fld-l', 'inp', 'seg', 'full',
    # canvas sub-classes used intentionally INSIDE their canvas parent (.cell, .lic, .rc, .chip)
    'tag', 'from', 'body', 'h', 'p', 'lt', 'lr', 'face', 'ln1', 'ln2', 'ln3', 'ln4', 'holo',
    'chip', 'who', 'role', 'city', 'live', 'more', 'on',
}

targets = []
for base, _, files in os.walk(os.path.join(ROOT, 'src')):
    if 'sections' in base.replace(os.sep, '/'):
        continue  # generated canvas ports may use anything
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            targets.append(os.path.join(base, f))

MARKER = 'lint-collisions: canvas-verbatim'

bad = 0
for path in targets:
    src = open(path, encoding='utf-8').read()
    if MARKER in src:
        continue  # markup lifted verbatim from an artboard; canvas classes are the point
    for m in re.finditer(r'className=\{?"([^"]+)"', src):
        for cls in m.group(1).split():
            if cls in bare and cls not in ALLOWED:
                print('COLLISION %s: class "%s" is a bare canvas class' % (os.path.relpath(path, ROOT), cls))
                bad += 1
sys.exit(1 if bad else 0)
