# backend/app/services/image_service.py
import os
import uuid
import shutil
from PIL import Image, ImageDraw, ImageFont
from fastapi import UploadFile

UPLOAD_DIR = "uploads/memes"
TEMP_DIR = "uploads/temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

async def save_temp_image(file: UploadFile) -> str:
    """Lưu ảnh tạm, trả về đường dẫn"""
    ext = file.filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = f"{TEMP_DIR}/{filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return filepath

def add_caption_to_image(image_path: str, caption: str) -> str:
    """Thêm caption vào ảnh, trả về đường dẫn ảnh mới"""
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)
    
    # Font mặc định
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()
    
    # Tính vị trí
    bbox = draw.textbbox((0, 0), caption, font=font)
    text_width = bbox[2] - bbox[0]
    x = (img.width - text_width) // 2
    y = img.height - 80
    
    # Vẽ viền đen + chữ trắng
    draw.text((x-2, y-2), caption, font=font, fill="black")
    draw.text((x+2, y-2), caption, font=font, fill="black")
    draw.text((x-2, y+2), caption, font=font, fill="black")
    draw.text((x+2, y+2), caption, font=font, fill="black")
    draw.text((x, y), caption, font=font, fill="white")
    
    # Lưu ảnh
    output_filename = f"{uuid.uuid4()}.png"
    output_path = f"{UPLOAD_DIR}/{output_filename}"
    img.save(output_path)
    
    # Xóa ảnh tạm
    os.remove(image_path)
    
    return f"/uploads/memes/{output_filename}"