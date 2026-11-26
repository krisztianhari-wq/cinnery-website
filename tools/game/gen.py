#!/usr/bin/env python3
"""Generate the Cinnery mini-game art with the Gemini image API.

The API key is read from the macOS Keychain (service "cr-jack-gemini"), never printed or stored.
Output: tools/game/raw/<name>-a.png, -b.png ... (gitignored; existing files are skipped, so a re-run resumes).

  python3 tools/game/gen.py --list
  python3 tools/game/gen.py --only 'baker-sheet,ing-*'
  python3 tools/game/gen.py --only 'baker-run*' --ref raw/baker-sheet-b.png   # poses from the chosen model sheet
  python3 tools/game/gen.py --sheet                                         # raw/index.html contact sheet
"""
import argparse, base64, concurrent.futures as cf, fnmatch, json, subprocess, sys, tempfile, threading, time
import urllib.error, urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "raw"
API = "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent"

STYLE = """Art style for a cheerful 2D side-scrolling browser game for Cinnery, a cinnamon-roll bakery in the Netherlands.
Flat vector cartoon look: clean bold dark-plum outlines (#2B1C25), flat fills, at most one soft shade per colour, no gradients,
no texture, no 3D render, no photo realism. Friendly, cute, readable at small sizes.
Palette: plum #614051, deep plum #4A2F3E, pink #F0A3AF, soft pink #FBE3E6, cream #FFFCFA, warm cinnamon brown #A8643A,
butter yellow #F4C95D, leaf green #5E9C6B, canal blue #6FA8C7. Use pink and plum as the dominant accents.
Absolutely NO text, letters, numbers, logos or watermarks anywhere in the image.
Background: plain pure white (#FFFFFF), not transparent, unless the prompt says it is a scenery background."""

BAKER = """The hero: a young woman baker in her twenties, cartoon proportions (head about 1/4 of body height), friendly
determined smile, generic cartoon face (not a portrait of a real person).
Hair in a high bun tucked under a pink headscarf (#F0A3AF) tied at the top. Cream short-sleeve shirt, long plum apron
(#614051) with a small cinnamon-roll swirl badge on the chest (a simple spiral, no text), rolled-up sleeves,
dark-plum trousers, pink sneakers. A small cream canvas tote bag over her shoulder for collecting ingredients."""

POSE = "\n\nKeep her exactly as in the attached model sheet (same face, outfit, colours, proportions). One single full figure, side view facing RIGHT, centred, feet on an invisible ground line, nothing else in the picture. Square 1:1."

ING = "\n\nDraw ONE single game pickup icon, centred, filling about 70% of a square 1:1 canvas, slightly tilted, nothing else: "
INGREDIENTS = {
    "flour": "a small paper bag of flour, cream paper with a pink band, a puff of white flour on top",
    "sugar": "a small glass jar of white sugar cubes with a pink lid",
    "butter": "a block of butter in half-open plum-and-cream paper wrapping",
    "egg": "one brown egg",
    "yeast": "a small cube of fresh yeast on a tiny square of paper, with two little bubbles",
    "cinnamon": "two cinnamon sticks tied with a pink ribbon, with a small pile of cinnamon powder",
    "creamcheese": "a small round tub of cream cheese with the lid off, a swirl of white cream cheese visible (special, give it a soft pink sparkle outline)",
    "cocoa": "a small tin of red-brown cocoa powder, lid off (special, soft pink sparkle outline)",
    "biscoff": "two caramel-coloured speculoos biscuits with a wavy edge, no text or logo (special, soft pink sparkle outline)",
    "pistachio": "three green pistachio nuts, one cracked open (special, soft pink sparkle outline)",
    "caramel": "a small jug of golden caramel sauce dripping, with two pecan nuts beside it (special, soft pink sparkle outline)",
    "blueberry": "a small cluster of four blueberries with a leaf (special, soft pink sparkle outline)",
}

JOBS = {
    "baker-sheet": dict(ratio="16:9", ref=False, prompt=STYLE + "\n\n" + BAKER + """

Draw a character model sheet of her: four full-body views side by side on white, evenly spaced, same scale:
front, three-quarter, side facing right, back. Neutral standing pose. Nothing else on the sheet."""),
    "baker-run1": dict(prompt="running, right leg forward, left arm forward, contact pose"),
    "baker-run2": dict(prompt="running, passing pose, both legs under the body, slight bounce up"),
    "baker-run3": dict(prompt="running, left leg forward, right arm forward, contact pose"),
    "baker-run4": dict(prompt="running, passing pose, opposite to the previous passing pose"),
    "baker-jump": dict(prompt="jumping upward, knees tucked, arms up, happy face"),
    "baker-fall": dict(prompt="falling down after a jump, legs reaching down for landing, arms out for balance"),
    "baker-hit": dict(prompt="stumbling backwards after bumping into something, surprised face, a couple of ingredients flying out of her tote bag"),
    "baker-pour": dict(prompt="standing and happily tipping her tote bag forward to pour ingredients into something in front of her (draw only her and the bag, nothing in front)"),
}
for k, v in JOBS.items():
    if k.startswith("baker-") and k != "baker-sheet":
        v.update(ratio="1:1", ref=True, prompt=STYLE + "\n\n" + BAKER + POSE + "\nPose: " + v["prompt"])
for k, v in INGREDIENTS.items():
    JOBS[f"ing-{k}"] = dict(ratio="1:1", ref=False, prompt=STYLE + ING + v)


_cache, _lock = {}, threading.Lock()
def ref_b64(path, tmp):
    with _lock:
        if path not in _cache:
            small = Path(tmp) / path.name
            subprocess.run(["sips", "-Z", "1024", str(path), "--out", str(small)], check=True, capture_output=True)
            _cache[path] = base64.b64encode(small.read_bytes()).decode()
        return _cache[path]


def generate(job, out, key, model, size, tmp):
    parts = [{"inline_data": {"mime_type": "image/png", "data": ref_b64(r, tmp)}} for r in job["refs"]]
    parts.append({"text": job["prompt"]})
    body = json.dumps({"contents": [{"role": "user", "parts": parts}],
                       "generationConfig": {"responseModalities": ["IMAGE"],
                                            "imageConfig": {"aspectRatio": job["ratio"], "imageSize": size}}}).encode()
    for attempt in range(5):
        req = urllib.request.Request(API.format(model), data=body, method="POST",
                                     headers={"Content-Type": "application/json", "x-goog-api-key": key})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                data = json.load(r)
            break
        except urllib.error.HTTPError as e:
            msg = " ".join(e.read().decode(errors="replace").split())[:400]
            if e.code in (429, 500, 502, 503, 504) and attempt < 4:
                time.sleep(10 * (attempt + 1)); continue
            return f"HTTP {e.code}: {msg}"
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < 4:
                time.sleep(10 * (attempt + 1)); continue
            return f"network: {e}"
    imgs = [p["inlineData"]["data"] for c in data.get("candidates", []) for p in c.get("content", {}).get("parts", [])
            if "inlineData" in p and not p.get("thought")]
    if not imgs:
        return "no image: " + json.dumps(data.get("candidates", data))[:300]
    out.write_bytes(base64.b64decode(imgs[-1]))
    return None


def thumb(path):
    from io import BytesIO
    from PIL import Image
    im = Image.open(path).convert("RGB")
    im.thumbnail((440, 440))
    buf = BytesIO()
    im.save(buf, "JPEG", quality=80)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def sheet():
    import re
    groups = {}
    for p in sorted(OUT.glob("*.png")):
        groups.setdefault(re.sub(r"-[a-z]$", "", p.stem), []).append(p.name)
    rows = "\n".join(f'<section><h2>{g}</h2><div>' + "".join(
        f'<figure><a href="{n}"><img src="{thumb(OUT / n)}" alt="{n}"></a><figcaption>{n}</figcaption></figure>' for n in ns)
        + "</div></section>" for g, ns in groups.items())
    (OUT / "index.html").write_text(f"""<!doctype html><meta charset="utf-8"><title>Cinnery game – raw art</title>
<style>body{{font-family:system-ui;background:#FFFCFA;color:#2B1C25;margin:16px}}section div{{display:flex;flex-wrap:wrap;gap:12px}}
figure{{margin:0;background:#fff;border:1px solid #ECDFE0;padding:6px}}img{{height:200px;display:block}}figcaption{{font:12px monospace}}</style>
<h1>Cinnery game – raw art</h1>{rows}""", encoding="utf-8")
    print(OUT / "index.html")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="*")
    ap.add_argument("--variants", type=int, default=2)
    ap.add_argument("--model", default="gemini-3-pro-image")
    ap.add_argument("--size", default="1K")
    ap.add_argument("--workers", type=int, default=3)
    ap.add_argument("--ref", help="model sheet (relative to tools/game) for the pose jobs")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--sheet", action="store_true")
    a = ap.parse_args()
    if a.sheet:
        return sheet()
    pats = a.only.split(",")
    jobs = [dict(name=n, **j) for n, j in JOBS.items() if any(fnmatch.fnmatch(n, p) for p in pats)]
    for j in jobs:
        j["refs"] = []
        if j["ref"]:
            if not a.ref:
                sys.exit(f'{j["name"]} needs --ref <chosen model sheet>')
            j["refs"] = [HERE / a.ref]
    if a.list:
        for j in jobs:
            print(f'{j["name"]:20} {j["ratio"]:5} refs={len(j["refs"])} prompt={len(j["prompt"])} chars')
        return print(f"{len(jobs)} jobs")
    key = subprocess.run(["security", "find-generic-password", "-s", "cr-jack-gemini", "-w"],
                         capture_output=True, text=True, check=True).stdout.strip()
    OUT.mkdir(exist_ok=True)
    todo = [(j, OUT / f'{j["name"]}-{chr(97 + v)}.png') for j in jobs for v in range(a.variants)]
    todo = [(j, o) for j, o in todo if not o.exists()]
    print(f"{len(todo)} images to generate with {a.model}", flush=True)
    fails = 0
    with tempfile.TemporaryDirectory() as tmp, cf.ThreadPoolExecutor(a.workers) as ex:
        futs = {ex.submit(generate, j, o, key, a.model, a.size, tmp): o for j, o in todo}
        for f in cf.as_completed(futs):
            try:
                err = f.result()
            except Exception as e:
                err = f"{type(e).__name__}: {e}"
            fails += bool(err)
            print(("FAIL " + futs[f].name + " " + err) if err else ("ok   " + futs[f].name), flush=True)
    print(f"done, {len(todo) - fails} ok, {fails} failed")
    sheet()


if __name__ == "__main__":
    sys.exit(main())
