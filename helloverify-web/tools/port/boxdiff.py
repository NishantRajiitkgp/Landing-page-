"""Compare two dommap captures ignoring elements that render no box.

The sequential aligner in diffmap.py desyncs when elements are INSERTED, which
is exactly what happened here: React puts its hidden $ACTION_* inputs at the top
of a form, and the honeypot adds a visually-hidden wrapper. None of those paint
anything. The question that actually matters for fidelity is whether any element
that DOES paint moved, so filter to those and compare the sequences.
"""
import io, json, sys

SP = "D:/Temp/claude/D--Projects-HV-new-landing-page/3952e45d-0bd9-45e4-b2f3-cdb0e334a42e/scratchpad/"


def load(name):
    return json.load(io.open(SP + name, encoding="utf-8"))


def visible(rows):
    """Row shape: [selector, x, y, w, h, text]."""
    out = []
    for r in rows:
        sel, x, y, w, h = r[0], r[1], r[2], r[3], r[4]
        text = r[5] if len(r) > 5 else ""
        if w <= 1 or h <= 1:
            continue
        out.append((sel, x, y, w, h, text))
    return out


def report(before_file, after_file, label):
    b = visible(load(before_file))
    a = visible(load(after_file))
    print(f"=== {label} ===")
    print(f"painted elements: before={len(b)} after={len(a)}")

    if len(b) != len(a):
        bs = [r[0] for r in b]
        as_ = [r[0] for r in a]
        only_after = [s for s in as_ if as_.count(s) > bs.count(s)]
        only_before = [s for s in bs if bs.count(s) > as_.count(s)]
        print("  only in after :", sorted(set(only_after)))
        print("  only in before:", sorted(set(only_before)))

    diffs = 0
    for i in range(min(len(b), len(a))):
        if b[i] != a[i]:
            diffs += 1
            if diffs <= 12:
                print(f"  row {i}")
                print(f"    before {b[i]}")
                print(f"    after  {a[i]}")
    print(f"DIFFS: {diffs}")
    print()
    return diffs


total = 0
total += report("before-desktop.json", "after-desktop.json", "DESKTOP 1440")
total += report("before-mobile.json", "after-mobile.json", "MOBILE 390")
print("TOTAL PAINTED-BOX DIFFS:", total)
sys.exit(0)
