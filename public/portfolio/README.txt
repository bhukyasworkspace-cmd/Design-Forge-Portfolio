HOW TO ADD YOUR WORK
====================

This folder IS the portfolio. Nothing needs to be coded — the site reads
these folders every time it starts (npm run dev) or builds (npm run build).

  public/portfolio/
    01 Posters/                 <- COLLECTION  (a card + its own page)
      Original Creations/       <- SECTION     (a heading inside that page)
        Neon Fest.jpg           <- the caption becomes "Neon Fest"
        02 Retro Night.png      <- caption "Retro Night", sorted 2nd
      Client Work/
    02 Thumbnails/
      Original Creations/
      Recreated Work/

RULES
-----
* Top-level folder  = collection  (shown on the home page + gets its own page)
* Second-level folder = section   (a titled group inside that page)
* File name         = the caption printed under the image
* A leading number ("01 ", "02 ") controls order and is stripped from titles
* Dashes/underscores become spaces: "neon-fest.jpg" -> "Neon Fest"
* Empty folders are skipped, so a collection only appears once it has files
* Deeper folders work too — they become their own sections

SUPPORTED FILES
---------------
Images : .jpg .jpeg .png .webp .avif .gif .svg
Videos : .mp4 .webm .mov .m4v

Give a video a matching image to use as its cover frame:
    Brand Reel.mp4
    Brand Reel.jpg      <- used as the poster

OPTIONAL: _meta.json  (drop into any folder)
--------------------------------------------
{
  "title": "Poster Art",
  "tagline": "Print & social",
  "description": "Shown under the collection title.",
  "order": 1,
  "items": {
    "Neon Fest.jpg": { "title": "Neon Fest 2025", "description": "Event key visual", "tags": ["Print"] }
  }
}

OPTIONAL: _links.json  (for videos hosted on YouTube / Vimeo)
------------------------------------------------------------
[
  { "title": "Brand Film", "url": "https://youtu.be/VIDEO_ID" },
  { "title": "Reel", "url": "https://vimeo.com/123456789", "thumbnail": "cover.jpg" }
]

YouTube covers are fetched automatically — no thumbnail needed.
