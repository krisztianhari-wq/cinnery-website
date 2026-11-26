#!/usr/bin/env python3
"""Turn the chosen raw Gemini images into game sprites in assets/game/.

White background connected to the image border becomes transparent (inner whites, e.g. highlights, stay),
then the sprite is trimmed and scaled to a fixed height. Opaque layers (far backgrounds, interior) are only scaled.

  python3 tools/game/cut.py            # all entries in PICK
  python3 tools/game/cut.py ing-egg    # just some
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

HERE = Path(__file__).resolve().parent
RAW, OUT = HERE / "raw", HERE.parent.parent / "assets" / "game"

# sprite name -> (raw file, height in px, opaque?)
PICK = {
    "ing-flour": ("ing-flour-b", 96, False), "ing-sugar": ("ing-sugar-b", 96, False), "ing-butter": ("ing-butter-a", 96, False),
    "ing-egg": ("ing-egg-a", 96, False), "ing-yeast": ("ing-yeast-a", 96, False), "ing-cinnamon": ("ing-cinnamon-a", 96, False),
    "ing-creamcheese": ("ing-creamcheese-b", 96, False), "ing-cocoa": ("ing-cocoa-a", 96, False), "ing-biscoff": ("ing-biscoff-b", 96, False),
    "ing-pistachio": ("ing-pistachio-a", 96, False), "ing-caramel": ("ing-caramel-b", 96, False), "ing-blueberry": ("ing-blueberry-b", 96, False),
    "baker-run1": ("baker-run1-b", 256, False), "baker-run2": ("baker-run2-b", 256, False), "baker-run3": ("baker-run3-b", 256, False),
    "baker-run4": ("baker-run4-b", 256, False), "baker-jump": ("baker-jump-d", 256, False), "baker-fall": ("baker-fall-a", 256, False),
    "baker-hit": ("baker-hit-d", 256, False), "baker-pour": ("baker-pour-d", 256, False),
    "bike": ("bike-a", 160, False), "cobble": ("cobble-b", 80, False), "tulip": ("tulip-a", 160, False), "tram": ("tram-a", 240, False),
    "pigeon": ("pigeon-a", 96, False), "gull": ("gull-a", 110, False), "puddle": ("puddle-a", 60, False), "canal": ("canal-a", 90, False),
    "bg-amsterdam-far": ("bg-amsterdam-far-b", 600, True), "bg-groningen-far": ("bg-groningen-far-a", 600, True),
    "bg-amsterdam-near": ("bg-amsterdam-near-a", 440, False), "bg-groningen-near": ("bg-groningen-near-a", 440, False),
    "bakery": ("bakery-a", 500, False), "bake-room": ("bake-room-b", 600, True), "machine": ("machine-a", 340, False),
}


def cutout(im, tol=28, crop=True):
    a = np.asarray(im.convert("RGB")).astype(int)
    white = (a.min(axis=2) > 255 - tol)
    lab, _ = ndimage.label(white)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    bg = ndimage.binary_dilation(bg, iterations=1) & (a.min(axis=2) > 200)   # eat the JPEG halo
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    alpha = np.asarray(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.6)))
    rgba = np.dstack([a.astype(np.uint8), alpha])
    out = Image.fromarray(rgba)
    return out.crop(out.getbbox()) if crop else out


def sticker(im, r):
    """Thick white outline around the figure, so she stands out against the busy street."""
    pad = Image.new("RGBA", (im.width + 2 * r, im.height + 2 * r), (0, 0, 0, 0))
    pad.paste(im, (r, r))
    ring = pad.getchannel("A").point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MaxFilter(2 * r + 1)).filter(ImageFilter.GaussianBlur(0.8))
    out = Image.new("RGBA", pad.size, (255, 255, 255, 0))
    out.putalpha(ring)
    out.alpha_composite(pad)
    return out


def main(names):
    OUT.mkdir(exist_ok=True)
    # baker frames share one crop box, so scale and foot line stay identical between frames
    bakers = {n: cutout(Image.open(RAW / f"{PICK[n][0]}.png"), crop=False) for n in PICK if n.startswith("baker-")}
    boxes = [im.getbbox() for im in bakers.values()]
    union = (min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes)) if boxes else None
    for name in names or PICK:
        src, h, opaque = PICK[name]
        if name in bakers:
            im = bakers[name].crop(union)
        else:
            im = Image.open(RAW / f"{src}.png")
            im = im.convert("RGB") if opaque else cutout(im)
        w = round(im.width * h / im.height)
        im = im.resize((w, h), Image.LANCZOS)
        if name.startswith(("baker-", "ing-")):
            im = sticker(im, 7 if name.startswith("baker-") else 4)
        if h > 150:   # flat art: a palette keeps the big files small
            im = im.quantize(colors=192, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
        im.save(OUT / f"{name}.png", optimize=True)
        print(f"{name:18} {w}x{h}  {(OUT / f'{name}.png').stat().st_size // 1024} kB")


if __name__ == "__main__":
    main(sys.argv[1:])
