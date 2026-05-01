"""Generate Open Graph preview image (1200x630) for Google and LinkedIn."""

import math
import random
from PIL import Image, ImageDraw, ImageFont

# ── Canvas ──────────────────────────────────────────────────────────────────
W, H = 1200, 630
img = Image.new("RGB", (W, H), color=(0, 0, 0))
draw = ImageDraw.Draw(img)

# ── Background gradient (deep navy → darker) ─────────────────────────────
for y in range(H):
    t = y / H
    r = int(18 + (10 - 18) * t)
    g = int(22 + (14 - 22) * t)
    b = int(48 + (32 - 48) * t)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# ── Network graph decoration (nodes + edges) ─────────────────────────────
random.seed(42)
NUM_NODES = 38
nodes = [(random.randint(30, W - 30), random.randint(30, H - 30)) for _ in range(NUM_NODES)]

# Edges: connect nearby nodes
EDGE_COLOR = (60, 80, 160, 60)
img_rgba = img.convert("RGBA")
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
for i, (x1, y1) in enumerate(nodes):
    for j, (x2, y2) in enumerate(nodes):
        if i >= j:
            continue
        dist = math.hypot(x2 - x1, y2 - y1)
        if dist < 220:
            alpha = int(50 * (1 - dist / 220))
            od.line([(x1, y1), (x2, y2)], fill=(80, 120, 220, alpha), width=1)

img_rgba = Image.alpha_composite(img_rgba, overlay)
img = img_rgba.convert("RGB")
draw = ImageDraw.Draw(img)

# Nodes: larger accent nodes highlighted
ACCENT = (180, 60, 60)
PRIMARY = (80, 120, 220)
MUTED = (50, 70, 130)
for i, (x, y) in enumerate(nodes):
    if i % 7 == 0:
        r, col = 8, ACCENT
    elif i % 3 == 0:
        r, col = 5, PRIMARY
    else:
        r, col = 3, MUTED
    draw.ellipse([x - r, y - r, x + r, y + r], fill=col)

# ── Left accent bar ───────────────────────────────────────────────────────
draw.rectangle([0, 0, 6, H], fill=(180, 60, 60))

# ── Dark content panel (left-aligned text area) ───────────────────────────
panel = Image.new("RGBA", (W, H), (0, 0, 0, 0))
pd = ImageDraw.Draw(panel)
pd.rectangle([40, 80, 760, H - 80], fill=(8, 12, 35, 210))
img = Image.alpha_composite(img.convert("RGBA"), panel).convert("RGB")
draw = ImageDraw.Draw(img)

# ── Fonts ─────────────────────────────────────────────────────────────────
def load_font(size, bold=False):
    candidates = []
    if bold:
        candidates = [
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/Library/Fonts/Arial Bold.ttf",
        ]
    else:
        candidates = [
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/Library/Fonts/Arial.ttf",
        ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    return ImageFont.load_default()

font_badge   = load_font(18)
font_title1  = load_font(52, bold=True)
font_title2  = load_font(46, bold=True)
font_sub     = load_font(22)
font_tags    = load_font(17)

# ── Badge pill ────────────────────────────────────────────────────────────
badge_text = "Knowledge Graph  ·  GraphRAG  ·  Demo"
bx, by = 68, 110
bw = draw.textlength(badge_text, font=font_badge) + 32
draw.rounded_rectangle([bx, by, bx + bw, by + 38], radius=19, fill=(180, 60, 60))
draw.text((bx + 16, by + 9), badge_text, font=font_badge, fill=(255, 255, 255))

# ── Main title (two lines) ────────────────────────────────────────────────
draw.text((68, 175), "Digitaler Wissensassistent", font=font_title1, fill=(240, 240, 255))
draw.text((68, 238), "für die Rentenversicherung", font=font_title2, fill=(240, 240, 255))

# ── Divider ───────────────────────────────────────────────────────────────
draw.rectangle([68, 308, 560, 311], fill=(180, 60, 60))

# ── Subtitle ─────────────────────────────────────────────────────────────
sub_lines = [
    "Multi-Layered Ontologie-Architektur",
    "Sozialrecht als navigierbarer Wissensgraph",
]
for i, line in enumerate(sub_lines):
    draw.text((68, 328 + i * 34), line, font=font_sub, fill=(170, 180, 220))

# ── Tags row ─────────────────────────────────────────────────────────────
tags = ["SGB I–XII", "DSGVO", "BSI IT-Grundschutz", "OpenAI API", "Neo4j"]
tx = 68
ty = H - 128
for tag in tags:
    tw = draw.textlength(tag, font=font_tags) + 22
    draw.rounded_rectangle([tx, ty, tx + tw, ty + 32], radius=8, fill=(30, 40, 90))
    draw.rounded_rectangle([tx, ty, tx + tw, ty + 32], radius=8, outline=(80, 100, 180), width=1)
    draw.text((tx + 11, ty + 7), tag, font=font_tags, fill=(160, 180, 230))
    tx += tw + 10

# ── URL watermark ─────────────────────────────────────────────────────────
url_font = load_font(16)
draw.text((68, H - 72), "ma3u.github.io/graph-insurance", font=url_font, fill=(80, 100, 160))

# ── Right-side: stylised graph icon ───────────────────────────────────────
cx, cy = 960, 315
# Outer ring
draw.ellipse([cx - 120, cy - 120, cx + 120, cy + 120], outline=(40, 60, 140), width=1)
draw.ellipse([cx - 80, cy - 80, cx + 80, cy + 80], outline=(60, 80, 160), width=1)
# Hub node
hub_r = 22
draw.ellipse([cx - hub_r, cy - hub_r, cx + hub_r, cy + hub_r], fill=(180, 60, 60))
# Satellite nodes
satellites = [
    (cx, cy - 100), (cx + 87, cy - 50), (cx + 87, cy + 50),
    (cx, cy + 100), (cx - 87, cy + 50), (cx - 87, cy - 50),
]
sat_colors = [PRIMARY, PRIMARY, ACCENT, PRIMARY, PRIMARY, ACCENT]
for (sx, sy), col in zip(satellites, sat_colors):
    draw.line([(cx, cy), (sx, sy)], fill=(60, 80, 160), width=2)
    draw.ellipse([sx - 10, sy - 10, sx + 10, sy + 10], fill=col)

# Secondary ring satellites
for angle_deg in range(0, 360, 45):
    angle = math.radians(angle_deg)
    sx = int(cx + 155 * math.cos(angle))
    sy = int(cy + 155 * math.sin(angle))
    draw.line(
        [(cx + int(100 * math.cos(angle)), cy + int(100 * math.sin(angle))), (sx, sy)],
        fill=(40, 55, 120), width=1,
    )
    draw.ellipse([sx - 5, sy - 5, sx + 5, sy + 5], fill=MUTED)

# ── Save ──────────────────────────────────────────────────────────────────
out = "public/og-image.png"
img.save(out, "PNG", optimize=True)
print(f"Saved {out}  ({W}x{H})")
