# README AI - SocialMeme

Tai lieu nay mo ta cac tinh nang AI/ML dang duoc su dung trong web `SocialMeme`, chung nam o dau trong code, va cach chung hoat dong.

## 1. Tong quan

Hien tai web dang su dung 2 tinh nang AI chinh:

1. `AI goi y meme` cho nguoi dung.
2. `AI kiem duyet binh luan` de chan noi dung tuc tiu/xuc pham.


## 2. Model dang dung

Backend dang goi model   `GitHub Models`.

File cau hinh lien quan:


## 3. AI Goi Y Meme

File chinh:

- `be/app/services/recommendation_service.py`
- API su dung:
  - `GET /api/feed/recommended`

### Muc tieu

Tra ve danh sach meme phu hop voi tung nguoi dung dua tren hanh vi da xem va da like.

### Cach hoat dong

Quy trinh gom 4 buoc:

1. Lay hanh vi nguoi dung.
   - Doc meme da `like`
   - Doc meme da `view`

2. Tao danh sach meme ung vien.
   - Loai bo meme nguoi dung da tuong tac
   - Loai bo meme cua chinh nguoi dung
   - Sap xep theo `trending_score`, `like_count`, `view_count`, `created_at`

3. Gui thong tin sang model GPT.
   - Dua caption cac meme da like
   - Dua thong ke hanh vi
   - Dua danh sach candidate
   - Yeu cau model tra ve `JSON array` gom ID meme phu hop nhat

4. Backend doc ket qua va tra lai frontend.


## 4. AI Kiem Duyet Binh Luan

File chinh:

- `be/app/services/comment_moderation_service.py`
- `be/app/controllers/comment_controller.py`


### Muc tieu

Chan cac binh luan co noi dung:

- Tuc tiu
- Chui boi
- Xuc pham nang
- Nha ma, lang ma qua muc

Neu binh luan binh thuong thi cho dang.

### Cach hoat dong

Khi nguoi dung gui binh luan:

1. Backend nhan noi dung comment.
2. `CommentModerationService.check_comment()` duoc goi.
3. Service thu goi model GPT de danh gia comment.
4. Model phai tra ve JSON:

5. Neu `is_allowed = false`:
   - Backend tra loi loi `400`
   - Frontend hien thong bao
   - Comment khong duoc luu vao database

6. Neu `is_allowed = true`:
   - Comment duoc luu nhu binh thuong

