# For you 🌹

A tiny one-page surprise: a box of roses (with a brown sugar boba and a
pineapple-and-ham pizza staged behind it) that opens when you tap it and
plays a video inside.

## Add the video
Drop your clip into [`assets/`](assets/) named `message.mp4`. See
[`assets/README.md`](assets/README.md).

## Run it locally
It is plain HTML/CSS/JS, no build step. Any static server works:

    python3 -m http.server 8000
    # then open http://localhost:8000

(Opening `index.html` directly works too, but a local server is closer to
how it runs live.)

## Edit the words
The name and message live in `index.html`, in the block marked
`EDIT ME`. Change two lines, done.

## Privacy
This is set up as an *unlisted* page: `noindex` + `robots.txt` keep it out
of search engines. Anyone with the exact link can still view it.
