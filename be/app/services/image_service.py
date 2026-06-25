# backend/app/services/image_service.py
import os
import shutil
import uuid
from typing import Optional

from fastapi import UploadFile
from PIL import Image, ImageDraw, ImageFont

UPLOAD_DIR = "uploads/memes"
TEMP_DIR = "uploads/temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)


async def save_temp_image(file: UploadFile) -> str:
    """Luu anh tam, tra ve duong dan."""
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = f"{TEMP_DIR}/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return filepath


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(value, maximum))


def _get_font(image_width: int, image_height: int):
    font_size = max(24, min(72, int(min(image_width, image_height) * 0.08)))
    try:
        return ImageFont.truetype("arial.ttf", font_size)
    except Exception:
        return ImageFont.load_default()


def _resolve_text_position(
    image_width: int,
    image_height: int,
    text_width: int,
    text_height: int,
    font_size: int,
    position: Optional[dict[str, float]] = None,
) -> tuple[int, int]:
    margin = max(12, font_size // 3)

    if position:
        center_x_ratio = _clamp(position.get("x", 0.5), 0.0, 1.0)
        center_y_ratio = _clamp(position.get("y", 0.82), 0.0, 1.0)
        x = int(center_x_ratio * image_width - (text_width / 2))
        y = int(center_y_ratio * image_height - (text_height / 2))
    else:
        x = (image_width - text_width) // 2
        y = image_height - text_height - max(20, font_size // 2)

    max_x = max(margin, image_width - text_width - margin)
    max_y = max(margin, image_height - text_height - margin)
    min_x = 0 if text_width >= image_width else margin
    min_y = 0 if text_height >= image_height else margin

    return (
        int(_clamp(x, min_x, max_x)),
        int(_clamp(y, min_y, max_y)),
    )


def add_caption_to_image(
    image_path: str,
    caption: str,
    position: Optional[dict[str, float]] = None,
) -> str:
    """Them caption vao anh, tra ve duong dan anh moi."""
    img = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(img)

    font = _get_font(img.width, img.height)
    font_size = getattr(font, "size", 40)
    line_spacing = max(6, font_size // 5)
    bbox = draw.multiline_textbbox(
        (0, 0),
        caption,
        font=font,
        spacing=line_spacing,
        align="center",
    )
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x, y = _resolve_text_position(
        img.width,
        img.height,
        text_width,
        text_height,
        font_size,
        position,
    )

    outline = max(2, font_size // 14)
    for offset_x in range(-outline, outline + 1):
        for offset_y in range(-outline, outline + 1):
            if offset_x == 0 and offset_y == 0:
                continue
            draw.multiline_text(
                (x + offset_x, y + offset_y),
                caption,
                font=font,
                fill="black",
                spacing=line_spacing,
                align="center",
            )

    draw.multiline_text(
        (x, y),
        caption,
        font=font,
        fill="white",
        spacing=line_spacing,
        align="center",
    )

    output_filename = f"{uuid.uuid4()}.png"
    output_path = f"{UPLOAD_DIR}/{output_filename}"
    img.save(output_path)

    os.remove(image_path)

    return f"/uploads/memes/{output_filename}"
