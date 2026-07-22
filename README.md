# For you 🌹

A nine-day countdown to New York. Each morning a new gift unlocks; tapping
it opens a box of roses and plays that day's video. A brown sugar boba and a
pineapple-and-ham pizza sit in the background. Days that haven't arrived yet
stay locked; past days can be rewatched.

**Live:** https://ronan498.github.io/for-you-0a0e56/

## Add a day
    ./add-day.sh <dayNumber> <path/to/video>
    ./add-day.sh 2 ~/Desktop/IMG_5630.MOV

Converts the clip to a phone-friendly `.mp4`, saves it as `assets/dayN.mp4`,
and pushes it live. See [`assets/README.md`](assets/README.md).

## Change the schedule or words
- **Dates / video slots:** the `DAYS` array and `ARRIVAL` at the top of
  [`script.js`](script.js).
- **Headline + subtitle:** the block marked `EDIT ME` in
  [`index.html`](index.html).

## How the unlocking works
Each day has a date. A day is openable once the viewer's own local date has
reached it, so it flips open at midnight in her timezone. No server needed.

## Notes
- Plain HTML/CSS/JS, no build step. Run locally with `python3 -m http.server`.
- Unlisted: `noindex` keeps it out of search engines; the repo is public
  only because free GitHub Pages requires it.
