"""Generate multi-size favicon.ico + PNG variants for the GraphRAG Demo site."""

import math
from PIL import Image, ImageDraw

def draw_favicon(size: int) -> Image.Image:
    """Draw the favicon at the given square size."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    s = size

    # ── Background: rounded square, deep navy ────────────────────────────
    radius = max(2, int(s * 0.18))
    draw.rounded_rectangle([0, 0, s - 1, s - 1], radius=radius, fill=(14, 18, 45, 255))

    # ── Graph: hub node + 6 satellites + edges ───────────────────────────
    cx, cy = s / 2, s / 2
    hub_r  = max(2, int(s * 0.13))
    sat_r  = max(1, int(s * 0.07))
    orbit  = s * 0.32

    # Satellite positions (hexagonal)
    satellites = [
        (cx + orbit * math.cos(math.radians(a)),
         cy + orbit * math.sin(math.radians(a)))
        for a in range(0, 360, 60)
    ]

    # Edges
    edge_w = max(1, int(s * 0.04))
    for sx, sy in satellites:
        draw.line([(cx, cy), (sx, sy)], fill=(70, 100, 200, 180), width=edge_w)

    # Two cross-connections (gives graph feel)
    for i in (0, 1, 2):
        sx1, sy1 = satellites[i]
        sx2, sy2 = satellites[i + 3]
        draw.line([(sx1, sy1), (sx2, sy2)], fill=(50, 75, 160, 100), width=max(1, edge_w - 1))

    # Satellite nodes
    sat_colors = [
        (80, 120, 220), (80, 120, 220), (180, 60, 60),
        (80, 120, 220), (80, 120, 220), (180, 60, 60),
    ]
    for (sx, sy), col in zip(satellites, sat_colors):
        draw.ellipse([sx - sat_r, sy - sat_r, sx + sat_r, sy + sat_r], fill=col)

    # Hub node (red accent)
    draw.ellipse([cx - hub_r, cy - hub_r, cx + hub_r, cy + hub_r], fill=(200, 50, 50))

    return img


# ── Generate all sizes ────────────────────────────────────────────────────
sizes = [16, 32, 48, 64, 128, 256]
frames = [draw_favicon(s) for s in sizes]

# favicon.ico — multi-size bundle (browsers pick best fit)
frames[0].save(
    "public/favicon.ico",
    format="ICO",
    sizes=[(s, s) for s in sizes],
    append_images=frames[1:],
)
print("Saved public/favicon.ico")

# favicon-32x32.png — used by most modern browsers & PWA manifests
frames[1].save("public/favicon-32x32.png", "PNG")
print("Saved public/favicon-32x32.png")

# apple-touch-icon.png — iOS home screen (180x180)
apple = draw_favicon(180)
apple.save("public/apple-touch-icon.png", "PNG")
print("Saved public/apple-touch-icon.png")
