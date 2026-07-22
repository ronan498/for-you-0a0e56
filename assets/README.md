# The daily videos

Each day of the countdown plays one file:

    assets/day1.mp4   (Wed Jul 22)
    assets/day2.mp4   (Thu Jul 23)
    ...
    assets/day9.mp4   (Thu Jul 30)

A day stays locked until its date arrives (in her local time), so a new
one is waiting when she wakes up. `day1.mp4` is already in place.

## Easiest way to add a day
From the project folder:

    ./add-day.sh 2 ~/Desktop/IMG_5630.MOV

That shrinks your clip to a phone-friendly `.mp4`, saves it as
`assets/day2.mp4`, and pushes it live (about 30 seconds later).

Raw `.MOV` files are ignored by git on purpose (they are huge and some
browsers cannot play them), so always let the script convert them.

## Or just hand it to me
Tell me "day 3 is ready, it's IMG_5631.MOV" and I will convert and push it.

## Notes
- iPhone clips are often HEVC/4K, which Android and Chrome may refuse to
  play. The conversion fixes that and drops an 80 MB clip to ~15 MB.
- Keep the finished `.mp4` under 100 MB (GitHub's hard limit).
