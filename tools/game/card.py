#!/usr/bin/env python3
"""Home-page card for the game: the baker jumping in front of Amsterdam, with a few ingredients around her.
Built from the game sprites in assets/game/ → assets/game/card.jpg.  Run: python3 tools/game/card.py"""
from pathlib import Path
from PIL import Image

G = Path(__file__).resolve().parent.parent.parent / "assets" / "game"
S = 720                                     # square card
ground = int(S * 0.86)

card = Image.new("RGB", (S, S), "#FBE3E6")
far = Image.open(G / "bg-amsterdam-far.png").convert("RGB")
far = far.resize((round(far.width * ground / far.height), ground), Image.LANCZOS)
card.paste(far.crop((80, 0, 80 + S, ground)), (0, 0))
near = Image.open(G / "bg-amsterdam-near.png").convert("RGBA")
nh = int(ground * 0.62)
near = near.resize((round(near.width * nh / near.height), nh), Image.LANCZOS)
card.paste(near.crop((140, 0, 140 + S, nh)), (0, ground - nh), near.crop((140, 0, 140 + S, nh)))
veil = Image.new("RGBA", (S, ground), (255, 252, 250, 97))
card.paste(veil, (0, 0), veil)
card.paste((217, 199, 192), (0, ground, S, S))          # pavement, as in the game
card.paste((74, 47, 62), (0, ground, S, ground + 6))

def put(name, h, cx, bottom):
    im = Image.open(G / f"{name}.png").convert("RGBA")
    im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
    card.paste(im, (cx - im.width // 2, bottom - im.height), im)

shadow = Image.new("RGBA", (150, 30), (0, 0, 0, 0))
from PIL import ImageDraw
ImageDraw.Draw(shadow).ellipse((0, 0, 149, 29), fill=(43, 28, 37, 60))
card.paste(shadow, (S // 2 - 75, ground - 12), shadow)
put("baker-jump", 400, S // 2 - 10, ground - 120)         # in the air, well above the street
put("ing-cinnamon", 92, 150, 250)
put("ing-egg", 84, 580, 200)
put("ing-pistachio", 84, 600, 420)
put("ing-butter", 80, 120, 470)
card.save(G / "card.jpg", quality=86, optimize=True, progressive=True)
print(G / "card.jpg", (G / "card.jpg").stat().st_size // 1024, "kB")
