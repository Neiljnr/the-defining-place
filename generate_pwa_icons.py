import os
import math
from PIL import Image, ImageDraw, ImageFont

os.makedirs("c:/Users/USER/Desktop/TD Prime/public/icons", exist_ok=True)

def draw_sanctuary_icon(size, is_maskable=False):
    # Create image with deep navy sanctuary background
    img = Image.new("RGBA", (size, size), (11, 25, 44, 255))
    draw = ImageDraw.Draw(img)

    # If maskable, safe zone is inner 80%
    scale = 0.82 if is_maskable else 0.94
    center = size / 2

    # Draw ambient radiant circular glow behind monogram
    glow_radius = int(center * scale * 0.9)
    for r in range(glow_radius, int(glow_radius * 0.4), -4):
        alpha = int(45 * (1.0 - (r / glow_radius)))
        draw.ellipse([center - r, center - r, center + r, center + r], 
                     fill=(212, 175, 55, alpha))

    # Outer ornate gold ring
    ring_r = int(center * scale * 0.78)
    draw.ellipse([center - ring_r, center - ring_r, center + ring_r, center + ring_r], 
                 outline=(212, 175, 55, 180), width=max(2, int(size * 0.015)))

    # Inner sacred geometric circle
    inner_r = int(ring_r * 0.88)
    draw.ellipse([center - inner_r, center - inner_r, center + inner_r, center + inner_r], 
                 outline=(47, 165, 184, 140), width=max(1, int(size * 0.008)))

    # Draw Altar Cross & Monogram 'T A'
    # Try to load a nice font, otherwise draw elegant geometric serif shapes
    font_size = int(size * 0.32)
    font = None
    try:
        font = ImageFont.truetype("georgia.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()

    text = "TA"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = center - (tw / 2)
    ty = center - (th / 2) - int(size * 0.02)

    # Draw gold text with soft drop shadow
    draw.text((tx + 2, ty + 2), text, font=font, fill=(5, 12, 20, 200))
    draw.text((tx, ty), text, font=font, fill=(212, 175, 55, 255))

    # Draw small sacred cross emblem above
    cross_y = center - ring_r + int(size * 0.06)
    cross_h = int(size * 0.07)
    cross_w = int(cross_h * 0.65)
    
    # Vertical cross bar
    draw.line([center, cross_y, center, cross_y + cross_h], fill=(212, 175, 55, 240), width=max(2, int(size * 0.012)))
    # Horizontal cross bar
    hbar_y = cross_y + int(cross_h * 0.35)
    draw.line([center - cross_w//2, hbar_y, center + cross_w//2, hbar_y], fill=(212, 175, 55, 240), width=max(2, int(size * 0.012)))

    # Small gold star beneath
    star_y = center + inner_r - int(size * 0.07)
    draw.text((center - 6, star_y), "✦", fill=(212, 175, 55, 220))

    return img

# Generate all required icon sizes
icons = [
    ("public/icons/icon-192.png", 192, False),
    ("public/icons/icon-512.png", 512, False),
    ("public/icons/icon-maskable.png", 512, True),
    ("public/apple-touch-icon.png", 180, False),
    ("public/favicon-96x96.png", 96, False)
]

base_dir = "c:/Users/USER/Desktop/TD Prime"
for rel_path, s, mask in icons:
    path = os.path.join(base_dir, rel_path)
    im = draw_sanctuary_icon(s, mask)
    im.save(path, "PNG")
    print(f"Generated {rel_path} ({s}x{s})")

# Generate favicon.ico from 96x96
ico_path = os.path.join(base_dir, "public/favicon.ico")
im32 = draw_sanctuary_icon(32, False)
im32.save(ico_path, format="ICO")
print("Generated public/favicon.ico")
