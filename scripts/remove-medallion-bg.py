"""Trim already done; remove soft light background from medallion frames → transparent PNGs."""
from pathlib import Path
import math
from PIL import Image
import numpy as np

src_dir = Path(r"C:\Users\ameen\OneDrive\Desktop\dhana-site\public\_med_frames")
out_dir = Path(r"C:\Users\ameen\OneDrive\Desktop\dhana-site\public\_med_frames_nobg")
out_dir.mkdir(parents=True, exist_ok=True)

files = sorted(src_dir.glob("f-*.png"))
print(f"processing {len(files)} frames")

for i, fp in enumerate(files):
    im = Image.open(fp).convert("RGBA")
    arr = np.asarray(im).astype(np.float32)
    rgb = arr[:, :, :3]
    h, w = rgb.shape[:2]
    cy, cx = h / 2.0, w / 2.0

    # Soft circular falloff — medallion is centered
    yy, xx = np.ogrid[:h, :w]
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    # Coin fills most of frame; keep a soft edge past the rim
    r_hard = min(w, h) * 0.42
    r_soft = min(w, h) * 0.48
    circle = np.clip((r_soft - dist) / max(r_soft - r_hard, 1e-6), 0, 1)

    # Lightness / near-white key (bg is soft gray-white)
    # Use max channel + saturation-ish signal
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = (mx - mn) / (mx + 1e-6)
    # Background: bright AND low saturation
    bg = (mx > 175) & (sat < 0.18)
    # Also catch very bright near-white
    bg = bg | ((mx > 210) & (sat < 0.28))

    alpha = np.ones((h, w), dtype=np.float32) * 255.0
    alpha[bg] = 0.0
    # Soften key edges
    # Keep circular crop so corners never leak
    alpha *= circle

    # Feather residual fringe: if pixel is bright-ish near transparent, lower alpha
    fringe = (mx > 160) & (sat < 0.25) & (alpha > 0)
    alpha[fringe] *= 0.15

    out = arr.copy()
    out[:, :, 3] = np.clip(alpha, 0, 255)
    Image.fromarray(out.astype(np.uint8), "RGBA").save(out_dir / fp.name)

    if i % 30 == 0:
        print(f"  {i}/{len(files)}")

print("done", len(files))
