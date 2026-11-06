from pathlib import Path
from PIL import Image

source = Path("/home/ubuntu/webdev-static-assets/ibaa/white-house-faith-office-2026.png")
target = Path("/home/ubuntu/webdev-static-assets/ibaa/white-house-faith-office-2026-optimized.webp")

with Image.open(source) as image:
    image = image.convert("RGB")
    image.thumbnail((1440, 960), Image.Resampling.LANCZOS)
    image.save(target, "WEBP", quality=76, method=6, optimize=True)

print(f"{target} {target.stat().st_size} bytes")
