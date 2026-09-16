#!/bin/sh
# diff.sh <ref-html> <url> <width> <mode>   (TAIL=1 to align on the page tail)
set -e
MODE="${4:-desktop}" node tools/port/dommap.mjs "$1" "$3" /tmp/map-ref.json > /dev/null
MODE="${4:-desktop}" node tools/port/dommap.mjs "$2" "$3" /tmp/map-my.json > /dev/null
python tools/port/diffmap.py /tmp/map-ref.json /tmp/map-my.json
