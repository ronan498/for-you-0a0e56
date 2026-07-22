#!/usr/bin/env bash
# Add one day's video to the calendar.
#
#   ./add-day.sh <dayNumber> <path/to/your/video>
#   e.g.  ./add-day.sh 2 ~/Desktop/IMG_5630.MOV
#
# It shrinks the clip to a web-friendly H.264 .mp4 (plays on any phone),
# saves it as assets/dayN.mp4, then commits and pushes so the live site
# updates in about half a minute.

set -euo pipefail
export PATH="/opt/homebrew/bin:$PATH"   # so ffmpeg is found

DAY="${1:?usage: ./add-day.sh <dayNumber> <path-to-video>}"
SRC="${2:?usage: ./add-day.sh <dayNumber> <path-to-video>}"
cd "$(dirname "$0")"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install it with:  brew install ffmpeg" >&2
  exit 1
fi
[ -f "$SRC" ] || { echo "Can't find video: $SRC" >&2; exit 1; }

OUT="assets/day${DAY}.mp4"
echo "Transcoding $SRC -> $OUT ..."
ffmpeg -y -i "$SRC" \
  -vf "scale='if(gte(iw,ih),min(1280,iw),-2)':'if(gte(iw,ih),-2,min(1280,ih))'" \
  -c:v libx264 -preset medium -crf 23 -profile:v high -pix_fmt yuv420p -movflags +faststart \
  -c:a aac -b:a 128k \
  "$OUT" </dev/null

echo "Publishing..."
git add "$OUT"
git commit -m "Add day ${DAY} video"
git push

echo
echo "Done. Day ${DAY} goes live in ~30s:"
echo "  https://ronan498.github.io/for-you-0a0e56/"
