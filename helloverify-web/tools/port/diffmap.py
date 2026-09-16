"""Compare a reference artboard's element map against the port's.

The port is one long page; each artboard is only a slice of it. TAIL=1 aligns the
reference against the last len(ref) elements of the port and compares y relative
to the slice's own origin, so board N can be checked before board N+1 exists.
"""
import json, os, sys

a = json.load(open(sys.argv[1], encoding='utf-8'))
b = json.load(open(sys.argv[2], encoding='utf-8'))
if os.environ.get('TAIL'):
    b = b[len(b) - len(a):]
else:
    # Find where this artboard's slice starts inside the (longer) port page by
    # matching the first ref row's tag+text, then confirming the next few tags.
    starts = [i for i, r in enumerate(b) if r[0] == a[0][0] and r[5] == a[0][5]]
    probe = [r[0] for r in a[1:6]]
    for i in starts:
        if [r[0] for r in b[i + 1:i + 6]] == probe:
            b = b[i:i + len(a)]
            print('aligned port slice at row %d' % i)
            break
    else:
        if len(b) != len(a):
            sys.exit('could not align: %d candidate starts' % len(starts))

print('rows: ref=%d port=%d' % (len(a), len(b)))
if not a or not b:
    sys.exit('empty map')

ya, yb = a[0][2], b[0][2]
bad = 0
for i, (x, y) in enumerate(zip(a, b)):
    if x[0] != y[0]:
        print('TAG MISMATCH at %d: %s vs %s | %s / %s' % (i, x[0], y[0], x[5][:20], y[5][:20]))
        bad += 1
        break
    if x[3] == 0 and x[4] == 0 and y[3] == 0 and y[4] == 0:
        continue  # display:none — both report a zero rect at the origin
    d = [abs(x[1] - y[1]), abs((x[2] - ya) - (y[2] - yb)), abs(x[3] - y[3]), abs(x[4] - y[4])]
    if max(d) > 1:
        print('%-4d %-32s ref=%s port=%s d=%s | %s' % (i, x[0][:32], x[1:5], y[1:5], d, x[5][:22]))
        bad += 1
        if bad > 20:
            break
print('DIFFS:', bad)
